const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, 'cv-gsap.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const scriptStart = '  <!-- Scrollytelling JavaScript - TRUE SCROLL SCRUB -->';
const scriptEnd = '  </script>\n\n  <!-- Version Indicator (for development)';

const gsapScript = `  <!-- GSAP + ScrollTrigger (replaces custom scroll engine) -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" crossorigin="anonymous"></script>
  <script>
    gsap.registerPlugin(ScrollTrigger);

    // Global progress bar
    gsap.to(".progress-bar__fill", {
      scaleX: 1,
      transformOrigin: "left center",
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });

    // Pin each scroll-container (same structure as cv.html)
    var pinContainers = [
      "intro", "cards", "problem", "future-outlook",
      "solution-text", "solution-matrix", "solution-resource-fit", "solution-opportunity",
      "growth", "strategy", "resources"
    ];
    pinContainers.forEach(function(name) {
      var sel = ".scroll-container--" + name;
      if (!document.querySelector(sel)) return;
      gsap.timeline({
        scrollTrigger: {
          trigger: sel,
          start: "top top",
          end: "bottom top",
          scrub: true,
          pin: true
        }
      });
    });

    // Nav active state (6 nav items: intro, cards, problem, solution, growth, contact)
    function setActiveNav(id) {
      document.querySelectorAll(".nav__dot-btn").forEach(function(btn) {
        btn.classList.toggle("active", btn.dataset.section === id);
      });
      document.querySelectorAll(".mobile-modal__link").forEach(function(link) {
        var href = link.getAttribute("href");
        var targetId = href && href.indexOf("#") === 0 ? href.slice(1) : null;
        link.classList.toggle("active", targetId === id);
      });
    }
    var navSections = [
      { id: "intro" }, { id: "cards" }, { id: "problem" }, { id: "solution" }, { id: "growth" }, { id: "contact" }
    ];
    navSections.forEach(function(s) {
      ScrollTrigger.create({
        trigger: "#" + s.id,
        start: "top center",
        end: "bottom center",
        onEnter: function() { setActiveNav(s.id); },
        onEnterBack: function() { setActiveNav(s.id); }
      });
    });
    ScrollTrigger.create({
      trigger: "#future-outlook",
      start: "top center",
      end: "bottom center",
      onEnter: function() { setActiveNav("problem"); },
      onEnterBack: function() { setActiveNav("problem"); }
    });
    ScrollTrigger.create({
      trigger: "#strategy",
      start: "top center",
      end: "bottom center",
      onEnter: function() { setActiveNav("growth"); },
      onEnterBack: function() { setActiveNav("growth"); }
    });
    ScrollTrigger.create({
      trigger: "#resources",
      start: "top center",
      end: "bottom center",
      onEnter: function() { setActiveNav("growth"); },
      onEnterBack: function() { setActiveNav("growth"); }
    });
  </script>
`;

const startIdx = html.indexOf(scriptStart);
const endIdx = html.indexOf(scriptEnd);
if (startIdx === -1 || endIdx === -1) {
  console.error('Could not find script boundaries');
  process.exit(1);
}
const before = html.slice(0, startIdx);
const after = html.slice(endIdx);
html = before + gsapScript + after;
fs.writeFileSync(htmlPath, html);
console.log('Replaced script block in cv-gsap.html');
