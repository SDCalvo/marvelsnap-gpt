import React, { useState } from "react";
import { useAssistant } from "@/contexts/AssistantContext";
import { addMessageToThread, cancelRun } from "@/requests/assistantsRequests";
import styles from "../styles/chat.module.css";
import AssistantMessage, { IMessagePart } from "./AssistantMessage";

export interface IShowCard {
  showCard: boolean;
  cardUrl: string;
}

const Chat = () => {
  const { state, dispatch } = useAssistant();
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Add a new state to track the index of the last user message
  const [lastUserMessageIndex, setLastUserMessageIndex] = useState(-1);
  const [showCard, setShowCard] = useState<IShowCard>({
    showCard: false,
    cardUrl: "",
  });

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
  const isNewMessage = (index: number) => index === lastUserMessageIndex;

  //Add event listener to send message when pressing enter
  const handleKeyDown = (event: any) => {
    if (isLoading || !newMessage.trim() || state.loadingMessage) return;
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  function parseMarkdownToParts(markdownText: string | undefined) {
    const parts: IMessagePart[] = [];
    if (!markdownText) return parts;

    // Replace single dash with a special placeholder that won't be affected by other regex
    const updatedText = markdownText.replace(/(^|\s)-(\s|$)/g, "$1<br/>$2");

    // Split the text by markdown link and image syntax
    const splitText = updatedText.split(/(\!\[.*?\]\(.*?\))|(\*\*.*?\*\*)/g);

    splitText.forEach((text) => {
      if (!text) return; // Skip empty strings resulting from split

      if (text.startsWith("![") && text.includes("type=card")) {
        // Image syntax for card
        const match = text.match(/\!\[(.*?)\]\((.*?)\)/);
        if (match) {
          parts.push({
            type: "image",
            content: match[1],
            url: match[2],
          });
        }
      } else if (text.startsWith("**")) {
        // Bold syntax
        const boldText = text.replace(/^\*\*(.*?)\*\*$/, "$1");
        parts.push({ type: "strong", content: boldText });
      } else {
        // Check for line breaks (br tags)
        const textParts = text.split("<br/>");
        textParts.forEach((part, index) => {
          if (part) {
            parts.push({ type: "text", content: part });
          }
          // Add line breaks except for the last part
          if (index < textParts.length - 1) {
            parts.push({ type: "linebreak", content: "" });
          }
        });
      }
    });

    return parts;
  }

  const cancelRun = async () => {
    try {
      await cancelRun();
    } catch (error) {
      console.error("Failed to cancel run:", error);
    }
  };

  // Cancel run if unmount component
  React.useEffect(() => {
    return () => {
      cancelRun();
    };
  }, []);

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
                {message?.content?.map((content, contentIndex) => {
                  const messageParts = parseMarkdownToParts(
                    content?.text?.value
                  );
                  return (
                    <AssistantMessage
                      key={contentIndex}
                      parts={messageParts}
                      showCard={showCard}
                      setShowCard={setShowCard}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className={styles.newMessageContainer}>
          <input
            type="text"
            value={newMessage}
            onKeyDown={handleKeyDown}
            onChange={(e) => setNewMessage(e.target.value)}
            className={styles.newMessageInput}
            placeholder="Type your message here..."
            disabled={isLoading || state.loadingMessage}
          />
          <button
            onClick={sendMessage}
            className={styles.sendMessageButton}
            disabled={isLoading || !newMessage.trim() || state.loadingMessage}
          >
            Send
          </button>
          <button onClick={cancelRun} className={styles.sendMessageButton}>
            Cancel
          </button>
        </div>

        <div
          className={`${styles["card-tooltip-image"]} ${
            showCard.showCard ? styles["show"] : ""
          }`}
        >
          <img src={showCard.cardUrl} alt="card" />
        </div>
      </div>
    </div>
  );
};

export default Chat;
