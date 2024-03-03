import { summonerSpellName } from "../functions/getSummonerSpellName.js";
import SingleItem from "./SingleItem";
import "./Teams.css";

const Teams = ({ summoner }) => {
  const summonerSpell_1 = summoner.summoner1Id;
  const summonerSpell_2 = summoner.summoner2Id;

  return (
    <>
      <span className="summoner-name">{summoner.summonerName}</span>
      <span className="champion-img-spells">
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/champion/${summoner.championName}.png`}
          className="champion-icon"
        />
        <span className="summoner-spells">
          <img
            className="spell1"
            src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/spell/${summonerSpellName(summonerSpell_1)}.png`}
          />
          <img
            className="spell2"
            src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/spell/${summonerSpellName(summonerSpell_2)}.png`}
          />
        </span>
      </span>

      <span className="kda-container">
        <img src="/img/score.png" className="kda-icon" />
        <span>
          {summoner.kills} / {summoner.deaths} / {summoner.assists}
        </span>
      </span>
      <span className="summoner-items">
        <span className="items-span">Items:</span>
        <span className="single-item-container">
          <SingleItem item={summoner.item0} />
          <SingleItem item={summoner.item1} />
          <SingleItem item={summoner.item2} />
          <SingleItem item={summoner.item3} />
          <SingleItem item={summoner.item4} />
          <SingleItem item={summoner.item5} />
          <SingleItem item={summoner.item6} />
        </span>
      </span>
    </>
  );
};

export default Teams;
