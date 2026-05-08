import './BottomButtons.css';

function BottomButtons({ poem, canUpdateDelete, canTranslate, loading, onEdit, onDelete, onTranslate }) {

return(

<div className = "features">
    <div className = "edit-and-delete">
        {canUpdateDelete && (
        <div className = "controls">
        <button className = "editing-button"
            onClick={onEdit}>
            Edit Poem
        </button>

        <button className = "editing-button" 
            onClick = {() => onDelete(poem.id)}>
            Delete Poem
        </button>

        </div>)
        }
    </div>

    <div className = "translation">
        {poem.translation ? (
        <div className = "translation-text">
            <h2>Translation</h2>
            <p>{poem.translation}</p>
        </div>
        ) : (
            canTranslate && (
                <button className = "translate-button" 
                onClick = {() => onTranslate(poem.id)} 
                disabled={loading}
                >
                    {loading ? "Translating...": "Translate Poem"}
                </button>
            )
        )}
    </div>

    </div>

)

}

export default BottomButtons;
