/**
 * Language options for the code editor
 * Each language has an ID that corresponds to the Judge0 API language ID
 */
export const languageOptions = [
  { id: 63, name: "JavaScript" },
  { id: 71, name: "Python" },
  { id: 50, name: "C" },
  { id: 105, name: "C++" },
  { id: 62, name: "Java" }
];

/**
 * Get language name from language ID
 * @param {number} id - Language ID
 * @returns {string} Language name in lowercase
 */
export const getLanguageNameById = (id) => {
  const language = languageOptions.find(lang => lang.id === id);
  return language ? language.name.toLowerCase() : 'javascript';
};
