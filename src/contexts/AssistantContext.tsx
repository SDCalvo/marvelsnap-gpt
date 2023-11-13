import React, { createContext, useReducer, useContext } from "react";

// Define a type for message content
type IMessageContent = {
  type: string;
  text?: {
    value: string;
    annotations: any[];
  };
};

// Define a type for a message
type IMessage = {
  id: string;
  created_at: number;
  thread_id: string;
  role: string;
  content: IMessageContent[];
  file_ids: string[];
  assistant_id?: string;
  run_id?: string;
  metadata: Record<string, unknown>;
};

// Define the state structure
type IState = {
  messages: IMessage[];
  isLoading: boolean;
  error: string | null;
};

// Define action types
type Action =
  | { type: "ADD_MESSAGE"; payload: IMessage }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_MESSAGES" };

// Create the context
const AssistantContext = createContext<{
  state: IState;
  dispatch: React.Dispatch<Action>;
}>({
  state: { messages: [], isLoading: false, error: null },
  dispatch: () => null,
});

// Reducer function
const reducer = (state: IState, action: Action): IState => {
  switch (action.type) {
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_MESSAGES":
      return { ...state, messages: [] };
    default:
      return state;
  }
};

// Context Provider component
type AssistantProviderProps = {
  children: React.ReactNode;
};

export const AssistantProvider = ({ children }: AssistantProviderProps) => {
  const [state, dispatch] = useReducer(reducer, {
    messages: [],
    isLoading: false,
    error: null,
  });

  return (
    <AssistantContext.Provider value={{ state, dispatch }}>
      {children}
    </AssistantContext.Provider>
  );
};

// Custom hook to use the assistant context
export const useAssistant = () => useContext(AssistantContext);

export default AssistantProvider;
