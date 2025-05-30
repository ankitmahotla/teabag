"use client";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function SignIn() {
  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (response) => {
      try {
        const res = await axios.post("http://localhost:8000/api/auth/sign-in", {
          code: response.code,
        });

        console.log("User info from backend:", res.data);
      } catch (err) {
        console.error("Login failed", err);
      }
    },
    onError: () => {
      console.log("Google Auth error");
    },
  });

  return (
    <div className="flex min-h-screen flex-col p-4">
      <div className="flex justify-end">
        <ModeToggle />
      </div>
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
            <Button onClick={() => login()} className="w-full">
              {/* <img src="/google-icon.svg" className="h-5 w-5 mr-2" alt="Google" /> */}
              Sign in with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
