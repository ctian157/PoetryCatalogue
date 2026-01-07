import ChinesePoemCard from "./ChinesePoemCard"; 
import EnglishPoemCard from "./EnglishPoemCard"; 

//props are for stuff like onClick()
function LanguagePoemCard ({ lang, poem, ...props}) { 

    const poemCards = { 
        zh: ChinesePoemCard, 
        en: EnglishPoemCard
    }; 

    const PoemCard = poemCards[lang]; 
    return <PoemCard poem={poem} {...props}/>; 
} 
    
export default LanguagePoemCard;
