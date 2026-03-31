import Dexie, { type EntityTable } from "dexie";

export interface DispatchRecord {
  id?: number;
  workflowId: string;
  workflowName: string;
  domain: string;
  payload: Record<string, unknown>;
  status: "success" | "error";
  response?: string;
  timestamp: number;
}

export interface SavedTemplate {
  id?: number;
  workflowId: string;
  name: string;
  values: Record<string, string>;
  createdAt: number;
}

class DispatchDB extends Dexie {
  history!: EntityTable<DispatchRecord, "id">;
  templates!: EntityTable<SavedTemplate, "id">;

  constructor() {
    super("DispatchDB");
    this.version(1).stores({
      history: "++id, workflowId, domain, timestamp",
      templates: "++id, workflowId, createdAt",
    });
  }
}

export const db = new DispatchDB();
