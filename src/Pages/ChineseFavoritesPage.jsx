import NavBar from '../Components/NavBar'
import { useState } from 'react';
import { useParams } from 'react-router-dom'
import './ChineseFavoritesPage.css'
import useFavorites from '../Hooks/useFavorites'
import LanguagePoemCard from '../Components/LanguagePoemCard'
import LanguagePoemDisplay from '../Components/LanguagePoemDisplay'


//I DELETED REFETCH BECAUSE SAME POEM OBJECT FROM POEMSBYLANGUAGE SHOULD BE UPDATED, WHICH REFLECTS IN CENTRALIZED STATE
function ChineseFavoritesPage () {

    const {lang} = useParams();

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPoem, setSelectedPoem] = useState(null);

    const { favorites, addFavorite, removeFavorite } = useFavorites();


    //for loading text when calling Gemini
    const [loading, setLoading] = useState(false);

    const handleTranslate = async(poemID) => {
        try {
            setLoading(true); //start loading

            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/poem/translate/${poemID}`, {
                method:'PUT'
            })
            
            if (!response.ok) {
                const errorText = await response.text();
                showError(`Translating poem failed: ${errorText}`);
                return;
            }

            const translatedPoem = await response.json();

            //update favorites list: remove old and add new poem with translation
            removeFavorite(poemID);
            addFavorite(translatedPoem);

            //display with translation
            setSelectedPoem(translatedPoem);

        } catch (error) {
            showError("Non-server error occurred.");
        } finally {
            setLoading(false); //stop loading
        }

    }

    return (
        <div className = "favorites-page">
            <div className = "favorites-content">
                <div className = 'favorites-title-bar'>
                    <h1 className = 'favorites-text'>Favorites</h1> 
                    <NavBar/>
                </div>

                <p>Poems may be edited or deleted only on the Explore page ~</p>

                <input  className = "favorites-search-bar" 
                        placeholder = "Search poem..."
                        value = {searchTerm}
                        onChange = {(e) => setSearchTerm(e.target.value)
                }/>

                <div className = 'favorites-library'>
                    {favorites.length === 0 ? 
                            (<p>No Favorites Yet</p>
                            ) : (
                                //get the array of favorited poems and render them
                                favorites.map((p) => 
                                    <LanguagePoemCard key={p.id} lang={lang} poem = {p} onClick = {() => setSelectedPoem(p)}/>)
                                )
                    }        
                </div>

                <LanguagePoemDisplay poem = {selectedPoem} lang = {lang} onClose = {() =>setSelectedPoem(null)} onTranslate = {handleTranslate} loading = {loading}/>
            </div>
        </div>
    )
}

export default ChineseFavoritesPage