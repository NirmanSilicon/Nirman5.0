// components/MonthlyCalendar.tsx
import { Calendar } from "lucide-react";
import { useState } from "react";

export default function MonthlyCalendar() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today);

  const monthName = currentMonth.toLocaleString("default", { month: "long" });
  const year = currentMonth.getFullYear();

  const firstDay = new Date(year, currentMonth.getMonth(), 1).getDay();
  const daysInMonth = new Date(year, currentMonth.getMonth() + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const prevMonth = () => {
    setCurrentMonth(new Date(year, currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(year, currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">
            {monthName} {year}
          </h2>
        </div>
        <div className="flex gap-3">
          <button
            onClick={prevMonth}
            className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            ‹
          </button>
          <button
            onClick={nextMonth}
            className="px-3 py-1 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            ›
          </button>
        </div>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 text-center text-sm text-gray-600 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="font-medium">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 text-center gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            className={`p-2 h-10 flex items-center justify-center rounded-xl
              ${
                day === today.getDate() &&
                currentMonth.getMonth() === today.getMonth()
                  ? "bg-blue-500 text-white"
                  : "text-gray-700"
              }
            `}
          >
            {day || ""}
          </div>
        ))}
      </div>
    </div>
  );
}
