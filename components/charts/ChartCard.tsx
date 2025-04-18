//각 차트를 분리하여 day month hour 데이터를 보여주는 기능
import React from "react";
import MetricChart from "./MetricChart";

interface ChartCardProps {
  title: string;
  data: { label: string; value: number }[];
  chartType?: "area" | "bar";
}

export default function ChartCard({
  title,
  data,
  chartType = "area",
}: ChartCardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md border border-gray-100">
      <h2 className="text-lg font-semibold text-center py-2">{title}</h2>
      <MetricChart data={data} chartType={chartType} />
    </div>
  );
}
