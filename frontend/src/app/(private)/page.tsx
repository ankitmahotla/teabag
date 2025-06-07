"use client";

import { UserTeam } from "@/components/home/user-team";
import { Loader } from "lucide-react";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <Suspense fallback={<Loader className="h-6 w-6 animate-spin" />}>
        <UserTeam />
      </Suspense>
    </div>
  );
}
