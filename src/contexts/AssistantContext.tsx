import { Assistant } from "openai/resources/beta/assistants/assistants.mjs";
import { Run } from "openai/resources/beta/threads/runs/runs.mjs";
import { Thread } from "openai/resources/beta/threads/threads.mjs";
import React, { createContext, useReducer, useContext } from "react";

// Define a type for message content
export type IMessageContent = {
  type: string;
  text?: {
    value: string;
    annotations: any[];
  };
};

// Define a type for a message
export type IMessage = {
  id: string;
  created_at: number;
  thread_id: string;
  role: string;
  content: IMessageContent[];
  file_ids: string[];
  assistant_id?: string;
  run_id?: string;
  metadata: Record<string, unknown>;
  tempId?: number | null;
};

// Define the state structure
export type IState = {
  messages: IMessage[];
  isLoading: boolean;
  error: string | null;
  assistantId: string | null;
  assistant: Assistant | null;
  threadId: string | null;
  thread: Thread | null;
  runId: string | null;
  run: Run | null;
  loadingMessage: boolean;
};

const initialState: IState = {
  messages: [],
  isLoading: false,
  error: null,
  assistantId: null,
  assistant: null,
  threadId: null,
  thread: null,
  runId: null,
  run: null,
  loadingMessage: false,
};

// Define action types
type Action =
  | { type: "ADD_MESSAGE"; payload: IMessage }
  | { type: "ADD_MESSAGES"; payload: IMessage[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_MESSAGES" }
  | { type: "SET_ASSISTANT_ID"; payload: string }
  | { type: "SET_ASSISTANT"; payload: Assistant }
  | { type: "SET_THREAD_ID"; payload: string }
  | { type: "SET_THREAD"; payload: Thread }
  | { type: "SET_RUN_ID"; payload: string }
  | { type: "SET_RUN"; payload: Run }
  | { type: "SET_LOADING_MESSAGE"; payload: boolean };

// Create the context
const AssistantContext = createContext<{
  state: IState;
  dispatch: React.Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Reducer function
const reducer = (state: IState, action: Action): IState => {
  switch (action.type) {
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "ADD_MESSAGES":
      return { ...state, messages: action.payload };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_MESSAGES":
      return { ...state, messages: [] };
    case "SET_ASSISTANT_ID":
      return { ...state, assistantId: action.payload };
    case "SET_ASSISTANT":
      return { ...state, assistant: action.payload };
    case "SET_THREAD_ID":
      return { ...state, threadId: action.payload };
    case "SET_THREAD":
      return { ...state, thread: action.payload };
    case "SET_RUN_ID":
      return { ...state, runId: action.payload };
    case "SET_RUN":
      return { ...state, run: action.payload };
    case "SET_LOADING_MESSAGE":
      return { ...state, loadingMessage: action.payload };
    default:
      return state;
  }
};

// Context Provider component
type AssistantProviderProps = {
  children: React.ReactNode;
};

export const AssistantProvider = ({ children }: AssistantProviderProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AssistantContext.Provider value={{ state, dispatch }}>
      {children}
    </AssistantContext.Provider>
  );
};

// Custom hook to use the assistant context
export const useAssistant = () => useContext(AssistantContext);

export default AssistantProvider;
