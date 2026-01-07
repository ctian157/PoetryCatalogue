import './PoetPage.css'
import LanguagePoemCard from '../Components/LanguagePoemCard'
import LanguagePoemDisplay from '../Components/LanguagePoemDisplay';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import NavBar from '../Components/NavBar';

function PoetPage ({ fetchPoemsByLanguage }) {

    const [poems, setPoems] = useState([]);
    const [selectedPoem, setSelectedPoem] = useState(null);

    // /poet/:poetName was dynamic URL routing, poetName was marked as a parameter
    //change to Javascript object
    const { lang, poetName } = useParams();
    const actualName = decodeURIComponent(poetName);

    //do this here instead so that refreshing poetpage does not lose the poems to state reset
    useEffect(()=> {
      async function loadPoems() {
        const fetchedPoems = await fetchPoemsByLanguage(lang);
        const filteredPoems = fetchedPoems.filter (
          p =>(lang === "zh" ? p.poet_en === actualName : p.poet === actualName)
        );

        setPoems(filteredPoems);
      }

      loadPoems();

    }, [lang, actualName]);

    return (

      <div className = "poet-page">
        <div className = "poet-content">
          <div className = 'poet-title-bar'>

            <h1 className = 'poet-text'>{actualName}</h1> 

            <NavBar/>

          </div>

          <p> Poems may be edited or deleted only on the Explore page ~ </p>

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