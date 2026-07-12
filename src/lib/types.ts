export type Choice = "future" | "present" | "drift";

export interface DailyRecord {
  id: string;
  recordDate: string; // "YYYY-MM-DD"
  choice: Choice;
  diary: string;
  categoryItemIds: string[];
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
}

export interface UserCategoryItem {
  id: string;
  category: Choice;
  label: string;
  sortOrder: number;
}

export const CHOICE_LABELS: Record<Choice, string> = {
  future: "未来の自分に使った",
  present: "今の自分を満たした",
  drift: "なんとなく過ごした",
};

export const CHOICE_ICONS: Record<Choice, string> = {
  future: "🌱",
  present: "😊",
  drift: "⏳",
};

export const CHOICE_ORDER: Choice[] = ["future", "present", "drift"];
