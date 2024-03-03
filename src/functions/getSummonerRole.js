export const summonerRole = (role) => {
  let position = "";

  switch (role) {
    case "TOP":
      position = "Top";
      break;
    case "JUNGLE":
      position = "Jungle";
      break;
    case "MIDDLE":
      position = "Mid";
      break;
    case "BOTTOM":
      position = "Bottom";
      break;
    case "UTILITY":
      position = "Support";
      break;
    default:
      break;
  }
  return position;
};
