import {Link} from 'react-router-dom'
import "./MainPage.css"

function MainPage() {
    return (
        <div>
            <div className="title"></div>
                <h1>Poems Around the World</h1>

            <div className = "language-links">
            <Link to='/zh'>Chinese</Link>
            <Link to='/en'>English</Link>
            </div>
        </div>
    )
}

export default MainPage;