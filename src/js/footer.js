document.addEventListener("DOMContentLoaded", () => {
  /**
   * Simulates fetching fun facts from a backend API.
   * @returns {Promise<string[]>} A promise that resolves to an array of fun facts.
   */
  const getFunFactsFromBackend = async () => {
    // In a real application, you would use fetch() here:
    // const response = await fetch('/api/fun-facts');
    // const data = await response.json();
    // return data.facts;

    // For now, we'll return mock data.
    console.log("✅ Footer: Fetching mock fun facts.");
    return [
      "Czy wiesz? Planowanie emerytury wcześnie może zwiększyć Twoje środki o ponad 50%.",
      "Koncepcja emerytury to nowoczesny wynalazek, spopularyzowany pod koniec XIX wieku.",
      "Na całym świecie średni wiek emerytalny rośnie.",
      "Oszczędzanie niewielkich dodatkowych kwot każdego miesiąca robi ogromną różnicę z czasem.",
    ];
  };

  /**
   * Initializes the scrolling footer by fetching facts and building the HTML.
   */
  const initializeFooter = async () => {
    const track = document.querySelector(".scrolling-footer__track");
    if (!track) {
      console.error("Footer track element not found.");
      return;
    }

    try {
      const facts = await getFunFactsFromBackend();
      // Path to logo in public folder
      const logoIconPath = "/logo_nobg.png";

      // Create a document fragment to build the content efficiently
      const contentFragment = document.createDocumentFragment();

      facts.forEach((fact) => {
        // Create the text element
        const textElement = document.createElement("span");
        textElement.className = "scrolling-footer__text";
        textElement.textContent = fact;
        contentFragment.appendChild(textElement);

        // Create the logo image
        const logoElement = document.createElement("img");
        logoElement.src = logoIconPath;
        // CHANGED: Alt text and class name updated for the logo
        logoElement.alt = "ZUS Logo";
        logoElement.className = "scrolling-footer__logo";
        contentFragment.appendChild(logoElement);
      });

      // To create a seamless loop, we duplicate the content.
      const contentWrapper1 = document.createElement("div");
      contentWrapper1.className = "scrolling-footer__content";
      contentWrapper1.appendChild(contentFragment.cloneNode(true));

      const contentWrapper2 = document.createElement("div");
      contentWrapper2.className = "scrolling-footer__content";
      contentWrapper2.appendChild(contentFragment.cloneNode(true));

      // Append both copies to the track
      track.appendChild(contentWrapper1);
      track.appendChild(contentWrapper2);
    } catch (error) {
      console.error("Failed to initialize footer:", error);
      // Optionally, hide the footer if data fetching fails
      if (track.parentElement) {
        track.parentElement.style.display = "none";
      }
    }
  };

  initializeFooter();
});
