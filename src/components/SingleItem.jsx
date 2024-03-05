import { useState } from "react";
import axios from "axios";
import "./SingleItem.css";

const SingleItem = ({ item }) => {
  const [itemDescription, setItemDescription] = useState("");
  const [itemName, setItemName] = useState("");

  const handleItemHover = async () => {
    await axios.get("https://ddragon.leagueoflegends.com/cdn/14.4.1/data/en_US/item.json").then((response) => {
      setItemDescription(response.data.data[item].description);
      setItemName(response.data.data[item].name);
    });
  };

  return (
    <span className="single_item">
      {!item == "0" ? (
        <span>
          <img
            onMouseEnter={() => {
              handleItemHover();
            }}
            onMouseLeave={() => {
              setItemName("");
              setItemDescription("");
            }}
            className="single-item"
            src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/item/${item}.png`}
          />
        </span>
      ) : (
        <img
          className="single-item"
          src="https://ddragon.leagueoflegends.com/cdn/14.4.1/img/spell/Summoner_UltBookPlaceholder.png"
        />
      )}
      {itemDescription && (
        <span className="item-float-container">
          <div className="item-name" dangerouslySetInnerHTML={{ __html: [itemName] }} />
          <div className="item-information" dangerouslySetInnerHTML={{ __html: [itemDescription] }} />
        </span>
      )}
    </span>
  );
};

export default SingleItem;
