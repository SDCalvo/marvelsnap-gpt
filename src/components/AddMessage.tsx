// components/AddMessageComponent.jsx

import { useState } from "react";

const AddMessageComponent = ({ threadId }: any) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const addMessage = async () => {
    setLoading(true);
    const response = await fetch(`/api/threads/${threadId}/addMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message }),
    });
    const data = await response.json();
    setLoading(false);
    setMessage("");
    console.log(data);
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message"
      />
      <button onClick={addMessage} disabled={loading || !threadId}>
        {loading ? "Sending..." : "Send Message"}
      </button>
    </div>
  );
};

export default AddMessageComponent;
