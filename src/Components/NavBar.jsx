import { Link, useParams} from "react-router-dom";
import { useEffect, useState } from "react";
import './NavBar.css'

function NavBar() {
    const {lang} = useParams(); //'zh', 'en' etc

    //when we navigate to Explore or Home from global Favorites (no lang defined), 
    //will use last "cached" language and navigate to that page
    const [lastLang, setLastLang] = useState(() => { 
        return (
            localStorage.getItem("lastLang") || null
        );
    })

    //if a language-required path is called:
    useEffect(() => { 
        if (lang) { 
            localStorage.setItem("lastLang", lang); //update localStorage
            setLastLang(lang); //trigger React re-render by changing state
        }},[lang]);

    //lastLang is the fallback
    const currLang = lang || lastLang;

    return (
       <div className = "nav-bar">
            <Link to="/">Main</Link> {/* Language selection / main */}
            {<Link to={`/${currLang}/`}>Home</Link>}
            {<Link to={`/${currLang}/explore`}>Explore</Link>}
            {<Link to={`/favorites`}>Favorites</Link>}
       </div> 
    );

}

export default NavBar

