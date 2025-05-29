import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto flex items-start justify-between p-2">
      <h1 className="text-2xl font-medium">Teabag</h1>
      <ModeToggle />
    </div>
  );
}
