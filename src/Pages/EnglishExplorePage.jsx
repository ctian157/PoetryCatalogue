import "./EnglishExplorePage.css"
import LanguagePoemCard from "../Components/LanguagePoemCard"
import LanguagePoemDisplay from "../Components/LanguagePoemDisplay";
import AddPoemCard from "../Components/AddPoemCard";
import NavBar from "../Components/NavBar";

//receives the poems list from App as a prop
function EnglishExplorePage ({ 
    lang,
    filteredPoems,
    selectedPoem,
    setSelectedPoem,
    searchTerm,
    setSearchTerm,
    isCreating,
    setIsCreating,
    newPoem,
    setNewPoem,
    onDelete,
    onUpdate,
    onPost,
    onTranslate,
    loading,
    errorMessage,
    onToggleFavorite }) {

    return (
    
        <div className = "en-explore-page">
            <div className = "en-explore-content">
                <div className = 'en-explore-title-bar'>
                    <h1 className = 'en-explore-text'>Explore</h1>
                    <NavBar/>
                </div>

                <button className = "create-button" onClick = {() => setIsCreating(true)}>Create </button>

                <input  className = "search-bar" 
                        placeholder = "Search poem..."
                        value = {searchTerm}
                        onChange = {(e) => setSearchTerm(e.target.value)}/>

                <div className = 'en-poem-library'>
                        {filteredPoems.map((p) => (
                            <LanguagePoemCard   
                                        key={p.id} 
                                        lang={lang}
                                        poem={p} 
                                        onClick = {() => setSelectedPoem(p)}
                                        onToggleFavorite = {() => onToggleFavorite(p)}/>
                            ))}
                </div>
                
                {selectedPoem && (
                <LanguagePoemDisplay   
                                poem = {selectedPoem} 
                                lang={lang}
                                onClose = {() =>setSelectedPoem(null)}
                                onUpdate = {onUpdate}
                                onDelete = {onDelete}
                                onAllowUpdateAndDelete={true}
                                onTranslate = {onTranslate}
                                loading = {loading}/>
                )}
                
                <AddPoemCard    isCreating = {isCreating} 
                                newPoem = {newPoem}
                                setNewPoem = {setNewPoem}
                                onClose = {() => setIsCreating(false)}
                                onSubmit = {onPost}/>


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

export default EnglishExplorePage;