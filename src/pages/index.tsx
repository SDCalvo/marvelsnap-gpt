import React from "react";
import Image from "next/image";
import baseStyles from "@/styles/home.module.css";
import Link from "next/link";

const Index = () => {
  return (
    <div className={baseStyles["main-container"]}>
      <div className={baseStyles["content-container"]}>
        <h1 className={baseStyles["title"]}>MTG Assistant</h1>
        <p className={baseStyles["subtitle"]}>
          Talk to your own MTG Assistant to help you build your deck, suggest
          cards, and more!
        </p>
        <div className={baseStyles["image-container"]}>
          <Link href="/assistant">
            <Image
              src="/mtgCardBack.jpg"
              alt="MTG Card Back"
              width={400} // Adjusted size
              height={560} // Adjusted size to maintain aspect ratio
              className={baseStyles["image"]}
              layout="intrinsic"
            />
          </Link>
        </div>
        <p className={baseStyles["description"]}>
          Leverage the power of Chat GPT in your journey to become the best MTG
          player in the world!
        </p>
      </div>
    </div>
  );
};

export default Index;
