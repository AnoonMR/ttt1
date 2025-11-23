// Simple navigation to different pages

const btn2p = document.getElementById("btn-2p");
const btnAi = document.getElementById("btn-ai");

btn2p.addEventListener("click", () => {
  // open 2 player game page
  window.location.href = "two-player.html";
});

btnAi.addEventListener("click", () => {
  // open AI (Minimax) game page
  window.location.href = "ai-mode.html";
});
