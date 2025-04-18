import {
  MonthlyRawData,
  DailyRawData,
  HourlyRawData,
} from "@/lib/types/rawdata";

// CSV 한 줄 생성 함수
function convertToCSV<T extends object>(data: T[]): string {
  if (data.length === 0) return "";

  // num, unit, location 순으로 정렬하기
  const PRIORITY_KEYS = ["es_num", "es_unit", "location"];
  const allKeys = Object.keys(data[0]);
  const otherKeys = allKeys.filter((key) => !PRIORITY_KEYS.includes(key));
  const orderedKeys = [...PRIORITY_KEYS, ...otherKeys];

  const header = orderedKeys.join(",");
  const rows = data.map((row) =>
    orderedKeys
      .map((key) => {
        const val = (row as Record<string, string | number | undefined>)[key];
        return val !== undefined ? `"${val}"` : '""';
      })
      .join(",")
  );

  return [header, ...rows].join("\n");
}

// CSV 다운로드 Blob 생성
export function downloadCSVBlob(csv: string, filename: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// 개별 다운로드 함수들
export function downloadMonthlyCSV(
  data: MonthlyRawData[],
  year: number,
  month: number
) {
  const csv = convertToCSV(data);
  downloadCSVBlob(csv, `${year}-${month}_monthly.csv`);
}

export function downloadDailyCSV(
  data: DailyRawData[],
  year: number,
  month: number
) {
  const csv = convertToCSV(data);
  downloadCSVBlob(csv, `${year}-${month}_daily.csv`);
}

export function downloadHourlyCSV(
  data: HourlyRawData[],
  year: number,
  month: number
) {
  const csv = convertToCSV(data);
  downloadCSVBlob(csv, `${year}-${month}_hourly.csv`);
}

// 통합 다운로드
export function downloadMergedCSV(
  datasets: {
    monthly?: MonthlyRawData[];
    daily?: DailyRawData[];
    hourly?: HourlyRawData[];
  },
  year: number,
  month: number
) {
  let mergedCSV = "";

  if (datasets.monthly?.length) {
    mergedCSV += "monthly\n";
    mergedCSV += convertToCSV(datasets.monthly);
    mergedCSV += "\n\n";
  }

  if (datasets.daily?.length) {
    mergedCSV += "daily\n";
    mergedCSV += convertToCSV(datasets.daily);
    mergedCSV += "\n\n";
  }

  if (datasets.hourly?.length) {
    mergedCSV += "hourly\n";
    mergedCSV += convertToCSV(datasets.hourly);
  }

  downloadCSVBlob(mergedCSV, `${year}-${month}_merged.csv`);
}
