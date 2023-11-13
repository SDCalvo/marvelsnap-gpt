import React from "react";
import Image from "next/image";
import "@/styles/global.css";
import baseStyles from "@/styles/home.module.css";

const Index = () => {
  return (
    <div className={baseStyles["main-container"]}>
      <div className={baseStyles["title-container"]}>
        <h1 className={baseStyles["title"]}>MTG Assistant</h1>
        <p className={baseStyles["subtitle"]}>
          A Magic: The Gathering assistant to create decks, ask questions, and
          more!
        </p>
        <div className={baseStyles["image-container"]}>
          <Image
            src="/mtgCardBack.jpg"
            alt="MTG Card Back"
            width={200}
            height={280}
            layout="responsive"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
