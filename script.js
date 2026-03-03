const resultsList = document.getElementById('resultsList');
const searchForm = document.getElementById('searchForm');
const statusText = document.getElementById('statusText');
const queryInput = document.getElementById('queryInput');

const modeButtons = document.querySelectorAll('.mode-btn');
let currentMode = 'synonyms';

const MODE_LABELS = {
  synonyms: 'Synonyms',
  rhymes: 'Rhymes',
  related: 'Related',
  'sounds-like': 'Sounds like',
};

const MODE_PARAMS = {
  synonyms: 'rel_syn',
  rhymes: 'rel_rhy',
  related: 'ml',
  'sounds-like': 'sl',
};

const buildDatamuseUrl = (mode, query) => {
  const baseUrl = 'https://api.datamuse.com/words';
  const param = MODE_PARAMS[mode];
  const encodedQuery = encodeURIComponent(query);

  return `${baseUrl}?${param}=${encodedQuery}&max=20`;
};

const fetchWords = async (mode, query) => {
  const url = buildDatamuseUrl(mode, query);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    const data = await response.json();
    const words = data.map((item) => item.word);

    return words;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const setStatus = (message) => {
  statusText.textContent = message;
};

const renderResults = (words) => {
  resultsList.textContent = '';

  if (words.length === 0) {
    setStatus('No results found.');
    return;
  }

  setStatus(`Showing ${words.length} ${MODE_LABELS[currentMode]} results.`);

  words.forEach((word) => {
    const li = document.createElement('li');
    li.textContent = word;
    resultsList.appendChild(li);
  });
};

const setActiveMode = (nextMode) => {
  currentMode = nextMode;

  modeButtons.forEach((btn) => {
    const isActive = btn.dataset.mode === currentMode;

    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-selected', String(isActive));
  });

  setStatus(`Mode: ${MODE_LABELS[currentMode]}`);
};

modeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    setActiveMode(btn.dataset.mode);
  });
});

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const query = queryInput.value.trim();

  if (query === '') {
    setStatus('Please enter a word.');
    resultsList.textContent = '';
    return;
  }

  setStatus(`Searching ${MODE_LABELS[currentMode]} for "${query}"...`);

  const words = await fetchWords(currentMode, query);
  renderResults(words);
});

setActiveMode(currentMode);
