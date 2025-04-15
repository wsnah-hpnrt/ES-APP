export type ChartPoint = {
  label: string;
  value: number;
};

// Hourly
export type HourlyRaw = {
  hour: number;
  boarding_load: number;
  boarding_passenger: number;
  driving_distance: number;
  start_num: number;
};

export type HourlyField = keyof Omit<HourlyRaw, "hour">;

export function groupHourly(
  data: HourlyRaw[],
  field: HourlyField
): ChartPoint[] {
  return Array.from({ length: 24 }, (_, hour) => {
    const sum = data
      .filter((d) => d.hour === hour)
      .reduce((acc, cur) => acc + cur[field], 0);
    return {
      label: `${hour + 1}`, // 1~24로 맞춤
      value: sum,
    };
  });
}

// Daily
export type DailyRaw = {
  date: string;
  boarding_load: number;
  boarding_passenger: number;
  driving_distance: number;
  start_num: number;
};

export type DailyField = keyof Omit<DailyRaw, "date">;

export function groupDaily(data: DailyRaw[], field: DailyField): ChartPoint[] {
  const dayMap: Record<number, number> = {};
  data.forEach((d) => {
    const day = new Date(d.date).getDate();
    dayMap[day] = (dayMap[day] || 0) + d[field];
  });

  return [...Array(31)].map((_, i) => ({
    label: `${i + 1}`,
    value: dayMap[i + 1] || 0,
  }));
}

// Monthly
export type MonthlyRaw = {
  date: string;
  boarding_load: number;
  boarding_passenger: number;
  driving_distance: number;
  start_num: number;
};

export type MonthlyField = keyof Omit<MonthlyRaw, "date">;

export function groupMonthly(
  data: MonthlyRaw[],
  field: MonthlyField
): ChartPoint[] {
  const monthMap: Record<number, number> = {};
  data.forEach((d) => {
    const month = new Date(d.date).getMonth() + 1;
    monthMap[month] = (monthMap[month] || 0) + d[field];
  });

  return [...Array(12)].map((_, i) => ({
    label: `${i + 1}`,
    value: monthMap[i + 1] || 0,
  }));
}
