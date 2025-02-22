(function () {
  function getText(selector) {
      const element = document.querySelector(selector);
      return element ? element.innerText.trim() : null;
  }

  function getAllTexts(selector) {
      return [...document.querySelectorAll(selector)].map(el => el.innerText.trim()).filter(text => text.length > 0);
  }

  // Extract profile data from LinkedIn profile pages
  const profileData = {
      picture: document.querySelector(".pv-top-card-profile-picture__image")?.src || null,
      name: getText(".text-heading-xlarge"), // LinkedIn name field
      headline: getText(".text-body-medium.break-words"), // Headline
      summary: getText(".pv-about-section .inline-show-more-text"), // Summary
      experience: getAllTexts(".experience-section ul li"), // Experience section
      skills: getAllTexts(".pv-skill-category-entity__name-text"), // Skills section
      certifications: getAllTexts(".pv-certifications__summary-info h3"), // Certifications
      endorsements: getAllTexts(".pv-endorsements-section .pv-skill-entity__endorsement-count"), // Endorsements
  };

  console.log("Extracted profile data:", profileData);

  // Send extracted data to background.js
  chrome.runtime.sendMessage({ type: "profileData", data: profileData });
})();
