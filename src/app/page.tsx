import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import LandingClient from "./LandingClient";

export default async function Page() {
  const session = await getServerSession(authOptions);
  return <LandingClient hasSession={!!session} />;
}
