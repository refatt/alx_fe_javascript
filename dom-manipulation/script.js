// Initialize the quotes array from local storage, or as an empty array if not present
let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
let categories = []; // To store unique categories
let selectedCategory = localStorage.getItem('selectedCategory') || 'all';
const notificationElement = document.getElementById('notification');

// Mock server data simulation
function fetchServerQuotes() {
  // Simulate a delay for fetching data
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 1, text: 'Be yourself; everyone else is already taken.', category: 'Inspirational' },
        { id: 2, text: 'So many books, so little time.', category: 'Literary' }
        // Additional mock quotes...
      ]);
    }, 1000);
  });
}

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

// Function to display notification
function displayNotification(message) {
  notificationElement.textContent = message;
  notificationElement.style.display = 'block';
  setTimeout(() => {
    notificationElement.style.display = 'none';
  }, 3000);
}

// Function to sync data with the server
async function syncWithServer() {
  try {
    const serverQuotes = await fetchServerQuotes();
    const serverIds = serverQuotes.map(q => q.id);
    const localIds = quotes.map(q => q.id);

    // Find new quotes from the server
    const newQuotes = serverQuotes.filter(q => !localIds.includes(q.id));
    if (newQuotes.length > 0) {
      quotes.push(...newQuotes);
      saveQuotes();
      displayNotification('New quotes have been added from the server.');
    }

    // Find removed quotes from the server
    const removedQuotes = quotes.filter(q => !serverIds.includes(q.id));
    if (removedQuotes.length > 0) {
      quotes = quotes.filter(q => serverIds.includes(q.id));
      saveQuotes();
      displayNotification('Some quotes have been removed based on server data.');
    }

    updateCategoryFilter();
    showRandomQuote();
  } catch (error) {
    console.error('Error syncing with server:', error);
    displayNotification('Error syncing with server. Please try again later.');
  }
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

// Periodically sync with server (every 10 seconds for demonstration purposes)
setInterval(syncWithServer, 10000);
