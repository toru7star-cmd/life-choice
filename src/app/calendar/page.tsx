"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CalendarGrid from "@/components/CalendarGrid";
import DayDetailSheet from "@/components/DayDetailSheet";
import SettingsGearLink from "@/components/SettingsGearLink";
import { Button } from "@/components/ui/button";
import { formatMonthTitle, isFutureDate } from "@/lib/date";
import { deleteRecord, getAllRecords, saveRecord } from "@/lib/storage";
import { Choice, DailyRecord } from "@/lib/types";

export default function CalendarPage() {
  const [loaded, setLoaded] = useState(false);
  const [records, setRecords] = useState<DailyRecord[]>([]);
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const [showFutureNotice, setShowFutureNotice] = useState(false);

  useEffect(() => {
    // localStorageはSSR時に読めないため、マウント後にクライアントでのみ読み込む
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecords(getAllRecords());
    setLoaded(true);
  }, []);

  const recordMap = useMemo(() => {
    const map: Record<string, Choice> = {};
    for (const r of records) {
      map[r.recordDate] = r.choice;
    }
    return map;
  }, [records]);

  const selectedRecord = selectedDateKey
    ? records.find((r) => r.recordDate === selectedDateKey)
    : undefined;

  function goToPrevMonth() {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  }

  function goToNextMonth() {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  }

  function handleSave(choice: Choice, diary: string, categoryItemIds: string[]) {
    if (!selectedDateKey) return;
    saveRecord(selectedDateKey, choice, diary, categoryItemIds);
    setRecords(getAllRecords());
    // Sheetはネコメッセージを表示するため、ここでは閉じずユーザー操作に委ねる
  }

  function handleDelete() {
    if (!selectedDateKey) return;
    deleteRecord(selectedDateKey);
    setRecords(getAllRecords());
    setSelectedDateKey(null);
  }

  function handleSelectDate(dateKey: string) {
    if (isFutureDate(dateKey)) {
      setShowFutureNotice(true);
      return;
    }
    setShowFutureNotice(false);
    setSelectedDateKey(dateKey);
  }

  if (!loaded) {
    return <div className="flex-1" />;
  }

  return (
    <div className="relative flex flex-1 flex-col px-6 pt-10 pb-6">
      <SettingsGearLink />

      <div className="mb-6 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          onClick={goToPrevMonth}
          aria-label="前の月"
        >
          <ChevronLeftIcon className="size-5" />
        </Button>
        <p className="text-base font-medium text-foreground">
          {formatMonthTitle(year, month)}
        </p>
        <Button
          type="button"
          variant="ghost"
          size="icon-lg"
          onClick={goToNextMonth}
          aria-label="次の月"
        >
          <ChevronRightIcon className="size-5" />
        </Button>
      </div>

      <CalendarGrid
        year={year}
        month={month}
        recordMap={recordMap}
        onSelectDate={handleSelectDate}
      />

      {showFutureNotice && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          その日の記録は、その日が来てから残せます。
        </p>
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
