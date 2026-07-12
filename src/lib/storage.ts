import { isFutureDate } from "./date";
import { Choice, DailyRecord, UserCategoryItem } from "./types";

const RECORDS_KEY = "mindful-log:records";
const CATEGORIES_KEY = "mindful-log:categories";

function generateId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

// ---- Daily Records ----

export function getAllRecords(): DailyRecord[] {
  const records = readJson<DailyRecord[]>(RECORDS_KEY, []);
  // categoryItemIdsが存在しない旧データも安全に読み込めるようにする。
  const normalized = records.map((r) => ({
    ...r,
    categoryItemIds: r.categoryItemIds ?? [],
  }));
  // 未来日付の記録は現在の仕様では作成できないため、過去のバージョンで
  // 保存されたものが残っていれば読み込み時に取り除いて自己修復する。
  const validRecords = normalized.filter((r) => !isFutureDate(r.recordDate));
  if (validRecords.length !== records.length) {
    writeJson(RECORDS_KEY, validRecords);
  }
  return validRecords;
}

export function getRecordByDate(recordDate: string): DailyRecord | undefined {
  return getAllRecords().find((r) => r.recordDate === recordDate);
}

export function saveRecord(
  recordDate: string,
  choice: Choice,
  diary: string,
  categoryItemIds: string[]
): DailyRecord {
  const records = getAllRecords();
  const now = new Date().toISOString();
  const existingIndex = records.findIndex((r) => r.recordDate === recordDate);

  if (existingIndex >= 0) {
    const updated: DailyRecord = {
      ...records[existingIndex],
      choice,
      diary,
      categoryItemIds,
      updatedAt: now,
    };
    records[existingIndex] = updated;
    writeJson(RECORDS_KEY, records);
    return updated;
  }

  const created: DailyRecord = {
    id: generateId(),
    recordDate,
    choice,
    diary,
    categoryItemIds,
    createdAt: now,
    updatedAt: now,
  };
  records.push(created);
  writeJson(RECORDS_KEY, records);
  return created;
}

export function deleteRecord(recordDate: string): void {
  const records = getAllRecords().filter((r) => r.recordDate !== recordDate);
  writeJson(RECORDS_KEY, records);
}

// ---- User Categories ----

const DEFAULT_CATEGORIES: Omit<UserCategoryItem, "id">[] = [
  { category: "future", label: "勉強", sortOrder: 0 },
  { category: "future", label: "筋トレ", sortOrder: 1 },
  { category: "future", label: "読書", sortOrder: 2 },
  { category: "future", label: "副業", sortOrder: 3 },
  { category: "future", label: "貯金", sortOrder: 4 },
  { category: "present", label: "友達との飲み会", sortOrder: 0 },
  { category: "present", label: "映画", sortOrder: 1 },
  { category: "present", label: "旅行", sortOrder: 2 },
  { category: "present", label: "ゲーム30分", sortOrder: 3 },
  { category: "present", label: "家族との時間", sortOrder: 4 },
  { category: "drift", label: "目的のないSNS", sortOrder: 0 },
  { category: "drift", label: "長時間の動画視聴", sortOrder: 1 },
  { category: "drift", label: "寝すぎ", sortOrder: 2 },
  { category: "drift", label: "衝動買い", sortOrder: 3 },
];

export function getAllCategories(): UserCategoryItem[] {
  const existing = readJson<UserCategoryItem[] | null>(CATEGORIES_KEY, null);
  if (existing !== null) return existing;

  const seeded: UserCategoryItem[] = DEFAULT_CATEGORIES.map((c) => ({
    ...c,
    id: generateId(),
  }));
  writeJson(CATEGORIES_KEY, seeded);
  return seeded;
}

export function getCategoriesByType(category: Choice): UserCategoryItem[] {
  return getAllCategories()
    .filter((c) => c.category === category)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getCategoryItemsByIds(ids: string[]): UserCategoryItem[] {
  if (ids.length === 0) return [];
  const all = getAllCategories();
  return all.filter((c) => ids.includes(c.id));
}

export function addCategory(category: Choice, label: string): UserCategoryItem {
  const all = getAllCategories();
  const sameType = all.filter((c) => c.category === category);
  const maxOrder = sameType.reduce((max, c) => Math.max(max, c.sortOrder), -1);
  const created: UserCategoryItem = {
    id: generateId(),
    category,
    label,
    sortOrder: maxOrder + 1,
  };
  all.push(created);
  writeJson(CATEGORIES_KEY, all);
  return created;
}

export function deleteCategory(id: string): void {
  const all = getAllCategories().filter((c) => c.id !== id);
  writeJson(CATEGORIES_KEY, all);
}

export function reorderCategories(
  category: Choice,
  orderedIds: string[]
): void {
  const all = getAllCategories();
  const orderMap = new Map(orderedIds.map((id, index) => [id, index]));
  const updated = all.map((c) =>
    c.category === category && orderMap.has(c.id)
      ? { ...c, sortOrder: orderMap.get(c.id)! }
      : c
  );
  writeJson(CATEGORIES_KEY, updated);
}
