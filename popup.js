document.getElementById("analyze").addEventListener("click", async () => {
  const profileUrl = document.getElementById("profile-url").value.trim();
  const resultsDiv = document.getElementById("results");

  if (!profileUrl || !profileUrl.includes("linkedin.com/in/")) {
      resultsDiv.innerHTML = "<p style='color: red;'>Enter a valid LinkedIn profile URL.</p>";
      return;
  }

  resultsDiv.innerHTML = "<p>Analyzing profile... Please wait.</p>";

  try {
      // 🔹 Step 1: Request background script to scrape LinkedIn profile
      const scrapeResponse = await new Promise((resolve) => {
          chrome.runtime.sendMessage({ type: "scrapeProfile", url: profileUrl }, resolve);
      });

      if (!scrapeResponse?.success) {
          throw new Error(scrapeResponse?.error || "Failed to scrape LinkedIn profile.");
      }

      const profileData = scrapeResponse.data;
      console.log("✅ Scraped LinkedIn Profile Data:", profileData);

      // 🔹 Step 2: Send scraped data to background script for AI analysis
      const aiResponse = await new Promise((resolve) => {
          chrome.runtime.sendMessage({ type: "analyzeProfile", profileData }, resolve);
      });

      if (!aiResponse?.success) {
          throw new Error(aiResponse?.error || "AI analysis failed.");
      }

      const { headline, summary, skills, suggestions } = aiResponse.data;

      // 🔹 Step 3: Display results dynamically
      resultsDiv.innerHTML = `
          <h4>Profile Analysis</h4>
          <p><strong>Headline:</strong> ${headline || "N/A"}</p>
          <p><strong>Summary:</strong> ${summary || "N/A"}</p>
          <p><strong>Skills:</strong> ${skills?.length ? skills.join(", ") : "N/A"}</p>
          <h4>Suggested Improvements</h4>
          <ul>${suggestions.map((s) => `<li>${s}</li>`).join("")}</ul>
      `;

  } catch (error) {
      console.error("❌ Error:", error);
      resultsDiv.innerHTML = `<p style='color: red;'>Error: ${error.message}</p>`;
  }
});
