"use client";

import React, { useState, useEffect } from "react";
import { Calendar } from "lucide-react";

interface BirthDatePickerProps {
    value: string;
    onChange: (value: string) => void;
}

export default function BirthDatePicker({ value, onChange }: BirthDatePickerProps) {
    const [day, setDay] = useState("");
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    useEffect(() => {
        if (value) {
            const parts = value.split("-");
            if (parts.length === 3) {
                setYear(parts[0]);
                setMonth(parts[1]);
                setDay(parts[2]);
            }
        }
    }, [value]);

    useEffect(() => {
        if (day && month && year) {
            const formattedMonth = month.padStart(2, "0");
            const formattedDay = day.padStart(2, "0");
            onChange(`${year}-${formattedMonth}-${formattedDay}`);
        }
    }, [day, month, year]);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 100 }, (_, i) => currentYear - i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);
    const daysInMonth = month && year ? new Date(Number(year), Number(month), 0).getDate() : 31;
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const selectClass =
        "flex-1 bg-slate-900/50 border border-slate-700 rounded-xl px-2 md:px-4 py-3 text-white focus:outline-none focus:border-[#1ED760] appearance-none cursor-pointer";

    return (
        <div className="flex flex-col gap-2 w-full">
            <label className="flex items-center gap-2 text-sm text-slate-400">
                <Calendar className="w-4 h-4" /> تاریخ تولد (میلادی) <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 w-full" dir="ltr">
                <select value={year} onChange={(e) => setYear(e.target.value)} className={selectClass}>
                    <option value="" disabled className="text-slate-500">
                        سال
                    </option>
                    {years.map((y) => (
                        <option key={y} value={y} className="bg-slate-800">
                            {y}
                        </option>
                    ))}
                </select>

                <select value={month} onChange={(e) => setMonth(e.target.value)} className={selectClass}>
                    <option value="" disabled className="text-slate-500">
                        ماه
                    </option>
                    {months.map((m) => (
                        <option key={m} value={m} className="bg-slate-800">
                            {m}
                        </option>
                    ))}
                </select>

                <select value={day} onChange={(e) => setDay(e.target.value)} className={selectClass}>
                    <option value="" disabled className="text-slate-500">
                        روز
                    </option>
                    {days.map((d) => (
                        <option key={d} value={d} className="bg-slate-800">
                            {d}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}
