type CardProps = {
  data: {
    date: string;
    day: string;
    temps: string;
    icon: number;
  };
};

const Card = ({ data }: CardProps) => {
  const iconUrl = `https://developer.accuweather.com/sites/default/files/${
    data.icon < 10 ? `0${data.icon}` : data.icon
  }-s.png`; // Build icon URL based on the icon code

  return (
    <div className="Card">
      <p>{data.date}</p>
      <p>{data.day}</p>
      <p>{data.temps}</p>
      <img src={iconUrl} alt={data.day} /> {/* Render the icon image */}
    </div>
  );
};

export default Card;
