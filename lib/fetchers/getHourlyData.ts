import { supabase } from "@/lib/supabase";

export async function getHourlyData(id: string, date: string) {
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
    .from("hourlyrawdata")
    .select(
      "date, hour, boarding_load, boarding_passenger, driving_distance, start_num"
    )
    .eq("es_id", userData?.es_id)
    .eq("date", targetDate) //
    .order("hour", { ascending: true }); //

  if (error) {
    throw new Error("hourly data fetch 실패: " + error.message);
  }

  return data;
}
