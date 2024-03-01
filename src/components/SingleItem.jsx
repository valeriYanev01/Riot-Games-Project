const SingleItem = ({ item }) => {
  return (
    <>
      {!item == "0" ? (
        <img className="single-item" src={`https://ddragon.leagueoflegends.com/cdn/14.4.1/img/item/${item}.png`} />
      ) : (
        <span className="empty-item"></span>
      )}
    </>
  );
};

export default SingleItem;
