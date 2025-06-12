import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSpaceStore from "@/store/space";
import { useGetCohortTeamsSync } from "@/sync/teams";
import { TEAM } from "@/types/team";
import { useRouter } from "next/navigation";

export const TeamsCatalog = () => {
  const { spaceId } = useSpaceStore();
  const { data } = useGetCohortTeamsSync(spaceId!);
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filteredTeams = data.filter((team: TEAM) =>
    team.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-semibold">Team Catalog</h1>
        <Input
          placeholder="Search teams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
        />
      </div>

      {filteredTeams.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeams.map((team: TEAM) => (
            <Card key={team.id}>
              <CardHeader>
                <CardTitle className="text-lg">{team.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>{team.description}</p>
                <Button
                  onClick={() => router.push(`/teams/${team.id}`)}
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                >
                  View Team
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No teams match your search.</p>
      )}
    </div>
  );
};
