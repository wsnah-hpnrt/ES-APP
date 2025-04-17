import { EscalatorInfo } from "@/lib/types/rawdata";

export function flattenJoinedData<T>(
  data: {
    escalator: EscalatorInfo[] | EscalatorInfo;
  }[] &
    T[]
): (Omit<T, "escalator"> & EscalatorInfo)[] {
  return data.map((item) => {
    const escalatorRaw = Array.isArray(item.escalator)
      ? item.escalator[0]
      : item.escalator;

    const rest = { ...item };
    delete (rest as { escalator?: unknown }).escalator;

    return {
      ...(rest as unknown as Omit<T, "escalator">),
      es_num: escalatorRaw?.es_num ?? "",
      es_unit: escalatorRaw?.es_unit ?? 0,
      location: escalatorRaw?.location ?? "",
    };
  });
}
