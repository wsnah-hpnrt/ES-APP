"use client";

import DaumPostcode from "react-daum-postcode";

export default function AddressModal({
  onComplete,
  onClose,
}: {
  onComplete: (addr: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow max-w-lg w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 text-xl"
        >
          &times;
        </button>
        <DaumPostcode
          onComplete={(data) => {
            const fullAddress = data.address;
            onComplete(fullAddress);
          }}
          autoClose
        />
      </div>
    </div>
  );
}
