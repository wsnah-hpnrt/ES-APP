"use client";

import ChartCard from "@/components/charts/ChartCard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getHourlyData } from "@/lib/fetchers/getHourlyData";
import { getDailyData } from "@/lib/fetchers/getDailyData";
import Cookies from "js-cookie";
import { ROUTES } from "@/lib/routes";
import AccessDeny from "@/components/AccessDeny";

type ViewType = "hour" | "day";

export default function DashboardPage() {
  const router = useRouter();

  // 쿠키관련
  const [id, setId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // 각 차트별 viewType
  const [distanceViewType, setDistanceViewType] = useState<ViewType>("day");
  const [passengerViewType, setPassengerViewType] = useState<ViewType>("day");
  const [loadViewType, setLoadViewType] = useState<ViewType>("day");
  const [startNumViewType] = useState<ViewType>("day");

  // 각 차트별 데이터 patch
  const [distanceData, setDistanceData] = useState<any[]>([]);
  const [passengerData, setPassengerData] = useState<any[]>([]);
  const [loadData, setLoadData] = useState<any[]>([]);
  const [startNumData, setStartNumData] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 쿠키에서 id와 role 가져오기
  useEffect(() => {
    if (mounted) {
      const cookieId = Cookies.get("id");
      const cookieRole = Cookies.get("role");
      setId(cookieId || "");
      setRole(cookieRole || "");
    }
  }, [mounted]);

  // 로그인 안 되어 있으면 로그인 페이지로
  useEffect(() => {
    if (mounted && id === "") {
      router.push(ROUTES.LOGIN);
    }
  }, [mounted, id, router]);

  // 차트 데이터 fetch
  const fetchChartData = async (
    view: ViewType,
    field: string,
    setter: (data: any[]) => void
  ) => {
    if (!id) return;

    try {
      if (view === "hour") {
        const data = await getHourlyData(id);
        const grouped = groupHourly(data, field);
        setter(grouped);
      } else {
        const { data, month } = await getDailyData(id);
        const grouped = groupDaily(data, field);
        setter(grouped);
        setCurrentMonth(month);
      }
    } catch (err) {
      console.error(`${field} fetch error:`, err);
    }
  };

  useEffect(() => {
    if (id)
      fetchChartData(distanceViewType, "driving_distance", setDistanceData);
  }, [distanceViewType]);

  useEffect(() => {
    if (id)
      fetchChartData(passengerViewType, "boarding_passanger", setPassengerData);
  }, [passengerViewType]);

  useEffect(() => {
    if (id) fetchChartData(loadViewType, "boarding_load", setLoadData);
  }, [loadViewType]);

  useEffect(() => {
    if (id) fetchChartData(startNumViewType, "start_num", setStartNumData);
  }, [startNumViewType]);

  // 쿠키 체크 전이면 아무것도 없이 return
  if (!mounted || id === null || role === null) {
    return null;
  }

  // 권한에 따른 접근 제한
  if (role !== "escalatorusers") {
    return <AccessDeny />;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <ChartCard
        title={currentMonth ? `운행거리 (${currentMonth}월)` : "운행거리"}
        chartType="area"
        viewType={distanceViewType}
        onChangeViewType={setDistanceViewType}
        data={distanceData}
      />
      <ChartCard
        title={currentMonth ? `탑승인원 (${currentMonth}월)` : "탑승인원"}
        chartType="area"
        viewType={passengerViewType}
        onChangeViewType={setPassengerViewType}
        data={passengerData}
      />
      <ChartCard
        title={currentMonth ? `탑승부하 (${currentMonth}월)` : "탑승부하"}
        chartType="area"
        viewType={loadViewType}
        onChangeViewType={setLoadViewType}
        data={loadData}
      />
      <ChartCard
        title={currentMonth ? `기동횟수 (${currentMonth}월)` : "기동횟수"}
        chartType="bar"
        viewType="day"
        onChangeViewType={() => {}}
        data={startNumData}
        hideSelect
      />
    </div>
  );
}

// group 함수들
function groupHourly(data: any[], field: string) {
  return Array.from({ length: 24 }, (_, hour) => {
    const sum = data
      .filter((d) => d.hour === hour)
      .reduce((acc, cur) => acc + cur[field], 0);
    return {
      label: `${hour}`,
      value: sum,
    };
  });
}

function groupDaily(data: any[], field: string) {
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
