"use client";

import { useEffect, useState } from "react";
import ChoiceSelector from "@/components/ChoiceSelector";
import DiaryInput from "@/components/DiaryInput";
import { Button } from "@/components/ui/button";
import { formatDateJa, todayKey } from "@/lib/date";
import { getRecordByDate, saveRecord } from "@/lib/storage";
import { Choice } from "@/lib/types";

export default function TodayPage() {
  const [loaded, setLoaded] = useState(false);
  const [hasSavedToday, setHasSavedToday] = useState(false);
  const [mode, setMode] = useState<"form" | "done">("form");
  const [choice, setChoice] = useState<Choice | null>(null);
  const [diary, setDiary] = useState("");

  useEffect(() => {
    const dateKey = todayKey();
    const existing = getRecordByDate(dateKey);
    if (existing) {
      // localStorageはSSR時に読めないため、マウント後にクライアントでのみ読み込む
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setChoice(existing.choice);
      setDiary(existing.diary);
      setHasSavedToday(true);
      setMode("done");
    }
    setLoaded(true);
  }, []);

  function handleSave() {
    if (!choice) return;
    saveRecord(todayKey(), choice, diary);
    setHasSavedToday(true);
    setMode("done");
  }

  if (!loaded) {
    return <div className="flex-1" />;
  }

  return (
    <div className="flex flex-1 flex-col px-6 pt-10 pb-6">
      <p className="mb-8 text-sm text-muted-foreground">{formatDateJa(todayKey())}</p>

      {mode === "done" ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center">
          <p className="text-2xl leading-relaxed font-medium text-foreground">
            今日の記録ができました。
            <br />
            もうスマホを閉じて大丈夫です。
          </p>
          <button
            type="button"
            onClick={() => setMode("form")}
            className="text-sm text-muted-foreground underline underline-offset-4"
          >
            記録を見直す
          </button>
        </div>
      ) : (
        <div className="flex flex-1 flex-col gap-8">
          <div>
            <h1 className="mb-5 text-lg font-medium text-foreground">
              今日はどんな一日でしたか
            </h1>
            <ChoiceSelector value={choice} onChange={setChoice} />
          </div>

          <DiaryInput value={diary} onChange={setDiary} />

          <Button
            type="button"
            onClick={handleSave}
            disabled={!choice}
            className="mt-auto h-14 w-full rounded-full text-base font-medium"
          >
            {hasSavedToday ? "更新する" : "記録する"}
          </Button>
        </div>
      )}
    </div>
  );
}
