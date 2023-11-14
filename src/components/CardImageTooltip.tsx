import { useState } from "react";
import baseStyles from "../styles/cardImageTooltip.module.css";

const CardImageTooltip = ({
  cardName,
  imageUrl,
}: {
  cardName: string;
  imageUrl: string;
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <span
      className={baseStyles["card-tooltip-container"]}
      onMouseEnter={() => setIsTooltipVisible(true)}
      onMouseLeave={() => setIsTooltipVisible(false)}
    >
      <p className={baseStyles["card-tooltip-text"]}>{cardName}</p>
      {isTooltipVisible && (
        <div className={baseStyles["card-tooltip-image"]}>
          <div className={baseStyles["card-tooltip-image"]}>
            <img src={imageUrl} alt={`Image of ${cardName}`} />
          </div>
        </div>
      )}
    </span>
  );
};

export default CardImageTooltip;
