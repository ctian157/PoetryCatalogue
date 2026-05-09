import './FavoritesPage.css'
import NavBar from '../components/NavBar'
import { useState, useMemo } from 'react';
import useFavorites from '../hooks/useFavorites'
import { usePoemActions } from '../hooks/usePoemActions'
import LanguagePoemCard from '../components/LanguagePoemCard'
import LanguagePoemDisplay from '../components/LanguagePoemDisplay'
import { getLanguageConfig } from '../config/languages';

function FavoritesPage () {

    const config = getLanguageConfig('all');

    const [searchTerm, setSearchTerm] = useState("");

    const { favorites, addFavorite, removeFavorite } = useFavorites();

    
    const { handleTranslate, selectedPoem, setSelectedPoem, loading, errorMessage,} = usePoemActions({
        onPoemTranslated: (translatedPoem) => {//drop old copy from favorites list and add new one (with same id)
            removeFavorite(translatedPoem.id);
            addFavorite(translatedPoem);
        },
    });

    const matchesSearch = config?.matchesSearch ?? (() => true);

    const filteredPoems = useMemo(
        () => favorites.filter((poem) => matchesSearch(poem, searchTerm)),
        [favorites, matchesSearch, searchTerm]
    );

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

                {errorMessage && (
                    <div style={{
                        position: 'fixed',
                        top: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#e74c3c',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        zIndex: 1000,
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    }}>
                        {errorMessage}
                    </div>
                )}

                {selectedPoem && 
                    <LanguagePoemDisplay poem = {selectedPoem} 
                                        lang = {selectedPoem.language} 
                                        onClose = {() =>setSelectedPoem(null)} 
                                        canUpdateDelete={false} //Favorites page does not have UpdateDelete permissions, so dont render those buttons
                                        onTranslate = {handleTranslate}
                                        loading = {loading}/>
                }
                </div>
        </div>
    )
}

export default FavoritesPage