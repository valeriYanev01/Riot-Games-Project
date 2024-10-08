import { useEffect, useState } from "react";
import { summonerRole } from "../functions/getSummonerRole.js";
import { summonerSpellName, summonerSpellDescription } from "../functions/summonerSpells.js";
import SingleItem from "./SingleItem";
import "./Teams.css";
import axios from "axios";
import MostPlayedChamp from "./MostPlayedChamp.jsx";

const Teams = ({ summoner, region }) => {
  const [hoverTextKDA, setHoverTextKDA] = useState("");
  const [hoverTextCS, setHoverTextCS] = useState("");
  const [hoverSummonerSpell_1, setHoverSummonerSpell_1] = useState("");
  const [hoverSummonerSpell_2, setHoverSummonerSpell_2] = useState("");
  const [championInfo_1, setChampionInfo_1] = useState({});
  const [championInfo_2, setChampionInfo_2] = useState({});
  const [championInfo_3, setChampionInfo_3] = useState({});
  const [championImage_1, setChampionImage_1] = useState("");
  const [championImage_2, setChampionImage_2] = useState("");
  const [championImage_3, setChampionImage_3] = useState("");

  const API_KEY = "RGAPI-64335f79-7554-4bf0-a66a-4fef126aaf33";

  useEffect(() => {
    const getActualSummonerData = async () => {
      setChampionInfo_1({});
      setChampionInfo_2({});
      setChampionInfo_3({});

      await axios
        .get(
          `https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${summoner.puuid}/top?count=3&api_key=${API_KEY}`
        )
        .then((response) => {
          setChampionInfo_1(response.data[0]);
          setChampionInfo_2(response.data[1]);
          setChampionInfo_3(response.data[2]);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getActualSummonerData();
  }, [region, summoner.puuid]);

  useEffect(() => {
    setChampionImage_1("");
    setChampionImage_2("");
    setChampionImage_3("");

    const getAllChampions = async () => {
      if (championInfo_1 && championInfo_2 && championInfo_3) {
        await axios
          .get("https://ddragon.leagueoflegends.com/cdn/14.4.1/data/en_US/champion.json")
          .then((response) => {
            return Object.values(response.data.data);
          })
          .then((response) => {
            response.forEach((champion) => {
              if (champion.key == championInfo_1.championId) {
                setChampionImage_1(champion.image.full);
              }
              if (champion.key == championInfo_2.championId) {
                setChampionImage_2(champion.image.full);
              }
              if (champion.key == championInfo_3.championId) {
                setChampionImage_3(champion.image.full);
              }
            });
          });
      }
    };

    getAllChampions();
  }, [championInfo_1, championInfo_2, championInfo_3]);

  return (
    <>
      <div className="match-overview">
        <span className="summoner-name">
          {summonerRole(summoner.teamPosition)} {summoner.championName}
        </span>
        <span className="champion-img-spells">
          <img
            src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/champion/${summoner.championName}.png`}
            className="champion-icon"
          />
          <span className="summoner-spells">
            <img
              onMouseEnter={() =>
                summonerSpellDescription(summoner.summoner1Id).then((response) => setHoverSummonerSpell_1(response))
              }
              onMouseLeave={async () => setHoverSummonerSpell_1("")}
              className="spell1"
              src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/spell/${summonerSpellName(
                summoner.summoner1Id
              )}.png`}
            />
            <img
              onMouseEnter={() =>
                summonerSpellDescription(summoner.summoner2Id).then((response) => setHoverSummonerSpell_2(response))
              }
              onMouseLeave={() => setHoverSummonerSpell_2("")}
              className="spell2"
              src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/spell/${summonerSpellName(
                summoner.summoner2Id
              )}.png`}
            />
            {hoverSummonerSpell_1 && (
              <div
                dangerouslySetInnerHTML={{ __html: [hoverSummonerSpell_1] }}
                className="spell-description-hover-text"
              />
            )}
            {hoverSummonerSpell_2 && (
              <div
                dangerouslySetInnerHTML={{ __html: [hoverSummonerSpell_2] }}
                className="spell-description-hover-text"
              />
            )}
          </span>
        </span>

        <span className="kda-container">
          <span
            className="kda-hover"
            onMouseEnter={() => setHoverTextKDA("Kills/Deaths/Assists")}
            onMouseLeave={() => setHoverTextKDA("")}
          >
            <img src="/img/score.png" className="kda-icon" />
            <span>
              {summoner.kills} / {summoner.deaths} / {summoner.assists}
              {hoverTextKDA && <div className="kda-hover-text">{hoverTextKDA}</div>}
            </span>
          </span>
          <span
            className="cs-hover"
            onMouseEnter={() => setHoverTextCS("Minions Killed")}
            onMouseLeave={() => setHoverTextCS("")}
          >
            <img src="/img/cs.png" className="minions-icon" />
            <span>
              {(summoner.totalAllyJungleMinionsKilled ? summoner.totalAllyJungleMinionsKilled : 0) +
                (summoner.totalEnemyJungleMinionsKilled ? summoner.totalEnemyJungleMinionsKilled : 0) +
                (summoner.totalMinionsKilled ? summoner.totalMinionsKilled : 0) +
                (summoner.neutralMinionsKilled ? summoner.neutralMinionsKilled : 0)}
            </span>
            {hoverTextCS && <div className="kda-hover-text">{hoverTextCS}</div>}
          </span>
        </span>
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

      <div className="summoner-stats">
        <div className="icon_name">
          <img
            src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/profileicon/${summoner.profileIcon}.png`}
            width="96xp"
          />
          <p>
            {summoner.summonerName} - {summoner.summonerLevel} Level
          </p>
        </div>

        <div className="most-played-champs">
          {
            <>
              <MostPlayedChamp championInfo={championInfo_1} championImage={championImage_1} />
              <MostPlayedChamp championInfo={championInfo_2} championImage={championImage_2} />
              <MostPlayedChamp championInfo={championInfo_3} championImage={championImage_3} />
            </>
          }
        </div>
      </div>
    </>
  );
};

export default Teams;
