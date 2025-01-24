import { cn } from "@/lib/utils";

interface SideTabProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

export function SideTab({ label, active, onClick }: SideTabProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2 rounded-lg transition-colors",
        "hover:bg-gray-100 dark:hover:bg-gray-800",
        active && "bg-gray-100 dark:bg-gray-800 font-medium"
      )}
    >
      {label}
    </button>
  );
} 