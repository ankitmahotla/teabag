"use client";
import { SpaceSelect } from "@/components/space-select";

export default function HomePage() {
  return (
    <div>
      <div className="flex items-start justify-between">
        Home Page
        <SpaceSelect />
      </div>
    </div>
  );
}
