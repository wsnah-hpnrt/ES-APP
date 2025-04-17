import "@/styles/globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function EscalatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <Topbar />
        <div className="px-10 py-6">{children}</div>
      </div>
    </main>
  );
}
