import { notFound } from "next/navigation";

import AdminClient from "./admin-client";

export default function AdminPage() {
  if (process.env.ENABLE_ADMIN !== "true") {
    notFound();
  }

  return <AdminClient />;
}
