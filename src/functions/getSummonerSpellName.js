import axios from "axios";

export const summonerSpellName = (id) => {
  let summonerSpell = "";

  switch (id) {
    case 21:
      summonerSpell = "SummonerBarrier";
      break;
    case 1:
      summonerSpell = "SummonerBoost";
      break;
    case 14:
      summonerSpell = "SummonerDot";
      break;
    case 3:
      summonerSpell = "SummonerExhaust";
      break;
    case 4:
      summonerSpell = "SummonerFlash";
      break;
    case 6:
      summonerSpell = "SummonerHaste";
      break;
    case 7:
      summonerSpell = "SummonerHeal";
      break;
    case 13:
      summonerSpell = "SummonerMana";
      break;
    case 30:
      summonerSpell = "SummonerPoroRecall";
      break;
    case 31:
      summonerSpell = "SummonerPoroThrow";
      break;
    case 11:
      summonerSpell = "SummonerSmite";
      break;
    case 39:
      summonerSpell = "SummonerSnowURFSnowball_Mark";
      break;
    case 32:
      summonerSpell = "SummonerSnowball";
      break;
    case 12:
      summonerSpell = "SummonerTeleport";
      break;
    case 54:
      summonerSpell = "Summoner_UltBookPlaceholder";
      break;
    case 55:
      summonerSpell = "Summoner_UltBookSmitePlaceholder";
      break;

    default:
      break;
  }
  return summonerSpell;
};

let description = "";

export const summonerSpellDescription = async (id) => {
  await axios
    .get("https://ddragon.leagueoflegends.com/cdn/14.4.1/data/en_US/summoner.json")
    .then((response) => {
      description = response.data.data[summonerSpellName(id)].description;
    })
    .finally();
  return description;
};
