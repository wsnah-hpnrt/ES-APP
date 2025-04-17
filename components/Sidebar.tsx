import Link from "next/link";
import Image from "next/image";

export default function Sidebar() {
  return (
    <aside className="w-[180px] bg-gray-50 shadow-md px-4 py-6">
      <div className="items-center pb-10">
        <Image src="/HPNRT.png" alt="LOGO" width={150} height={150} />
      </div>
      <div className="items-center">
        <ul className="space-y-2">
          <li>
            <Link href="/dashboard" className="hover:font-semibold">
              대시보드
            </Link>
          </li>
          <li>
            <Link href="/rawdata" className="hover:font-semibold">
              Raw 데이터
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
