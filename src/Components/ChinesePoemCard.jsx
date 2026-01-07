import './ChinesePoemCard.css'
import InkBranch from '../assets/InkBranch.png'
import useFavorites from '../Hooks/useFavorites';

//accepts a prop (which in this case is a json object)
function ChinesePoemCard ({ poem, onClick }) {

    //object destructure; assign isFavorite to the method from useFavorites with the same name
    const { isFavorite } = useFavorites();

    return(
        <div className = "poem-card" onClick = {onClick} style={{ backgroundImage: `url(${InkBranch})`}}>

            
            {isFavorite(poem.id) && ( 
                <i className="fas fa-bookmark saved-icon"></i>
            )}

            <div className = "poemcard-info">

                <p className = "poem-dynasty">{poem.dynasty}</p>

                <h1>{poem.title}</h1>

                <div className = "poet-info">
                    <p className = "poet-name-cn">{poem.poet}</p>
                    <p className =  "poet-name-en">{poem.poet_en}</p>
                </div>

            </div>
        </div>
    )
}

export default ChinesePoemCard;