import './EnglishPoemDisplay.css'
import StarryNight from '../assets/StarryNight.jpg'
import Frame from '../assets/ChineseFrame.png'

//take poem and onClose from ExplorePage as props
function EnglishPoemDisplay ({ poem, onClose, onDelete, editedPoem, isEditing, setIsEditing, setEditedPoem, onEditField, onSave, onAllowUpdateAndDelete, onToggleFavorite, isFavorite, onTranslate, loading }) {

    //modal-overlay refers to the for the temporary pop-up feature over the app
    return (
        <div className = "modal-overlay">

            <div className = "modal-content">
                
                <img className = "decorative-background" src = {StarryNight}/>

                    <div className = "quick-action">
                        <button className = "close-button" 
                        onClick = {onClose}>Close</button>

                        <button className = "favorite-button" onClick = {() => onToggleFavorite(poem)}>
                            {isFavorite ? '★ Remove Favorite' : '☆ Add to Favorites'}
                        </button>
                    </div>

                    <div className = 'poem-display'>
                    {isEditing ? (
                    <div className = "editing-fields">

                        <h1>In Poem-Editing Mode:</h1>

                        <label htmlFor="title">Poem Title:</label>
                        <input  name = "title" 
                                value = {editedPoem.title}
                                onChange = {onEditField}/>
                        <label htmlFor="poet">Poet Name:</label>
                        <input  name = "poet" 
                                value = {editedPoem.poet}
                                onChange = {onEditField}/>
                        <label htmlFor="poet_en">English Romanization:</label>
                        <input  name = "poet_en" 
                                value = {editedPoem.poet_en}
                                onChange = {onEditField}/>
                        <label htmlFor="dynasty">Dynasty:</label>
                        <input  name = "dynasty" 
                                value = {editedPoem.dynasty || ""}
                                onChange = {onEditField}/>
                        <label htmlFor="content">Verses:</label> 
                        <textarea   name = "content" 
                                    value = {editedPoem.content}
                                    onChange = {onEditField}/>
                        <label htmlFor="translation">Translation:</label> 
                        <textarea   name = "translation" 
                                    value = {editedPoem.translation}
                                    onChange = {onEditField}/>

                        <div className = "top-buttons">
                            <button className = "editing-button" onClick = {onSave}>Save</button>
                            <button className = "editing-button" onClick = {() => setIsEditing(false)}>Cancel</button>
                        </div>

                        
                    </div>
                    
                    ): (
                    
                    <div className = "all-content">

                    <div className = "poem-body">

                        <img className = "decorative-frame" src = {Frame}/>

                        <h1 className = "poem-title">{poem.title}</h1>
                        <h2 className = "poem-poet">{poem.poet}</h2>
                        <h2 className = "poem-dynasty">{poem.dynasty}</h2>

                        <hr className="poem-separator" />

                        <p className = "poem-content">{poem.content}</p>

                    </div>


                    <div className = "bottom-buttons">

                        <div className = "features">
                            <div className = "edit-and-delete">
                                {onAllowUpdateAndDelete && (
                                <div className = "controls">
                                <button className = "editing-button"
                                    onClick = {() => {
                                        setIsEditing(true)
                                        //set fields with prop poem values upon render
                                        setEditedPoem(poem)
                                    }}>
                                    Edit Poem
                                </button>
                    
                                <button className = "editing-button" onClick = {() => onDelete(poem.id)}>
                                    Delete Poem
                                </button>

                                </div>)
                                }
                            </div>

                            </div>

                        </div>
                    </div>
                     
                    )}

                </div>

            </div>
        </div>
    )

}

export default EnglishPoemDisplay;