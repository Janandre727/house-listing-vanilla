console.log("JS started");
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const addBtn = document.getElementById("addModal");
const modal = document.getElementById("modal");

function initSliders(root = document) {
  const sliders =root.querySelectorAll("[data-slider]");
   console.log("initSliders() found:", sliders.length);

  sliders.forEach((card) => {
    if (card.dataset.ready === "true") return;
    card.dataset.ready = "true";

    const track = card.querySelector(".track");
    const slides = card.querySelectorAll(".slide");
    const prev = card.querySelector(".prev");
    const next = card.querySelector(".next");
    const dotsWrap = card.querySelector(".dots");
    const media = card.querySelector(".media");

    console.log("slider parts:", {track, slides: slides.length, prev, next, dotsWrap, media });

    if (!track || !prev || !next || !dotsWrap || !media || slides.length === 0 ) {
      console.warn("Missing slider parts, skipping initialization.");
    return;
   }

    let index = 0;
  
    const dots =[];
    dotsWrap.innerHTML = "";
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
            dot.type = "button";
            dot.addEventListener("click", () => go(i));
            dotsWrap.appendChild(dot);
            dots.push(dot);
    });

    function updateDots() {
      dots.forEach((d, i) => 
        d.classList.toggle("active", i === index));
    }

    function go(i) {
      index = (i +slides.length)% slides.length;
      const w = media.clientWidth;
      console.log("go()", {i, index, w});
      track.style.transform = `translateX(-${index * w}px)`;
      updateDots();
    }

    prev.addEventListener("click", () => { 
      console.log("prev click");
      go(index - 1);
    });

    next.addEventListener("click", () => {
      console.log("next click");
      go(index + 1);
    });

    if (slides.length <= 1) {
      prev.style.display = "none";
      next.style.display = "none";
      dotsWrap.style.display = "none";
    }

    window.addEventListener("resize", () => go(index));
    go(0);

  });
}

 document.addEventListener("DOMContentLoaded", () => {
  initSliders();
 });
openBtn.addEventListener("click", ()=> {
    modal.classList.add("open");
});

closeBtn.addEventListener("click", () => {
    modal.classList.remove("open");
});

addBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const dealname = document.getElementById("myDeals").value.trim();
  const loc      = document.getElementById("myLocation").value.trim();
  const priceVal = document.getElementById("myPrice").value.trim();
  const beds     = document.getElementById("myBeds").value.trim();
  const baths    = document.getElementById("myBaths").value.trim();
  const sqm      = document.getElementById("mySqm").value.trim();

  const grid = document.getElementById("cards");

  if (!dealname || !loc) return;

  const images = ["img/House 1.webp", "img/House 1.2.webp", "img/House 1.3.webp"];

  const card = document.createElement("article");
  card.className = "card";
  card.setAttribute("data-slider", "");

  card.innerHTML = `
    <div class="media">
      <div class="track">
        ${images.map(src => `
          <div class="slide"><img src="${src}" alt="house"></div>
        `).join("")}
      </div>

      <div class="options">
        <button class="menu-btn" aria-label="More options">⋯</button>
        <div class="menu">
          <a href="#">Edit</a>
          <a href="#" class="delete">Delete</a>
          <a href="#">Share</a>
        </div>
      </div>

      <button class="nav prev" type="button" aria-label="Previous image">
        <span class="button__icon">
          <ion-icon name="arrow-back-outline"></ion-icon>
        </span>
      </button>

      <button class="nav next" type="button" aria-label="Next image">
        <span class="button__icon">
          <ion-icon name="arrow-forward-outline"></ion-icon>
        </span>
      </button>

      <div class="dots" aria-hidden="true"></div>
    </div>

    <div class="body">
      <div class="info">
        <h3>${dealname}</h3>
        <p class="location">${loc}
          <ion-icon name="location-outline"></ion-icon>
        </p>
        <p class="price">₱${Number(priceVal || 0).toLocaleString()}</p>
      </div>

      <div class="traits">
        <div class="beds">
          <p class="beds"><ion-icon name="bed-outline"></ion-icon><br/>${beds || 0} beds</p>
        </div>

        <div class="baths">
          <p class="bathrooms"><ion-icon name="water-outline"></ion-icon><br/>${baths || 0} baths</p>
        </div>

        <div class="squaremeters">
          <p class="meta">${sqm || 0} <br/> sqm</p>
        </div>
      </div>
    </div>
  `;

  grid.appendChild(card);
       initSliders(card);

  // close modal + clear form
  modal.classList.remove("open");
  ["myDeals","myLocation","myPrice","myBeds","myBaths","mySqm"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
});
