import axios from "axios";
import { RunSubmitToolOutputsParams } from "openai/resources/beta/threads/runs/runs.mjs";
// All assistants requests

// Create a new assistant
interface ICreateAssistant {
  name: string;
  description: string;
  model?: string;
  additionalTools?: string[];
}
export const createAssistant = async ({
  name,
  description,
  model,
  additionalTools,
}: ICreateAssistant) => {
  const { data } = await axios.post("/api/assistant/createAssistant", {
    name,
    description,
    model,
    additionalTools,
  });
  return data;
};

// Get assistant by id
export const getAssistant = async (id: string) => {
  const { data } = await axios.get(`/api/assistant/${id}/getAssistant`);
  return data;
};

// Create thread
interface ICreateThread {
  messages: any[];
  fileIds: string[];
}

export const createThread = async ({ messages, fileIds }: ICreateThread) => {
  const { data } = await axios.post(`/api/threads/createThread`, {
    messages,
    fileIds,
  });
  return data;
};

// Get thread by id
export const getThread = async (id: string) => {
  const { data } = await axios.get(`/api/threads/${id}/getThread`);
  return data;
};

// Add message to thread
interface IAddMessageToThread {
  threadID: string;
  content: string;
}

export const addMessageToThread = async ({
  threadID,
  content,
}: IAddMessageToThread) => {
  const { data } = await axios.post(`/api/threads/${threadID}/addMessage`, {
    content,
  });
  return data;
};

// Get messages from thread
interface IGetMessagesFromThread {
  threadID: string;
}

export const getMessagesFromThread = async ({
  threadID,
}: IGetMessagesFromThread) => {
  const { data } = await axios.get(`/api/threads/${threadID}/messages`);
  return data;
};

// Get run steps
interface IGetRunSteps {
  threadId: string;
  runId: string;
}

export const getRunSteps = async ({ threadId, runId }: IGetRunSteps) => {
  const { data } = await axios.get(
    `/api/threads/${threadId}/runs/${runId}/steps`
  );
  return data;
};

// Submit tool outputs
interface ISubmitToolOutputs {
  threadId: string;
  runId: string;
  toolOutputs: RunSubmitToolOutputsParams;
}

export const submitToolOutputs = async ({
  threadId,
  runId,
  toolOutputs,
}: ISubmitToolOutputs) => {
  const { data } = await axios.post(
    `/api/threads/${threadId}/runs/${runId}/submitToolOutput`,
    {
      toolOutputs,
    }
  );
  return data;
};

// Check for action
export const checkForAction = async (threadId: string) => {
  const { data } = await axios.get(`/api/checkForAction/${threadId}`);
  return data;
};

// Get config
export const getConfig = async () => {
  const { data } = await axios.get(`/api/config`);
  return data;
};
