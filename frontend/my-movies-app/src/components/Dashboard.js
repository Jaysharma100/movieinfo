import "./Dashboard.css";
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Dashboard(props) {
  const [list, list2, smallAside] = [useRef(), useRef(), useRef()];

  useEffect(() => {
    if (props.index !== undefined) {
      [list, list2].forEach((list) => {
        list.current.querySelectorAll("li")[props.index].classList = "Highlight";
        list.current.querySelectorAll("li").forEach((e) => {
          e.addEventListener("click", (el) => {
            list.current.querySelectorAll("li").forEach((e) => {
              e.classList = "";
            });
            if (el.target.nodeName === "LI") {
              el.target.classList = "Highlight";
            } else {
              el.target.parentElement.classList = "";
              el.target.parentElement.classList = "Highlight";
            }
          });
        });
      });
    }
  }, []);

  return (
    <>
      <aside id="big_aside">
        <ul ref={list}>
          <Link style={{ textDecoration: 'none' }} to="/">
            <li>
              <span>Home</span>
            </li>
          </Link>
          <Link style={{ textDecoration: 'none' }} to="/Explore">
            <li>
              <span>Explore</span>
            </li>
          </Link>
          <Link to="/Favorites" style={{ textDecoration: 'none' }}>
            <li>
              <span>Favorites</span>
            </li>
          </Link>
        </ul>
      </aside>
      <aside id="small_aside" ref={smallAside}>
        <h4>WeedyMovies</h4>
        <i className="fa-solid fa-xmark" onClick={() => {
          smallAside.current.style.display = "none";
        }}></i>
        <ul ref={list2}>
          <Link style={{ textDecoration: 'none' }} to="/">
            <li>
              <span>Home</span>
            </li>
          </Link>
          <Link style={{ textDecoration: 'none' }} to="/Explore">
            <li>
              <span>Explore</span>
            </li>
          </Link>
          <Link to="/Favorites" style={{ textDecoration: 'none' }}>
            <li>
              <span>Favorites</span>
            </li>
          </Link>
        </ul>
      </aside>
    </>
  );
}
    