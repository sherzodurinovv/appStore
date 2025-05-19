// Firebase Functions yoki statik fayl yo‘lini tanlash
const API_URL = "/data/apps.json"; // Functions uchun
// Agar statik fayl ishlatmoqchi bo‘lsangiz, quyidagini izohdan chiqaring va yuqoridagini izohga oling
// const API_URL = "/data/apps.json";

fetch(API_URL)
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP xatosi! Holat: ${response.status}`);
        }
        return response.json();
    })
    .then((apps) => {
        const appList = document.getElementById("app-list");
        if (!appList) {
            console.error("app-list elementi topilmadi!");
            return;
        }

        apps.forEach((app) => {
            const appCard = document.createElement("div");
            appCard.className = "app-card";
            appCard.innerHTML = `
        <img src="${app.icon}" alt="${app.name} ikonkasi" class="app-icon" loading="lazy">
        <h2>${app.name}</h2>
        <div class="screenshots">
          <button class="screenshot-nav prev" aria-label="Oldingi skrinshot">
            <i class="fas fa-chevron-left"></i>
          </button>
          ${app.screenshots
                    .map(
                        (shot) =>
                            `<img src="${shot}" alt="Skrinshot" class="screenshot" loading="lazy">`
                    )
                    .join("")}
          <button class="screenshot-nav next" aria-label="Keyingi skrinshot">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
        <a href="${app.apk}" target="_blank" class="download-btn">
          <i class="fas fa-download"></i> Yuklash
        </a>
      `;
            appList.appendChild(appCard);
        });

        // Slayder navigatsiyasi va avtomatik surish
        document.querySelectorAll(".screenshots").forEach((slider) => {
            const prevBtn = slider.querySelector(".prev");
            const nextBtn = slider.querySelector(".next");
            const scrollAmount = 172; // Skrinshot kengligi + bo‘shliq (160px + 12px)
            let autoScrollInterval;

            // Tugmalar orqali surish
            prevBtn.addEventListener("click", () => {
                slider.scrollBy({ left: -scrollAmount, behavior: "smooth" });
            });

            nextBtn.addEventListener("click", () => {
                slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
            });

            // Tugmalar holatini yangilash
            const updateButtons = () => {
                prevBtn.disabled = slider.scrollLeft <= 0;
                nextBtn.disabled =
                    slider.scrollLeft >= slider.scrollWidth - slider.clientWidth - 1;
                prevBtn.style.opacity = prevBtn.disabled ? "0.3" : "1";
                nextBtn.style.opacity = nextBtn.disabled ? "0.3" : "1";
            };

            // Avtomatik surish funksiyasi
            const startAutoScroll = () => {
                autoScrollInterval = setInterval(() => {
                    if (slider.scrollLeft < slider.scrollWidth - slider.clientWidth - 1) {
                        slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
                    } else {
                        slider.scrollTo({ left: 0, behavior: "smooth" }); // Oxirida boshiga qaytish
                    }
                }, 3000); // Har 3 sekundda surish
            };

            // Surishni to‘xtatish
            const stopAutoScroll = () => {
                clearInterval(autoScrollInterval);
            };

            // Hover’da to‘xtatish
            slider.addEventListener("mouseenter", stopAutoScroll);
            slider.addEventListener("mouseleave", startAutoScroll);

            // Mobil qurilmalarda touch uchun
            slider.addEventListener("touchstart", stopAutoScroll);
            slider.addEventListener("touchend", () =>
                setTimeout(startAutoScroll, 1000)
            );

            // Scroll hodisasi uchun tugmalar holatini yangilash
            slider.addEventListener("scroll", updateButtons);

            // Modal oyna uchun skrinshotlarni bosish
            slider.querySelectorAll(".screenshot").forEach((img) => {
                img.addEventListener("click", () => {
                    const modal = document.createElement("div");
                    modal.className = "modal";
                    modal.innerHTML = `<img src="${img.src}" alt="Katta skrinshot">`;
                    document.body.appendChild(modal);
                    // Modalni ko‘rsatish
                    setTimeout(() => modal.classList.add("show"), 10);
                    // Modalni yopish
                    modal.addEventListener("click", () => {
                        modal.classList.remove("show");
                        setTimeout(() => modal.remove(), 300); // Animatsiya tugaguncha kutish
                    });
                    // Avtomatik surishni to‘xtatish
                    stopAutoScroll();
                    modal.addEventListener("click", startAutoScroll, { once: true });
                });
            });

            // Dastlabki holatni yangilash va avtomatik surishni boshlash
            updateButtons();
            startAutoScroll();
        });
    })
    .catch((error) => {
        console.error("Ilovalar ma'lumotlarini olishda xato:", error);
    });

// Qidiruv funksiyasi
const searchInput = document.getElementById("search");
if (searchInput) {
    searchInput.addEventListener("input", (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const appCards = document.querySelectorAll(".app-card");
        appCards.forEach((card) => {
            const appName = card.querySelector("h2").textContent.toLowerCase();
            card.style.display = appName.includes(searchTerm) ? "block" : "none";
        });
    });
} else {
    console.error("search elementi topilmadi!");
}