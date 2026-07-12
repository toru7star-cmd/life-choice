"use client";

import { getMonthMatrix, isFutureDate, toDateKey, WEEKDAY_LABELS } from "@/lib/date";
import { CHOICE_ICONS, Choice } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CalendarGridProps {
  year: number;
  month: number; // 0-indexed
  recordMap: Record<string, Choice>;
  onSelectDate: (dateKey: string) => void;
}

export default function CalendarGrid({
  year,
  month,
  recordMap,
  onSelectDate,
}: CalendarGridProps) {
  const weeks = getMonthMatrix(year, month);
  const todayStr = toDateKey(new Date());

  return (
    <div>
      <div className="mb-2 grid grid-cols-7 text-center text-xs text-muted-foreground">
        {WEEKDAY_LABELS.map((label) => (
          <div key={label} className="py-2">
            {label}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {weeks.flatMap((week, weekIndex) =>
          week.map((date, dayIndex) => {
            if (!date) {
              return (
                <div key={`${weekIndex}-${dayIndex}`} className="aspect-square" />
              );
            }
            const dateKey = toDateKey(date);
            const choice = recordMap[dateKey];
            const isToday = dateKey === todayStr;
            const isFuture = isFutureDate(dateKey);

            return (
              <button
                key={dateKey}
                type="button"
                onClick={() => onSelectDate(dateKey)}
                className={cn(
                  "flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl border transition-colors",
                  isToday ? "border-foreground/25" : "border-transparent",
                  isFuture ? "opacity-35" : "hover:bg-muted"
                )}
              >
                <span className="text-xs text-muted-foreground">{date.getDate()}</span>
                <span className="text-2xl leading-none" aria-hidden>
                  {choice ? CHOICE_ICONS[choice] : ""}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
