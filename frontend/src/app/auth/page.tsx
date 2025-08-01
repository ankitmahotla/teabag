"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSessionStore } from "@/store/session";
import { useSignInSync } from "@/sync/auth";

import { useGoogleLogin } from "@react-oauth/google";
import { redirect } from "next/navigation";
import { toast } from "sonner";

export default function SignIn() {
  const { mutateAsync, isPending } = useSignInSync();
  const { isAuthenticated } = useSessionStore();

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (response) => {
      await mutateAsync({ code: response.code });
      toast.success("Logged in successfully!");
    },
  });

  if (isAuthenticated) redirect("/");

  return (
    <div className="flex min-h-screen flex-col p-4">
      <div className="flex flex-1 items-center justify-center">
        <Card className="w-full max-w-sm border shadow-2xl backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-center text-2xl font-semibold">
              Welcome to Teabag
            </CardTitle>
            <CardDescription className="text-center">
              Sign in with your Google account to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              disabled={isPending}
              onClick={() => login()}
              className="w-full"
            >
              Sign in with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
