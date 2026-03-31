import { create } from "zustand";

interface DispatchState {
  activeWorkflowId: string | null;
  dispatchStatus: "idle" | "sending" | "success" | "error";
  lastDispatchTarget: string | null;
  setActiveWorkflow: (id: string) => void;
  setDispatchStatus: (status: DispatchState["dispatchStatus"]) => void;
  setLastDispatchTarget: (target: string) => void;
}

export const useDispatchStore = create<DispatchState>((set) => ({
  activeWorkflowId: null,
  dispatchStatus: "idle",
  lastDispatchTarget: null,
  setActiveWorkflow: (id) => set({ activeWorkflowId: id }),
  setDispatchStatus: (status) => set({ dispatchStatus: status }),
  setLastDispatchTarget: (target) => set({ lastDispatchTarget: target }),
}));
