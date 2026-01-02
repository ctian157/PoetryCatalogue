import './EnglishPoemCard.css'
import ScotCastle from '../assets/ScotCastle.jpg'
import useFavorites from '../Hooks/useFavorites';

//accepts a prop (which in this case is a json object)
function EnglishPoemCard ({ poem, onClick }) {

    //object destructure; assign isFavorite to the method from useFavorites with the same name
    const { isFavorite } = useFavorites();

    return(
        <div className = "poem-card" onClick = {onClick} style={{ backgroundImage: `url(${ScotCastle})`}}>

            
            {isFavorite(poem.id) && ( 
                <i className="fas fa-bookmark saved-icon"></i>
            )}

            <div className = "poemcard-info">

                <h1>{poem.title}</h1>

                <div className = "poet-info">
                    <p className = "poet-name">{poem.poet}</p>
                </div>

            </div>
        </div>
    )
}

export default EnglishPoemCard;