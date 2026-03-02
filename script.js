const resultsList = document.getElementById('resultsList');
const searchForm = document.getElementById('searchForm');
const statusText = document.getElementById('statusText');
const queryInput = document.getElementById('queryInput');

let currentMode = 'synonyms';

const mockResults = ['joyful', 'cheerful', 'content', 'delighted', 'elated'];

const setStatus = (message) => {
  statusText.textContent = message;
};

const renderResults = (words) => {
  resultsList.textContent = '';

  if (words.length === 0) {
    setStatus('No results found.');
    return;
  }

  setStatus(`Showing ${words.length} results.`);

  words.forEach((word) => {
    const li = document.createElement('li');
    li.textContent = word;
    resultsList.appendChild(li);
  });
};

searchForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const query = queryInput.value.trim();

    if (query === '') {
        setStatus('Please enter a word.');
        resultsList.textContent = '';
        return;
    }

    setStatus(`Searching for "${query}"...`);

    renderResults(mockResults);
})