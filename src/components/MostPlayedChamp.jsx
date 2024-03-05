import "./MostPlayedChamp.css";

const MostPlayedChamp = ({ championInfo, championImage }) => {
  return (
    <div className="most-played-champ-container">
      <div className="champion-border">
        <img
          src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/champion/${championImage}`}
          className="most-played-champion-icon"
        />
      </div>
      <div className="most-played-single-champ">
        {championInfo.championLevel == 1 ? (
          <img className="mastery-points" src="/img/mastery_level_1.png" />
        ) : championInfo.championLevel == 2 ? (
          <img className="mastery-points" src="/img/mastery_level_2.png" />
        ) : championInfo.championLevel == 3 ? (
          <img className="mastery-points" src="/img/mastery_level_3.png" />
        ) : championInfo.championLevel == 4 ? (
          <img className="mastery-points" src="/img/mastery_level_4.png" />
        ) : championInfo.championLevel == 5 ? (
          <img className="mastery-points" src="/img/mastery_level_5.png" />
        ) : championInfo.championLevel == 6 ? (
          <img className="mastery-points" src="/img/mastery_level_6.png" />
        ) : championInfo.championLevel == 7 ? (
          <img className="mastery-points" src="/img/mastery_level_7.png" />
        ) : (
          ""
        )}
      </div>
      <div>Mastery Points - {championInfo.championPoints}</div>
    </div>
  );
};

export default MostPlayedChamp;
