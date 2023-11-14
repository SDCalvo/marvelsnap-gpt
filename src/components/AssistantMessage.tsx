import CardImageTooltip from "./CardImageTooltip";

export interface IMessagePart {
  type: "text" | "image" | "strong";
  content: string;
  url?: string;
}
interface AssistantMessageProps {
  parts: IMessagePart[];
}

const AssistantMessage: React.FC<AssistantMessageProps> = ({ parts }) => {
  // Logic to render message parts based on their type
  const renderMessagePart = (part: IMessagePart, index: number) => {
    switch (part.type) {
      case "text":
        return <span key={index}>{part.content}</span>;
      case "strong":
        return <strong key={index}>{part.content}</strong>;
      case "image":
        // Here you will show the image in a tooltip or however you prefer
        return (
          <CardImageTooltip
            key={index}
            cardName={part.content}
            imageUrl={part.url as string}
          />
        );
      default:
        return null;
    }
  };

  // Render the message by mapping over the parts
  return <>{parts.map(renderMessagePart)}</>;
};

export default AssistantMessage;
