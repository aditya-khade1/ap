import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminShell from "./AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/login?callbackUrl=/admin");
  }
  return <AdminShell>{children}</AdminShell>;
}