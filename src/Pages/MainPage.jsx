import {Link} from 'react-router-dom'
import { useState } from 'react'
import "./MainPage.css"
import LanguagePoemDisplay from '../Components/LanguagePoemDisplay'

function MainPage({poems}) {
    // Select 3 featured poems (or first 3 if less than 3 available)
    const featuredPoems = poems.length > 0 ? poems.slice(0, 5) : [];
    const [selectedPoem, setSelectedPoem] = useState(null);

    return (
        <div className= "main-page">
            <div className="main-title-bar">
                <h1>Poems Around the World</h1>

                <div className = "language-links">
                <Link to='/zh'>Chinese</Link>
                <Link to='/en'>English</Link>
                </div>
            </div>

            <div className = "main-body">

            <div className="poem-container">
                <div className="left-box">
                    <img src="/BoyWithBirds.webp"/>
                </div>

                <div className="right-boxes">
                    
                    <h2>Featured Poems</h2>

                    {featuredPoems.length > 0 ? (
                        featuredPoems.map((poem) => (
                           
                        <div 
                            className="right-box" 
                            key={poem.id}
                            onClick={() => setSelectedPoem(poem)}
                            style={{ cursor: 'pointer' }}
                        >
                            <h3 className="poem-title-preview">{poem.title}</h3>
                            <p className="poem-content-full">{poem.content}</p>
                        </div>

                    ))) : (
                        // Placeholder boxes if no poems available
                        <>
                            <div className="right-box">
                                <h3 className="poem-title-preview">Featured Poem</h3>
                                <p className="poem-content-full">Explore our collection...</p>
                            </div>
                            <div className="right-box">
                                <h3 className="poem-title-preview">Featured Poem</h3>
                                <p className="poem-content-full">Explore our collection...</p>
                            </div>
                            <div className="right-box">
                                <h3 className="poem-title-preview">Featured Poem</h3>
                                <p className="poem-content-full">Explore our collection...</p>
                            </div>
                        </>
                    )}
                </div>

            </div>

            </div>

            {selectedPoem && (
                <LanguagePoemDisplay 
                    poem={selectedPoem} 
                    lang={selectedPoem.language}
                    onClose={() => setSelectedPoem(null)}
                    onAllowUpdateAndDelete={false}
                />
            )}

        </div>
    )
}

export default MainPage;