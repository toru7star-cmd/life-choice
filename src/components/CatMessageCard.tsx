import { Card, CardContent } from "@/components/ui/card";
import { CatMessage } from "@/lib/cat-message";

interface CatMessageCardProps {
  catMessage: CatMessage;
}

export default function CatMessageCard({ catMessage }: CatMessageCardProps) {
  return (
    <Card className="bg-muted/40">
      <CardContent className="flex flex-col items-center gap-2 py-2 text-center">
        <span className="text-3xl" aria-hidden>
          🐱
        </span>
        <p className="text-base leading-relaxed text-foreground">{catMessage.message}</p>
        <p className="text-sm text-muted-foreground">{catMessage.closingMessage}</p>
      </CardContent>
    </Card>
  );
}
