import AddMessageComponent from "@/components/AddMessage";
import CreateAssistantComponent from "@/components/CreateAssistant";
import CreateThreadComponent from "@/components/CreateThread";
import { useState, useEffect } from "react";
import axios from "axios"; // Assuming you're using axios for HTTP requests

const HomePage = () => {
  const [assistantId, setAssistantId] = useState<string>("");
  const [thread, setThread] = useState<any>(null);

  const fetchConfig = async () => {
    try {
      const response = await axios.get("/api/config");
      const config = response.data;
      if (config.ASSISTANT_ID) {
        setAssistantId(config.ASSISTANT_ID);
      }
    } catch (error) {
      console.error("Error fetching config:", error);
    }
  };

  // useEffect to fetch config on mount
  useEffect(() => {
    fetchConfig();
  }, []);

  return (
    <div>
      <h1>Assistant Test App</h1>
      {!assistantId && (
        <CreateAssistantComponent onAssistantCreated={setAssistantId} />
      )}
      {assistantId && (
        <>
          <CreateThreadComponent
            assistantId={assistantId}
            onThreadCreated={setThread}
          />
          {thread && <AddMessageComponent threadId={thread.id} />}
        </>
      )}
    </div>
  );
};

export default HomePage;
