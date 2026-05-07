import { useState, useEffect } from "react";
import useFavorites from "../hooks/useFavorites"; //like useState etc. but your own custom hook!
import { getLanguageConfig } from "../config/languages";


function LanguagePoemDisplay( { poem, lang, onClose, onUpdate, onDelete, onTranslate, onAllowUpdateAndDelete, loading }) {

    const languageConfig = getLanguageConfig(lang);
    const PoemDisplay = languageConfig?.poemDisplayComponent;
    const allowTranslate = languageConfig?.canTranslate;

    const { isFavorite, removeFavorite, addFavorite } = useFavorites(); 

    //mark if a poem is in a "being edited" state
    const [isEditing, setIsEditing] = useState(false);

    //temporarily store state of updated poem
    // copy the poem object into state; intially going to be identical to all key:values as OG
    const [editedPoem, setEditedPoem] = useState({...poem});

    //fill in editing fields with current poem data, not whatever was stored in state before
    //triggered every time poem prop changes (i.e new poem selected and new PoemDisplay rendered)
    useEffect(() => {
        setEditedPoem({...poem});
        setIsEditing(false);
    }, [poem]);


    //if no poem selected, don't render the following display
    if (poem === null) return null;


    //add to favorites list inside; on the display
    const handleToggleFavorite = (poem) => {
        if (isFavorite(poem.id)) {
            removeFavorite(poem.id);
        } else {
            addFavorite(poem)
        }
    }

    //make necesary replacements when editing poem
    //event is 'user typing', target is the actual element user interacted with
    const handleEdit = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        //in event, will replace whatever the specified edited field is with its new version (value)
        setEditedPoem(prev => ({...prev, [name]: value}))
    }
    
    //save poem and change editing status
    const handleSave = () => {
        //send updated poem to database via prop function
        onUpdate(editedPoem);
        setIsEditing(false);
    }


    return <PoemDisplay poem={poem}
                        onClose={onClose}
                        onDelete={onDelete}
                        editedPoem={editedPoem}
                        isEditing={isEditing}
                        setIsEditing={setIsEditing}
                        onEditField={handleEdit}
                        setEditedPoem={setEditedPoem}
                        onSave={handleSave}
                        onAllowUpdateAndDelete={onAllowUpdateAndDelete}
                        onToggleFavorite={handleToggleFavorite}
                        isFavorite={isFavorite(poem.id)}
                        onAllowTranslate={allowTranslate}
                        onTranslate={onTranslate}
                        loading={loading}/>; } 

export default LanguagePoemDisplay;
