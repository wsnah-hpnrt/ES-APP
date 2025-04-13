"use client";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartType = "bar" | "area";

interface MetricChartProps {
  chartType?: ChartType;
  data: {
    label: string;
    value: number;
  }[];
}

export default function MetricChart({
  data,
  chartType = "area",
}: MetricChartProps) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      {chartType === "bar" ? (
        <BarChart data={data}>
          <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#FB923C" radius={[6, 6, 0, 0]} />
        </BarChart>
      ) : (
        <AreaChart data={data}>
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f97316" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#eee" strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#FB923C"
            fill="url(#lineGradient)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      )}
    </ResponsiveContainer>
  );
}
