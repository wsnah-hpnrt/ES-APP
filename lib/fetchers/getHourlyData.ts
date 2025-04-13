import { supabase } from "@/lib/supabase";

export async function getHourlyData(id: string) {
  // 어제 날짜 계산
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const targetDate = yesterday.toISOString().slice(0, 10); // "YYYY-MM-DD"

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
      "date, hour, boarding_load, boarding_passanger, driving_distance, start_num"
    )
    .eq("es_id", userData?.es_id)
    .eq("date", targetDate) // ⬅️ 어제 날짜만 조회
    .order("hour", { ascending: true }); // ⬅️ 시간순 정렬 (선택)

  if (error) {
    throw new Error("hourly data fetch 실패: " + error.message);
  }

  return data;
}
