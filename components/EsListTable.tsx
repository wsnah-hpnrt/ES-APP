"use client";

import React, { useState } from "react";
import CreateEsModal from "./modal/CreateEsModal";
import DetailEsModal from "./modal/DetailEsModal";
import InputWithPlaceholder from "./InputWithPlaceholder";

interface Escalator {
  es_id: number;
  es_num: string;
  es_unit: number;
  location: string;
  address: string;
  detail_address: string;
  escalatorusers: {
    id: string;
    pw: string;
    is_actived: boolean;
  };
}

export default function EsListTable({
  escalators,
}: {
  escalators: Escalator[];
}) {
  // pagenation
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalPages = Math.ceil(escalators.length / rowsPerPage);

  // sort (No 기준 오름차순, 내림차순)
  const [sort, setSort] = useState<{
    key: keyof Escalator;
    direction: "asc" | "desc";
  }>({
    key: "es_id",
    direction: "asc",
  });

  // 활성화, 비활성화 필터
  const [showActive, setShowActive] = useState(true);
  const [showInactive, setShowInactive] = useState(true);

  // search
  const [search, setSearch] = useState("");
  const filteredEscalators = escalators.filter((es) => {
    const matchesSearch =
      es.location.toLowerCase().includes(search.toLowerCase()) ||
      es.es_num.toLowerCase().includes(search.toLowerCase());

    const isActive = es.escalatorusers.is_actived === true;
    const isInactive = es.escalatorusers.is_actived === false;

    const matchesStatus =
      (showActive && isActive) || (showInactive && isInactive);
    return matchesSearch && matchesStatus;
  });

  // 테이블 sort
  const sortedEscalators = [...filteredEscalators].sort((a, b) => {
    if (!sort) return 0;
    const aValue = a[sort.key];
    const bValue = b[sort.key];

    if (aValue < bValue) return sort.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sort.direction === "asc" ? 1 : -1;
    return 0;
  });

  // sort handler
  const handleSort = (key: keyof Escalator) => {
    setSort((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  const visibleRows = sortedEscalators.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  // modal
  const [openModal, setOpenModal] = useState(false);

  // detail modal
  const [selectedEscalator, setSelectedEscalator] = useState<Escalator | null>(
    null
  );
  // <p className="text-sm text-gray-600">Showing {escalators.length} items </p>
  return (
    <div className="w-full bg-white p-5 rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <p className="text-2xl font-bold">에스컬레이터 정보</p>

        <div className="flex gap-4 items-center">
          <div className="flex gap-3">
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={showActive}
                onChange={() => setShowActive(!showActive)}
              />
              활성화
            </label>
            <label className="flex items-center gap-1 text-sm">
              <input
                type="checkbox"
                checked={showInactive}
                onChange={() => setShowInactive(!showInactive)}
              />
              비활성화
            </label>
          </div>

          <div className="w-[30rem]">
            <InputWithPlaceholder
              label="현장명이나 승강기 번호를 검색하세요."
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border pl-2 pr-4 py-2 rounded text-left text-sm"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
            onClick={() => setOpenModal(true)}
          >
            에스컬레이터 정보 생성
          </button>

          {openModal && (
            <CreateEsModal
              onClose={() => setOpenModal(false)}
              onSuccess={() => window.location.reload()}
            />
          )}
        </div>
      </div>

      <table className="w-full text-sm table-fixed">
        <thead className="bg-gray-100">
          <tr className="text-center">
            <th
              className="p-2 cursor-pointer"
              onClick={() => handleSort("es_id")}
            >
              No
              {sort?.key === "es_id" && (
                <span>{sort.direction === "asc" ? " ▲" : " ▼"}</span>
              )}
            </th>
            <th className="p-2">현장명</th>
            <th className="p-2">승강기 번호(정부)</th>
            <th className="p-2">호기</th>
            <th className="p-2">승강기 ID</th>
            <th className="p-2">PW</th>
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((es) => (
            <tr
              key={es.es_id}
              className={`text-center hover:bg-gray-50 ${
                !es.escalatorusers.is_actived ? " text-gray-300" : ""
              }`}
              onClick={() => setSelectedEscalator(es)}
            >
              <td className="p-2">{es.es_id}</td>
              <td className="p-2 truncate">{es.location}</td>
              <td className="p-2">{es.es_num}</td>
              <td className="p-2">{es.es_unit}</td>
              <td className="p-2">{es.escalatorusers.id}</td>
              <td className="p-2">{es.escalatorusers.pw}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedEscalator && (
        <DetailEsModal
          escalator={selectedEscalator}
          onClose={() => setSelectedEscalator(null)}
          onUpdated={() => window.location.reload()} // 데이터 다시 fetch
        />
      )}

      {!showActive && !showInactive && (
        <p className="text-center text-gray-500 mt-4">
          표시할 계정이 없습니다. 필터를 선택해 주세요.
        </p>
      )}

      {/* Pagination Section */}
      <div className="flex items-center justify-between mt-4">
        {/* Show per page */}
        <div className="flex items-center gap-2 text-sm">
          <span>Show</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(parseInt(e.target.value));
              setPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            {[10, 25, 50].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
          <span>Per Page</span>
        </div>

        {/* Pagination */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-2 py-1 border rounded text-sm"
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded text-sm ${
                page === i + 1 ? "bg-blue-600 text-white" : "border"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-2 py-1 border rounded text-sm"
          >
            &gt;
          </button>
        </div>

        {/* Go to Page */}
        <div className="flex items-center gap-2 text-sm">
          <span>Go to</span>
          <select
            value={page}
            onChange={(e) => setPage(parseInt(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {Array.from({ length: totalPages }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
