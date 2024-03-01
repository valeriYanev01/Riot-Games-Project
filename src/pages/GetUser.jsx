import axios from "axios";
import { useEffect, useState } from "react";
import "./GetUser.css";
import Loading from "../components/Loading";
import Teams from "../components/Teams";

const Homepage = () => {
  const [error, setError] = useState("");
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingMatchHistory, setLoadingMatchHistory] = useState(false);
  const [user, setUser] = useState({});
  const [region, setRegion] = useState("");
  const [summonerName, setSummonerName] = useState("");
  const [profileIcon, setProfileIcon] = useState("");
  const [name, setName] = useState("");
  const [level, setLevel] = useState(null);
  const [continent, setContinent] = useState("");
  const [matches, setMatches] = useState([]);
  const [matchIndex, setMatchIndex] = useState(null);
  const [mapName, setMapName] = useState("");

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

  const getMatchHistory = (puuid, region) => {
    setLoadingMatchHistory(true);
    axios
      .get(
        `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10&api_key=${API_KEY}`
      )
      .then((response) => {
        const matchPromises = response.data.map((match) => {
          return axios
            .get(`https://${region}.api.riotgames.com/lol/match/v5/matches/${match}?api_key=${API_KEY}`)
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

  const getUser = () => {
    setLoadingUser(true);
    setMatches([]);
    setUser({});

    if (!region) {
      setError("Please select a region");
      throw new Error("Please select a region");
    }

    if (!summonerName) {
      setError("Empty summoner name!");
      throw new Error("Empty summoner name!");
    }

    axios
      .get(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`)
      .then((response) => {
        setUser(response.data);
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
      .catch(() => {
        setError("There is no summoner with that name!");
        setSummonerName("");
        setUser("");
        throw new Error("There is no summoner with that name!");
      });
  };

  const handleShowMatch = (index) => {
    setMatchIndex(index === matchIndex ? null : index);

    axios
      .get(`https://static.developer.riotgames.com/docs/lol/maps.json`)
      .then((response) => {
        response.data.map((m) => {
          if (m.mapId === matches[index].mapId) {
            setMapName(m.mapName);
          }
        });
      })
      .then((err) => console.log(err));
  };

  console.log(matches);

  return (
    <>
      <div>
        <select
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
          <label>Summoner Name</label>
          <input value={summonerName} onChange={(e) => setSummonerName(e.target.value)} />
        </div>

        <button onClick={getUser}>Get user</button>

        {error && <p>{error}</p>}

        {loadingUser && <Loading toLoad={"user"} />}
        {user.name ? (
          <div>
            <p>Summoner: {name}</p>
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/profileicon/${profileIcon}.png`}
              width="96xp"
            />
            <p>Level: {level}</p>
            <img />
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
                    <div className="blue-team">
                      {match.participants
                        .filter((_, idx) => idx <= 4)
                        .map((p) => (
                          <div key={p.summonerName} className="team-container">
                            <Teams p={p} />
                          </div>
                        ))}
                    </div>
                    <div className="red-team">
                      {match.participants
                        .filter((_, idx) => idx > 4)
                        .map((p) => (
                          <div key={p.summonerName} className="team-container">
                            <Teams p={p} />
                          </div>
                        ))}
                    </div>
                  </div>
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
                </div>
              )}
            </div>
          ))}
      </div>
    </>
  );
};

export default Homepage;
