import "./ExploreCard.css";
import { Link } from "react-router-dom";

const getCategoryBackground = (category) => {
    switch (category.toLowerCase()) {
        case 'horror':
            return 'linear-gradient(to bottom right, #ff0000, #ffffff)';
        case 'excitement':
            return 'linear-gradient(to bottom right, #1e90ff, #fffff1)';
        case 'comedy':
            return 'linear-gradient(to bottom right, #ffff00, #ffa5ff)';
        case 'romance':
            return 'linear-gradient(to bottom right, #ff69b4, #ffffff)';
        case 'action':
            return 'linear-gradient(to bottom right, #fe6009, #ffffff)';
        case 'drama':
            return 'linear-gradient(to bottom right, #045000, #ffffff)';
        case 'fantasy':
            return 'linear-gradient(to bottom right, #008080, #ffffff)';
        case 'sci-fi':
            return 'linear-gradient(to bottom right, #00bfff, #ffffff)';
        default:
            return 'linear-gradient(to bottom right, #009900, #ffffff)';
    }
};

export default function ExploreCard({ category }) {
    const backgroundStyle = getCategoryBackground(category);
    return (
        <div className="card-container">
            <Link to={`/category/${category}`} style={{ textDecoration: 'none' }}>
                <button
                    className="Catsbtn"
                    style={{ background: backgroundStyle }}
                    onMouseEnter={() => {
                        const homeElement = document.querySelector('.Home');
                        homeElement.style.background = backgroundStyle;
                        homeElement.style.opacity = '0.8';
                        homeElement.style.filter = 'blur(5px)';
                    }}
                    onMouseLeave={() => {
                        const homeElement = document.querySelector('.Home');
                        homeElement.style.background = '';
                        homeElement.style.opacity = '';
                        homeElement.style.filter = '';
                    }}
                >
                    <h3>{category}</h3>
                </button>
            </Link>
        </div>
    );
}
