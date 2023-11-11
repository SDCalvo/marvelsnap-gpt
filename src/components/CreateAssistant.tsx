// components/CreateAssistantComponent.jsx

import { useState } from "react";

const CreateAssistantComponent = ({ onAssistantCreated }: any) => {
  const [assistantName, setAssistantName] = useState("");
  const [loading, setLoading] = useState(false);

  const createAssistant = async () => {
    setLoading(true);
    const response = await fetch("/api/createAssistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: assistantName,
        description: "Test Assistant",
      }),
    });
    const data = await response.json();
    setLoading(false);
    onAssistantCreated(data);
  };

  return (
    <div>
      <input
        type="text"
        value={assistantName}
        onChange={(e) => setAssistantName(e.target.value)}
        placeholder="Assistant Name"
      />
      <button onClick={createAssistant} disabled={loading}>
        {loading ? "Creating..." : "Create Assistant"}
      </button>
    </div>
  );
};

export default CreateAssistantComponent;
