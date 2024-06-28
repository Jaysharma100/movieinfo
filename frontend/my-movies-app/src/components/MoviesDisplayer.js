
import "./MoviesDisplayer.css";
import CategoryMovies from "./CategoryMovies";
import { useEffect, useState } from "react";
import axios from "axios";
export default function MoviesDisplayer(){
    const [category,setCategory] = useState(null);
    useEffect( ()=>{
        const getCategory = async ()=>{
            const {data} = await axios.get(`https://movieinfo-qyuv.onrender.com/api/movies/category?categoryList`);
            if(data.success  === true){
                const JSX =data.data.map(e=><CategoryMovies type={e}/>)
                setCategory(JSX)
            }
        }
        getCategory();
        },[])


   return(
    <div className="MoviesCont">
        <CategoryMovies type="New Releases"/>
        {category}
    </div>
   )
}