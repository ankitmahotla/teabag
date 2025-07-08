"use client";
import { Users } from "@/components/user/users";
import useSpaceStore from "@/store/space";
import { Loader } from "lucide-react";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function Page() {
  const { spaceId } = useSpaceStore();
  return (
    <Suspense fallback={<Loader className="h-6 w-6 animate-spin" />}>
      <ErrorBoundary
        fallback={
          <p className="text-sm text-muted-foreground">Error loading users.</p>
        }
      >
        <Users cohortId={spaceId!} />
      </ErrorBoundary>
    </Suspense>
  );
}
