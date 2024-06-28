import "./MovieCard.css";
import { useRef, useEffect } from "react";
import {  useNavigate } from "react-router-dom";

export default function MovieCard(props) {
  const description = useRef(null);
  const descriptionDisplayer = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    description.current.addEventListener("mouseenter", () => {
      descriptionDisplayer.current.classList = "description goCenter";
    });
    description.current.addEventListener("mouseleave", () => {
      descriptionDisplayer.current.classList = "description";
    });
  }, []);

  const navigateToMovieDetails = () => {
    navigate(`/MovieDetails/${encodeURIComponent(props.name)}`);
  };

  return (
    <div className="Card" ref={description} onClick={navigateToMovieDetails}>
      <img className="cardImg" src={props.src} alt={props.name} />
      <div className="CardsInfo">
        <h6 className="category">{props.category}</h6>
        <h5>{props.name}</h5> {/* Title at the bottom */}
      </div>
      <span className="rating">{props.rating}</span>
        <div className="LearnMore">Learn More</div>
      <div className="description" ref={descriptionDisplayer}>
        <div className="desc">
          <div className="CardsInfo">
            <h5 className="des">{props.name}</h5>
            <h6 className="category">{props.category}</h6>
          </div>
          <span className="ratingdes">{props.rating}</span>
          <p className="descriptionPara desc">{props.description}</p>
            <button className="Watch desc"> WATCH NOW</button>
        </div>
      </div>
    </div>
  );
}
