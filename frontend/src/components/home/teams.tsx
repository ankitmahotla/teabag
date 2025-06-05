import useSpaceStore from "@/store/space";
import { useGetCohortTeamsSync } from "@/sync/teams";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TEAM } from "@/types/team";
import { TeamDetail } from "./team-detail";
import { useState } from "react";

export const Teams = () => {
  const { spaceId } = useSpaceStore();
  const { data } = useGetCohortTeamsSync(spaceId ?? "");
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  return (
    <section className="mt-8">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data?.map((team: TEAM) => (
          <Card
            onClick={() => setSelectedTeamId(team.id)}
            key={team.id}
            className="flex flex-col h-full shadow-sm transition-transform hover:scale-[1.03] cursor-pointer"
          >
            <CardHeader className="pb-2">
              <CardTitle className="truncate">{team.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm line-clamp-3">
                {team?.description || "No description provided."}
              </p>
            </CardContent>
          </Card>
        ))}

        {(!data || data.length === 0) && (
          <div className="col-span-full text-center text-muted-foreground py-12">
            No teams found.
          </div>
        )}
      </div>

      {selectedTeamId && (
        <TeamDetail
          teamId={selectedTeamId}
          open={!!selectedTeamId}
          setOpen={(open: boolean) => {
            if (!open) setSelectedTeamId(null);
          }}
        />
      )}
    </section>
  );
};
