import React, { useState } from "react";
import { useAssistant } from "@/contexts/AssistantContext";
import { addMessageToThread } from "@/requests/assistantsRequests";
import styles from "../styles/chat.module.css";

const Chat = () => {
  const { state, dispatch } = useAssistant();
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Add a new state to track the index of the last user message
  const [lastUserMessageIndex, setLastUserMessageIndex] = useState(-1);

  const sendMessage = async () => {
    if (state.threadId && newMessage.trim()) {
      dispatch({ type: "SET_LOADING_MESSAGE", payload: true });
      try {
        // Send the new message to the thread
        const finalResult = await addMessageToThread({
          threadID: state.threadId,
          content: newMessage,
        });

        // Dispatch an action to update messages with the latest including the assistant's response
        dispatch({ type: "ADD_MESSAGES", payload: finalResult.messages });
        // Set the index of the last user message
        setLastUserMessageIndex(finalResult.messages.length - 1);
        // Clear the input field
        setNewMessage("");
      } catch (error) {
        console.error("Failed to send message:", error);
      }
      dispatch({ type: "SET_LOADING_MESSAGE", payload: false });
    }
  };

  // Note: Depending on your backend, you might need to adjust the index calculation
  const orderedMessages = state.messages;
  const isNewMessage = (index: number) => index === lastUserMessageIndex;

  return (
    <div className={styles.outerContainer}>
      <div className={styles.chatContainer}>
        <div className={styles.messagesContainer}>
          {state.loadingMessage && <div className={styles.spinner}></div>}
          {state?.messages?.map((message, index) => (
            <div
              key={index}
              className={`${styles.message} ${
                isNewMessage(index)
                  ? message.role === "user"
                    ? styles.newestUserMessage
                    : styles.newestAssistantMessage
                  : ""
              }`}
            >
              <div
                className={
                  message.role === "user"
                    ? styles.userMessage
                    : styles.assistantMessage
                }
              >
                {message?.content?.map((content, contentIndex) => (
                  <p key={contentIndex}>{content?.text?.value}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.newMessageContainer}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={styles.newMessageInput}
            placeholder="Type your message here..."
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            className={styles.sendMessageButton}
            disabled={isLoading || !newMessage.trim() || state.loadingMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
