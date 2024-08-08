let quotes = [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", category: "Action" },
  { text: "Whether you think you can or think you can’t, you’re right.", category: "Belief" }
];

// Function to display a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");

  quoteDisplay.innerHTML = `<p>"${quote.text}"</p><p>- ${quote.category}</p>`;
}

// Function to create the form for adding a new quote
function createAddQuoteForm() {
  const formContainer = document.createElement('div');

  // Create input for new quote text
  const inputQuoteText = document.createElement('input');
  inputQuoteText.id = 'newQuoteText';
  inputQuoteText.type = 'text';
  inputQuoteText.placeholder = 'Enter a new quote';
  formContainer.appendChild(inputQuoteText);

  // Create input for new quote category
  const inputQuoteCategory = document.createElement('input');
  inputQuoteCategory.id = 'newQuoteCategory';
  inputQuoteCategory.type = 'text';
  inputQuoteCategory.placeholder = 'Enter quote category';
  formContainer.appendChild(inputQuoteCategory);

  // Create the add quote button
  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.onclick = addQuote;
  formContainer.appendChild(addButton);

  // Append the form container to the body or a specific section
  document.body.appendChild(formContainer);
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text: newQuoteText, category: newQuoteCategory });

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `<p>"${newQuoteText}"</p><p>- ${newQuoteCategory}</p>`;
}

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// Initial display of a random quote
showRandomQuote();

// Call the function to create the add quote form on page load
createAddQuoteForm();
