function toggleMenu() {
  const overlay = document.getElementById("overlay");
  if (overlay.style.width === "100%") {
    overlay.style.width = "0";
  } else {
    overlay.style.width = "100%";
  }
}
