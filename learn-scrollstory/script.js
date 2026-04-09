document.addEventListener("DOMContentLoaded", () => {
  const steps = Array.from(document.querySelectorAll(".story-step"));
  const graphicTitleEl = document.querySelector("[data-graphic-title]");
  const graphicTextEl = document.querySelector("[data-graphic-text]");
  const dots = Array.from(
    document.querySelectorAll(".story-graphic__dot")
  );
  const backToTopButton = document.querySelector(".back-to-top");

  if (!steps.length || !graphicTitleEl || !graphicTextEl) {
    return;
  }

  function activateStep(stepElement) {
    const index = steps.indexOf(stepElement);

    steps.forEach((step) => step.classList.remove("story-step--active"));
    stepElement.classList.add("story-step--active");

    const title = stepElement.querySelector(".story-step__title");
    const body = stepElement.querySelector(".story-step__body");

    graphicTitleEl.textContent = title ? title.textContent : "";
    graphicTextEl.textContent = body ? body.textContent : "";

    dots.forEach((dot) =>
      dot.classList.remove("story-graphic__dot--active")
    );
    if (index >= 0 && index < dots.length) {
      dots[index].classList.add("story-graphic__dot--active");
    }
  }

  activateStep(steps[0]);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activateStep(entry.target);
        }
      });
    },
    {
      threshold: 0.6,
    }
  );

  steps.forEach((step) => observer.observe(step));

  if (backToTopButton) {
    window.addEventListener("scroll", () => {
      const showAfter = window.innerHeight * 0.85;
      const shouldShow = window.scrollY > showAfter;

      backToTopButton.classList.toggle(
        "back-to-top--visible",
        shouldShow
      );
    });

    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }
});

