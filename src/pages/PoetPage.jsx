import './PoetPage.css'
import LanguagePoemCard from '../components/LanguagePoemCard'
import LanguagePoemDisplay from '../components/LanguagePoemDisplay';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import NavBar from '../components/NavBar';
import { getLanguageConfig } from '../config/languages';
import { usePoemActions } from '../hooks/usePoemActions';

function PoetPage ({ poemsByLanguage, fetchPoemsByLanguage, setPoemsByLanguage }) {

   // /poet/:poetName was dynamic URL routing, poetName was marked as a parameter
    //change to Javascript object
    const { lang, poetName } = useParams();
    const actualName = decodeURIComponent(poetName);
    const config = getLanguageConfig(lang);

    const {handleTranslate, handleDelete, handleUpdate,
          selectedPoem, setSelectedPoem, loading} = usePoemActions({lang, setPoemsByLanguage});

    //useEffect to run upon mount to avoid any state reset problems upon hard refresh; fetch triggered
    useEffect(() => {
      if (config && (!poemsByLanguage[lang] || poemsByLanguage[lang].length === 0)) {
        fetchPoemsByLanguage(lang);
      }}, [lang, config, poemsByLanguage, fetchPoemsByLanguage]); 
    //^any update/delete will change poemsByLanguage, which will in turn change poetPage (no staleness)

    const poems = config ? (poemsByLanguage[lang] || []).filter(p => p[config.poetField] === actualName)
                          : [];

    if (!config) {
      return <div>Language not supported.</div>;
    }

    return (

      <div className = "poet-page">
        <div className = "poet-content">
          <div className = 'poet-title-bar'>

            <h1 className = 'poet-text'>{actualName}</h1> 

            <NavBar/>

          </div>

          <div className = "poet-library">

              {poems.length === 0 ? (
                <p>No poems found for this poet.</p>
              ) : (
                poems.map((p) => (
                <LanguagePoemCard key = {p.id} 
                                  poem = {p} 
                                  lang = {lang} 
                                  onClick = {() => {setSelectedPoem(p)}}/>
                ))
              )}

              <LanguagePoemDisplay poem = {selectedPoem} 
                                  lang={lang} 
                                  onClose = {() =>setSelectedPoem(null)}
                                  onUpdate={handleUpdate}
                                  onDelete={handleDelete}
                                  onTranslate={handleTranslate}
                                  canUpdateDelete={true}
                                  loading={loading}/>
            
          </div>

        </div>
      </div>
    )
}

export default PoetPage;