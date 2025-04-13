import { supabase } from "@/lib/supabase";

export async function getDailyData(id: string) {
  const today = new Date();
  const thisMonth = today.getMonth(); // 0~11
  const lastMonth = thisMonth - 1;
  const targetMonth = lastMonth === -1 ? 11 : lastMonth;
  const targetYear =
    lastMonth === -1 ? today.getFullYear() - 1 : today.getFullYear();

  const fromDate = new Date(targetYear, targetMonth, 1);
  const toDate = new Date(targetYear, targetMonth + 1, 0); // 그 달의 마지막 날

  const { data, error } = await supabase
    .from("dailyrawdata")
    .select(
      "date, boarding_load, boarding_passanger, driving_distance, start_num, escalatorusers!inner(id)"
    )
    .eq("escalatorusers.id", id)
    .gte("date", fromDate.toISOString().slice(0, 10))
    .lte("date", toDate.toISOString().slice(0, 10));

  if (error) {
    throw new Error("daily data fetch 실패: " + error.message);
  }

  return { data, month: targetMonth + 1 };
}
