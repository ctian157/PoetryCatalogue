import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './Pages/MainPage';
import LanguageHome from './Pages/LanguageHome'
import { FavoritesProvider } from './Hooks/useFavorites';
import FavoritesPage from './Pages/FavoritesPage';
import LanguageExplore from './Pages/LanguageExplore';
import PoetPage from './Pages/PoetPage'; 

function App() {

    //store fetched poems in initial arrays with no poems
    //update this with poems from backend once API data arrives
    const [poemsByLanguage, setPoemsByLanguage] = useState({
        all: [], //static
        zh: [], //all dynamic keys below
        en: [] 
        //ADD MORE LANGUAGES AS NEEDED
        });

    //GET: fetch all poems from backend once component loads
    //good to useEffect to do this so it only runs once when mounted
    //use async so the rest of React app still runs while useEffect is awaiting promise

    const fetchAllPoems = async() => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/poem`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();// turns JSON response body into array of JavaScriptobjects
            setPoemsByLanguage(prev => ({...prev, all: data})); // replaces 'all' array in poems with this array 

        } catch (error) {
            console.error("Error fetching poems:", error);
        }
    }

    //Async function, returns a Promise but nothing explicitly, only updates parent state here
    const fetchPoemsByLanguage = async(lang) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/poem?language=${lang}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();// turns JSON response body into array of JavaScriptobjects

            setPoemsByLanguage(prev => ({...prev, [lang]: data})); 
            return data; //for poetPage and other components that use this async method

        } catch (error) {
            console.error("Error fetching poems:", error);
            return [];
        }
    }

    /*//Probably not gonna render poems here yet
    useEffect(() => {
        fetchPoemsByLanguage();
    }, []);
    */
    

    return(
        <FavoritesProvider>
        <BrowserRouter>
        <Routes>
            <Route  path = "/" 
                    element = {<MainPage poems={poemsByLanguage.all}/>}/>

            {/* parameterized/dynamic routing for lang, lang also allowed to define nested routes */}
            {/* lang does not wrap anything bc no element tag, so it only groups nested routes, does not wrap them with anything (ie display a page)*/}
            <Route path = "/:lang" >

                {/*default route*/}
                <Route 
                    index
                    element = {<LanguageHome
                                poemsByLanguage={poemsByLanguage}
                                fetchPoemsByLanguage={fetchPoemsByLanguage}/>}/>
                
                < Route 
                    path="explore"
                    element={ <LanguageExplore
                        poemsByLanguage={poemsByLanguage}
                        fetchPoemsByLanguage={fetchPoemsByLanguage}
                        setPoemsByLanguage={setPoemsByLanguage}/>}/>

                <Route
                    path="poet/:poetName"
                    element={<PoetPage fetchPoemsByLanguage={fetchPoemsByLanguage} />}/>
            </Route>

            {/*favorites page is global*/}
            <Route
                    path="favorites"
                    element={ <FavoritesPage/>}/>

        </Routes>
        </BrowserRouter>
        </FavoritesProvider>
    )
};

export default App
