import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SpaceState = {
  spaceId: string | null;
};

type SpaceActions = {
  setSpaceId: (id: string | null) => void;
};

const useSpaceStore = create<SpaceState & SpaceActions>()(
  persist(
    (set) => ({
      spaceId: null,
      setSpaceId: (id) => set({ spaceId: id }),
    }),
    {
      name: "space-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useSpaceStore;
