"use client";

import { Team } from "@/components/user/team";
import { Loader } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function Page() {
  return (
    <Suspense fallback={<Loader className="h-6 w-6 animate-spin" />}>
      <ErrorBoundary fallbackRender={errorFallback}>
        <Team />
      </ErrorBoundary>
    </Suspense>
  );
}

const errorFallback = () => {
  redirect("/");
};
