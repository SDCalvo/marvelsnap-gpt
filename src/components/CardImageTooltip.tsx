import { useState } from "react";
import baseStyles from "../styles/chat.module.css";
import { IShowCard } from "./Chat";

const CardImageTooltip = ({
  cardName,
  cardUrl,
  showCard,
  setShowCard,
}: {
  cardName: string;
  cardUrl: string;
  showCard: IShowCard;
  setShowCard: React.Dispatch<React.SetStateAction<IShowCard>>;
}) => {
  return (
    <span
      className={baseStyles["card-tooltip-container"]}
      onMouseEnter={() => setShowCard({ showCard: true, cardUrl })}
      onMouseLeave={() => setShowCard({ showCard: false, cardUrl: "" })}
    >
      <p className={baseStyles["card-tooltip-text"]}>{cardName}</p>
    </span>
  );
};

export default CardImageTooltip;
