import './FavoritesPage.css'
import NavBar from '../Components/NavBar'
import { useState } from 'react';
import useFavorites from '../Hooks/useFavorites'
import LanguagePoemCard from '../Components/LanguagePoemCard'
import LanguagePoemDisplay from '../Components/LanguagePoemDisplay'
import pinyin from 'pinyin';

function FavoritesPage () {

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedPoem, setSelectedPoem] = useState(null);

    const { favorites, addFavorite, removeFavorite } = useFavorites();

    //for loading text when calling Gemini
    const [loading, setLoading] = useState(false);

    //for romanized search (定風波 -> "ding feng bo")
    const favoritesWithPinyinMaybe = favorites.map(poem => ({
        ...poem,
        pinyinTitle: 
            poem.language === "zh" ? pinyin(poem.title, {//new field
            style: pinyin.STYLE_NORMAL //returns nested array as each character maps to an array of pinyin syllables
            }).flat().join(" ") //flatten array into single array and join elements into single string
            : null //not Chinese
    }));

    const userInput = searchTerm.toLowerCase().trim().replace(/\s+/g, '');

    //filter for both actual Chinese text and English text
    const filteredPoems = favoritesWithPinyinMaybe.filter(poem => 
        poem.title.toLowerCase().includes(userInput) ||
        (poem.language == 'zh' && poem.pinyinTitle.toLowerCase().replace(/\s+/g, '').includes(userInput))||
        poem.content.toLowerCase().includes(userInput)
    );


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
                    <LanguagePoemDisplay poem = {selectedPoem} lang = {selectedPoem.language} onClose = {() =>setSelectedPoem(null)} onTranslate = {handleTranslate} loading = {loading}/>
                }
                </div>
        </div>
    )
}

export default FavoritesPage