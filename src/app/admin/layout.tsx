"use client";
import "@/app/globals.css";
import "primereact/resources/themes/bootstrap4-dark-purple/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import DashboardPanel from "@/components/dashboard/dasboard-panel";
import { adminItems } from "@/components/dashboard/admin-menu-items";
import { useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <div className="flex h-[100vh] sm:grid sm:grid-cols-12 ">
      {<DashboardPanel items={adminItems(router)} />}
      <div className="flex w-full sm:col-span-10 p-4 m-0 outline-none bg-slate-600 md:max-w-[86vw] max-h-[100vh]">
        {children}
      </div>
    </div>
  );
}
