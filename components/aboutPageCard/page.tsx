"use client";
import React from "react";
import styles from "./card.module.css";

type CardProps = {
  title: string;
  hoverText: string;
  bgColor?: string;
  hoverColor?: string;
  variant?: "default" | "values"; 
};

function Card({ 
  title, 
  hoverText, 
  bgColor = "#00ADEE", 
  hoverColor = "#125892",
  variant = "default"
}: CardProps) {
  return (
    <div 
      className={`${styles.card} ${variant === "values" ? styles.valuesCard : ""}`}
      style={{ background: bgColor }}
    >
      <div className={styles.title}>{title}</div>
      <div 
        className={styles.hoverContent}
        style={{ background: hoverColor }}
      >
        <p>{hoverText}</p>
      </div>
    </div>
  );
}

export default Card;