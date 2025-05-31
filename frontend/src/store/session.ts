import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

enum Role {
  ADMIN = "admin",
  USER = "user",
}

type User = {
  id: string;
  email: string;
  name?: string;
  role: Role;
};

type SessionState = {
  user: User | null;
  expiresAt: number | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
};

type SessionActions = {
  newSession: (user: User) => void;
  refreshSession: () => void;
  resetSession: () => void;
};

const initialState: SessionState = {
  user: null,
  expiresAt: null,
  isAuthenticated: false,
  hasHydrated: false,
};

export const useSessionStore = create<SessionState & SessionActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      newSession: (user) =>
        set({
          user,
          expiresAt: Date.now() + 60 * 60 * 1000,
          isAuthenticated: true,
        }),

      refreshSession: () => {
        const currentUser = get().user;
        set({
          user: currentUser,
          expiresAt: Date.now() + 60 * 60 * 1000,
          isAuthenticated: true,
        });
      },

      resetSession: async () => {
        useSessionStore.persist.clearStorage();
        set({ ...initialState });
        await useSessionStore.persist.rehydrate();
      },
    }),
    {
      name: "session",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hasHydrated = true;
        }
      },
    },
  ),
);
