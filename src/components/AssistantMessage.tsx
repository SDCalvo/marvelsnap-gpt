import CardImageTooltip from "./CardImageTooltip";
import { IShowCard } from "./Chat";

export interface IMessagePart {
  type: "text" | "image" | "strong" | "linebreak";
  content: string;
  url?: string;
}
interface AssistantMessageProps {
  parts: IMessagePart[];
  showCard: IShowCard;
  setShowCard: React.Dispatch<React.SetStateAction<IShowCard>>;
}

const AssistantMessage: React.FC<AssistantMessageProps> = ({
  parts,
  showCard,
  setShowCard,
}) => {
  // Logic to render message parts based on their type
  const renderMessagePart = (part: IMessagePart, index: number) => {
    switch (part.type) {
      case "text":
        return <span key={index}>{part.content}</span>;
      case "strong":
        return <strong key={index}>{part.content}</strong>;
      case "image":
        // Render the image with a tooltip or modal as before
        return (
          <CardImageTooltip
            key={index}
            cardName={part.content}
            cardUrl={part.url as string}
            showCard={showCard}
            setShowCard={setShowCard}
          />
        );
      case "linebreak":
        // Render a line break
        return <br key={index} />;
      default:
        return null;
    }
  };

  // Render the message by mapping over the parts
  return <>{parts.map(renderMessagePart)}</>;
};

export default AssistantMessage;
