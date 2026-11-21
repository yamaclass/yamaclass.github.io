(() => {
  const input = document.getElementById('site-search');
  const status = document.getElementById('search-status');
  const results = document.getElementById('search-results');

  if (!input || !status || !results) return;

  let pages = null;
  let timer = null;

  const indexUrl = document.body.dataset.searchIndex;

  async function loadIndex() {
    if (pages) return pages;
    const response = await fetch(indexUrl);
    if (!response.ok) throw new Error('検索データを読み込めませんでした');
    pages = await response.json();
    return pages;
  }

  async function search() {
    const query = input.value.trim().toLowerCase();
    results.replaceChildren();

    if (!query) {
      status.textContent = '';
      return;
    }

    try {
      const allPages = await loadIndex();
      const words = query.split(/\s+/).filter(Boolean);

      const matches = allPages.filter(page => {
        const haystack = `${page.title} ${page.content}`.toLowerCase();
        return words.every(word => haystack.includes(word));
      });

      status.textContent = matches.length
        ? `${matches.length}件見つかりました`
        : '該当するページはありません';

      const list = document.createElement('ul');

      matches.slice(0, 30).forEach(page => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = page.url;
        link.textContent = page.title;
        item.appendChild(link);
        list.appendChild(item);
      });

      results.appendChild(list);
    } catch (error) {
      status.textContent = error.message;
    }
  }

  input.addEventListener('input', () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(search, 200);
  });
})();
