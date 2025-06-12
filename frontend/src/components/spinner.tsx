import { Loader } from "lucide-react";

export function Spinner() {
  return (
    <div className="flex items-center justify-center">
      <Loader className="h-6 w-6 animate-spin" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}
