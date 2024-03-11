import axios from "axios";
import { useEffect, useState } from "react";
import "./Homepage.css";
import Loading from "../components/Loading";
import Teams from "../components/Teams";
import MostPlayedChamp from "../components/MostPlayedChamp";

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
  const [rank, setRank] = useState("");
  const [summonerName, setSummonerName] = useState("");
  const [championInfo_1, setChampionInfo_1] = useState({});
  const [championInfo_2, setChampionInfo_2] = useState({});
  const [championInfo_3, setChampionInfo_3] = useState({});
  const [championImage_1, setChampionImage_1] = useState("");
  const [championImage_2, setChampionImage_2] = useState("");
  const [championImage_3, setChampionImage_3] = useState("");

  const API_KEY = import.meta.env.VITE_API_KEY;

  const controller = new AbortController();
  const signal = controller.signal;

  const resetData = () => {
    setContinent("");
    setLevel("");
    setLoadingMatchHistory(false);
    setLoadingUser(false);
    setMapName(false);
    setMatches([]);
    setName("");
    setMatchIndex(null);
    setUserData({});
    setProfileIcon("");
    setRegion("");
    setRank("");
    setSummonerName("");
    setChampionInfo_1({});
    setChampionInfo_2({});
    setChampionInfo_3({});
    setChampionImage_1("");
    setChampionImage_2("");
    setChampionImage_3("");
  };

  // setRegion
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

  //setChampionInfo
  useEffect(() => {
    const getActualSummonerData = async () => {
      if (userData.puuid) {
        await axios
          .get(
            `https://${region}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${userData.puuid}/top?count=3&api_key=${API_KEY}`,
            { "Access-Control-Allow-Credentials": true }
          )
          .then((response) => {
            setChampionInfo_1(response.data[0]);
            setChampionInfo_2(response.data[1]);
            setChampionInfo_3(response.data[2]);
          })
          .catch((err) => {
            resetData(err);
          });
      }
    };
    getActualSummonerData();
  }, [region, userData.puuid]);

  //setChampionImage
  useEffect(() => {
    const getAllChampions = async () => {
      if (championInfo_1 && championInfo_2 && championInfo_3) {
        await axios
          .get(`https://ddragon.leagueoflegends.com/cdn/14.4.1/data/en_US/champion.json`)
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
          })
          .catch((err) => {
            resetData(err);
          });
      }
    };

    getAllChampions();
  }, [championInfo_1, championInfo_2, championInfo_3]);

  //matchHistory

  const getMatchHistory = async (puuid, region) => {
    setLoadingMatchHistory(true);
    await axios
      .get(
        `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10&api_key=${API_KEY}`
      )
      .then((response) => {
        const matchPromises = response.data.map(async (match) => {
          return axios
            .get(`https://${region}.api.riotgames.com/lol/match/v5/matches/${match}?api_key=${API_KEY}`, { signal })
            .then((matchResponse) => {
              return matchResponse.data.info;
            })
            .catch((err) => {
              if (err.message == "Network Error") {
                controller.abort();
                console.log("No data for that match!");
              }
            });
        });
        return Promise.all(matchPromises);
      })
      .then((response) => {
        setMatches(response);
        setLoadingMatchHistory(false);
      })
      .catch((err) => {
        console.log(err.message);
        setLoadingMatchHistory(false);
      });
  };

  //fetchUserData
  const getUser = async () => {
    setLoadingUser(true);
    setMatches([]);
    setUserData({});
    setRank("");
    setMatchIndex(null);

    if (!region) {
      setError("Please select a region");
      resetData();
      throw new Error("Please select a region");
    }

    if (!summonerName) {
      setError("Empty summoner name!");
      resetData();
      throw new Error("Empty summoner name!");
    }

    await axios
      .get(`https://${region}.api.riotgames.com/lol/summoner/v4/summoners/by-name/${summonerName}?api_key=${API_KEY}`)
      .then((response) => {
        setUserData(response.data);
        setName(response.data.name);
        setProfileIcon(response.data.profileIconId);
        setLevel(response.data.summonerLevel);
        setError("");
        setSummonerName("");

        return response.data;
      })
      .catch((err) => {
        setError("Too many requests! Try again in a minute!");
        resetData(err);
      })
      .then((response) => {
        try {
          getMatchHistory(response.puuid, continent);
        } catch (error) {
          console.log(error);
        }

        return response;
      })
      .catch((err) => resetData(err))
      .then((response) => {
        setLoadingUser(false);
        return response;
      })
      .catch((err) => resetData(err))
      .then(async (response) => {
        await axios
          .get(
            `https://${region}.api.riotgames.com/lol/league/v4/entries/by-summoner/${response.id}?api_key=${API_KEY}`,
            {
              "Access-Control-Allow-Credentials": true,
            }
          )
          .then((response) => {
            if (response.data.length > 0) {
              if (response.data[0].queueType == "RANKED_SOLO_5x5") {
                setRank(response.data[0].tier);
              }
              if (response.data[1].queueType == "RANKED_SOLO_5x5") {
                setRank(response.data[1].tier);
              }
            }
          })
          .catch((err) => resetData(err));
      })
      .catch((err) => {
        resetData(err);
        setError("There is no summoner with that name!");
      });
  };

  //Match Logic
  const handleShowMatch = async (index) => {
    setMatchIndex(index == matchIndex ? null : index);

    await axios
      .get(`https://static.developer.riotgames.com/docs/lol/maps.json`)
      .then((response) => {
        response.data.map((m) => {
          if (m.mapId === matches[index].mapId) {
            setMapName(m.mapName);
          }
        });
      })
      .catch(() => {
        console.log("No data for that match!");
      });
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
              setMatchIndex(null);
              setRegion(e.target.value);
            }}
            value={region}
            id="select-region"
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
              id="search-input-name"
              placeholder="Summoner Name..."
              value={summonerName}
              onChange={(e) => setSummonerName(e.target.value)}
            />
          </div>
        </div>

        <div className="button-container">
          <button className="search-button" onClick={getUser}>
            Search Summoner
          </button>
          <button className="close-button" onClick={resetData}>
            Close Summoner
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {loadingUser && <Loading toLoad={"user"} />}
        {userData.name ? (
          <div className="summoner-data">
            <div className="summoner-data-general-info">
              <div className="summoner-icon-container">
                <div>
                  {rank == "IRON" ? (
                    <img src="/img/iron.png" className="summoner-icon-border i" />
                  ) : rank == "BRONZE" ? (
                    <img src="/img/bronze.png" className="summoner-icon-border b" />
                  ) : rank == "SILVER" ? (
                    <img src="/img/silver.png" className="summoner-icon-border s" />
                  ) : rank == "GOLD" ? (
                    <img src="/img/gold.png" className="summoner-icon-border g" />
                  ) : rank == "PLATINUM" ? (
                    <img src="/img/platinum.png" className="summoner-icon-border p" />
                  ) : rank == "EMERALD" ? (
                    <img src="/img/emerald.png" className="summoner-icon-border e" />
                  ) : rank == "DIAMOND" ? (
                    <img src="/img/diamond.png" className="summoner-icon-border d" />
                  ) : rank == "MASTER" ? (
                    <img src="/img/master.png" className="summoner-icon-border m" />
                  ) : rank == "GRANDMASTER" ? (
                    <img src="/img/grandmaster.png" className="summoner-icon-border gm" />
                  ) : rank == "CHALLENGER" ? (
                    <img src="/img/challenger.png" className="summoner-icon-border c" />
                  ) : (
                    ""
                  )}
                </div>
                <img
                  src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/profileicon/${profileIcon}.png`}
                  className="home-summoner-icon"
                />
              </div>
              <div>
                <p>Summoner: {name}</p>
                <p>Level: {level}</p>
              </div>
            </div>

            <p className="summoner-three-champs-para">Most Played Champs</p>
            <div className="summoner-three-champs">
              {championInfo_1 && championInfo_2 && championImage_3 ? (
                <>
                  <MostPlayedChamp championInfo={championInfo_1} championImage={championImage_1} />
                  <MostPlayedChamp championInfo={championInfo_2} championImage={championImage_2} />
                  <MostPlayedChamp championInfo={championInfo_3} championImage={championImage_3} />
                </>
              ) : (
                ""
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="match-history-container">
        {loadingMatchHistory && <Loading toLoad={"match history"} />}
        {matches.length > 0 && <p className="match-history-para">Match History</p>}
        {matches.length > 0 &&
          matches.map((match, i) => (
            <div key={i} className="single-match">
              <span
                onClick={() => {
                  handleShowMatch(i);
                }}
                className="match-number"
              >{`#${i + 1} Match`}</span>
              {match && matchIndex == i ? (
                <div>
                  <div className="matches-container">
                    <p className="match-stats-para match-stats-para-first">
                      Winner: {match.teams[0].win ? "Blue Team" : "Red Team"}
                    </p>
                    <p className="match-stats-para">
                      Date: {new Date(match.gameCreation).toLocaleDateString("en-EU", { timeZone: "UTC" })}
                    </p>
                    <p className="match-stats-para">Duration: {(match.gameDuration / 60).toFixed(2)} m</p>
                    <p className="match-stats-para">
                      Mode:{" "}
                      {match.gameMode === "CLASSIC"
                        ? match.gameMode[0] + match.gameMode.slice(1).toLowerCase()
                        : match.gameMode}
                    </p>
                    <p className="match-stats-para">Map: {mapName}</p>

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
              ) : !match ? (
                <span className="match-error">No data for that match!</span>
              ) : (
                ""
              )}
            </div>
          ))}
        <span>{!matches && "No match history for that summoner!"}</span>
      </div>
    </div>
  );
};

export default Homepage;
