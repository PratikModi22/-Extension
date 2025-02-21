chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "scrapeProfile") {
      console.log("Scraping profile:", message.url);

      const apiKey = "4d2e281a7e0a76747da2b5f63b0d7ae3"; // Replace with your actual API key
      const apiUrl = `https://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(message.url)}`;

      fetch(apiUrl)
          .then(response => {
              if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
              return response.text();
          })
          .then(html => {
              sendResponse({ success: true, data: html });
          })
          .catch(error => {
              console.error("Scraping failed:", error);
              sendResponse({ success: false, error: error.message });
          });

      return true; // Keep message port open for async response
  }
});
