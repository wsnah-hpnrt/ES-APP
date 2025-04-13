//각 차트를 분리하여 day month hour 데이터를 보여주는 기능
import React from "react";
import MetricChart from "./MetricChart";
import { FaCalendarAlt } from "react-icons/fa";

interface ChartCardProps {
  title: string;
  viewType: "hour" | "day" | "month";
  onChangeViewType: (view: "hour" | "day") => void;
  data: { label: string; value: number }[];
  chartType?: "area" | "bar";
  hideSelect?: boolean; // 기동횟수는 dropdown 없애기
}

export default function ChartCard({
  title,
  viewType,
  onChangeViewType,
  data,
  chartType = "area",
  hideSelect,
}: ChartCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-md font-semibold">{title}</h2>
        {!hideSelect && (
          <div className="relative">
            <select
              value={viewType}
              onChange={(e) =>
                onChangeViewType(e.target.value as "hour" | "day")
              }
              className="appearance-none bg-violet-100 text-violet-700 text-sm rounded-md pl-8 pr-3 py-1 focus:outline-none"
            >
              <option value="month">월</option>
              <option value="day">일</option>
              <option value="hour">시간</option>
            </select>
            <FaCalendarAlt className="absolute left-2 top-1/2 transform -translate-y-1/2 text-violet-500" />
          </div>
        )}
      </div>
      <MetricChart data={data} chartType={chartType} />
    </div>
  );
}
