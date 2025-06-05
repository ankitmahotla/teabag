"use client";

import { NoticeBoard } from "@/components/home/notice-board";
import { UserTeam } from "@/components/home/user-team";
import { Loader } from "lucide-react";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
      <Suspense fallback={<Loader className="h-6 w-6 animate-spin" />}>
        <UserTeam />
      </Suspense>
      <NoticeBoard />
    </div>
  );
}
