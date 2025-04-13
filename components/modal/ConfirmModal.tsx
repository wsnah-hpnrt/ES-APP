"use client";

export default function ConfirmModal({
  message,
  onCancel,
  onConfirm,
}: {
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow w-[90%] max-w-md text-center">
        <p className="text-lg font-semibold mb-4">{message}</p>
        <div className="flex justify-between gap-4">
          <button
            onClick={onCancel}
            className="bg-gray-300 px-4 py-2 rounded w-full"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
