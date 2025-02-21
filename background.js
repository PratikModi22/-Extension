chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  try {
      if (message.type === "scrapeProfile") {
          console.log("Scraping LinkedIn profile:", message.url);

          const apiKey = "67b816a99648fa584c0e68da"; // Your ScrapingDog API key
          const scrapeUrl = `https://api.scrapingdog.com/linkedinscraper/${apiKey}?link=${encodeURIComponent(message.url)}`;

          const scrapeResponse = await fetch(scrapeUrl, {
              method: "GET",
              headers: { "Content-Type": "application/json" }
          });

          if (!scrapeResponse.ok) {
              throw new Error(`Scraping API error: ${scrapeResponse.status}`);
          }

          const scrapedData = await scrapeResponse.json();

          if (!scrapedData || Object.keys(scrapedData).length === 0) {
              throw new Error("Scraped data is empty or invalid.");
          }

          console.log("Scraped LinkedIn Data:", scrapedData);
          sendResponse({ success: true, data: scrapedData });
      }

      if (message.type === "analyzeProfile") {
          console.log("Analyzing profile data with AI:", message.profileData);

          const openAiApiKey = "YOUR_OPENAI_API_KEY"; // Replace with OpenAI API key
          const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
              method: "POST",
              headers: {
                  "Authorization": `Bearer ${openAiApiKey}`,
                  "Content-Type": "application/json"
              },
              body: JSON.stringify({
                  model: "gpt-4",
                  messages: [
                      { role: "system", content: "You are a LinkedIn profile optimization expert." },
                      { role: "user", content: `Analyze and suggest improvements for this LinkedIn profile:\n\n${JSON.stringify(message.profileData, null, 2)}` }
                  ]
              })
          });

          if (!openAiResponse.ok) {
              throw new Error(`OpenAI API error: ${openAiResponse.status}`);
          }

          const aiData = await openAiResponse.json();
          const suggestions = aiData.choices?.[0]?.message?.content.split("\n") || ["No recommendations found."];

          console.log("AI Recommendations:", suggestions);

          sendResponse({
              success: true,
              data: {
                  headline: message.profileData.headline || "Not found",
                  summary: message.profileData.summary || "No summary available",
                  skills: message.profileData.skills || [],
                  suggestions
              }
          });
      }
  } catch (error) {
      console.error("Error in background script:", error);
      sendResponse({ success: false, error: error.message });
  }

  return true; // Keep message port open for async response
});
