import { Link } from "react-router-dom";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found-page">
      <img src="/img/amumu.png" className="amumu" />
      <span className="not-found-text">
        Page not found. Return to <Link to="/">Homepage</Link>
      </span>
    </div>
  );
};

export default NotFound;
