import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import ts from "typescript";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const root = fileURLToPath(new URL("../", import.meta.url));

// Load the real TS/TSX modules without a build or additional test dependencies.
// Redirect JSON storage into a temporary directory, never the store's live data.
function createLoader(dataDirectory) {
    const cache = new Map();
    return function load(relativePath) {
        const filename = path.resolve(root, relativePath);
        if (cache.has(filename)) return cache.get(filename).exports;
        const loadedModule = { exports: {} };
        cache.set(filename, loadedModule);
        const localRequire = createRequire(filename);
        const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
            compilerOptions: {
                module: ts.ModuleKind.CommonJS,
                target: ts.ScriptTarget.ES2020,
                jsx: ts.JsxEmit.ReactJSX,
                esModuleInterop: true,
            },
        }).outputText;
        const requireModule = (specifier) => {
            if (specifier === "server-only") return {};
            if (specifier.startsWith("@/") || specifier.startsWith(".")) {
                const base = specifier.startsWith("@/")
                    ? path.join(root, "src", specifier.slice(2))
                    : path.resolve(path.dirname(filename), specifier);
                const source = [base, `${base}.ts`, `${base}.tsx`, path.join(base, "index.tsx")]
                    .find((candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
                if (source) return load(source);
            }
            return localRequire(specifier);
        };
        const run = vm.runInThisContext(`(function(require, module, exports, process) {\n${compiled}\n})`, {
            filename,
        });
        run(requireModule, loadedModule, loadedModule.exports, { cwd: () => dataDirectory });
        return loadedModule.exports;
    };
}


function setup(t, couponOverrides = {}) {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "vpn-discount-test-"));
    assert.equal(path.dirname(path.resolve(directory)), path.resolve(os.tmpdir()));
    t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
    const load = createLoader(directory);
    const { PRICING_DATA } = load("src/constants/order.ts");
    const price = PRICING_DATA[30][1];
    const coupon = { code: "FREE", type: "percent", value: 100, active: true, usedCount: 0, maxUses: 1, ...couponOverrides };
    const write = (name, data) => fs.writeFileSync(path.join(directory, name), JSON.stringify(data));
    write("discount-codes.json", [coupon]);
    const { POST } = load("src/app/api/order/route.ts");
    return {
        price, load, write,
        read(name) {
            const filename = path.join(directory, name);
            return fs.existsSync(filename) ? JSON.parse(fs.readFileSync(filename, "utf8")) : [];
        },
        async submit(overrides = {}) {
            const response = await POST(new Request("http://localhost/api/order", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify({volume: 30, duration: 1, fullName: "Test Customer", contactInfo: "checkout@example.com", price, couponCode: "FREE", paymentNotRequired: true, ...overrides}),
            }));
            return { status: response.status, body: await response.json() };
        },
    };
}

for (const type of ["percent", "fixed", "oversized fixed"]) {
    test(`${type}: zero-total orders are saved without payment details`, async (t) => {
        const ctx = setup(t);
        ctx.write("discount-codes.json", [{code:"FREE",type:type === "percent" ? "percent" : "fixed",value:type === "percent" ? 100 : ctx.price + (type === "oversized fixed" ? 1 : 0),active:true,usedCount:0,maxUses:1}]);
        const result = await ctx.submit({price: 1, finalPrice: 999});
        assert.equal(result.status, 201);
        assert.equal(result.body.originalPrice, ctx.price);
        assert.equal(result.body.finalPrice, 0);
        assert.equal(result.body.discountAmount, ctx.price);
        assert.match(result.body.orderId, /^CN-/);
        const [order] = ctx.read("orders.json");
        assert.equal(order.id, result.body.orderId);
        assert.equal(order.price, 0);
        assert.equal(order.finalPrice, 0);
        assert.equal(order.status, "processing");
        assert.equal(order.receipt, undefined);
        assert.equal(ctx.read("discount-codes.json")[0].usedCount, 1);
        assert.equal((await ctx.submit()).status, 400);
        assert.equal(ctx.read("orders.json").length, 1);
    });
}

test("partial discount requires receipt and uses the server's plan price", async (t) => {
    const ctx = setup(t, {value:25});
    assert.equal((await ctx.submit({paymentNotRequired:false})).status, 400);
    assert.equal(ctx.read("discount-codes.json")[0].usedCount, 0);
    const result = await ctx.submit({paymentNotRequired:false, price:1, receipt:{payerName:"Test Payer",trackingCode:"123456",sourceBank:"Test Bank"}});
    assert.equal(result.status, 201);
    assert.equal(result.body.finalPrice, ctx.price - Math.floor(ctx.price / 4));
    assert.equal(ctx.read("orders.json")[0].receipt.trackingCode, "123456");
});

