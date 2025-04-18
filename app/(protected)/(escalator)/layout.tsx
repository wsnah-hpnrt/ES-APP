import "@/styles/globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function EscalatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex h-screen w-screen overflow-x-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="w-full border-b border-gray-200  px-6 ">
          <Topbar />
        </div>
        <div className="flex-1 px-10 py-6 overflow-y-auto">{children}</div>
      </div>
    </main>
  );
}
