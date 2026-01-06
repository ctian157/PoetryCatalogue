import './PoetPage.css'
import LanguagePoemCard from '../Components/LanguagePoemCard'
import LanguagePoemDisplay from '../Components/LanguagePoemDisplay';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import NavBar from '../Components/NavBar';

function PoetPage ({ poemsByLanguage }) {

    const [selectedPoem, setSelectedPoem] = useState(null);

    // /poet/:poetName was dynamic URL routing, poetName was marked as a parameter
    //change to Javascript object
    const { lang, poetName } = useParams();
    const actualName = decodeURIComponent(poetName);

    const filteredPoems = 
      lang === "zh" ? poemsByLanguage[lang].filter(p => p.poet_en === actualName)
                    : poemsByLanguage[lang].filter(p => p.poet === actualName);

    return (

      <div className = "poet-page">
        <div className = "poet-content">
          <div className = 'poet-title-bar'>

            <h1 className = 'poet-text'>{actualName}</h1> 

            <NavBar/>

          </div>

          <p>Poems may be edited or deleted only on the Explore page ~</p>

          <div className = "poet-library">

              {filteredPoems.length === 0 ? (
                <p>No poems found for this poet.</p>
              ) : (
                filteredPoems.map((p) => (
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