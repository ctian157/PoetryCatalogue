import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { getLanguageConfig } from '../config/languages';

//Router for language home pages
function LanguageHome({poemsByLanguage, fetchPoemsByLanguage}) {

    const {lang} = useParams(); //set through dynamic routing
    const config = getLanguageConfig(lang);

    //runs fetchPoemsByLanguage after component mounts
    //re-run only when dependency array changes
    useEffect(() => {
        if (config) {
            fetchPoemsByLanguage(lang);
        }
    }, [lang, config, fetchPoemsByLanguage]);

    const poems = poemsByLanguage[lang] || [];
    const HomePage = config?.homeComponent;
    
    //React Router supports nested routes; these are automatically built off from 
    //LanguageHome path
    if (!HomePage) {
        return <div>Language not supported.</div>;
    }

    return (
        <HomePage poems={poems}/>
    );
    
}

export default LanguageHome
