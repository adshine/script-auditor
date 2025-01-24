import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";

export function Suggestion({ text }: { text: string }) {
  const isImplemented = text.includes("[IMPLEMENTED]");
  const cleanText = text.replace("[IMPLEMENTED]", "").trim();
  
  return (
    <div className="flex items-start gap-2 group">
      <div className="flex-shrink-0 w-5 h-5 mt-0.5">
        {isImplemented ? (
          <div className="rounded-full bg-green-50 p-1">
            <Check className="h-3 w-3 text-green-600" />
          </div>
        ) : (
          <Circle className="h-5 w-5 text-gray-300" />
        )}
      </div>
      <span className={cn(
        "text-sm",
        isImplemented ? "text-gray-700" : "text-gray-600"
      )}>
        {cleanText}
      </span>
    </div>
  );
} 