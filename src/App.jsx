import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LanguageHome from './pages/LanguageHome'
import { FavoritesProvider } from './hooks/useFavorites';
import FavoritesPage from './pages/FavoritesPage';
import LanguageExplore from './pages/LanguageExplore';
import PoetPage from './pages/PoetPage'; 
import { LANGUAGE_CODES } from './config/languages';

function App() {

    //store fetched poems in initial arrays with no poems
    //update this with poems from backend once API data arrives
    //derive language keys from config so adding a new language does not require touching App state
    const initialPoemsByLanguage = {
        all: [],
        ...Object.fromEntries(LANGUAGE_CODES.map((code) => [code, []])) 
        //fromEntries creates an object from an array of key-value pairs
        //spread operator takes an existing object and "unpacks" its contents into a new one
    };

    const [poemsByLanguage, setPoemsByLanguage] = useState(initialPoemsByLanguage);

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

            const data = await response.json();// turns JSON response body into array of JavaScript objects

            setPoemsByLanguage(prev => ({...prev, [lang]: data})); 
            return data; //for poetPage and other components that use this async method

        } catch (error) {
            console.error("Error fetching poems:", error);
            return [];
        }
    }

    //Calling here for MainPage random selection of featured poems. Should probably find a better way to do this later.
    useEffect(() => {
        fetchAllPoems();
    }, []);

    return(
        <FavoritesProvider>
        <BrowserRouter>
        <Routes>
            <Route  path = "/" 
                    element = {<MainPage poems={poemsByLanguage.all}/>}/>

            {/* parameterized/dynamic routing for lang, lang also allowed to define nested routes */}
            {/* 'lang' route does not wrap/render anything; it only groups nested routes*/}
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
