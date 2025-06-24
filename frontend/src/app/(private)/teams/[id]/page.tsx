"use client";

import { Suspense } from "react";
import { Spinner } from "@/components/spinner";
import { Team } from "@/components/team/team";
import { ErrorBoundary } from "react-error-boundary";
import useSpaceStore from "@/store/space";

export default function Page() {
  const { spaceId } = useSpaceStore();

  if (!spaceId) return null;
  return (
    <Suspense fallback={<Spinner />}>
      <ErrorBoundary fallback={<div>Team not found</div>}>
        <Team spaceId={spaceId} />
      </ErrorBoundary>
    </Suspense>
  );
}
