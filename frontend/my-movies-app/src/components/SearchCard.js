import "./SearchCard.css";

import { useNavigate } from "react-router-dom";

export default function SearchCard(props){
    const navigate=useNavigate();
    const navigateToMovieDetails = () => {
        navigate(`/MovieDetails/${encodeURIComponent(props.name)}`);
      };
    return(
    
        <div className="SearchCardContainer" onClick={navigateToMovieDetails}>
            <img src={props.src} className="searchImg" alt=""/>
            <div>
            <h5>{props.name}</h5>
            <h6 className="searchCat">{props.category}</h6>
            </div>
        </div>
    )
}