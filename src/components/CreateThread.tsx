// components/CreateThreadComponent.jsx

import { useState } from "react";

const CreateThreadComponent = ({ assistantId, onThreadCreated }: any) => {
  const [loading, setLoading] = useState(false);

  const createThread = async () => {
    setLoading(true);
    const response = await fetch("/api/createThread", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [], assistantId }),
    });
    const data = await response.json();
    setLoading(false);
    onThreadCreated(data);
  };

  return (
    <button onClick={createThread} disabled={loading || !assistantId}>
      {loading ? "Creating..." : "Create Thread"}
    </button>
  );
};

export default CreateThreadComponent;
