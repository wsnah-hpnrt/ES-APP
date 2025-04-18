import Link from "next/link";
import Image from "next/image";

export default function Sidebar() {
  return (
    <aside className="w-[180px] shrink-0 bg-gray-50 shadow-md px-4 py-6 flex flex-col items-center">
      <div className="items-center pb-10">
        <Image src="/HPNRT.png" alt="LOGO" width={150} height={150} />
      </div>
      <div className="">
        <ul className="space-y-2 mt-8">
          <li>
            <Link
              href="/dashboard"
              className="block px-4 py-2 hover:bg-gray-200 rounded"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              href="/rawdata"
              className="block px-4 py-2 hover:bg-gray-200 rounded"
            >
              RawData
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
