import { useParams} from 'react-router-dom';
import { useState, useEffect } from "react";
import useFavorites from "../hooks/useFavorites"
import { usePoemActions } from '../hooks/usePoemActions';
import pinyin from 'pinyin';
import { getLanguageConfig } from '../config/languages';

//receives the poems list from App as a prop
function LanguageExplore ({ poemsByLanguage, fetchPoemsByLanguage, setPoemsByLanguage }) {

    const { lang } = useParams(); 
    const config = getLanguageConfig(lang);
    
    useEffect(() => { 
        if (config && (!poemsByLanguage[lang]|| poemsByLanguage[lang].length === 0)) { 
            fetchPoemsByLanguage(lang); 
        } 
    }, [lang, config, poemsByLanguage, fetchPoemsByLanguage]); //fetchPoemsByLanguage in dependency array to re-run when App re-executes (ie fetchAllPoemsByLanguage for some reason)

    //methods from useFavorites.js
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();
    const {handleTranslate, handleDelete, handleUpdate, 
            selectedPoem, setSelectedPoem, loading, showError, errorMessage} = usePoemActions({lang, setPoemsByLanguage});

    //for search feature
    //will return ALL poems upon mount because every string includes initial state ""
    const [searchTerm, setSearchTerm] = useState ("");

    //for adding to database feature
    const [isCreating, setIsCreating] = useState(false);

     //to temporarily store state of fields to be added
     const [newPoem, setNewPoem] = useState({
        title: '',
        poet: '',
        poet_en: '',
        dynasty: '',
        content: ''
    });

    const poems = poemsByLanguage[lang] || [];
    

    //for romanized search (定風波 -> "ding feng bo")
    const poemsWithPinyin = poems.map(poem => ({
        ...poem,
        pinyinTitle: pinyin(poem.title, {//new field
            style: pinyin.STYLE_NORMAL //returns nested array as each character maps to an array of pinyin syllables
            }).flat().join(" ") //flatten array into single array and join elements into single string
    }));

    const userInput = searchTerm.toLowerCase().trim().replace(/\s+/g, '');

    //filter for both actual Chinese text and English text
    const filteredPoems = poemsWithPinyin.filter(poem => 
        poem.title.includes(userInput) ||
        poem.pinyinTitle.toLowerCase().replace(/\s+/g, '').includes(userInput)
    );
    
    //maintains favorites
    const handleToggleFavorite = (poem) => {
        if (isFavorite(poem.id)) {
            removeFavorite(poem.id);
        } else {
        addFavorite(poem);
    }
    };

    
    //adds to database
    const handlePost = async(newPoem) => {

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/poem?language=${lang}`, {
                method:'POST',
                headers: { 'Content-Type':'application/json'},
                body:JSON.stringify(newPoem)
            })
            
            if (!response.ok) {
                const errorText = await response.text();  // like "Duplicate"
                showError(`Saving poem failed: ${errorText}`);
                return;
            }

            const savedPoem = await response.json();

            //notify user
            alert(`Saved at ${savedPoem.id}`);

            //clear fields
            setNewPoem({
                title: '',
                poet: '',
                poet_en: '',
                dynasty: '',
                content: '',
            });

            //re-render UI (savedPoem has id whereas newPoem doesn't!)
            setPoemsByLanguage(prev => ({...prev, [lang]: [...prev[lang], savedPoem]}));

            //close the AddPoem window
            setIsCreating(false);

        } catch (error) {
            showError("Non-server error occurred.");
        }
    }


    const ExplorePage = config?.exploreComponent;

    if (!ExplorePage) {
        return <div>Language not supported.</div>;
    }

    return (
        <ExplorePage 
        lang={lang}
        filteredPoems={filteredPoems}
        selectedPoem={selectedPoem}
        setSelectedPoem={setSelectedPoem}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isCreating={isCreating}
        setIsCreating={setIsCreating}
        newPoem={newPoem}
        setNewPoem={setNewPoem}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
        onPost={handlePost}
        onTranslate={handleTranslate}
        loading={loading}
        errorMessage={errorMessage}
        onToggleFavorite={handleToggleFavorite}/>
    )
}

export default LanguageExplore;
