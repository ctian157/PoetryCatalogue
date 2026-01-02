import { useParams } from "react-router-dom";
import ChineseFavoritesPage from "./ChineseFavoritesPage";

function LanguageFavorites() {

  const { lang } = useParams();

  const favoritesPages = {
    zh: ChineseFavoritesPage,
  };

  const FavoritesPage = favoritesPages[lang];

  return <FavoritesPage lang={lang}/>;
}

export default LanguageFavorites;

