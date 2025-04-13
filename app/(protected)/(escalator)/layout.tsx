import "@/styles/globals.css";
import Navigation from "@/components/Navigation";

export default function EscalatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navigation />
      {children}
    </div>
  );
}
