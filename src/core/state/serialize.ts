/**
 * State Serialization
 * JSON serialization/deserialization for CLI session persistence
 */

import type { WorkflowState } from "../types";
import { createInitialWorkflowState } from "../types";

/**
 * Session file schema version for migration support
 */
export const SESSION_SCHEMA_VERSION = 1;

/**
 * Session file structure
 */
export interface SessionFile {
  version: number;
  createdAt: string;
  updatedAt: string;
  state: WorkflowState;
  aiResponses?: {
    analysis?: string;
    prd?: string;
    architecture?: string;
  };
}

/**
 * Serialize workflow state to JSON string
 */
export const serializeState = (
  state: WorkflowState,
  aiResponses?: SessionFile["aiResponses"]
): string => {
  const session: SessionFile = {
    version: SESSION_SCHEMA_VERSION,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    state,
    aiResponses,
  };
  return JSON.stringify(session, null, 2);
};

/**
 * Deserialize JSON string to workflow state
 * Returns null if parsing fails or schema is incompatible
 */
export const deserializeState = (json: string): SessionFile | null => {
  try {
    const parsed = JSON.parse(json) as unknown;

    if (!isSessionFile(parsed)) {
      return null;
    }

    // Version migration could be added here
    if (parsed.version > SESSION_SCHEMA_VERSION) {
      console.warn(
        `Session file version ${parsed.version} is newer than supported version ${SESSION_SCHEMA_VERSION}`
      );
    }

    return parsed;
  } catch {
    return null;
  }
};

/**
 * Type guard for SessionFile
 */
function isSessionFile(value: unknown): value is SessionFile {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const obj = value as Record<string, unknown>;

  return (
    typeof obj["version"] === "number" &&
    typeof obj["createdAt"] === "string" &&
    typeof obj["updatedAt"] === "string" &&
    typeof obj["state"] === "object" &&
    obj["state"] !== null
  );
}

/**
 * Update session with new state while preserving metadata
 */
export const updateSession = (
  existingSession: SessionFile,
  newState: Partial<WorkflowState>,
  aiResponses?: Partial<SessionFile["aiResponses"]>
): SessionFile => {
  return {
    ...existingSession,
    updatedAt: new Date().toISOString(),
    state: {
      ...existingSession.state,
      ...newState,
    },
    aiResponses: {
      ...existingSession.aiResponses,
      ...aiResponses,
    },
  };
};

/**
 * Create a new session with initial state
 */
export const createSession = (): SessionFile => {
  const now = new Date().toISOString();
  return {
    version: SESSION_SCHEMA_VERSION,
    createdAt: now,
    updatedAt: now,
    state: createInitialWorkflowState(),
  };
};
