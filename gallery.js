/* gallery script */ 
let _body = document.querySelector('body'),
  galleryImg = document.querySelectorAll('.gallery img'),
  modalWindow = document.getElementById('modal-gall'),
  modalImg = document.getElementById('modal-slides'),
  showTxt = document.getElementById('alt-text'),
  closeModal = document.getElementById('closem'),
  nextBtn = document.getElementById('nextm'),
  prevBtn = document.getElementById('prevm'),
  closeTxt = document.getElementById('alt-text'),
  viewport = window.visualViewport, 
  curSlide;
    
  document.querySelector('.gallery').addEventListener('click', function(event) {
  if (event.target.tagName === 'IMG') {
  curSlide = Number(event.target.dataset.image);
  modalImg.src = event.target.src;
  showTxt.innerHTML = event.target.alt;
  _body.classList.add('modal-open');
  }
	});

	prevBtn.addEventListener('click', function() {
  curSlide = curSlide === galleryImg.length ? 1 : curSlide + 1;
  updateModalContent();
	});
  
  nextBtn.addEventListener('click', function() {
  curSlide = curSlide === 1 ? galleryImg.length : curSlide - 1;
  updateModalContent();
	});

	function updateModalContent() {
  modalImg.src = document.querySelector(`.gallery img[data-image="${curSlide}"]`).src;
  const altText = document.querySelector(`.gallery img[data-image="${curSlide}"]`).alt;
  showTxt.innerHTML = altText; // Koristimo innerHTML kako bi se <br> interpretirao kao novi red
  document.getElementById("alt-text").style.display = "block";
	}

	// Dugme za zatvaranje ALT teksta
	closeTxt.addEventListener('click', function() {
  document.getElementById("alt-text").style.display = "none"; 
	});

  // Funkcija za čuvanje svih učitanih slika u sessionStorage
	function cacheImages() {
  const images = document.querySelectorAll("img");
  const imageCache = {};

	  images.forEach(img => {
    if (img.src.startsWith("http") || img.src.startsWith("data")) {
    imageCache[img.src] = img.src; // Čuvamo URL slike
    }
	  });

  	sessionStorage.setItem("cachedImages", JSON.stringify(imageCache));
		}

	// Funkcija za ponovo postavljanje slika nakon reload-a
	function restoreImages() {
  const cachedImages = JSON.parse(sessionStorage.getItem("cachedImages"));
  if (!cachedImages) return;

  const images = document.querySelectorAll("img");
  images.forEach(img => {
  if (cachedImages[img.src]) {
  img.src = cachedImages[img.src]; // Vraćamo keširanu verziju slike
  }
  });

  sessionStorage.removeItem("cachedImages"); // Brišemo keš nakon ponovnog učitavanja
	}

// Funkcija za detekciju da li je uređaj mobilni
function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

// Dodavanje event listener-a na dugme CLOSE
closeModal.addEventListener("click", function (e) {
  e.preventDefault();
  _body.classList.remove("modal-open");
  document.getElementById("alt-text").style.display = "block";

  if (isMobileDevice()) {
    // Ako je na mobilnom - izvrši HARD RELOAD bez ponovnog učitavanja slika
    cacheImages(); // Sačuvaj slike pre reload-a
    sessionStorage.setItem("scrollPosition", window.scrollY); // Sačuvaj skrol poziciju

    // HARD RELOAD - resetuje keš ali ne učitava slike ponovo
    window.location.href = window.location.pathname + "?reload=" + new Date().getTime();
  } else {
    // Ako je na desktopu - samo zatvori modal bez osvežavanja stranice
    console.log("Modal zatvoren bez reload-a (desktop)");
  }
});


	// Kada se stranica ponovo učita, vrati slike i scroll poziciju
	window.addEventListener("load", function () {
  restoreImages(); // Vraćamo slike iz keša

  let savedScrollPosition = sessionStorage.getItem("scrollPosition");
  if (savedScrollPosition !== null) {
  window.scrollTo(0, savedScrollPosition);
  sessionStorage.removeItem("scrollPosition"); // Brišemo zapis da ne bi stalno vraćao
  }
	});
  
    function adjustCloseButton() { // Ovo je kod da CLOSE dugme ostane na istom položaju prilikom zumiranja na mobilnom 
   // Dugme ostaje u desnom gornjem uglu ekrana 
  closeModal.style.top = `${viewport.offsetTop - 80}px`;                        // 80 je polovina visine slike   
  closeModal.style.left = `${viewport.width + viewport.offsetLeft - 80}px`;
  // Održava istu veličinu pri zumiranju
  closeModal.style.transform = `scale(${1 / viewport.scale})`;
	}
	// Praćenje promena ekrana i zumiranja
	window.visualViewport.addEventListener("resize", adjustCloseButton);
	window.visualViewport.addEventListener("scroll", adjustCloseButton);
	adjustCloseButton(); // Poziv odmah na učitavanju
  
  
  function adjustPrevButton() { // Ovo je kod da Prev dugme ostane na istom položaju prilikom zumiranja na mobilnom 	      
	prevBtn.style.top = `${(viewport.offsetTop - 80) + (viewport.height / 2)}px`;   // 80 je polovina visine slike
	prevBtn.style.left = `${viewport.offsetLeft - 80}px`;
  // Održava istu veličinu pri zumiranju
  prevBtn.style.transform = `scale(${1 / viewport.scale})`;
	}
	// Praćenje promena ekrana i zumiranja
	window.visualViewport.addEventListener("resize", adjustPrevButton);
	window.visualViewport.addEventListener("scroll", adjustPrevButton);
	adjustPrevButton(); // Poziv odmah na učitavanju
  
  
  function adjustNextButton() { // Ovo je kod da Next dugme ostane na istom položaju prilikom zumiranja na mobilnom 	      
	nextBtn.style.top = `${(viewport.offsetTop - 80) + (viewport.height / 2)}px`;   // 80 je polovina visine slike
	nextBtn.style.left = `${viewport.width + viewport.offsetLeft - 80}px`;
  // Održava istu veličinu pri zumiranju
  nextBtn.style.transform = `scale(${1 / viewport.scale})`;
	}
	// Praćenje promena ekrana i zumiranja
	window.visualViewport.addEventListener("resize", adjustNextButton);
	window.visualViewport.addEventListener("scroll", adjustNextButton);
	adjustNextButton(); // Poziv odmah na učitavanju