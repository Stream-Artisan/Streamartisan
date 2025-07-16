function toggleMenu() {
  const overlay = document.getElementById("overlay");
  if (overlay.style.width === "100%") {
    overlay.style.width = "0";
  } else {
    overlay.style.width = "100%";
  }
}
window.addEventListener('scroll', () => {
  document.body.style.setProperty('--scroll', window.pageYOffset / (document.body.offsetHeight - window.innerHeight));
}, false);