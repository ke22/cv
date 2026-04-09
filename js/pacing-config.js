// js/pacing-config.js
// Central pacing config for cv-v2 scenes. Values start from current tuned behavior.

globalThis.PACING = {
  global: {
    scrubSmooth: 1
  },

  problem: {
    enabled: true,
    pin: true,
    heightVh: 200,
    textStagger: 0.18
  },

  cards: {
    pin: true,
    heightVh: 400,
    flipDuration: 2.5,
    holdPerCard: 1.5,
    finalHold: 4
  },

  outlook: {
    pin: true,
    endOffset: "+=320%",  // ScrollTrigger end, matches current tuning
    itemHold: 2           // delay between items before fade-out
  },

  solutionIntro: {
    pin: true,
    endOffset: "+=100%",
    finalHold: 1.5
  },

  strategy: {
    pin: true,
    endOffset: "+=260%",
    pauseRoot: 0.5,
    pausePaths: 0.5,
    pauseActions: 0.5
  },

  resources: {
    pin: true,
    pinEnd: "+=130%"
  }
};

