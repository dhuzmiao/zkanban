import { useMemo } from 'react';
import { FlipDigit } from './FlipDigit';

interface FlipClockProps {
  timestamp: number;
  timezoneOffset?: number; // 时区偏移（小时），默认 UTC+8（北京时间）
}

export function FlipClock({ timestamp, timezoneOffset = 8 }: FlipClockProps) {
  const digits = useMemo(() => {
    const date = new Date(timestamp);
    // 获取 UTC 时间并加上时区偏移
    let hours = date.getUTCHours() + timezoneOffset;
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();

    // 处理跨日情况
    if (hours >= 24) hours -= 24;
    if (hours < 0) hours += 24;

    const hoursStr = hours.toString().padStart(2, '0');
    const minutesStr = minutes.toString().padStart(2, '0');
    const secondsStr = seconds.toString().padStart(2, '0');

    return [
      parseInt(hoursStr[0]), parseInt(hoursStr[1]),
      parseInt(minutesStr[0]), parseInt(minutesStr[1]),
      parseInt(secondsStr[0]), parseInt(secondsStr[1])
    ];
  }, [timestamp, timezoneOffset]);

  return (
    <div className="flex items-center gap-1">
      <FlipDigit value={digits[0]} />
      <FlipDigit value={digits[1]} />
      <span className="text-4xl font-bold text-black dark:text-white mx-1">:</span>
      <FlipDigit value={digits[2]} />
      <FlipDigit value={digits[3]} />
      <span className="text-4xl font-bold text-black dark:text-white mx-1">:</span>
      <FlipDigit value={digits[4]} />
      <FlipDigit value={digits[5]} />
    </div>
  );
}
