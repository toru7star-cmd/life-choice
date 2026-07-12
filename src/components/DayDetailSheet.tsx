"use client";

import { useState } from "react";
import CatCompletionView from "@/components/CatCompletionView";
import ChoiceSelector from "@/components/ChoiceSelector";
import DiaryInput from "@/components/DiaryInput";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CatMessage, catMessageProvider } from "@/lib/cat-message";
import { formatDateJa } from "@/lib/date";
import { CHOICE_ICONS, CHOICE_LABELS, Choice, DailyRecord } from "@/lib/types";

interface DayDetailSheetProps {
  dateKey: string;
  record: DailyRecord | undefined;
  onClose: () => void;
  onSave: (choice: Choice, diary: string) => void;
}

export default function DayDetailSheet({
  dateKey,
  record,
  onClose,
  onSave,
}: DayDetailSheetProps) {
  const [editing, setEditing] = useState(!record);
  const [choice, setChoice] = useState<Choice | null>(record?.choice ?? null);
  const [diary, setDiary] = useState(record?.diary ?? "");
  const [catMessage, setCatMessage] = useState<CatMessage | null>(null);

  function handleSave() {
    if (!choice) return;
    onSave(choice, diary);
    setCatMessage(catMessageProvider.getMessage({ choice, diary, recordDate: dateKey }));
  }

  return (
    <Sheet open onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-3xl px-6 pb-8">
        {!catMessage && (
          <SheetHeader className="px-0">
            <SheetTitle className="text-sm font-normal text-muted-foreground">
              {formatDateJa(dateKey)}
            </SheetTitle>
          </SheetHeader>
        )}

        {catMessage ? (
          <CatCompletionView catMessage={catMessage} onClose={onClose} />
        ) : editing ? (
          <div className="flex flex-col gap-6">
            <ChoiceSelector value={choice} onChange={setChoice} />
            <DiaryInput value={diary} onChange={setDiary} />
            <Button
              type="button"
              onClick={handleSave}
              disabled={!choice}
              className="h-14 w-full rounded-full text-base font-medium"
            >
              保存する
            </Button>
          </div>
        ) : record ? (
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="text-3xl leading-none" aria-hidden>
                {CHOICE_ICONS[record.choice]}
              </span>
              <span className="text-base font-medium text-foreground">
                {CHOICE_LABELS[record.choice]}
              </span>
            </div>
            {record.diary && (
              <p className="rounded-2xl bg-muted/50 px-4 py-3 text-sm leading-relaxed text-foreground">
                {record.diary}
              </p>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditing(true)}
              className="h-14 w-full rounded-full text-base font-medium"
            >
              編集する
            </Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
