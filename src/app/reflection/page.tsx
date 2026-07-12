"use client";

import { useEffect, useMemo, useState } from "react";
import ChoiceIcon from "@/components/ChoiceIcon";
import DayDetailSheet from "@/components/DayDetailSheet";
import SettingsGearLink from "@/components/SettingsGearLink";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  formatDateShortJa,
  isInCurrentMonth,
  isInCurrentWeek,
} from "@/lib/date";
import {
  deleteRecord,
  getAllRecords,
  getCategoryItemsByIds,
  saveRecord,
} from "@/lib/storage";
import { CHOICE_ORDER, Choice, DailyRecord } from "@/lib/types";

type Period = "week" | "month" | "all";

export default function ReflectionPage() {
  const [loaded, setLoaded] = useState(false);
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const [period, setPeriod] = useState<Period>("week");
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  useEffect(() => {
    // localStorageはSSR時に読めないため、マウント後にクライアントでのみ読み込む
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecords(getAllRecords());
    setLoaded(true);
  }, []);

  const filteredRecords = useMemo(() => {
    const filtered = records.filter((r) => {
      if (period === "week") return isInCurrentWeek(r.recordDate);
      if (period === "month") return isInCurrentMonth(r.recordDate);
      return true;
    });
    return [...filtered].sort((a, b) => b.recordDate.localeCompare(a.recordDate));
  }, [records, period]);

  const counts = useMemo(() => {
    const result: Record<Choice, number> = { future: 0, present: 0, drift: 0 };
    for (const r of filteredRecords) {
      result[r.choice] += 1;
    }
    return result;
  }, [filteredRecords]);

  const selectedRecord = selectedDateKey
    ? records.find((r) => r.recordDate === selectedDateKey)
    : undefined;

  function handleSave(choice: Choice, diary: string, categoryItemIds: string[]) {
    if (!selectedDateKey) return;
    saveRecord(selectedDateKey, choice, diary, categoryItemIds);
    setRecords(getAllRecords());
  }

  function handleDelete() {
    if (!selectedDateKey) return;
    deleteRecord(selectedDateKey);
    setRecords(getAllRecords());
    setSelectedDateKey(null);
  }

  if (!loaded) {
    return <div className="flex-1" />;
  }

  return (
    <div className="relative flex flex-1 flex-col px-6 pt-10 pb-6">
      <SettingsGearLink />

      <Tabs
        value={period}
        onValueChange={(value) => setPeriod(value as Period)}
        className="mb-6"
      >
        <TabsList className="w-full">
          <TabsTrigger value="week" className="flex-1">
            今週
          </TabsTrigger>
          <TabsTrigger value="month" className="flex-1">
            今月
          </TabsTrigger>
          <TabsTrigger value="all" className="flex-1">
            すべて
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mb-6 flex justify-center gap-6 text-sm text-muted-foreground">
        {CHOICE_ORDER.map((choice) => (
          <span key={choice} className="inline-flex items-center gap-1">
            <ChoiceIcon choice={choice} size={18} /> {counts[choice]}件
          </span>
        ))}
      </div>

      {filteredRecords.length === 0 ? (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          この期間の記録はまだありません。
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filteredRecords.map((record) => {
            const tags = getCategoryItemsByIds(record.categoryItemIds);
            return (
              <li key={record.id}>
                <button
                  type="button"
                  onClick={() => setSelectedDateKey(record.recordDate)}
                  className="w-full rounded-2xl border px-4 py-3 text-left"
                >
                  <div className="flex items-center gap-2">
                    <ChoiceIcon choice={record.choice} size={20} />
                    <span className="text-sm text-muted-foreground">
                      {formatDateShortJa(record.recordDate)}
                    </span>
                  </div>
                  {tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
                        >
                          {tag.label}
                        </span>
                      ))}
                    </div>
                  )}
                  {record.diary && (
                    <p className="mt-2 text-sm leading-relaxed text-foreground">
                      {record.diary}
                    </p>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {selectedDateKey && (
        <DayDetailSheet
          dateKey={selectedDateKey}
          record={selectedRecord}
          onClose={() => setSelectedDateKey(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
