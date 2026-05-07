import { getLanguageConfig } from '../config/languages';

function LanguagePoemCard ({ lang, poem, ...props}) {
    const PoemCard = getLanguageConfig(lang)?.poemCardComponent;
    if (!PoemCard) return null;
    return <PoemCard poem={poem} {...props}/>;
}

export default LanguagePoemCard;
