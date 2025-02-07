import { create } from "zustand";
interface UserStore {
  token: string;
  setToken: (token: string) => void;
  clearToken: () => void;
}
const userStore = create<UserStore>((set) => ({
  token: "",
  setToken: (token: string) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  clearToken: () => {
    localStorage.removeItem("token");
    set({ token: "" });
  },
}));

export default userStore;
