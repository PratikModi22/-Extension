(function() {
    // Extract profile data from LinkedIn profile pages
    const profileData = {
      picture: document.querySelector(".profile-photo")?.src || null,
      headline: document.querySelector(".headline")?.textContent || null,
      summary: document.querySelector(".summary")?.textContent || null,
      experience: [...document.querySelectorAll(".experience-section .result")].map(exp => exp.textContent),
      skills: [...document.querySelectorAll(".skills-section .skill")].map(skill => skill.textContent),
      certifications: [...document.querySelectorAll(".certifications-section .cert")].map(cert => cert.textContent),
      endorsements: [...document.querySelectorAll(".endorsements-section .endorsement")].map(endor => endor.textContent),
    };
    console.log("Extracted profile data:", profileData);
    chrome.runtime.sendMessage({ type: "profileData", data: profileData });
  })();