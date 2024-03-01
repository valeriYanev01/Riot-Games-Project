import SingleItem from "./SingleItem";
import "./Teams.css";

const Teams = ({ p }) => {
  return (
    <>
      <div>
        <span className="summoner-name">{p.summonerName}</span>
      </div>
      <img
        src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/champion/${p.championName}.png`}
        className="champion-icon"
      />
      <span className="kda-container">
        <img src="/img/score.png" className="kda-icon" />
        <span>
          {p.kills} / {p.deaths} / {p.assists}
        </span>
      </span>
      <span className="summoner-items">
        <span className="items-span">Items:</span>
        <span className="single-item-container">
          <SingleItem item={p.item0} />
          <SingleItem item={p.item1} />
          <SingleItem item={p.item2} />
          <SingleItem item={p.item3} />
          <SingleItem item={p.item4} />
          <SingleItem item={p.item5} />
          <SingleItem item={p.item6} />
        </span>
      </span>
    </>
  );
};

export default Teams;
