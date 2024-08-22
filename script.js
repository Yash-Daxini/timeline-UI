const calendar = document.getElementById("calendar");
const filledDiv = document.querySelector(".filled");
let isResizing = false;
let resizeDirection = null;
let initialY = 0;
let initialHeight = filledDiv.clientHeight;
let initialTop = filledDiv.offsetTop;
let isDragging = false;
let duration = 0;

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
  } else {
    // Otherwise, initiate dragging
    isDragging = true;
    isResizing = false;
    offsetTop = e.clientY - rect.top;
    duration = Math.round(filledDiv.clientHeight / 60);
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
  } else if (isDragging) {
    const newTop = e.clientY - offsetTop;

    if (
      newTop >= 0 &&
      newTop + filledDiv.clientHeight <= calendar.clientHeight
    ) {
      filledDiv.style.top = newTop + "px";
    }
  }
});

calendar.addEventListener("pointerup", () => {
  const hourHeight = 60;
  if (isResizing) {
    isResizing = false;
    resizeDirection = null;

    // Update data-hour to match the new start time

    const topHour = Math.round(filledDiv.offsetTop / hourHeight);
    const bottomHour = Math.round(
      (filledDiv.offsetTop + filledDiv.offsetHeight) / hourHeight
    );

    filledDiv.textContent = `${topHour} AM - ${bottomHour} AM`;
  }

  if (isDragging) {
    isDragging = false;

    // Snap the filledDiv to the nearest valid time slot
    const newTop = Math.round(filledDiv.offsetTop / 60);
    const snappedTop = Math.round(newTop / duration) * duration;

    if (snappedTop >= 0 && snappedTop + duration <= calendar.children.length) {
      filledDiv.style.top = snappedTop * 60 + "px";
      const topHour = Math.round(filledDiv.offsetTop / hourHeight);
      const bottomHour = Math.round(
        (filledDiv.offsetTop + filledDiv.offsetHeight) / hourHeight
      );

      filledDiv.textContent = `${topHour} AM - ${bottomHour} AM`;
    } else {
      // Reset to the original position if invalid drop
      filledDiv.style.top = initialTop + "px";
    }
  }
});