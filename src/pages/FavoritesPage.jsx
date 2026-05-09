import './FavoritesPage.css'
import NavBar from '../components/NavBar'
import { useState, useMemo } from 'react';
import useFavorites from '../hooks/useFavorites'
import LanguagePoemCard from '../components/LanguagePoemCard'
import LanguagePoemDisplay from '../components/LanguagePoemDisplay'
import { getLanguageConfig } from '../config/languages';

function FavoritesPage () {

    const config = getLanguageConfig('all');

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPoem, setSelectedPoem] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    const { favorites, addFavorite, removeFavorite } = useFavorites();

    //for loading text when calling Gemini
    const [loading, setLoading] = useState(false);

    const matchesSearch = config?.matchesSearch ?? (() => true);

    const filteredPoems = useMemo(
        () => favorites.filter((poem) => matchesSearch(poem, searchTerm)),
        [favorites, matchesSearch, searchTerm]
    );

    const showError = (msg) => {
        setErrorMessage(msg);
        setTimeout(() => setErrorMessage(""), 5000);
    }

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
                    {filteredPoems.length === 0 ? 
                            (<p>No Favorites Yet</p>
                            ) : (
                                //get the array of favorited poems and render them
                                filteredPoems.map((p) => (
                                    <LanguagePoemCard key={p.id} poem = {p} lang={p.language} onClick = {() => setSelectedPoem(p)}/>))
                                )
                    }        
                </div>

                {selectedPoem && 
                    <LanguagePoemDisplay poem = {selectedPoem} 
                                        lang = {selectedPoem.language} 
                                        onClose = {() =>setSelectedPoem(null)} 
                                        onTranslate = {handleTranslate}
                                        loading = {loading}/>
                }
                </div>
        </div>
    )
}

export default FavoritesPage