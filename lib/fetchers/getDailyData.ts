import { supabase } from "@/lib/supabase";

export async function getDailyData(id: string, year: number, month: number) {
  const fromDate = new Date(year, month - 1, 1);
  const toDate = new Date(year, month, 0); // 마지막 날

  const { data: userData, error: userError } = await supabase
    .from("escalatorusers")
    .select("es_id")
    .eq("id", id)
    .single();

  if (userError || !userData) {
    console.error("es_id 조회 실패:", userError?.message);
    return { data: [], month };
  }
  const { data, error } = await supabase
    .from("dailyrawdata")
    .select(
      "date, boarding_load, boarding_passenger, driving_distance, start_num"
    )
    .eq("es_id", userData.es_id)
    .gte("date", fromDate.toISOString().slice(0, 10))
    .lte("date", toDate.toISOString().slice(0, 10))
    .order("date");

  if (error) {
    throw new Error("daily data fetch 실패: " + error.message);
  }

  return { data, month };
}
