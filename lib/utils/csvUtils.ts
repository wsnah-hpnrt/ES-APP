import {
  MonthlyRawData,
  DailyRawData,
  HourlyRawData,
} from "@/lib/types/rawdata";

// CSV 한 줄 생성 함수
function convertToCSV<T extends object>(data: T[]): string {
  if (data.length === 0) return "";

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers
      .map((field) => (row as Record<string, string | number>)[field])
      .join(",")
  );

  return [headers.join(","), ...rows].join("\n");
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
    mergedCSV += "=== 월간 데이터 ===\n";
    mergedCSV += convertToCSV(datasets.monthly);
    mergedCSV += "\n\n";
  }

  if (datasets.daily?.length) {
    mergedCSV += "=== 일간 데이터 ===\n";
    mergedCSV += convertToCSV(datasets.daily);
    mergedCSV += "\n\n";
  }

  if (datasets.hourly?.length) {
    mergedCSV += "=== 시간별 데이터 ===\n";
    mergedCSV += convertToCSV(datasets.hourly);
  }

  downloadCSVBlob(mergedCSV, `${year}-${month}_merged.csv`);
}
