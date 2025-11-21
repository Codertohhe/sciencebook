window.addEventListener("DOMContentLoaded", function (e) {
  const questionsList = document.getElementById("questions-list");
  let qHTML = "";
  questions.map((q, i) => {
    //qHTML += `<li class="list-[lower-alpha]">
    qHTML += `<li class="list-decimal">
					<div class="flex flex-col gap-2 text-lg">
					<h3>${q}</h3>
					<textarea
					name=""
					id=""
					class="p-2 w-full rounded-md border-2 border border-black resize-none answer" placeholder="Write answer here..." rows="4"></textarea>
					</div>
					</li>`;
    questionsList.innerHTML = qHTML;
  });

  try {
    document.getElementById("audio-intro").play();
  } catch (err) {
    console.error(err.message);
  }

  function autoResize(textarea) {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }

  // Store original heights
  const originalHeights = new Map();

  window.addEventListener("beforeprint", function () {
    document.querySelectorAll("textarea").forEach((textarea) => {
      // Store original height
      originalHeights.set(textarea, textarea.style.height);
      // Apply auto-resize for printing
      autoResize(textarea);
    });
  });

  // Optional: Reset heights after printing
  window.addEventListener("afterprint", function () {
    originalHeights.forEach((originalHeight, textarea) => {
      textarea.style.height = originalHeight;
    });
    originalHeights.clear();
  });
});
