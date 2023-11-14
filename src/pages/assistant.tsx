import { useState, useEffect } from "react";
import axios from "axios";
import { useAssistant } from "@/contexts/AssistantContext";
import {
  createThread,
  getAssistant,
  getConfig,
} from "@/requests/assistantsRequests";
import Chat from "@/components/Chat";
import Steps from "@/components/Steps";

const Assistant = () => {
  const { state, dispatch } = useAssistant();

  useEffect(() => {
    fetchConfigAndSetAssistant();
  }, []);

  useEffect(() => {
    const createNewThread = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const threadDetails = await createThread({
          messages: state.messages,
          fileIds: [],
        });
        dispatch({ type: "SET_THREAD", payload: threadDetails });
        dispatch({ type: "SET_THREAD_ID", payload: threadDetails.id });
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to create thread" });
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    if (state.assistantId && !state.threadId) {
      createNewThread();
    }
  }, [state.assistantId, state.threadId]);

  const fetchConfigAndSetAssistant = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const config = await getConfig();

      if (config.ASSISTANT_ID) {
        const assistantDetails = await getAssistant(config.ASSISTANT_ID);
        dispatch({ type: "SET_ASSISTANT", payload: assistantDetails });
        dispatch({ type: "SET_ASSISTANT_ID", payload: config.ASSISTANT_ID });
      } else {
        dispatch({
          type: "SET_ERROR",
          payload: "Assistant ID not found in config",
        });
      }
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: "Failed to fetch assistant details",
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const createNewThread = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const threadDetails = await createThread({
        messages: state.messages,
        fileIds: [],
      });
      dispatch({ type: "SET_THREAD", payload: threadDetails });
      dispatch({ type: "SET_THREAD_ID", payload: threadDetails.id });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to create thread" });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  return (
    <div>
      {state.isLoading && <p>Loading...</p>}
      {state.error && <p>Error: {state.error}</p>}
      {!state.isLoading && !state.error && (
        <>
          <Chat />
          <Steps />
        </>
      )}
    </div>
  );
};

export default Assistant;
