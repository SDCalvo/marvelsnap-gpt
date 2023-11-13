import React from "react";
import baseStyles from "@/styles/about.module.css";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const About = () => {
  return (
    <div className={baseStyles["main-container"]}>
      <h1 className={baseStyles["title"]}>About MTG Assistant</h1>
      <p className={baseStyles["subtitle"]}>
        This is a Magic: The Gathering Assistant powered by OpenAI&apos;s API.
      </p>
      <div className={baseStyles["info-section"]}>
        <div className={baseStyles["tech-container"]}>
          <h2 className={baseStyles["tech-title"]}>Technologies Used</h2>
          <ul className={baseStyles["tech-list"]}>
            <li className={baseStyles["tech-item"]}>Next.js</li>
            <li className={baseStyles["tech-item"]}>React.js</li>
            <li className={baseStyles["tech-item"]}>OpenAI&apos;s API</li>
          </ul>
        </div>
        <div className={baseStyles["author-container"]}>
          <div className={baseStyles["author-header"]}>
            <h2 className={baseStyles["author-title"]}>Author:</h2>
            <p className={baseStyles["author-name"]}>Santiago D. Calvo</p>
          </div>
          <ul className={baseStyles["author-list"]}>
            <li className={baseStyles["author-email"]}>
              <a
                href="mailto:santiago.d.calvo@gmail.com"
                className={baseStyles["link"]}
              >
                <FaEnvelope /> Email Me
              </a>
            </li>
            <li className={baseStyles["author-github"]}>
              <a
                href="https://github.com/SDCalvo"
                className={baseStyles["link"]}
              >
                <FaGithub /> GitHub
              </a>
            </li>
            <li className={baseStyles["author-linkedin"]}>
              <a
                href="https://www.linkedin.com/in/santiago-d-calvo/"
                className={baseStyles["link"]}
              >
                <FaLinkedin /> LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default About;
