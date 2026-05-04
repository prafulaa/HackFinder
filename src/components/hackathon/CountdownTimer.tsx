"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNowStrict, isPast, differenceInDays } from "date-fns";

interface CountdownTimerProps {
  deadline: Date | string;
}

export function CountdownTimer({ deadline }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [urgencyClass, setUrgencyClass] = useState("text-muted-foreground");

  useEffect(() => {
    const targetDate = new Date(deadline);
    
    if (isPast(targetDate)) {
      setTimeLeft("Registration closed");
      setUrgencyClass("text-red-500 font-medium");
      return;
    }

    const calculateTimeLeft = () => {
      const days = differenceInDays(targetDate, new Date());
      let uClass = "text-muted-foreground";
      if (days <= 3) uClass = "text-red-500 font-medium";
      else if (days <= 7) uClass = "text-amber-500 font-medium";
      
      setUrgencyClass(uClass);
      setTimeLeft(formatDistanceToNowStrict(targetDate) + " left");
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // update every minute
    
    return () => clearInterval(interval);
  }, [deadline]);

  if (!timeLeft) {
    return <span className="text-sm text-muted-foreground animate-pulse">Loading...</span>;
  }

  return (
    <span className={`text-sm ${urgencyClass}`}>
      {timeLeft}
    </span>
  );
}
