import React, { createContext, useReducer, useContext, ReactNode } from "react";

// Define the state structure
type State = {
  message: string;
};

// Define action types
type Action =
  | { type: "SET_MESSAGE"; payload: string }
  | { type: "CLEAR_MESSAGE" };

// Create the context
const AssistantContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: { message: "" },
  dispatch: () => null,
});

// Reducer function
const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_MESSAGE":
      return { ...state, message: action.payload };
    case "CLEAR_MESSAGE":
      return { ...state, message: "" };
    default:
      return state;
  }
};

// Context Provider component
type AssistantProviderProps = {
  children: ReactNode;
};

export const AssistantProvider = ({ children }: AssistantProviderProps) => {
  const [state, dispatch] = useReducer(reducer, { message: "" });

  return (
    <AssistantContext.Provider value={{ state, dispatch }}>
      {children}
    </AssistantContext.Provider>
  );
};

// Custom hook to use the assistant context
export const useAssistant = () => useContext(AssistantContext);
