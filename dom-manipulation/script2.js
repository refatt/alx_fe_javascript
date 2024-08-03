// Initialize the quotes array from local storage, or as an empty array if not present
let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
let categories = []; // To store unique categories
let selectedCategory = localStorage.getItem('selectedCategory') || 'all';

// Function to save quotes and selected category to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
  localStorage.setItem('selectedCategory', selectedCategory);
}

// Function to show a quote based on the selected category
function showRandomQuote() {
  const filteredQuotes = quotes.filter(q => selectedCategory === 'all' || q.category === selectedCategory);
  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `"${randomQuote.text}" - <em>${randomQuote.category}</em>`;

    sessionStorage.setItem('lastViewedQuoteIndex', randomIndex);
  } else {
    alert('No quotes available for this category.');
  }
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value.trim();
  const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();

    if (!categories.includes(newQuoteCategory)) {
      categories.push(newQuoteCategory);
      updateCategoryFilter();
    }

    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('Quote added successfully!');
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Function to update the category dropdown menu
function updateCategoryFilter() {
  categories = Array.from(new Set(quotes.map(q => q.category)));
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  categoryFilter.value = selectedCategory;
}

// Function to filter quotes based on selected category
function filterQuotes() {
  selectedCategory = document.getElementById('categoryFilter').value;
  saveQuotes();
  showRandomQuote();
}

// Function to export quotes as a JSON file
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes) && importedQuotes.every(q => q.text && q.category)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        updateCategoryFilter();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format. Make sure the file contains an array of quotes with "text" and "category" properties.');
      }
    } catch (error) {
      alert('Error reading JSON file: ' + error.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Attach event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteButton').addEventListener('click', addQuote);
document.getElementById('exportButton').addEventListener('click', exportQuotes);

// Initialize the category filter and show a quote if applicable
updateCategoryFilter();
if (sessionStorage.getItem('lastViewedQuoteIndex') !== null) {
  showRandomQuote();
} else if (selectedCategory === 'all') {
  showRandomQuote();
}
