import {Link} from 'react-router-dom'

function MainPage({poems}) {
    return (
        <div>
            <h1>Main Page</h1>
            <Link to='/zh'>Chinese</Link>
        </div>
    )
}

export default MainPage;