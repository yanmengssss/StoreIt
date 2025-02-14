import { create } from "zustand";
interface CommonStore {
  changePage: boolean;
  setChangePage: (changePage: boolean) => void;
}
const commonStore = create<CommonStore>((set) => ({
  changePage: false,
  setChangePage: (changePage: boolean) => set({ changePage }),
  getChangePage: () => {
    return commonStore.getState().changePage;
  },
}));

export default commonStore;
