import React from "react";
import "./Card.css";

type data = { date: string; day: string; temps: string; icon: string };

interface iCardProps {
  data: data;
}

const Card: React.FC<iCardProps> = ({ data }) => {
  const { date, day, temps, icon } = data;

  return (
    <div className="Card">
      <h2>
        {date} {day}
      </h2>
      <h3>{temps} </h3>
      <img src={icon} alt="☀️" />
    </div>
  );
};

export default Card;
