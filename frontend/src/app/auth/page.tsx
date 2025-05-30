"use client";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

export default function SignIn() {
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:8000/api/auth/sign-in", {
        credential: credentialResponse.credential,
      });

      console.log("User info from backend:", res.data);
    } catch (err) {
      console.error("Login failed", err);
    }
  };
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
          <CardContent className="w-full flex justify-center">
            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={() => {
                console.log("Login Failed");
              }}
              logo_alignment="center"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
