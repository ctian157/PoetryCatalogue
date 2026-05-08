import ChineseHomePage from '../languages/chinese/ChineseHomePage';
import EnglishHomePage from '../languages/english/EnglishHomePage';
import ChineseExplorePage from '../languages/chinese/ChineseExplorePage';
import EnglishExplorePage from '../languages/english/EnglishExplorePage';
import ChinesePoemCard from '../languages/chinese/ChinesePoemCard';
import EnglishPoemCard from '../languages/english/EnglishPoemCard';
import ChinesePoemDisplay from '../languages/chinese/ChinesePoemDisplay';
import EnglishPoemDisplay from '../languages/english/EnglishPoemDisplay';
import pinyin from 'pinyin';

function normalizeSearchInput(value = '') {
  return value.toLowerCase().trim().replace(/\s+/g, '');
}

export const LANGUAGES = {
  zh: {
    code: 'zh',
    name: 'Chinese',
    homeComponent: ChineseHomePage,
    exploreComponent: ChineseExplorePage,
    poemCardComponent: ChinesePoemCard,
    poemDisplayComponent: ChinesePoemDisplay,
    poetField: 'poet_en',
    navPath: '/zh',
    canTranslate: true,
    romanizedSearch: true,
    matchesSearch: (poem, rawInput) => {
      const userInput = normalizeSearchInput(rawInput);

      if (!userInput) return true;

      const pinyinTitle = pinyin(poem.title || '', {
        style: pinyin.STYLE_NORMAL
      }).flat().join('').toLowerCase();

      return (
        (poem.title || '').toLowerCase().includes(userInput) ||
        pinyinTitle.includes(userInput)
      );
    }
  },
  en: {
    code: 'en',
    name: 'English',
    homeComponent: EnglishHomePage,
    exploreComponent: EnglishExplorePage,
    poemCardComponent: EnglishPoemCard,
    poemDisplayComponent: EnglishPoemDisplay,
    poetField: 'poet',
    navPath: '/en',
    canTranslate: false,
    romanizedSearch: false,
    matchesSearch: (poem, rawInput) => {
      const userInput = normalizeSearchInput(rawInput);

      if (!userInput) return true;

      return (poem.title || '').toLowerCase().includes(userInput);
    }
  }
};


//Object is a built-in JavaScript object that provides methods for working with objects
//Object.keys() returns an array of the keys in the object
export const LANGUAGE_CODES = Object.keys(LANGUAGES); 

export function getLanguageConfig(lang) {
  return LANGUAGES[lang] ?? null;
}
