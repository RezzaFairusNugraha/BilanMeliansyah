document.addEventListener("DOMContentLoaded", () => {
  // ==================== ELEMENT UTAMA ==================== //
  const startScreen = document.getElementById("start-screen");
  const startText = document.getElementById("start-text");
  const profileBlock = document.getElementById("profile-block");
  const profileContainer = document.querySelector(".profile-container");
  const profileName = document.getElementById("profile-name");
  const profileBio = document.getElementById("profile-bio");
  const backgroundVideo = document.getElementById("background");
  const backgroundMusic = document.getElementById("background-music");
  const volumeIcon = document.getElementById("volume-icon");
  const volumeSlider = document.getElementById("volume-slider");
  const transparencySlider = document.getElementById("transparency-slider");

  // ==================== CUSTOM CURSOR ==================== //
  const customCursor = document.createElement("img");
  customCursor.src = "assets/custom_cursor.png"; // pastikan path benar
  customCursor.id = "custom-cursor";
  customCursor.style.position = "fixed";
  customCursor.style.width = "32px"; // sesuaikan ukuran
  customCursor.style.height = "32px"; // sesuaikan ukuran
  customCursor.style.pointerEvents = "none";
  customCursor.style.zIndex = "9999";
  customCursor.style.transition =
    "transform 0.05s linear, left 0.05s, top 0.05s";
  document.body.appendChild(customCursor);

  document.addEventListener("mousemove", (e) => {
    const offsetX = customCursor.width / 2;
    const offsetY = customCursor.height / 2;
    customCursor.style.left = e.clientX - offsetX + "px";
    customCursor.style.top = e.clientY - offsetY + "px";
  });

  document.addEventListener("mousedown", () => {
    customCursor.style.transform = "scale(0.8)";
  });
  document.addEventListener("mouseup", () => {
    customCursor.style.transform = "scale(1)";
  });

  // ==================== GENERIC LOOPING TYPEWRITER ==================== //
  // options: element, text, typeSpeed(ms), eraseSpeed(ms), pauseAfterType(ms), pauseAfterErase(ms)
  function loopTypewriter(element, text, opts = {}) {
    const {
      typeSpeed = 90,
      eraseSpeed = 40,
      pauseAfterType = 1500,
      pauseAfterErase = 400,
      cursorChar = "|",
      cursorBlink = true,
      cursorBlinkInterval = 500,
    } = opts;

    let i = 0;
    let phase = "typing"; // typing | pausingAfterType | erasing | pausingAfterErase
    let cursorVisible = true;
    let mainTimer = null;
    let blinkTimer = null;

    // render helper (keep rawText so we can slice easily)
    function render() {
      element.textContent = text.substring(
        0,
        Math.max(0, Math.min(i, text.length))
      );
      if (cursorBlink && cursorVisible) element.textContent += cursorChar;
    }

    function startBlink() {
      if (blinkTimer) clearInterval(blinkTimer);
      blinkTimer = setInterval(() => {
        cursorVisible = !cursorVisible;
        render();
      }, cursorBlinkInterval);
    }

    function stopBlink() {
      if (blinkTimer) {
        clearInterval(blinkTimer);
        blinkTimer = null;
      }
      cursorVisible = true;
    }

    function doTypingStep() {
      if (i < text.length) {
        i++;
        render();
        mainTimer = setTimeout(doTypingStep, typeSpeed);
      } else {
        // finished typing
        phase = "pausingAfterType";
        mainTimer = setTimeout(() => {
          phase = "erasing";
          doErasingStep();
        }, pauseAfterType);
      }
    }

    function doErasingStep() {
      if (i > 0) {
        i--;
        render();
        mainTimer = setTimeout(doErasingStep, eraseSpeed);
      } else {
        // finished erasing
        phase = "pausingAfterErase";
        mainTimer = setTimeout(() => {
          phase = "typing";
          doTypingStep();
        }, pauseAfterErase);
      }
    }

    // public start
    function start() {
      // reset state
      i = 0;
      phase = "typing";
      cursorVisible = true;
      render();
      startBlink();
      // start typing after a tiny delay so cursor shows
      mainTimer = setTimeout(doTypingStep, typeSpeed);
    }

    function stop() {
      if (mainTimer) clearTimeout(mainTimer);
      if (blinkTimer) clearInterval(blinkTimer);
      mainTimer = null;
      blinkTimer = null;
    }

    start();
    return { stop };
  }

  // ==================== START SCREEN TYPEWRITER (looping) ==================== //
  const startMessage = "Click here to see the motion baby";
  // use a looped typewriter on the start text until user clicks start
  const startType = loopTypewriter(startText, startMessage, {
    typeSpeed: 90,
    eraseSpeed: 40,
    pauseAfterType: 1200,
    pauseAfterErase: 600,
    cursorChar: "|",
    cursorBlinkInterval: 500,
  });

  // ==================== KETIKA DIKLIK START SCREEN ==================== //
  startScreen.addEventListener("click", () => {
    // stop the start-screen typewriter loop (optional)
    if (startType && typeof startType.stop === "function") startType.stop();

    // animasi hilang blur (pastikan gsap ada)
    if (window.gsap) {
      gsap.to(startScreen, {
        opacity: 0,
        backdropFilter: "blur(0px)",
        duration: 1,
        ease: "power2.out",
        onComplete: () => startScreen.classList.add("hidden"),
      });
    } else {
      startScreen.style.opacity = "0";
      startScreen.classList.add("hidden");
    }

    // mulai video
    if (backgroundVideo) {
      backgroundVideo.muted = false;
      backgroundVideo
        .play()
        .catch((err) => console.error("Video gagal diputar:", err));
    }

    // mulai musik
    if (backgroundMusic) {
      backgroundMusic.volume = 0.4;
      backgroundMusic.muted = false;
      backgroundMusic
        .play()
        .catch((err) => console.error("Musik gagal diputar:", err));
    }

    // tampilkan profil
    if (profileBlock) profileBlock.classList.remove("hidden");
    if (window.gsap && profileBlock && profileContainer) {
      gsap.fromTo(
        profileBlock,
        { opacity: 0, y: -50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          onComplete: () => profileContainer.classList.add("orbit"),
        }
      );
    } else if (profileBlock) {
      profileBlock.style.opacity = "1";
      profileContainer && profileContainer.classList.add("orbit");
    }

    // mulai typewriter looping untuk nama & bio
    // If there are previous instances, stop them before creating new ones
    if (
      window._nameTypeInstance &&
      typeof window._nameTypeInstance.stop === "function"
    ) {
      window._nameTypeInstance.stop();
    }
    if (
      window._bioTypeInstance &&
      typeof window._bioTypeInstance.stop === "function"
    ) {
      window._bioTypeInstance.stop();
    }

    window._nameTypeInstance = loopTypewriter(profileName, "BILAN MELIANSYAH", {
      typeSpeed: 140,
      eraseSpeed: 50,
      pauseAfterType: 1800,
      pauseAfterErase: 800,
      cursorChar: "|",
      cursorBlinkInterval: 500,
    });

    window._bioTypeInstance = loopTypewriter(
      profileBio,
      "Hello I am the owner of FireShot",
      {
        typeSpeed: 120,
        eraseSpeed: 45,
        pauseAfterType: 1600,
        pauseAfterErase: 700,
        cursorChar: "|",
        cursorBlinkInterval: 500,
      }
    );
  });

  // ==================== VOLUME CONTROL ==================== //
  let isMuted = false;
  if (volumeIcon) {
    volumeIcon.addEventListener("click", () => {
      isMuted = !isMuted;
      if (backgroundMusic) backgroundMusic.muted = isMuted;
      // update simple icon; if your icon is inline SVG, ensure you replace correctly
      volumeIcon.innerHTML = isMuted
        ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>`
        : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
    });
  }

  if (volumeSlider) {
    volumeSlider.addEventListener("input", () => {
      if (backgroundMusic) backgroundMusic.volume = volumeSlider.value;
      if (
        backgroundMusic &&
        backgroundMusic.muted &&
        backgroundMusic.volume > 0
      ) {
        backgroundMusic.muted = false;
        isMuted = false;
      }
    });
  }

  // ==================== TRANSPARANSI BLUR ==================== //
  if (transparencySlider) {
    transparencySlider.addEventListener("input", () => {
      const opacity = transparencySlider.value;
      if (opacity == 0) {
        profileBlock.style.background = "rgba(0, 0, 0, 0)";
        profileBlock.style.backdropFilter = "none";
        profileBlock.style.border = "1px solid transparent";
      } else {
        profileBlock.style.background = `rgba(0, 0, 0, ${opacity})`;
        profileBlock.style.backdropFilter = `blur(${10 * opacity}px)`;
        profileBlock.style.border = `1px solid rgba(255, 255, 255, ${
          opacity * 0.2
        })`;
      }
    });
  }
});
