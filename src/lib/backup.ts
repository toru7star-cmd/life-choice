import { todayKey } from "./date";
import {
  getAllCategories,
  getAllRecords,
  replaceAllCategories,
  replaceAllRecords,
} from "./storage";
import { Choice, DailyRecord, UserCategoryItem } from "./types";

export interface BackupData {
  appName: "life-choice";
  backupVersion: 1;
  exportedAt: string;
  records: DailyRecord[];
  categories: UserCategoryItem[];
}

const APP_NAME = "life-choice";
const BACKUP_VERSION = 1;
const CHOICES: Choice[] = ["future", "present", "drift"];

export function exportBackup(): BackupData {
  return {
    appName: APP_NAME,
    backupVersion: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    records: getAllRecords(),
    categories: getAllCategories(),
  };
}

export function downloadBackup(data: BackupData): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `life-choice-backup-${todayKey()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function parseBackupJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function isValidRecord(item: unknown): item is DailyRecord {
  if (typeof item !== "object" || item === null) return false;
  const r = item as Record<string, unknown>;
  return (
    typeof r.id === "string" &&
    typeof r.recordDate === "string" &&
    typeof r.choice === "string" &&
    CHOICES.includes(r.choice as Choice) &&
    typeof r.diary === "string" &&
    typeof r.createdAt === "string" &&
    typeof r.updatedAt === "string" &&
    (r.categoryItemIds === undefined ||
      (Array.isArray(r.categoryItemIds) &&
        r.categoryItemIds.every((id) => typeof id === "string")))
  );
}

function isValidCategory(item: unknown): item is UserCategoryItem {
  if (typeof item !== "object" || item === null) return false;
  const c = item as Record<string, unknown>;
  return (
    typeof c.id === "string" &&
    typeof c.category === "string" &&
    CHOICES.includes(c.category as Choice) &&
    typeof c.label === "string" &&
    typeof c.sortOrder === "number"
  );
}

export type ValidateBackupResult =
  | { valid: true; data: BackupData }
  | { valid: false; reason: string };

export function validateBackup(input: unknown): ValidateBackupResult {
  if (typeof input !== "object" || input === null) {
    return { valid: false, reason: "このファイルの内容を読み取れませんでした。" };
  }
  const data = input as Record<string, unknown>;

  if (data.appName !== APP_NAME) {
    return { valid: false, reason: "このアプリのバックアップファイルではないようです。" };
  }
  if (data.backupVersion !== BACKUP_VERSION) {
    return { valid: false, reason: "対応していないバックアップの形式です。" };
  }
  if (typeof data.exportedAt !== "string") {
    return { valid: false, reason: "バックアップの情報が不足しています。" };
  }
  if (!Array.isArray(data.records) || !data.records.every(isValidRecord)) {
    return { valid: false, reason: "記録データの形式が正しくありません。" };
  }
  if (!Array.isArray(data.categories) || !data.categories.every(isValidCategory)) {
    return { valid: false, reason: "分類データの形式が正しくありません。" };
  }

  const records: DailyRecord[] = data.records.map((r) => ({
    ...r,
    categoryItemIds: r.categoryItemIds ?? [],
  }));

  return {
    valid: true,
    data: {
      appName: APP_NAME,
      backupVersion: BACKUP_VERSION,
      exportedAt: data.exportedAt,
      records,
      categories: data.categories,
    },
  };
}

export function importBackup(data: BackupData): void {
  replaceAllRecords(data.records);
  replaceAllCategories(data.categories);
}
