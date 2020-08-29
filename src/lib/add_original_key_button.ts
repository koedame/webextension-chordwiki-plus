const addOriginalKeyButton = (html: string, loactionSearch: string): string => {
  const queryString = require('query-string');

  // TransposeButtonをマウントする要素を追加
  return html.replace(
    /(移調\+[0-9]|移調\-[0-9]|移調[:： 　]\+[0-9]|移調[:： 　]\-[0-9])/g,
    (match, capture) => {
      const parsedQueries = queryString.parse(loactionSearch);
      const queries = {
        c: parsedQueries.c,
        t: parsedQueries.t,
        key: parseInt(match.replace(/[^0-9\-]/g, ''), 10),
        symbol: parsedQueries.symbol,
      };

      const stringifiedQuery = queryString.stringify(queries);
      const url = `https://ja.chordwiki.org/wiki.cgi?${stringifiedQuery}`;
      return `<a href='${url}' class='chordwiki-plus-transpose-button'>${match}</a>`;
    }
    // "<div class='chordwiki-plus-transpose-button-wrap' data-transpose-to='$2'><div class='chordwiki-plus-transpose-button' data-transpose-to='$2'>$1</div></div>"
  );
};

export default addOriginalKeyButton;
