document.getElementById("analyze").addEventListener("click", async () => {
  const profileUrl = document.getElementById("profile-url").value.trim();
  const resultsDiv = document.getElementById("results");

  if (!profileUrl || !profileUrl.includes("linkedin.com/in/")) {
      resultsDiv.innerHTML = "<p style='color: red;'>Enter a valid LinkedIn profile URL.</p>";
      return;
  }

  resultsDiv.innerHTML = "<p>Analyzing profile... Please wait.</p>";

  try {
      // 🔹 Step 1: Scrape LinkedIn profile using ScraperAPI (Free)
      const scraperApiKey = "4d2e281a7e0a76747da2b5f63b0d7ae3"; // Get a free key from scraperapi.com
      const scrapeUrl = `https://api.scraperapi.com?api_key=${scraperApiKey}&url=${encodeURIComponent(profileUrl)}`;

      const scrapeResponse = await fetch(scrapeUrl);
      const scrapedHtml = await scrapeResponse.text();
      
      // Extract relevant information using a simple text search
      const headlineMatch = scrapedHtml.match(/<title>(.*?)<\/title>/);
      const headline = headlineMatch ? headlineMatch[1] : "Headline not found";

      // 🔹 Step 2: Send scraped data to OpenAI API for recommendations
      const openAiApiKey = "YOUR_OPENAI_API_KEY"; // Get from openai.com
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
                  { role: "user", content: `Analyze this LinkedIn profile and suggest improvements:\n\nHeadline: ${headline}` }
              ]
          })
      });

      const aiData = await openAiResponse.json();
      const suggestions = aiData.choices[0].message.content;

      // 🔹 Step 3: Display results
      resultsDiv.innerHTML = `
          <h4>Profile Analysis</h4>
          <p><strong>Headline:</strong> ${headline}</p>
          <h4>Suggested Improvements</h4>
          <p>${suggestions.replace(/\n/g, "<br>")}</p>
      `;
  } catch (error) {
      console.error("Error:", error);
      resultsDiv.innerHTML = "<p style='color: red;'>Error fetching profile data. Try again later.</p>";
  }
});
