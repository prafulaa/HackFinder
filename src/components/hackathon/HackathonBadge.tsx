import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface HackathonBadgeProps {
  type: "theme" | "difficulty" | "status";
  label: string;
}

export function HackathonBadge({ type, label }: HackathonBadgeProps) {
  const baseClass = "px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-full";
  
  let colorClass = "";
  
  if (type === "theme") {
    colorClass = "bg-violet-100 text-violet-700 hover:bg-violet-200 border-transparent";
  } else if (type === "difficulty") {
    switch (label.toLowerCase()) {
      case "beginner": colorClass = "bg-green-100 text-green-700 border-transparent"; break;
      case "intermediate": colorClass = "bg-amber-100 text-amber-700 border-transparent"; break;
      case "advanced": colorClass = "bg-red-100 text-red-700 border-transparent"; break;
      default: colorClass = "bg-slate-100 text-slate-700 border-transparent"; break;
    }
  } else if (type === "status") {
    switch (label.toLowerCase()) {
      case "upcoming": colorClass = "bg-blue-100 text-blue-700 border-transparent"; break;
      case "ongoing": colorClass = "bg-green-100 text-green-700 border-transparent animate-pulse"; break;
      case "ended": colorClass = "bg-gray-100 text-gray-600 border-transparent"; break;
    }
  }

  return (
    <Badge variant="outline" className={cn(baseClass, colorClass)}>
      {label}
    </Badge>
  );
}
