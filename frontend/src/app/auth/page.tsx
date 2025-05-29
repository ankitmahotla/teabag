import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignIn() {
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
            <Button className="w-full">Sign in with Google</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
