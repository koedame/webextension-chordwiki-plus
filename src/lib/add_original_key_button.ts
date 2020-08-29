const addOriginalKeyButton = (html: string, loactionSearch: string): string => {
  const queryString = require('query-string');

  // TransposeButtonをマウントする要素を追加
  return html.replace(/(移調\+[0-9]|移調\-[0-9]|移調[:： 　]\+[0-9]|移調[:： 　]\-[0-9])/g, (match, capture) => {
    const parsedQueries = queryString.parse(loactionSearch);
    const key = parseInt(match.replace(/[^0-9\-]/g, ''), 10);
    const queries = {
      c: parsedQueries.c,
      t: parsedQueries.t,
      key: key,
      symbol: parsedQueries.symbol,
    };

    const stringifiedQuery = queryString.stringify(queries);
    const url = `https://ja.chordwiki.org/wiki.cgi?${stringifiedQuery}`;
    return `<transpose-button href="${url}" original-text="${match}">${match}</transpose-button>`;
  });
};

export default addOriginalKeyButton;
