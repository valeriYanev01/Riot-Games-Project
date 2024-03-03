import { useState } from "react";
import { summonerRole } from "../functions/getSummonerRole.js";
import { summonerSpellName } from "../functions/getSummonerSpellName.js";
import SingleItem from "./SingleItem";
import "./Teams.css";

const Teams = ({ summoner }) => {
  const [hoverText, setHoverText] = useState("");

  return (
    <>
      <div className="match-overview">
        <span className="summoner-name">
          {summonerRole(summoner.teamPosition)} - {summoner.championName}
        </span>
        <span className="champion-img-spells">
          <img
            src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/champion/${summoner.championName}.png`}
            className="champion-icon"
          />
          <span className="summoner-spells">
            <img
              className="spell1"
              src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/spell/${summonerSpellName(
                summoner.summoner1Id
              )}.png`}
            />
            <img
              className="spell2"
              src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/spell/${summonerSpellName(
                summoner.summoner2Id
              )}.png`}
            />
          </span>
        </span>

        <span className="kda-container">
          <span
            className="kda-hover"
            onMouseEnter={() => setHoverText("Kill/Deaths/Assists")}
            onMouseLeave={() => setHoverText("")}
          >
            <img src="/img/score.png" className="kda-icon" />
            <span>
              {summoner.kills} / {summoner.deaths} / {summoner.assists}
            </span>
          </span>
          <span className="cs-hover">
            <img src="/img/cs.png" className="minions-icon" />
            <span>{summoner.totalMinionsKilled}</span>
          </span>
        </span>
        {hoverText && <div>{hoverText}</div>}
        <span className="summoner-items">
          <span className="items-span">
            <img src="/img/items.png" />
          </span>
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
      </div>

      <div className="match-stats">
        <span>
          <p>Level: {summoner.champLevel}</p>
          <p>Damage Dealt: {summoner.totalDamageDealtToChampions}</p>
          <p>Damaged Taken: {summoner.totalDamageTaken}</p>
          <p>Damage To Turrets: {summoner.damageDealtToTurrets}</p>
          <p>Turret Takedowns: {summoner.turretTakedowns}</p>
          <p>Healing: {summoner.totalHeal}</p>
          <p>Gold Earned: {summoner.goldEarned}</p>
        </span>
      </div>

      <div className="summoner-stats"></div>
    </>
  );
};

export default Teams;
