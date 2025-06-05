import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import _ from "lodash";
import { useGetUserCohortsSync } from "@/sync/cohort";
import type { Cohort } from "@/types/cohort";
import useSpaceStore from "@/store/space";

export function SpaceSelect() {
  const { data } = useGetUserCohortsSync();
  const { spaceId, setSpaceId } = useSpaceStore();

  return (
    <Select value={spaceId ?? ""} onValueChange={setSpaceId}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a space" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Cohorts</SelectLabel>
          {data?.cohortsDetails.map((cohort: Cohort) => (
            <SelectItem key={cohort.cohortId} value={cohort.cohortId}>
              {_.capitalize(cohort.name)}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
