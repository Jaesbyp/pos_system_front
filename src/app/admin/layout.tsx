"use client";
import "@/app/globals.css";
import "primereact/resources/themes/bootstrap4-dark-purple/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import DashboardPanel from "@/components/dashboard/dasboard-panel";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-12 ">
      {<DashboardPanel />}
      <div className="col-span-10 p-4 m-0 outline-none bg-slate-600 max-w-[86vw] max-h-[100vh]">
        {children}
      </div>
    </div>
  );
}
