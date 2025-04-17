"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  downloadMergedCSV,
  downloadHourlyCSV,
  downloadMonthlyCSV,
  downloadDailyCSV,
} from "@/lib/utils/csvUtils";
import {
  MonthlyRawData,
  DailyRawData,
  HourlyRawData,
} from "@/lib/types/rawdata";
import { flattenJoinedData } from "@/lib/utils/flattenJoinedData";
import RawDataTable from "./RawDataTable";

export default function RawDataDownload({ id }: { id: string }) {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [month, setMonth] = useState(1);

  const [showMonthly, setShowMonthly] = useState(true);
  const [showDaily, setShowDaily] = useState(true);
  const [showHourly, setShowHourly] = useState(true);

  const [monthlyData, setMonthlyData] = useState<MonthlyRawData[]>([]);
  const [dailyData, setDailyData] = useState<DailyRawData[]>([]);
  const [hourlyData, setHourlyData] = useState<HourlyRawData[]>([]);

  const handleSearch = async () => {
    const lastDay = new Date(year, month, 0).getDate();
    const from = `${year}-${String(month).padStart(2, "0")}-01`;
    const to = `${year}-${String(month).padStart(2, "0")}-${String(
      lastDay
    ).padStart(2, "0")}`;

    const { data: user, error: userError } = await supabase
      .from("escalatorusers")
      .select("es_id")
      .eq("id", id)
      .single();

    if (userError || !user) {
      alert("유저 정보를 불러오지 못했습니다.");
      return;
    }

    const es_id = user.es_id;

    const { data: monthlyRaw } = await supabase
      .from("monthlyrawdata")
      .select(
        `
        escalator!inner(es_num, es_unit, location),
        date, boarding_load, boarding_passenger, driving_distance, driving_time,
        operating_time, left_handrail_distance, left_handrail_speed,
        right_handrail_distance, right_handrail_speed, nominal_speed,
        power_consum, start_num, auxmbrake_braking_distance,
        driving_chain_increased_length, mbrake_braking_distance,
        stepchain_increased_length
      `
      )
      .eq("es_id", es_id)
      .gte("date", from)
      .lte("date", to);

    setMonthlyData(flattenJoinedData<MonthlyRawData>(monthlyRaw as any));

    const { data: dailyRaw } = await supabase
      .from("dailyrawdata")
      .select(
        `
        escalator!inner(es_num, es_unit, location), date, boarding_load, boarding_passenger, driving_distance, driving_time,
        operating_time, left_handrail_distance, left_handrail_speed,
        right_handrail_distance, right_handrail_speed, nominal_speed,
        power_consum, start_num
      `
      )
      .eq("es_id", es_id)
      .gte("date", from)
      .lte("date", to);

    setDailyData(flattenJoinedData<DailyRawData>(dailyRaw as any));

    const { data: hourlyRaw } = await supabase
      .from("hourlyrawdata")
      .select(
        `
        escalator!inner(es_num, es_unit, location), date, hour, boarding_load, boarding_passenger, driving_distance, driving_time,
        operating_time, left_handrail_distance, left_handrail_speed,
        right_handrail_distance, right_handrail_speed, nominal_speed,
        power_consum, start_num, humidity, temper
      `
      )
      .eq("es_id", es_id)
      .gte("date", from)
      .lte("date", to);

    setHourlyData(flattenJoinedData<HourlyRawData>(hourlyRaw as any));
  };

  return (
    <div className="p-6 space-y-4">
      {/* 날짜 조회 영역 */}
      <div className="flex gap-4 items-center">
        <select
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="border px-2 py-1 rounded"
        >
          {Array.from({ length: 5 }, (_, i) => {
            const y = currentYear - i;
            return (
              <option key={y} value={y}>
                {y}년
              </option>
            );
          })}
        </select>

        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="border px-2 py-1 rounded"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}월
            </option>
          ))}
        </select>

        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          조회
        </button>
      </div>

      {/* 필터 체크박스 & 통합 다운로드 */}
      <div className="flex gap-6 items-center">
        <label className="flex gap-1 items-center">
          <input
            type="checkbox"
            checked={showMonthly}
            onChange={() => setShowMonthly(!showMonthly)}
          />
          월간 데이터
        </label>
        <label className="flex gap-1 items-center">
          <input
            type="checkbox"
            checked={showDaily}
            onChange={() => setShowDaily(!showDaily)}
          />
          일간 데이터
        </label>
        <label className="flex gap-1 items-center">
          <input
            type="checkbox"
            checked={showHourly}
            onChange={() => setShowHourly(!showHourly)}
          />
          시간별 데이터
        </label>

        <button
          className="ml-auto bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm"
          onClick={() =>
            downloadMergedCSV(
              {
                monthly: showMonthly ? monthlyData : [],
                daily: showDaily ? dailyData : [],
                hourly: showHourly ? hourlyData : [],
              },
              year,
              month
            )
          }
        >
          조회된 데이터 전체 다운로드
        </button>
      </div>

      {showMonthly && (
        <RawDataTable
          title="📆 월간 데이터"
          data={monthlyData}
          onDownload={() => downloadMonthlyCSV(monthlyData, year, month)}
        />
      )}

      {showDaily && (
        <RawDataTable
          title="📅 일간 데이터"
          data={dailyData}
          onDownload={() => downloadDailyCSV(dailyData, year, month)}
        />
      )}

      {showHourly && (
        <RawDataTable
          title="⏰ 시간별 데이터"
          data={hourlyData}
          onDownload={() => downloadHourlyCSV(hourlyData, year, month)}
        />
      )}
    </div>
  );
}
