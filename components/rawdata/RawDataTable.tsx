import React from "react";

const PRIORITY_KEYS: string[] = [
  "es_num",
  "es_unit",
  "location",
  "date",
  "hour",
];

interface RawDataTableProps<T extends object> {
  title: string;
  data: T[];
  onDownload: () => void;
}

export default function RawDataTable<T extends object>({
  title,
  data,
  onDownload,
}: RawDataTableProps<T>) {
  if (!data || data.length === 0) {
    return null;
  }

  const allKeys = Object.keys(data[0]) as (keyof T)[];
  const otherKeys = allKeys.filter(
    (key) => !PRIORITY_KEYS.includes(key as string)
  );
  const orderedKeys: (keyof T)[] = [
    ...(PRIORITY_KEYS.filter((k) =>
      allKeys.includes(k as keyof T)
    ) as (keyof T)[]),
    ...otherKeys,
  ];

  return (
    <section className="space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          className="bg-gray-800 text-white px-3 py-1 rounded text-sm"
          onClick={onDownload}
        >
          CSV 다운로드
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left border">
          <thead>
            <tr>
              {orderedKeys.map((key) => (
                <th key={String(key)} className="border px-2 py-1 bg-gray-100">
                  {key as string}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {orderedKeys.map((key) => (
                  <td key={String(key)} className="border px-2 py-1">
                    {String(row[key])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
