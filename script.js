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
  // ==================== CUSTOM CURSOR ==================== //
  const customCursor = document.createElement("img");
  customCursor.src = "assets/custom_cursor.png"; // pastikan path benar
  customCursor.id = "custom-cursor";
  customCursor.style.position = "fixed";
  customCursor.style.width = "32px"; // sesuaikan ukuran
  customCursor.style.height = "32px"; // sesuaikan ukuran
  customCursor.style.pointerEvents = "none";
  customCursor.style.zIndex = "9999";
  // hilangkan translate agar tepat di pointer
  customCursor.style.transition =
    "transform 0.05s linear, left 0.05s, top 0.05s";
  document.body.appendChild(customCursor);

  // ikuti pointer mouse secara tepat
  document.addEventListener("mousemove", (e) => {
    // offset setengah ukuran agar ujung gambar sesuai pointer
    const offsetX = customCursor.width / 2;
    const offsetY = customCursor.height / 2;
    customCursor.style.left = e.clientX - offsetX + "px";
    customCursor.style.top = e.clientY - offsetY + "px";
  });

  // untuk klik efek, misal shrink saat klik
  document.addEventListener("mousedown", () => {
    customCursor.style.transform = "scale(0.8)";
  });
  document.addEventListener("mouseup", () => {
    customCursor.style.transform = "scale(1)";
  });

  // ==================== TYPEWRITER START SCREEN ==================== //
  const startMessage = "Click here to see the motion baby";
  let startIndex = 0;
  let showCursor = true;

  function typeWriterStart() {
    if (startIndex <= startMessage.length) {
      startText.textContent =
        startMessage.substring(0, startIndex) + (showCursor ? "|" : "");
      startIndex++;
      setTimeout(typeWriterStart, 90);
    }
  }

  setInterval(() => {
    showCursor = !showCursor;
    startText.textContent =
      startMessage.substring(0, startIndex) + (showCursor ? "|" : "");
  }, 500);

  typeWriterStart();

  // ==================== KETIKA DIKLIK START SCREEN ==================== //
  startScreen.addEventListener("click", () => {
    // animasi hilang blur
    gsap.to(startScreen, {
      opacity: 0,
      backdropFilter: "blur(0px)",
      duration: 1,
      ease: "power2.out",
      onComplete: () => startScreen.classList.add("hidden"),
    });

    // mulai video
    backgroundVideo.muted = false;
    backgroundVideo
      .play()
      .catch((err) => console.error("Video gagal diputar:", err));

    // mulai musik
    backgroundMusic.volume = 0.4;
    backgroundMusic.muted = false;
    backgroundMusic
      .play()
      .catch((err) => console.error("Musik gagal diputar:", err));

    // tampilkan profil
    profileBlock.classList.remove("hidden");
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

    // mulai ketik nama & bio
    typeWriterName();
    typeWriterBio();
  });

  // ==================== TYPEWRITER NAMA ==================== //
  const name = "BILAN MELIANSYAH";
  let nameIndex = 0;
  let showNameCursor = true;

  function typeWriterName() {
    if (nameIndex <= name.length) {
      profileName.textContent =
        name.substring(0, nameIndex) + (showNameCursor ? "|" : "");
      nameIndex++;
      setTimeout(typeWriterName, 150);
    }
  }

  setInterval(() => {
    showNameCursor = !showNameCursor;
    profileName.textContent =
      name.substring(0, nameIndex) + (showNameCursor ? "|" : "");
  }, 500);

  // ==================== TYPEWRITER BIO ==================== //
  const bioTextFull = "Hello I am the owner of FireShot";
  let bioIndex = 0;
  let showBioCursor = true;

  function typeWriterBio() {
    if (bioIndex <= bioTextFull.length) {
      profileBio.textContent =
        bioTextFull.substring(0, bioIndex) + (showBioCursor ? "|" : "");
      bioIndex++;
      setTimeout(typeWriterBio, 120);
    }
  }

  setInterval(() => {
    showBioCursor = !showBioCursor;
    profileBio.textContent =
      bioTextFull.substring(0, bioIndex) + (showBioCursor ? "|" : "");
  }, 500);

  // ==================== VOLUME CONTROL ==================== //
  let isMuted = false;
  volumeIcon.addEventListener("click", () => {
    isMuted = !isMuted;
    backgroundMusic.muted = isMuted;
    volumeIcon.innerHTML = isMuted
      ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"></path>`
      : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>`;
  });

  volumeSlider.addEventListener("input", () => {
    backgroundMusic.volume = volumeSlider.value;
    if (backgroundMusic.muted && backgroundMusic.volume > 0) {
      backgroundMusic.muted = false;
      isMuted = false;
    }
  });

  // ==================== TRANSPARANSI BLUR ==================== //
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
});
