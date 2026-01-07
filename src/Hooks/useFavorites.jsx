import { createContext, useContext, useState, useEffect } from 'react';

//to sync favorite states across all components
const FavoritesContext = createContext();

export function FavoritesProvider ({children}) {

    //localStorage only accepts strings as values
    //upon initial render, access data from localStorage if available and use as state
    const [favorites, setFavorites] = useState(() => {

        const storedFavorites = localStorage.getItem('favorited'); //take the favorited JSON string..
        return storedFavorites ? JSON.parse(storedFavorites): []; //turn into giant JavaScript object with inner objects
        
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

    //check if poem is already in favorited list; does ANY poem in list match with current?
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

    //export as an object with the list, and the three functions
    return (

        <FavoritesContext.Provider value = {{ favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite }}>
            {children}
        </FavoritesContext.Provider>
    )
}

//custom hook so we don't have to write 'useContext(FavoritesContext)' every time it's used and can just useFavorites
function useFavorites() {
    return useContext(FavoritesContext);
};

export default useFavorites;

