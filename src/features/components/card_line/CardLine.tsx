import React from "react";
import Card from "../Card";
import "./CardLine.css";

type data = { date: string; day: string; temps: string; icon: string };

interface iCardProps {
  data: data;
}

function CardLine() {
  return (
    <div className="CardLine-Container">
      <Card
        data={{
          date: "02/20",
          day: "TUE",
          temps: "18/10",
          icon: "☀️",
        }}
      />
      <Card
        data={{
          date: "02/20",
          day: "TUE",
          temps: "18/10",
          icon: "☀️",
        }}
      />
      <Card
        data={{
          date: "02/20",
          day: "TUE",
          temps: "18/10",
          icon: "☀️",
        }}
      />
      <Card
        data={{
          date: "02/20",
          day: "TUE",
          temps: "18/10",
          icon: "☀️",
        }}
      />
      <Card
        data={{
          date: "02/20",
          day: "TUE",
          temps: "18/10",
          icon: "☀️",
        }}
      />
    </div>
  );
}

export default CardLine;
