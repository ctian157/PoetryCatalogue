import { createContext, useContext, useState, useEffect } from 'react';

//to sync favorite states across all components
const FavoritesContext = createContext();

export function FavoritesProvider ({children}) {

    //localStorage only accepts strings as values
    //upon initial render, access data from localStorage if available and use as state
    const [favorites, setFavorites] = useState(() => {

        const storedFavorites = localStorage.getItem('favorited'); //take the favorited JSON string.
        return storedFavorites ? JSON.parse(storedFavorites): []; //turn string into giant JavaScript object
        
    });

    useEffect(() => {
        localStorage.setItem('favorited', JSON.stringify(favorites)) //save as giant JSON string under key 'favorited'
    }, [favorites])

    const addFavorite = (poem) => {
        setFavorites((prev) => [...prev, poem]); //create new array and set as state, so we don't directly mutate state
    };

    const removeFavorite = (poemId) => {
        setFavorites((prev) => prev.filter((p) => p.id !== poemId));
    };

    //check if poem is already in favorited list
    const isFavorite = (poemId) => {
        return favorites.some(p => p.id === poemId);
    };

    const toggleFavorite = (poem) => {
        if (isFavorite(poem.id)) {
          removeFavorite(poem.id);
        } else {
          addFavorite(poem);
        }
      };

    //export as an object with the array, and the functions
    return (

        <FavoritesContext.Provider value = {{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    )
}

//custom hook
function useFavorites() {
    return useContext(FavoritesContext);//subscribes component to custom FavoritesContext
};

export default useFavorites;

