const serverUrl = "https://jsonplaceholder.typicode.com/posts";

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(serverUrl);
    const serverQuotes = await response.json();

    // Assume serverQuotes is an array of objects with text and category fields
    return serverQuotes.map(quote => ({ text: quote.title, category: quote.body }));
  } catch (error) {
    console.error("Failed to fetch quotes from server:", error);
    return [];
  }
}

// Function to simulate posting a new quote to the server
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(serverUrl, {
      method: "POST",
      body: JSON.stringify({
        title: quote.text,
        body: quote.category,
        userId: 1,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    });
    return await response.json();
  } catch (error) {
    console.error("Failed to post quote to server:", error);
  }
}
function startPeriodicSync() {
  setInterval(async () => {
    const serverQuotes = await fetchQuotesFromServer();
    syncLocalWithServer(serverQuotes);
  }, 5000); // Sync every 5 seconds (adjust as needed)
}

function syncLocalWithServer(serverQuotes) {
  const localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

  // Find new quotes from the server that aren't in local storage
  const newQuotes = serverQuotes.filter(serverQuote => {
    return !localQuotes.some(localQuote => 
      localQuote.text === serverQuote.text && localQuote.category === serverQuote.category);
  });

  // Merge server quotes with local quotes (Server precedence in case of conflict)
  const mergedQuotes = [...localQuotes, ...newQuotes];

  localStorage.setItem('quotes', JSON.stringify(mergedQuotes));
  quotes = mergedQuotes;

  // Notify the user of any updates
  if (newQuotes.length > 0) {
    alert(`New quotes from the server have been added.`);
    filterQuotes();
  }
}

async function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value;
  const newQuoteCategory = document.getElementById("newQuoteCategory").value;

  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = { text: newQuoteText, category: newQuoteCategory };

  quotes.push(newQuote);
  localStorage.setItem('quotes', JSON.stringify(quotes));

  await postQuoteToServer(newQuote);

  // Clear input fields and update display
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  filterQuotes();
}

function notifyUser(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000); // Remove notification after 3 seconds
}
