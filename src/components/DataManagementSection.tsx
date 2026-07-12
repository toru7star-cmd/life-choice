"use client";

import { useRef, useState } from "react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BackupData,
  downloadBackup,
  exportBackup,
  importBackup,
  parseBackupJson,
  validateBackup,
} from "@/lib/backup";
import { clearAllData } from "@/lib/storage";

interface DataManagementSectionProps {
  onDataChanged: () => void;
}

export default function DataManagementSection({
  onDataChanged,
}: DataManagementSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingImport, setPendingImport] = useState<BackupData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleExport() {
    downloadBackup(exportBackup());
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setErrorMessage(null);
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseBackupJson(String(reader.result));
      if (parsed === null) {
        setErrorMessage(
          "このファイルを読み込めませんでした。JSON形式のバックアップファイルを選んでください。"
        );
        return;
      }
      const result = validateBackup(parsed);
      if (!result.valid) {
        setErrorMessage(result.reason);
        return;
      }
      setPendingImport(result.data);
    };
    reader.readAsText(file);
  }

  function handleConfirmImport() {
    if (!pendingImport) return;
    importBackup(pendingImport);
    setPendingImport(null);
    onDataChanged();
  }

  function handleClearAll() {
    clearAllData();
    onDataChanged();
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-base">データ管理</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          記録はこの端末のブラウザ内に保存されます。ブラウザのデータを削除した場合や、別の端末・ブラウザを使用した場合は、記録を引き継げません。大切な記録はバックアップしてください。
        </p>

        {errorMessage && (
          <p className="rounded-xl bg-muted/50 px-4 py-3 text-sm text-foreground">
            {errorMessage}
          </p>
        )}

        <Button type="button" onClick={handleExport} className="h-11 w-full rounded-full">
          バックアップを書き出す
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          className="h-11 w-full rounded-full"
        >
          バックアップから復元
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json,.json"
          onChange={handleFileSelect}
          className="hidden"
        />

        <AlertDialog>
          <AlertDialogTrigger
            render={
              <button
                type="button"
                className="self-center text-sm text-muted-foreground underline underline-offset-4"
              />
            }
          >
            すべてのデータを削除
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>すべての記録と設定を削除しますか？</AlertDialogTitle>
              <AlertDialogDescription>
                この操作は元に戻せません。必要な場合は先にバックアップしてください。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>キャンセル</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={handleClearAll}>
                すべて削除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>

      <AlertDialog
        open={pendingImport !== null}
        onOpenChange={(open) => !open && setPendingImport(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>現在の記録をバックアップ内容で置き換えますか？</AlertDialogTitle>
            <AlertDialogDescription>
              復元すると、現在の記録と設定は上書きされます。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmImport}>復元する</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
