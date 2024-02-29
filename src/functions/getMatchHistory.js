import axios from "axios";

const API_KEY = "RGAPI-e0aa0d51-b0ce-4370-8906-d062beedeb82";

const getMatchHistory = (puuid, region) => {
  axios
    .get(
      `https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=10&api_key=${API_KEY}`
    )
    .then((response) => {
      return response;
    })
    .then((response) => {
      response.data.map((match) => {
        axios
          .get(`https://${region}.api.riotgames.com/lol/match/v5/matches/${match}?api_key=${API_KEY}`)
          .then((matchResponse) => {
            console.log(matchResponse.data);
          });
      });
    })
    .catch((err) => console.log(err));
};

const asdf = () => {
  axios.get(`https://ddragon.leagueoflegends.com/cdn/14.4.1/data/en_US/champion/Aatrox.json`).then((response) => {
    console.log(response.data);
  });
};

asdf();
