import {useState} from 'react';
import useFavorites from './useFavorites';

export function usePoemActions({lang, setPoemsByLanguage}) {

    const { removeFavorite, isFavorite } = useFavorites();
    const [selectedPoem, setSelectedPoem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const showError = (msg) => {
        setErrorMessage(msg);
        setTimeout(() => setErrorMessage(""), 5000);
    }

    //deletes poem from database
    const handleDelete = async (poemID) => {
        try {
            //delete poem from database
            await fetch(`${import.meta.env.VITE_API_URL}/api/v1/poem/${poemID}`, {
                method:'DELETE'
            });

            //notify user
            alert(`Poem deleted`);

            //re-render UI upon state change
            setPoemsByLanguage((prev) => ({...prev, [lang]: prev[lang].filter(p => p.id !== poemID)}));

            //remove from Favorites as well if it's in there
            if (isFavorite(poemID)) {
                removeFavorite(poemID);
            }

            setSelectedPoem(null);

        } catch (error) {
            showError("Non-server error occurred.");
            console.log("Delete failed:", error)
        }
    };


    //updates database
    const handleUpdate = async (editedPoem)=> {
        try {

            //update poem in database
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/poem/${editedPoem.id}`, {
                method:'PUT',
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(editedPoem)
            })
            
            if (!response.ok) {
                const errorText = await response.text();  // like "Duplicate" or "Bad Request" from Springboot for null
                showError(`Update failed: ${errorText}`)
                return;
            }

            const updatedPoem = await response.json(); //convert returned response body JSON into Javascript object

            //update local array of poems, replacing old poem with new and keeping index in array
            setPoemsByLanguage(prev => ({...prev, 
                                        [lang]: prev[lang].map(p => 
                                            (p.id === updatedPoem.id ? updatedPoem : p))}))
                
            //Displays updated poem automatically for user
            setSelectedPoem(updatedPoem);

        } catch (error) {
            showError("Non-server error occurred.");
        }
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

            //update local array of poems, replacing old poem with new and keeping index in array
            setPoemsByLanguage(prev => ({...prev,
                                            [lang]: prev[lang].map(p => 
                                                (p.id === translatedPoem.id ? translatedPoem : p))}))
                

            //display with translation
            setSelectedPoem(translatedPoem);


        } catch (error) {
            showError("Non-server error occurred.");
        } finally {
            setLoading(false); //stop loading
        }

    }

    return {handleTranslate, handleDelete, handleUpdate, 
            selectedPoem, setSelectedPoem, loading, showError, errorMessage};
}
