import { Link, useParams} from "react-router-dom";
import './NavBar.css'

function NavBar() {
    const {lang} = useParams(); //'zh', 'en' etc

    return (
       <div className = "nav-bar">
            <Link to="/">Main</Link> {/* Language selection / main */}
            {lang && <Link to={`/${lang}/`}>Home</Link>}
            {lang && <Link to={`/${lang}/explore`}>Explore</Link>}
            {lang && <Link to={`/favorites`}>Favorites</Link>}
       </div> 
    )

}

export default NavBar

