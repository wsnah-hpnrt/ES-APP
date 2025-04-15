"use client";

import ChartCard from "@/components/charts/ChartCard";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ROUTES } from "@/lib/routes";
import AccessDeny from "@/components/AccessDeny";
import { getHourlyData } from "@/lib/fetchers/getHourlyData";
import { getDailyData } from "@/lib/fetchers/getDailyData";
import { getMonthlyData } from "@/lib/fetchers/getMontlyData";

import {
  ChartPoint,
  groupHourly,
  groupDaily,
  groupMonthly,
  HourlyField,
  DailyField,
  MonthlyField,
} from "@/lib/utils/chartGroups";

type ViewType = "hour" | "day" | "month";

export default function DashboardPage() {
  const router = useRouter();

  const [id, setId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // 날짜 상태
  const now = new Date();
  const getPreviousMonth = (date: Date) => {
    const year =
      date.getMonth() === 0 ? date.getFullYear() - 1 : date.getFullYear();
    const month = date.getMonth() === 0 ? 12 : date.getMonth();
    return { year, month };
  };
  const { year: defaultYear, month: defaultMonth } = getPreviousMonth(now);

  const [year, setYear] = useState<number>(defaultYear);
  const [month, setMonth] = useState<number>(defaultMonth);
  const [day, setDay] = useState<number | null>(null);
  const [viewType, setViewType] = useState<ViewType>("month");

  const [distanceData, setDistanceData] = useState<ChartPoint[]>([]);
  const [passengerData, setPassengerData] = useState<ChartPoint[]>([]);
  const [loadData, setLoadData] = useState<ChartPoint[]>([]);
  const [startNumData, setStartNumData] = useState<ChartPoint[]>([]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted) {
      const cookieId = Cookies.get("id");
      const cookieRole = Cookies.get("role");
      setId(cookieId || "");
      setRole(cookieRole || "");
    }
  }, [mounted]);

  useEffect(() => {
    if (mounted && id === "") {
      router.push(ROUTES.LOGIN);
    }
  }, [mounted, id, router]);

  useEffect(() => {
    setViewType("month");
    setMonth(0);
    setDay(null);
  }, []);

  const fetchChartData = useCallback(
    async (
      view: ViewType,
      field: HourlyField | DailyField | MonthlyField,
      setter: (data: ChartPoint[]) => void
    ) => {
      if (!id) return;

      try {
        if (view === "hour") {
          const date = `${year}-${String(month).padStart(2, "0")}-${String(
            day
          ).padStart(2, "0")}`;
          const data = await getHourlyData(id, date);
          const grouped = groupHourly(data, field as HourlyField);
          setter(grouped);
        } else if (view === "day") {
          const { data, month: returnedMonth } = await getDailyData(
            id,
            year,
            month
          );
          const grouped = groupDaily(data, field as DailyField);
          setter(grouped);
        } else if (view === "month") {
          const data = await getMonthlyData(id, year);
          const grouped = groupMonthly(data, field as MonthlyField);
          setter(grouped);
        }
      } catch (err) {
        console.error(`${field} fetch error:`, err);
      }
    },
    [id, year, month, day]
  );

  useEffect(() => {
    if (!id || !viewType) return;

    const viewConfigs = [
      { view: viewType, field: "driving_distance", setter: setDistanceData },
      { view: viewType, field: "boarding_passenger", setter: setPassengerData },
      { view: viewType, field: "boarding_load", setter: setLoadData },
      { view: viewType, field: "start_num", setter: setStartNumData },
    ] as const;

    viewConfigs.forEach(({ view, field, setter }) => {
      fetchChartData(view, field, setter);
    });
  }, [id, viewType, fetchChartData]);

  if (!mounted || id === null || role === null) return null;
  if (role !== "escalatorusers") return <AccessDeny />;

  // (0월) 표시하기
  function getTitle(
    baseTitle: string,
    month: number | null,
    day: number | null
  ) {
    if (month && day) return `${baseTitle} (${month}월 ${day}일)`;
    if (month) return `${baseTitle} (${month}월)`;
    return baseTitle;
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-end gap-4 items-center">
        <select
          value={year}
          onChange={(e) => {
            const newYear = Number(e.target.value);
            setYear(newYear);
            setMonth(0);
            setDay(null);
            setViewType("month");
          }}
          className="border px-2 py-1 rounded text-sm"
        >
          {Array.from({ length: 5 }, (_, i) => {
            const y = new Date().getFullYear() - i;
            return (
              <option key={y} value={y}>
                {y}년
              </option>
            );
          })}
        </select>

        <select
          value={month || ""}
          disabled={!year}
          onChange={(e) => {
            const newMonth = Number(e.target.value);
            setMonth(newMonth);
            setDay(null);
            setViewType("day");
          }}
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="">월 선택</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}월
            </option>
          ))}
        </select>

        <select
          value={day || ""}
          disabled={!month}
          onChange={(e) => {
            const newDay = Number(e.target.value);
            setDay(newDay);

            setViewType("hour");
          }}
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="">일 선택</option>
          {Array.from({ length: 31 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}일
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ChartCard
          title={getTitle("운행거리", month, day)}
          chartType="area"
          data={distanceData}
        />
        <ChartCard
          title={getTitle("탑승인원", month, day)}
          chartType="bar"
          data={passengerData}
        />
        <ChartCard
          title={getTitle("탑승부하", month, day)}
          chartType="area"
          data={loadData}
        />
        <ChartCard
          title={getTitle("기동횟수", month, day)}
          chartType="bar"
          data={startNumData}
        />
      </div>
    </div>
  );
}
