
import "./MoviesHeaderContainer.css";


export default function MoviesHeaderContainer({type}){
    return(
        <div className="MoviesHeaderContainer">
                <h1 className="type">{type}</h1> 
            </div>
    )
}