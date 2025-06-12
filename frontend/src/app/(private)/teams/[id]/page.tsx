"use client";

import { Suspense } from "react";
import { Spinner } from "@/components/spinner";
import { Team } from "@/components/team/team";

export default function Page() {
  return (
    <Suspense fallback={<Spinner />}>
      <Team />
    </Suspense>
  );
}
