// Initialize the quotes array from local storage, or as an empty array if not present
let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
  if (quotes.length > 0) {
    // Get a random index
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Display the random quote
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `"${randomQuote.text}" - <em>${randomQuote.category}</em>`;

    // Save the index of the last viewed quote to session storage
    sessionStorage.setItem('lastViewedQuoteIndex', randomIndex);
  } else {
    alert('No quotes available.');
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

    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert('Quote added successfully!');
  } else {
    alert('Please enter both a quote and a category.');
  }
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

// Load the last viewed quote if available in session storage
const lastViewedQuoteIndex = sessionStorage.getItem('lastViewedQuoteIndex');
if (lastViewedQuoteIndex !== null && quotes[lastViewedQuoteIndex]) {
  const lastQuote = quotes[lastViewedQuoteIndex];
  document.getElementById('quoteDisplay').innerHTML = `"${lastQuote.text}" - <em>${lastQuote.category}</em>`;
}
