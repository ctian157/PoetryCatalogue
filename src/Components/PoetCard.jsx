import './PoetCard.css'

function PoetCard ( {poetName, image, lang} ) {

    return (
        <div className="poet-card" style={{ backgroundImage: `url(${image})` }}>
            <div className = {`poet-name ${lang==="zh" ?
                "poet-name-vertical" : "poet-name-horizontal"
            }`}>
                <h1>{poetName}</h1>
            </div>
        </div>
    )

}

export default PoetCard;