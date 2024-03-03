import axios from "axios";
import { useState } from "react";

const SingleItem = ({ item }) => {
  const [itemDescription, setItemDescription] = useState("");

  const handleItemHover = () => {
    axios.get("https://ddragon.leagueoflegends.com/cdn/14.4.1/data/en_US/item.json").then((response) => {
      setItemDescription(response.data.data[item].description);
    });
  };

  return (
    <>
      {!item == "0" ? (
        <img
          // onMouseEnter={handleItemHover}
          className="single-item"
          src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/item/${item}.png`}
        />
      ) : (
        <img
          className="single-item"
          src="https://ddragon.leagueoflegends.com/cdn/14.4.1/img/spell/Summoner_UltBookPlaceholder.png"
        />
      )}
      {itemDescription && <span>{itemDescription}</span>}
    </>
  );
};

export default SingleItem;
