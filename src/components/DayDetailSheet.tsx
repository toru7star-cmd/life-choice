"use client";

import { useState } from "react";
import CatCompletionView from "@/components/CatCompletionView";
import ChoiceIcon from "@/components/ChoiceIcon";
import ChoiceSelector from "@/components/ChoiceSelector";
import DiaryInput from "@/components/DiaryInput";
import TagSelector from "@/components/TagSelector";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CatMessage, catMessageProvider } from "@/lib/cat-message";
import { formatDateJa } from "@/lib/date";
import { getCategoryItemsByIds } from "@/lib/storage";
import { CHOICE_LABELS, Choice, DailyRecord } from "@/lib/types";

interface DayDetailSheetProps {
  dateKey: string;
  record: DailyRecord | undefined;
  onClose: () => void;
  onSave: (choice: Choice, diary: string, categoryItemIds: string[]) => void;
  onDelete: () => void;
}

export default function DayDetailSheet({
  dateKey,
  record,
  onClose,
  onSave,
  onDelete,
}: DayDetailSheetProps) {
  const [editing, setEditing] = useState(!record);
  const [choice, setChoice] = useState<Choice | null>(record?.choice ?? null);
  const [diary, setDiary] = useState(record?.diary ?? "");
  const [categoryItemIds, setCategoryItemIds] = useState<string[]>(
    record?.categoryItemIds ?? []
  );
  const [catMessage, setCatMessage] = useState<CatMessage | null>(null);

  function handleChoiceChange(newChoice: Choice) {
    if (newChoice !== choice) {
      setCategoryItemIds([]);
    }
    setChoice(newChoice);
  }

  function handleSave() {
    if (!choice) return;
    onSave(choice, diary, categoryItemIds);
    setCatMessage(catMessageProvider.getMessage({ choice, diary, recordDate: dateKey }));
  }

  const tags = record ? getCategoryItemsByIds(record.categoryItemIds) : [];

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
          <CatCompletionView catMessage={catMessage} />
        ) : editing ? (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <ChoiceSelector value={choice} onChange={handleChoiceChange} />
              {choice && (
                <TagSelector
                  category={choice}
                  selectedIds={categoryItemIds}
                  onChange={setCategoryItemIds}
                />
              )}
            </div>
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
              <ChoiceIcon choice={record.choice} size={30} />
              <span className="text-base font-medium text-foreground">
                {CHOICE_LABELS[record.choice]}
              </span>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground"
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
            )}
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

            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <button
                    type="button"
                    className="self-center text-sm text-muted-foreground underline underline-offset-4"
                  />
                }
              >
                この日の記録を削除
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>この日の記録を削除しますか？</AlertDialogTitle>
                  <AlertDialogDescription>
                    削除した記録は元に戻せません。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>キャンセル</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={onDelete}>
                    記録を削除
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
