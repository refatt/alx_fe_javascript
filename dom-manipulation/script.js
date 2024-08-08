function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  // Restore the last selected filter from local storage
  const lastSelectedCategory = localStorage.getItem('selectedCategory');
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
    filterQuotes();
  }
}
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory);

  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(quote => quote.category === selectedCategory);

  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const quote = filteredQuotes[randomIndex];
    const quoteDisplay = document.getElementById("quoteDisplay");

    quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p>- ${quote.category}</p>`;
  } else {
    document.getElementById("quoteDisplay").innerHTML = "<p>No quotes available for this category.</p>";
  }
}

function showRandomQuote() {
  filterQuotes();
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text: newQuoteText, category: newQuoteCategory });

  // Update categories if the new quote has a unique category
  const categoryFilter = document.getElementById('categoryFilter');
  if (![...categoryFilter.options].some(option => option.value === newQuoteCategory)) {
    const option = document.createElement('option');
    option.value = newQuoteCategory;
    option.textContent = newQuoteCategory;
    categoryFilter.appendChild(option);
  }

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Update the displayed quote
  filterQuotes();
}

function createAddQuoteForm() {
  const formContainer = document.getElementById('addQuoteFormContainer');

  const inputQuoteText = document.createElement('input');
  inputQuoteText.id = 'newQuoteText';
  inputQuoteText.type = 'text';
  inputQuoteText.placeholder = 'Enter a new quote';
  formContainer.appendChild(inputQuoteText);

  const inputQuoteCategory = document.createElement('input');
  inputQuoteCategory.id = 'newQuoteCategory';
  inputQuoteCategory.type = 'text';
  inputQuoteCategory.placeholder = 'Enter quote category';
  formContainer.appendChild(inputQuoteCategory);

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.onclick = addQuote;
  formContainer.appendChild(addButton);
}

createAddQuoteForm();
populateCategories();
showRandomQuote();
