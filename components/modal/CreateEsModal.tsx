import { supabase } from "@/lib/supabase";
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import SuccessModal from "./SuccessModal";
import InputWithPlaceholder from "../InputWithPlaceholder";
import AddressModal from "./AddressModal";
import { Search } from "lucide-react";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateEsModal({ onClose, onSuccess }: Props) {
  const [form, setForm] = useState({
    location: "",
    es_num: "",
    es_unit: "",
    id: "",
    pw: "",
    address: "",
    detail_address: "",
  });

  // 각 칸에 대한 에러메세지
  const [formError, setFormError] = useState({
    location: "",
    es_num: "",
    es_unit: "",
    address: "",
    detail_address: "",
  });

  const [_loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //확인모달, 성공모달
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 다음주소 API 모달
  const [showAddressModal, setShowAddressModal] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    let errorMsg = "";
    if (name === "es_num") {
      if (!/^\d*$/.test(value)) {
        errorMsg = "숫자만 입력 가능합니다.";
      } else if (value.length !== 8) {
        errorMsg = "8자리로 입력해주세요.";
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

    if (["location", "address"].includes(name) && value.trim() === "") {
      errorMsg = "필수 입력 항목입니다.";
    }
    if (name === "detail_address" && value.trim() === "") {
      errorMsg = "필수 입력 항목입니다.";
    }

    if (name === "es_num") {
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

    setFormError((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  // 폼 유효성 검사
  const isFormValid =
    Object.values(formError).every((err) => err === "") &&
    form.location &&
    form.es_num &&
    form.es_unit &&
    form.address &&
    form.detail_address;

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    // 1. escalators table insert
    const { data: escalatorData, error: escalatorError } = await supabase
      .from("escalator")
      .insert({
        es_num: form.es_num,
        es_unit: Number(form.es_unit),
        location: form.location,
        address: form.address,
        detail_address: form.detail_address,
      })
      .select("es_id")
      .single();
    if (escalatorError) {
      setError("에스컬레이터 정보 저장 실패: " + escalatorError.message);
      setLoading(false);
      return;
    }

    // 2. users table insert
    const { error: userError } = await supabase.from("escalatorusers").insert({
      id: form.id,
      pw: form.pw,
      es_id: escalatorData?.es_id, // es_id 조회해서 연결
      is_actived: true,
    });

    if (userError) {
      setError("생성 실패: " + userError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setShowConfirmModal(false); // 확인 모달 표시
    setShowSuccessModal(true); // 성공 모달 표시
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 text-xl font-bold"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">에스컬레이터 정보 생성</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">현장명</label>
            <InputWithPlaceholder
              label="현장명을 입력해 주세요."
              name="location"
              value={form.location}
              onChange={handleChange}
              className={`w-full border p-2 rounded mt-1 ${
                formError.location ? "border-red-500" : ""
              }`}
            />
            {formError.location && (
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
              className={`w-full border p-2 rounded mt-1 ${
                formError.es_num ? "border-red-500" : ""
              }`}
            />
            {formError.es_num && (
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
              className={`w-full border p-2 rounded mt-1 ${
                formError.es_unit ? "border-red-500" : ""
              }`}
            />
            {formError.es_unit && (
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
              className="w-full border p-2 rounded mt-1"
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
              readOnly
              className="w-full border p-2 rounded mt-1 bg-gray-100 text-gray-500 pointer-events-none"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">PW</label>
            <InputWithPlaceholder
              label="PW"
              name="pw"
              value={form.pw}
              onChange={() => {}}
              readOnly
              className="w-full border p-2 rounded mt-1 bg-gray-100 text-gray-500 pointer-events-none"
              type="text"
            />
          </div>

          <div className="col-span-2">
            <label className="text-sm text-gray-600">주소</label>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex-1">
                <InputWithPlaceholder
                  label="주소를 검색해 주세요."
                  name="address"
                  value={form.address}
                  onChange={() => {}}
                  disabled
                  className={`w-full border p-2 rounded bg-gray-100 text-gray-500 pointer-events-none ${
                    formError.address ? "border-red-500" : ""
                  }`}
                />
              </div>
              <button
                type="button"
                onClick={() => setShowAddressModal(true)}
                className="px-3 py-2 border border-gray-300 rounded text-sm whitespace-nowrap"
              >
                <Search size={18} className="text-gray-700" />
              </button>
            </div>
            {formError.address && (
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
          <div className="col-span-2">
            <InputWithPlaceholder
              type="text"
              label="상세 주소를 입력해 주세요."
              name="detail_address"
              value={form.detail_address}
              onChange={handleChange}
              disabled={!form.address}
              className={`w-full border p-2 rounded mt-1 ${
                !form.address ? "bg-gray-100 text-gray-400" : ""
              } ${formError.detail_address ? "border-red-500" : ""}`}
            />
            {formError.detail_address && (
              <p className="text-sm text-red-500 mt-1">
                {formError.detail_address}
              </p>
            )}
          </div>
        </div>
        {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={onClose}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Close
          </button>

          <button
            disabled={!isFormValid}
            onClick={() => setShowConfirmModal(true)}
            className={`px-4 py-2 rounded text-white transition ${
              isFormValid
                ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            생성하기
          </button>

          {showConfirmModal && (
            <ConfirmModal
              message="에스컬레이터를 생성하시겠습니까?"
              onCancel={() => setShowConfirmModal(false)}
              onConfirm={handleSubmit}
            />
          )}

          {showSuccessModal && (
            <SuccessModal
              message="생성이 완료되었습니다."
              onClose={() => {
                setShowSuccessModal(false);
                onSuccess?.(); // 리패치
                // onClose(); // 모달 전체 닫기
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
