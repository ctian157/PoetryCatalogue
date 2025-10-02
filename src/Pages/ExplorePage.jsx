import "./ExplorePage.css"
import PoemCard from "../Components/PoemCard"
import PoemDisplay from "../Components/PoemDisplay";
import AddPoemCard from "../Components/AddPoemCard";
import { Link } from 'react-router-dom';
import { useState } from "react";
import useFavorites from "../Hooks/useFavorites"
import pinyin from 'pinyin';

//receives the poems list from App as a prop
function ExplorePage ({ poems, setPoems }) {

    //methods from useFavorites.js
    const { addFavorite, removeFavorite, isFavorite } = useFavorites();

    //for search feature
    //will return ALL poems upon mount because every string includes initial state ""
    const [searchTerm, setSearchTerm] = useState ("");

    //for poem display feature
    const [selectedPoem, setSelectedPoem] = useState(null);

    //for adding to database feature
    const [isCreating, setIsCreating] = useState(false);

    //for loading text when calling Gemini
    const [loading, setLoading] = useState(false);


     //to temporarily store state of fields to be added
     const [newPoem, setNewPoem] = useState({
        title: '',
        poet: '',
        poet_en: '',
        dynasty: '',
        content: ''
    });


    //for error messages
    const [errorMessage, setErrorMessage] = useState("");


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
        poem.pinyinTitle.toLowerCase().replace(/\s+/g, '').includes(userInput)||
        poem.content.toLowerCase().includes(userInput)
    );
    

    //maintains favorites
    const handleToggleFavorite = (poem) => {
        if (isFavorite(poem.id)) {
            removeFavorite(poem.id);
        } else {
        addFavorite(poem);
    }
    };

    //handles errors
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
            setPoems((prev) => prev.filter((p) => (p.id !== poemID)));

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
            setPoems(prev=>prev.map((p) => (p.id === updatedPoem.id ? updatedPoem : p)))
                
            //Displays updated poem automatically for user
            setSelectedPoem(updatedPoem);

        } catch (error) {
            showError("Non-server error occurred.");
        }
    }

    //adds to database
    const handlePost = async(newPoem) => {

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/poem`, {
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
                content: ''
            });

            //re-render UI (savedPoem has id whereas newPoem doesn't!)
            setPoems(prev => [...prev, savedPoem]);

            //close the AddPoem window
            setIsCreating(false);

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
            setPoems(prev=>prev.map((p) => (p.id === translatedPoem.id ? translatedPoem : p)))
                

            //display with translation
            setSelectedPoem(translatedPoem);


        } catch (error) {
            showError("Non-server error occurred.");
        } finally {
            setLoading(false); //stop loading
        }

    }


    return (
    
        <div className = "explore-page">
            <div className = "explore-content">
                <div className = 'explore-title-bar'>
                    <h1 className = 'explore-text'>Explore</h1>
                    <div className = 'explore-button-bar'> 
                        <Link to= "/">Home</Link>
                        <div className = "vertical-line">|</div>
                        <Link to= "/favorites">Favorites</Link>
                        <div className = "vertical-line">|</div>
                        <Link to= "/explore">Explore</Link>
                    </div>
                </div>

                <button className = "create-button" onClick = {() => setIsCreating(true)}>Create </button>

                <input  className = "search-bar" 
                        placeholder = "Search poem..."
                        value = {searchTerm}
                        onChange = {(e) => setSearchTerm(e.target.value)}/>

                <div className = 'poem-library'>
                        {filteredPoems.map((p) => (
                            <PoemCard   key={p.id} 
                                        poem={p} 
                                        onClick = {() => setSelectedPoem(p)}
                                        onToggleFavorite = {() => handleToggleFavorite(p)}/>
                            ))}
                </div>
                
                {selectedPoem && (
                <PoemDisplay    poem = {selectedPoem} 
                                onClose = {() =>setSelectedPoem(null)}
                                onUpdate = {handleUpdate}
                                onDelete = {handleDelete}
                                onAllowUpdateAndDelete={true}
                                onTranslate = {handleTranslate}
                                loading = {loading}/>
                )}
                
                <AddPoemCard    isCreating = {isCreating} 
                                newPoem = {newPoem}
                                setNewPoem = {setNewPoem}
                                onClose = {() => setIsCreating(false)}
                                onSubmit = {handlePost}/>


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
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                      }}>
                        {errorMessage}
                    </div>
                )}
            

            </div>
        </div>
    )
}

export default ExplorePage;