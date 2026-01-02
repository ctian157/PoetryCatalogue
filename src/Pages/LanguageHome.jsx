import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import ChineseHomePage from './ChineseHomePage';
import EnglishHomePage from './EnglishHomePage';

//Router for language home pages
function LanguageHome({poemsByLanguage, fetchPoemsByLanguage}) {

    const {lang} = useParams(); //set through dynamic routing

    //runs fetchPoemsByLanguage after component mounts, re-run only when dependency array changes
    //useEffect prevents running fetchPoems every rerender aka risking infinite loops 
    //  since we setPoems in fetchPoems (trigges rerender again)
    // () => { … } stores and runs fetchPoems AFTER jsx renders
    useEffect(() => {
        fetchPoemsByLanguage(lang);
    }, [lang]);

    const poems = poemsByLanguage[lang] || [];
    const homePages = {
        zh: ChineseHomePage,
        en: EnglishHomePage
        //add more languages as needed
      };

    const HomePage = homePages[lang];
    
    //React Router supports nested routes; these are automatically built off from 
    //  LanguageHome path
    //<Outlet /> is replaced by whichever nested route matches:
    return (
        <HomePage poems={poems} lang={lang}/>
    );
    
}

export default LanguageHome
