// pages/index.jsx

import AddMessageComponent from "@/components/AddMessage";
import CreateAssistantComponent from "@/components/CreateAssistant";
import CreateThreadComponent from "@/components/CreateThread";
import { useState } from "react";

const HomePage = () => {
  const [assistant, setAssistant] = useState<any>(null);
  const [thread, setThread] = useState<any>(null);

  return (
    <div>
      <h1>Assistant Test App</h1>
      <CreateAssistantComponent onAssistantCreated={setAssistant} />
      {assistant && (
        <>
          <CreateThreadComponent
            assistantId={assistant.id}
            onThreadCreated={setThread}
          />
          {thread && <AddMessageComponent threadId={thread.id} />}
        </>
      )}
    </div>
  );
};

export default HomePage;
