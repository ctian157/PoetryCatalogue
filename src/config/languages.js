import ChineseHomePage from '../Pages/ChineseHomePage';
import EnglishHomePage from '../Pages/EnglishHomePage';
import ChineseExplorePage from '../Pages/ChineseExplorePage';
import EnglishExplorePage from '../Pages/EnglishExplorePage';

export const LANGUAGES = {
  zh: {
    code: 'zh',
    name: 'Chinese',
    homeComponent: ChineseHomePage,
    exploreComponent: ChineseExplorePage,
    poetField: 'poet_en',
    navPath: '/zh',
  },
  en: {
    code: 'en',
    name: 'English',
    homeComponent: EnglishHomePage,
    exploreComponent: EnglishExplorePage,
    poetField: 'poet',
    navPath: '/en',
  },
};

export const LANGUAGE_CODES = Object.keys(LANGUAGES); //Object refers to keys in LANGUAGES object, and keys() returns an array of those keys

export function getLanguageConfig(lang) {
  return LANGUAGES[lang] ?? null;
}
