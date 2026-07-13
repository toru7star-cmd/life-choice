import { toDateKey } from "./date";
import { DailyRecord } from "./types";

export function countUnrecordedDaysThisMonth(records: DailyRecord[]): number {
  const now = new Date();
  const recordedDates = new Set(records.map((r) => r.recordDate));
  let count = 0;
  for (let day = 1; day < now.getDate(); day++) {
    const dateKey = toDateKey(new Date(now.getFullYear(), now.getMonth(), day));
    if (!recordedDates.has(dateKey)) count++;
  }
  return count;
}

const HAS_UNRECORDED_TEMPLATES: ((count: number) => string)[] = [
  (count) => `今月は、今日までに${count}日分の記録がまだないにゃ。`,
  () => "記録のない日が少しあるにゃ。思い出せる日だけ残してみる？",
  (count) => `あとから残せる日が${count}日あるにゃ。`,
  () => "まとめて埋めなくても大丈夫だにゃ。",
];

const NO_UNRECORDED_TEMPLATES: string[] = [
  "今日までの記録が残っているにゃ。",
  "今月の選択が少しずつ見えてきたにゃ。",
  "あとで振り返ってみてもいいかもにゃ。",
];

export function getUnrecordedMessage(records: DailyRecord[]): string {
  const count = countUnrecordedDaysThisMonth(records);
  if (count === 0) {
    const index = Math.floor(Math.random() * NO_UNRECORDED_TEMPLATES.length);
    return NO_UNRECORDED_TEMPLATES[index];
  }
  const index = Math.floor(Math.random() * HAS_UNRECORDED_TEMPLATES.length);
  return HAS_UNRECORDED_TEMPLATES[index](count);
}
