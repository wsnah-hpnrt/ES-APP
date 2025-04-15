import { supabase } from "@/lib/supabase";

export async function getMonthlyData(id: string, year: number) {
  const from = `${year}-01-01`;
  const to = `${year}-12-31`;

  const { data: userData, error: userError } = await supabase
    .from("escalatorusers")
    .select("es_id")
    .eq("id", id)
    .single();

  if (userError || !userData) {
    console.error("es_id 조회 실패:", userError?.message);
    return [];
  }

  const { data, error } = await supabase
    .from("monthlyrawdata")
    .select(
      "date, boarding_load, boarding_passenger, driving_distance, start_num"
    )
    .eq("es_id", Number(userData?.es_id))
    .gte("date", from)
    .lte("date", to)
    .order("date");

  if (error) {
    throw new Error("monthly data fetch 실패: " + error.message);
  }
  return data || [];
}