test("stale discount cannot bypass payment or consume the coupon", async (t) => {
    const ctx = setup(t, {value:25});
    assert.equal((await ctx.submit({price:0, finalPrice:0})).status, 409);
    assert.equal(ctx.read("orders.json").length, 0);
    assert.equal(ctx.read("discount-codes.json")[0].usedCount, 0);
});

for (const invalid of [{active:false}, {expiresAt:"2000-01-01"}, {usedCount:1}, {minOrderAmount:99999999}]) {
    test(`invalid coupon is rejected: ${JSON.stringify(invalid)}`, async (t) => {
        const ctx = setup(t, invalid);
        assert.equal((await ctx.submit()).status, 400);
        assert.equal(ctx.read("orders.json").length, 0);
    });
}

test("unknown plans are rejected; longer plans use their own price", async (t) => {
    const ctx = setup(t);
    assert.equal((await ctx.submit({volume:999})).status, 400);
    assert.equal((await ctx.submit({duration:999})).status, 400);
    const result = await ctx.submit({duration:6});
    assert.equal(result.status, 201);
    assert.equal(result.body.originalPrice, 449000);
    assert.equal(ctx.read("orders.json")[0].duration, 6);
});

test("import retains unrelated customers and zero-total orders", async (t) => {
    const ctx = setup(t);
    const existing = {id:"CN-EXISTING",fullName:"Existing Customer",contactInfo:"existing@example.com",price:100000};
    ctx.write("orders.json", [existing]);
    const free = {id:"CN-FREE",fullName:"Free Customer",contactInfo:"free@example.com",price:ctx.price,originalPrice:ctx.price,finalPrice:0,discountAmount:ctx.price,status:"processing"};
    assert.equal((await ctx.submit({action:"import",orders:[free]})).status, 201);
    const saved = ctx.read("orders.json");
    assert.deepEqual(saved.find(order=>order.id===existing.id), existing);
    assert.equal(saved.find(order=>order.id===free.id).price, 0);
    assert.equal(saved.find(order=>order.id===free.id).finalPrice, 0);
    assert.equal((await ctx.submit({action:"import",orders:[{...free,fullName:"Updated Customer"}]})).status, 201);
    assert.equal(ctx.read("orders.json").length, 2);
    assert.equal(ctx.read("orders.json").find(order=>order.id===free.id).fullName, "Updated Customer");
    assert.equal((await ctx.submit({action:"import",orders:[{fullName:"Invalid"}]})).status, 400);
    assert.equal(ctx.read("orders.json").length, 2);
});

test("imported rows without IDs receive distinct IDs and all survive", async (t) => {
    const ctx = setup(t);
    const rows = Array.from({length: 20}, (_, index) => ({fullName: "Customer " + index, contactInfo: "test@example.com", price: 100000}));
    assert.equal((await ctx.submit({action: "import", orders: rows})).status, 201);
    const saved = ctx.read("orders.json");
    assert.equal(saved.length, rows.length);
    assert.equal(new Set(saved.map(order => order.id)).size, rows.length);
});

test("invoice preserves zero and success requires the saved order ID", (t) => {
    const ctx = setup(t);
    const Checkout = ctx.load("src/components/order/steps/StepCheckout.tsx").default;
    const Receipt = ctx.load("src/components/Receiptform/index.tsx").default;
    const noop = () => {};
    const html = renderToStaticMarkup(React.createElement(Checkout, {
        formData:{volume:30,fullName:"Test Customer",contactInfo:"test@example.com"},totalPrice:ctx.price,payablePrice:0,couponCode:"FREE",couponDiscount:ctx.price,couponApplying:false,onCouponChange:noop,onApplyCoupon:noop,setStep:noop,handleSubmit:noop,loading:false,themeBg:"",themeColor:"",
    }));
    assert.match(html, />۰<\/span>/);
    assert.match(html, /ثبت سفارش رایگان/);
    const success = renderToStaticMarkup(React.createElement(Receipt, {orderId:"CN-TEST1234",onSubmit:noop,onBack:noop}));
    assert.match(success, /CN-TEST1234/);
    assert.doesNotMatch(success, /اطلاعات رسید پرداخت/);
    const pending = renderToStaticMarkup(React.createElement(Receipt, {orderId:"",onSubmit:noop,onBack:noop}));
    assert.match(pending, /اطلاعات رسید پرداخت/);
});
