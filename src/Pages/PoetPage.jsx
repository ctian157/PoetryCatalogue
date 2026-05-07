import './PoetPage.css'
import LanguagePoemCard from '../components/LanguagePoemCard'
import LanguagePoemDisplay from '../components/LanguagePoemDisplay';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { getLanguageConfig } from '../config/languages';

function PoetPage ({ fetchPoemsByLanguage }) {

    const [poems, setPoems] = useState([]);

    // /poet/:poetName was dynamic URL routing, poetName was marked as a parameter
    //change to Javascript object
    const { lang, poetName } = useParams();
    const actualName = decodeURIComponent(poetName);
    const config = getLanguageConfig(lang);

    //do this here instead so that refreshing poetpage does not lose the poems to state reset
    useEffect(()=> {
      if (!config) {
        setPoems([]);
        return;
      }

      async function loadPoems() {
        const fetchedPoems = await fetchPoemsByLanguage(lang);
        const poetField = config.poetField;
        const filteredPoems = fetchedPoems.filter (
          p => p[poetField] === actualName
        );

        setPoems(filteredPoems);
      }

      loadPoems();

    }, [lang, actualName, config, fetchPoemsByLanguage]);

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
                <LanguagePoemCard key = {p.id} poem={p} lang={lang} onClick = {() => {setSelectedPoem(p)}}/>
                ))
              )}

              <LanguagePoemDisplay poem = {selectedPoem} lang={lang} onClose = {() =>setSelectedPoem(null)}/>
            
          </div>

        </div>
      </div>
    )
}

export default PoetPage;