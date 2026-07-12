import { SettingsIcon } from "lucide-react";
import Link from "next/link";

export default function SettingsGearLink() {
  return (
    <Link
      href="/settings"
      aria-label="設定"
      className="absolute right-6 top-4 text-muted-foreground"
    >
      <SettingsIcon className="size-5" />
    </Link>
  );
}
