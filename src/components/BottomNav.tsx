"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "今日", icon: "📝" },
  { href: "/calendar", label: "カレンダー", icon: "📅" },
  { href: "/settings", label: "設定", icon: "⚙️" },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="sticky bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <ul className="flex justify-around">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-1 text-sm transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <span className="text-xl leading-none" aria-hidden>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
