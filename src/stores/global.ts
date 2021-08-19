import { defineStore } from "pinia";

export const useGlobalStore = defineStore({
  id: "global",
  state: () => ({
    loading: false,
  }),
  actions: {
    async runWithLoader(
      callback: (...args: unknown[]) => Promise<boolean>,
      errorMessage: string
    ): Promise<boolean> {
      try {
        this.loading = true;
        await callback();
        this.loading = false;
        return true;
      } catch (error) {
        this.loading = false;
        throw new Error(errorMessage);
      }
    },
  },
});
