import axios from "axios";
import { useEffect, useState } from "react";
import "./Homepage.css";
import Loading from "../components/Loading";
import Teams from "../components/Teams";

const Homepage = () => {
  const [continent, setContinent] = useState("");
  const [error, setError] = useState("");
  const [level, setLevel] = useState(null);
  const [loadingMatchHistory, setLoadingMatchHistory] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);
  const [mapName, setMapName] = useState("");
  const [matches, setMatches] = useState([]);
  const [matchIndex, setMatchIndex] = useState(null);
  const [name, setName] = useState("");
  const [userData, setUserData] = useState({});
  const [profileIcon, setProfileIcon] = useState("");
  const [region, setRegion] = useState("");
  const [summonerName, setSummonerName] = useState("");

  const API_KEY = "RGAPI-e0aa0d51-b0ce-4370-8906-d062beedeb82";

  useEffect(() => {
    switch (region) {
      case "br1":
      case "la1":
      case "la2":
      case "na1":
        setContinent("americas");
        break;

      case "eun1":
      case "euw1":
        setContinent("europe");
        break;

      case "oc1":
        setContinent("sea");
        break;

      case "ru1":
      case "tr1":
      case "jp1":
      case "ph2":
      case "sg2":
      case "tw2":
      case "th2":
      case "vn2":
      case "kr":
        setContinent("asia");
        break;
    }
  }, [region]);

  const getMatchHistory = async (puuid, region) => {
    setLoadingMatchHistory(true);
    await axios
      .get(
        `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10&api_key=${API_KEY}`,
        { "Access-Control-Allow-Credentials": true }
      )
      .then((response) => {
        const matchPromises = response.data.map(async (match) => {
          return await axios
            .get(`https://${region}.api.riotgames.com/lol/match/v5/matches/${match}?api_key=${API_KEY}`, {
              "Access-Control-Allow-Credentials": true,
            })
            .then((matchResponse) => matchResponse.data.info);
        });

        return Promise.all(matchPromises);
      })
      .then((response) => {
        setMatches(response);
        setLoadingMatchHistory(false);
      })
      .catch((err) => console.log(err));
  };

  const getUser = async () => {
    setLoadingUser(true);
    setMatches([]);
    setUserData({});

    if (!region) {
      setError("Please select a region");
      throw new Error("Please select a region");
    }

    if (!summonerName) {
      setError("Empty summoner name!");
      throw new Error("Empty summoner name!");
    }

    await axios
      .get(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`, {
        "Access-Control-Allow-Credentials": true,
      })
      .then((response) => {
        setUserData(response.data);
        setName(response.data.name);
        setProfileIcon(response.data.profileIconId);
        setLevel(response.data.summonerLevel);

        setError("");
        setSummonerName("");

        return response.data.puuid;
      })
      .then((response) => {
        getMatchHistory(response, continent);
      })
      .then(() => setLoadingUser(false))
      .catch((err) => {
        setError("There is no summoner with that name!");
        setSummonerName("");
        setUserData({});
        console.error(err);
      });
  };

  const handleShowMatch = async (index) => {
    setMatchIndex(index === matchIndex ? null : index);

    await axios
      .get(`https://static.developer.riotgames.com/docs/lol/maps.json`)
      .then((response) => {
        response.data.map((m) => {
          if (m.mapId === matches[index].mapId) {
            setMapName(m.mapName);
          }
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="homepage">
      <div className="main-text">
        <img src="/img/Logo.png" /> <span>Summoner&apos;s Scoreboard</span>
      </div>
      <div>
        <div className="select-input-container">
          <select
            className="select-region"
            onChange={(e) => {
              setRegion(e.target.value);
            }}
            value={region}
          >
            <option>Select Region</option>
            <option value="br1">Brazil</option>
            <option value="eun1">Europe Nordic & East</option>
            <option value="euw1">Europe West</option>
            <option value="la1">Latin America North</option>
            <option value="la2">Latin America South</option>
            <option value="na1">North America</option>
            <option value="oc1">Oceania</option>
            <option value="ru1">Russia</option>
            <option value="tr1">Turkey</option>
            <option value="jp1">Japan</option>
            <option value="kr">Republic of Korea</option>
            <option value="ph2">The Philippines</option>
            <option value="sg2">Singapore, Malaysia, & Indonesia</option>
            <option value="tw2">Taiwan, Hong Kong, and Macao</option>
            <option value="th2">Thailand</option>
            <option value="vn2">Vietnam</option>
          </select>

          <div>
            <input
              className="search-input-name"
              placeholder="Summoner Name..."
              value={summonerName}
              onChange={(e) => setSummonerName(e.target.value)}
            />
          </div>
        </div>

        <button className="search-button" onClick={getUser}>
          Search Summoner
        </button>

        {error && <p>{error}</p>}

        {loadingUser && <Loading toLoad={"user"} />}
        {userData.name ? (
          <div className="summoner-data">
            <div className="summoner-data-general-info">
              <img src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/profileicon/${profileIcon}.png`} />
              <div>
                <p>Summoner: {name}</p>
                <p>Level: {level}</p>
              </div>
            </div>

            <div className="summoner-three-champs">
              <div>1</div>
              <div>2</div>
              <div>3</div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>

      <div>
        {loadingMatchHistory && <Loading toLoad={"match history"} />}
        {matches.length > 0 &&
          matches.map((match, i) => (
            <div key={i}>
              <span
                onClick={() => {
                  handleShowMatch(i);
                }}
                className="match-number"
              >{`#${i + 1} Match`}</span>
              {matchIndex === i && (
                <div>
                  <div className="matches-container">
                    <p>Winner: {match.teams[0].win ? "Blue Team" : "Red Team"}</p>
                    <p>Date: {new Date(match.gameCreation).toISOString()}</p>
                    <p>Duration: {(match.gameDuration / 60).toFixed(2)} m</p>
                    <p>
                      Mode:{" "}
                      {match.gameMode === "CLASSIC"
                        ? match.gameMode[0] + match.gameMode.slice(1).toLowerCase()
                        : match.gameMode}
                    </p>
                    <div>
                      <span>Map: {mapName}</span>
                    </div>

                    <div className="blue-team">
                      {match.participants
                        .filter((_, idx) => idx <= 4)
                        .map((p) => (
                          <div key={p.summonerName} className="team-container">
                            <Teams summoner={p} region={region} />
                          </div>
                        ))}
                    </div>
                    <div className="red-team">
                      {match.participants
                        .filter((_, idx) => idx > 4)
                        .map((p) => (
                          <div key={p.summonerName} className="team-container">
                            <Teams summoner={p} region={region} />
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Homepage;
