"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import ConfirmModal from "./ConfirmModal";
import SuccessModal from "./SuccessModal";
import InputWithPlaceholder from "../InputWithPlaceholder";
import AddressModal from "./AddressModal";
import { Search } from "lucide-react";

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

export default function DetailEsModal({
  escalator,
  onClose,
  onUpdated,
}: {
  escalator: Escalator;
  onClose: () => void;
  onUpdated?: () => void;
}) {
  const [isEdit, setIsEdit] = useState(false);
  const [form, setForm] = useState({
    location: escalator.location,
    es_num: escalator.es_num,
    es_unit: escalator.es_unit.toString(),
    id: escalator.escalatorusers.id,
    pw: escalator.escalatorusers.pw,
    address: escalator.address,
    detail_address: escalator.detail_address,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //확인모달, 성공모달
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // 활성화/비활성화용 확인 모달
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [isActived, setIsActived] = useState(
    escalator.escalatorusers?.is_actived ?? true
  );
  // 삭제하기 모달
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 주소 API 모달
  const [showAddressModal, setShowAddressModal] = useState(false);

  // 각 칸에 대한 에러메세지
  const [formError, setFormError] = useState({
    location: "",
    es_num: "",
    es_unit: "",
    address: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    let errorMsg = "";

    // 유효성 검사
    if (name === "es_num") {
      if (!/^\d*$/.test(value)) {
        errorMsg = "숫자만 입력 가능합니다.";
      } else if (value.length !== 8) {
        errorMsg = "8자리로 입력해 주세요.";
      } else if (value.trim() === "") {
        errorMsg = "필수 입력 항목입니다.";
      }
    }

    if (name === "es_unit") {
      if (!/^\d*$/.test(value)) {
        errorMsg = "숫자만 입력해주세요.";
      } else if (value.trim() === "") {
        errorMsg = "필수 입력 항목입니다.";
      }
    }

    if ((name === "location" || name === "address") && value.trim() === "") {
      errorMsg = "필수 입력 항목입니다.";
    }

    setFormError((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));

    // es_num에 따른 ID, PW 변경
    if (name === "es_num" && isEdit) {
      setForm((prev) => ({
        ...prev,
        es_num: value,
        id: value,
        pw: "hpnrt" + value,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (mode: "edit" | "toggle" | "delete") => {
    setLoading(true);
    setError("");

    // edit
    if (mode === "edit") {
      // edit users table
      const { error: userErr } = await supabase
        .from("escalatorusers")
        .update({ pw: form.pw })
        .eq("id", form.id);

      if (userErr) {
        setError("에스컬레이터 ID 수정 실패: " + userErr.message);
        setLoading(false);
        return;
      }

      // edit escalator table
      const { error: esEditErr } = await supabase
        .from("escalator")
        .update({
          location: form.location,
          es_num: form.es_num,
          es_unit: Number(form.es_unit),
          address: form.address,
          detail_address: form.detail_address,
        })
        .eq("es_id", escalator.es_id);

      if (esEditErr) {
        setError("에스컬레이터 정보 수정 실패: " + esEditErr.message);
        setLoading(false);
        return;
      }

      setLoading(false);
      setIsEdit(false); // view로 전환
      setShowConfirmModal(false); // 확인 모달 비활
      setShowSuccessModal(true); // 성공 모달 표시
    }

    // 활성/비활성화
    if (mode === "toggle") {
      // delete escalator table
      const { error: toggleErr } = await supabase
        .from("escalatorusers")
        .update({ is_actived: !isActived })
        .eq("id", form.id);

      if (toggleErr) {
        setError("에스컬레이터 비활성화 실패: " + toggleErr.message);
        setLoading(false);
        return;
      }

      setIsActived(!isActived); // 상태 토글
      setShowToggleModal(false); // 비활성화용 확인 모달 닫기
      setShowSuccessModal(true); // 성공 모달 표시
    }

    if (mode === "delete") {
      const { error: deleteErr } = await supabase
        .from("escalatorusers")
        .delete()
        .eq("id", form.id);

      if (deleteErr) {
        setError("계정 삭제 실패: " + deleteErr.message);
        setLoading(false);
        return;
      }

      setShowDeleteModal(false); // 삭제 모달 닫기
      setShowSuccessModal(true); // 성공 모달 표시
    }
  };

  // 폼 유효성 검사
  const isFormValid =
    Object.values(formError).every((e) => e === "") &&
    form.location &&
    form.es_num &&
    form.es_unit &&
    form.address &&
    form.detail_address;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-xl font-semibold mb-4">에스컬레이터 상세 정보</h2>

        <div className="grid grid-cols-2 gap-4">
          {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

          <div>
            <label className="text-sm text-gray-600">현장명</label>
            <InputWithPlaceholder
              label="현장명을 입력해 주세요."
              name="location"
              value={form.location}
              onChange={handleChange}
              disabled={!isEdit}
              className={`w-full border p-2 rounded mt-1 ${
                !isEdit && "bg-gray-100"
              } ${formError.location && isEdit ? "border-red-500" : ""}`}
            />
            {formError.location && isEdit && (
              <p className="text-sm text-red-500 mt-1">{formError.location}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-600">승강기 번호(정부)</label>
            <InputWithPlaceholder
              label="승강기 번호를 입력해 주세요."
              name="es_num"
              value={form.es_num}
              onChange={handleChange}
              disabled={!isEdit}
              className={`w-full border p-2 rounded mt-1 ${
                !isEdit && "bg-gray-100"
              } ${formError.es_num && isEdit ? "border-red-500" : ""}`}
            />
            {formError.es_num && isEdit && (
              <p className="text-sm text-red-500 mt-1">{formError.es_num}</p>
            )}
          </div>

          <div>
            <label className="text-sm text-gray-600">승강기 고객 호기</label>
            <InputWithPlaceholder
              label="승강기 고객 호기 번호를 입력해 주세요."
              name="es_unit"
              value={form.es_unit}
              onChange={handleChange}
              disabled={!isEdit}
              className={`w-full border p-2 rounded mt-1 ${
                !isEdit && "bg-gray-100"
              } ${formError.es_unit && isEdit ? "border-red-500" : ""}`}
            />
            {formError.es_unit && isEdit && (
              <p className="text-sm text-red-500 mt-1">{formError.es_unit}</p>
            )}
          </div>

          <div></div>
          {/* <div>
            <label className="text-sm text-gray-600">원격 관리 여부</label>
            <select
              name="remote"
              value={form.remote}
              onChange={handleChange}
              disabled={!isEdit}
              className={`w-full border p-2 rounded mt-1 ${
                !isEdit && "bg-gray-100"
              }`}
            >
              <option value="0">없음</option>
              <option value="1">있음</option>
            </select>
          </div> */}

          <div>
            <label className="text-sm text-gray-600">ID</label>
            <InputWithPlaceholder
              label="ID"
              name="id"
              value={form.id}
              onChange={() => {}}
              disabled
              className="w-full border p-2 rounded mt-1 bg-gray-100"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">PW</label>
            <InputWithPlaceholder
              label="PW"
              name="pw"
              value={form.pw}
              onChange={() => {}}
              disabled
              className="w-full border p-2 rounded mt-1 bg-gray-100"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm text-gray-600">주소</label>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1">
                <InputWithPlaceholder
                  type="text"
                  label="주소를 검색해 주세요"
                  name="address"
                  value={form.address}
                  onChange={() => {}}
                  disabled
                  className={`w-full border p-2 rounded mt-1 bg-gray-100 ${
                    formError.address && isEdit ? "border-red-500" : ""
                  }`}
                />
              </div>
              <button
                type="button"
                disabled={!isEdit}
                onClick={() => setShowAddressModal(true)}
                className={`mt-1 p-2 ${
                  !isEdit
                    ? " px-3 py-2 bg-gray-200 border border-gray-300 rounded text-sm whitespace-nowrap opacity-70"
                    : "px-3 py-2 border border-gray-300 rounded text-sm whitespace-nowrap"
                }`}
              >
                <Search size={18} className="text-gray-700" />
              </button>
            </div>
          </div>
          {formError.address && isEdit && (
            <p className="text-sm text-red-500 mt-1">{formError.address}</p>
          )}

          {showAddressModal && (
            <AddressModal
              onClose={() => setShowAddressModal(false)}
              onComplete={(addr) => {
                setForm((prev) => ({ ...prev, address: addr }));
                setShowAddressModal(false);
              }}
            />
          )}
        </div>

        <div className="mt-2">
          <InputWithPlaceholder
            type="text"
            label="상세 주소를 입력해 주세요"
            name="detail_address"
            value={form.detail_address}
            onChange={handleChange}
            disabled={!isEdit || !form.address}
            className={`w-full border p-2 rounded mt-1 ${
              !form.address || !isEdit ? "bg-gray-100" : ""
            } ${formError.address && isEdit ? "border-red-500" : ""}`}
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <button
            onClick={
              (onClose = () => {
                onUpdated?.();
              })
            }
            className="bg-black text-white px-4 py-2 rounded"
          >
            닫기
          </button>
          <div className="flex gap-4">
            <button
              className={`px-4 py-2 rounded text-white ${
                isActived
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              onClick={() => setShowToggleModal(true)}
            >
              {isActived ? "비활성화" : "활성화"}
            </button>

            {isEdit ? (
              <button
                className={`px-4 py-2 rounded text-white ${
                  !isFormValid || loading
                    ? "bg-gray-400 cursor-not-allowed pointer-events-none"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={() => setShowConfirmModal(true)}
                disabled={!isFormValid || loading}
              >
                수정 완료
              </button>
            ) : (
              <>
                {isActived ? (
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => setIsEdit(true)}
                  >
                    수정하기
                  </button>
                ) : (
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    삭제하기
                  </button>
                )}
              </>
            )}

            {showConfirmModal && (
              <ConfirmModal
                message="정말 수정하시겠습니까?"
                onCancel={() => setShowConfirmModal(false)}
                onConfirm={() => handleSubmit("edit")}
              />
            )}

            {showToggleModal && (
              <ConfirmModal
                message={
                  isActived
                    ? "정말 비활성화 하시겠습니까?"
                    : "정말 활성화 하시겠습니까?"
                }
                onCancel={() => setShowToggleModal(false)}
                onConfirm={() => handleSubmit("toggle")}
              />
            )}

            {showDeleteModal && (
              <ConfirmModal
                message="정말 계정을 삭제하시겠습니까?"
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={() => handleSubmit("delete")}
              />
            )}

            {showSuccessModal && (
              <SuccessModal
                message="완료되었습니다."
                onClose={() => {
                  setShowSuccessModal(false);
                  //onUpdated?.(); // 리패치
                  // onClose(); // 모달 전체 닫기
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
