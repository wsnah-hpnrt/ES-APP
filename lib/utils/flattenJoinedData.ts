import { EscalatorInfo } from "@/lib/types/rawdata";

// Supabase Join 결과 타입 정의
type WithEscalator<T> = T & { escalator?: EscalatorInfo };

export function flattenJoinedData<T extends object>(
  data: WithEscalator<T>[]
): T[] & EscalatorInfo[] {
  return data.map((item) => {
    const { escalator, ...rest } = item;
    return {
      ...rest,
      es_num: escalator?.es_num ?? "",
      es_unit: escalator?.es_unit ?? 0,
      location: escalator?.location ?? "",
    };
  }) as T[] & EscalatorInfo[];
}
