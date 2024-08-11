const calendar = document.getElementById("calendar");
const filledDiv = document.querySelector(".filled");
let isResizing = false;
let resizeDirection = null;
let initialY = 0;
let initialHeight = filledDiv.clientHeight;
let initialTop = filledDiv.offsetTop;

filledDiv.addEventListener("pointerdown", (e) => {
  const rect = filledDiv.getBoundingClientRect();

  isResizing = true;
  initialY = e.clientY;
  initialHeight = filledDiv.clientHeight;
  initialTop = filledDiv.offsetTop;

  // Determine the resize direction based on where the user clicked
  if (e.clientY >= rect.top - 10 && e.clientY <= rect.top + 10) {
    resizeDirection = "top";
  } else if (e.clientY >= rect.bottom - 10 && e.clientY <= rect.bottom + 10) {
    resizeDirection = "bottom";
  }

  e.preventDefault();
});

calendar.addEventListener("pointermove", (e) => {
  if (isResizing) {
    const dy = e.clientY - initialY;
    const hourHeight = dy < 0 ? -61 : 61; // Height of each hour div

    if (resizeDirection === "top") {
      const newHeight = initialHeight - hourHeight;
      const newTop = initialTop + hourHeight;

      if (newTop >= 0 && newHeight >= hourHeight) {
        filledDiv.style.height = newHeight + "px";
        filledDiv.style.top = newTop + "px";
      }
    } else if (resizeDirection === "bottom") {
      const newHeight = initialHeight + hourHeight;
      if (newHeight >= hourHeight) {
        filledDiv.style.height = newHeight + "px";
      }
    }
  }
});

calendar.addEventListener("pointerup", () => {
  if (isResizing) {
    isResizing = false;
    resizeDirection = null;

    // Update data-hour to match the new start time
    const hourHeight = 60;

    const topHour = Math.round(filledDiv.offsetTop / hourHeight);
    const bottomHour = Math.round(
      (filledDiv.offsetTop + filledDiv.offsetHeight) / hourHeight
    );

    filledDiv.textContent = `${topHour} AM - ${bottomHour} AM`;
  }
});


