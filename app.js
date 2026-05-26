
console.log("APP JS LOADED")
let listings = [
    {
        dealname: "modern apartment",
        loc: "Example Location",
        priceVal: 500000,
        beds: 3,
        baths: 2,
        sqm: 200,
        images: ["img/House 1.webp", "img/House 1.2.webp" , "img/House 1.3.webp"]
    },
    {
        dealname: "beach villa",
        loc: "Beach Location",
        priceVal: 1000000,
        beds: 4,
        baths: 3,
        sqm: 300,
        images: ["img/house 2.webp", "img/house 2.1.webp" , "img/house 2.2.webp"]
    }
]

let editingIndex = null

// DOM Elements
const openBtn = document.getElementById("openModal");
const closeBtn = document.getElementById("closeModal");
const closeBtn2 = document.getElementById("closeModal2");
const addBtn = document.getElementById("addModal");
const modal = document.getElementById("modal");
const viewer = document.getElementById("viewer");
console.log("viewer", viewer);
const closeImageViewerBtn = document.getElementById("closeImageViewer");
console.log("closeImageViewerBtn", closeImageViewerBtn);
const viewerImage = document.getElementById("viewerImage");
console.log("viewerImage", viewerImage);
//----------//
  
function buildCardHTML({ dealname, loc, priceVal, beds, baths, sqm }, images) {
  const safeImages =
    images && images.length
      ? images
      : ["img/House 1.webp", "img/House 1.2.webp", "img/House 1.3.webp"];

  return `
    <div class="media">
      <div class="track">
        ${safeImages
          .map((src) => `<div class="slide"><img src="${src}" alt="house"></div>`)
          .join("")}
      </div>

      <div class="options">
        <button class="menu-btn" aria-label="More options" type="button">⋯</button>
        <div class="menu">
          <a href="#" class="edit">Edit</a>
          <a href="#" class="delete">Delete</a>
          <a href="#" class="share">Share</a>
        </div>
      </div>

      <button class="nav prev" type="button" aria-label="Previous image">
        <span class="button__icon"><ion-icon name="arrow-back-outline"></ion-icon></span>
      </button>

      <button class="nav next" type="button" aria-label="Next image">
        <span class="button__icon"><ion-icon name="arrow-forward-outline"></ion-icon></span>
      </button>

      <div class="dots" aria-hidden="true"></div>
    </div>

    <div class="body">
      <div class="info">
        <h3>${dealname}</h3>
        <p class="location">${loc} <ion-icon name="location-outline"></ion-icon></p>
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
          <p class="meta">${sqm || 0}<br/>sqm</p>
        </div>
      </div>
    </div>
  `;
}
//---Save to localStorage----//
const savedListings = localStorage.getItem("listings");
if (savedListings) {listings = JSON.parse(savedListings);}

function renderListings() {
    console.log("renderinglisting running");
    const grid = document.getElementById("cards");
    console.log("GRID", grid);

    grid.innerHTML = "";
    console.log("renderlisting running")

    listings.forEach((listing, index) => {
        const card = document.createElement("article");
        card.className = "card";
        card.dataset.index = index
        card.innerHTML = buildCardHTML(listing, listing.images);

         grid.appendChild(card);

    });

}
//---------------//

//--------Delete----///
document.addEventListener("click", (event) => {
    const deleteBtn = event.target.closest(".delete");
    if (!deleteBtn) return;

    const card = deleteBtn.closest(".card");
    if (!card) return;

    const index = card.dataset.index;

    listings.splice(index, 1);
    saveListings();
    renderListings();
})
//-----------------//

//----edit----//
document.addEventListener("click", (event) => {
  const editBtn = event.target.closest(".edit");
  if (!editBtn) return;

  event.preventDefault();

  const card = editBtn.closest(".card");
  if (!card) return;

  const index = card.dataset.index;

  editingIndex = index;
  const listing = listings[editingIndex];

  selectedImageUrls = [...(listing.images || [])];
  renderPhotoPreview();

  openModal();

  console.log("myDeals in edit:", document.getElementById("myDeals"));
  document.getElementById("myDeals").value = listing.dealname;
  document.getElementById("myLocation").value = listing.loc;
  document.getElementById("myPrice").value = listing.priceVal;
  document.getElementById("myBeds").value = listing.beds;
  document.getElementById("myBaths").value = listing.baths;
  document.getElementById("mySqm").value = listing.sqm;

  addBtn.textContent = "Save Changes";
  

  console.log("editing listing:", listing);
});
//-----------------//


function openModal(){
   modal?.classList.add("open")
}

function closeModal() {
  modal?.classList.remove("open");
  editingIndex = null;
  addBtn.textContent = "Add Listing";
  clearForm();
  clearPhotoPreview();
}

openBtn?.addEventListener("click", () => {
  editingIndex = null;
  addBtn.textContent = "Add Listing";
  openModal();
});
closeBtn?.addEventListener("click", closeModal);
closeBtn2?.addEventListener("click", closeModal);

let selectedImageUrls = [];
const photoBtn = document.querySelector(".addPhoto");
const photoInput = document.getElementById("photoInput");
const photoPreview = document.getElementById("photoPreview");

// Photo Button Functionality
photoBtn?.addEventListener("click", () => {
  photoInput.click();
});

photoInput?.addEventListener("change", (event) => {
  selectedImageUrls = [];
  const files = Array.from(photoInput.files);
   files.forEach((file) => {
    const url = URL.createObjectURL(file);
    selectedImageUrls.push(url);
  });
  renderPhotoPreview();
  console.log(selectedImageUrls);
});


addBtn?.addEventListener("click", () => {
  console.log("Add button clicked");
  const dealname = document.getElementById("myDeals").value;
  const loc = document.getElementById("myLocation").value;
  const priceVal = document.getElementById("myPrice").value;
  const beds = document.getElementById("myBeds").value;
  const baths = document.getElementById("myBaths").value;
  const sqm = document.getElementById("mySqm").value;

  const newListing = { 
    dealname,
    loc, 
    priceVal,
    beds,
    baths,
    sqm,
    images: selectedImageUrls
  };

  if (editingIndex !== null) {
  listings[editingIndex] = newListing;
  } else {
  listings.push(newListing);
  }
  saveListings();
  renderListings();
  closeModal();
  clearForm();
  editingIndex = null;
  addBtn.textContent = "Add Listing";
});

function clearForm() {
  document.getElementById("myDeals").value = "";
  document.getElementById("myLocation").value = "";
  document.getElementById("myPrice").value = "";
  document.getElementById("myBeds").value = "";
  document.getElementById("myBaths").value = "";
  document.getElementById("mySqm").value = "";
  console.log("Form cleared.");
  console.log("after clear:", document.getElementById("myDeals").value);
}

function clearPhotoPreview() {
  photoPreview.innerHTML = "";
}

function renderPhotoPreview() {
  photoPreview.innerHTML = "";
  selectedImageUrls.forEach((url) => {
  const img = document.createElement("img");
  img.src = url;
  img.alt = "Selected Photo";
  img.addEventListener("click", () => {
    viewerImage.src = url;
    viewer.classList.add("open");
    console.log("Image clicked for preview:", url);
    console.log("Viewer element:", viewer);
    console.log("Viewer image element:", viewerImage);
  });
  photoPreview.appendChild(img);
  });

}

closeImageViewer?.addEventListener("click", () => {
  viewer.classList.remove("open");
  viewerImage.src = "";
});

function saveListings()
{localStorage.setItem("listings", JSON.stringify(listings))}

renderListings();