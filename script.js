// Audio & Welcome Screen Controls
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const welcomeScreen = document.getElementById('welcome-screen');
const btnOpenWedding = document.getElementById('btn-open-wedding');

if (bgMusic && musicToggle) {
    bgMusic.volume = 0.3;

    musicToggle.addEventListener('click', () => {
        if (bgMusic.paused) {
            playAudio();
        } else {
            pauseAudio();
        }
    });
}

if (welcomeScreen && btnOpenWedding) {
    btnOpenWedding.addEventListener('click', () => {
        welcomeScreen.classList.add('opened');
        playAudio();
    });
}

function playAudio() {
    if (bgMusic) {
        bgMusic.play().then(() => {
            musicToggle.classList.add('playing');
            musicToggle.classList.remove('manually-paused');
        }).catch((err) => {
            console.log("Autoplay blocked by browser. Awaiting user interaction.");
        });
    }
}

function pauseAudio() {
    if (bgMusic) {
        bgMusic.pause();
        musicToggle.classList.remove('playing');
        musicToggle.classList.add('manually-paused');
    }
}

// Countdown Timer
const targetDate = new Date('August 1, 2026 00:00:00').getTime();

const countdown = setInterval(() => {
    const now = new Date().getTime();
    const difference = targetDate - now;

    if (difference < 0) {
        clearInterval(countdown);
        return;
    }

    const d = Math.floor(difference / (1000 * 60 * 60 * 24));
    const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = d < 10 ? '0' + d : d;
    document.getElementById('hours').innerText = h < 10 ? '0' + h : h;
    document.getElementById('minutes').innerText = m < 10 ? '0' + m : m;
    document.getElementById('seconds').innerText = s < 10 ? '0' + s : s;
}, 1000);

// Navigation Controls
const sections = document.querySelectorAll('section');
const dots = document.querySelectorAll('#nav-dots .dot');
let isScrolling = false;

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        if (isScrolling) {
            return;
        }
        scrollToSection(index);
    });
});

function scrollToSection(index) {
    if (index < 0 || index >= sections.length) {
        return;
    }
    isScrolling = true;
    
    // Use scrollIntoView on the element directly for better browser compatibility
    sections[index].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    
    updateActiveDot(index);
    
    setTimeout(() => {
        isScrolling = false;
    }, 700); 
}

function updateActiveDot(index) {
    dots.forEach((dot, i) => {
        if (i === index) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

const observerOptions = {
    root: null,
    rootMargin: '-10% 0px -10% 0px',
    threshold: 0.4
};

const observer = new IntersectionObserver((entries) => {
    if (isScrolling) {
        return;
    }
    
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const index = Array.from(sections).indexOf(entry.target);
            updateActiveDot(index);
        }
    });
}, observerOptions);

sections.forEach((section) => {
    observer.observe(section);
});

// Gallery Modal Functionality - High Performance Optimized with Full Background Spinner
document.addEventListener('DOMContentLoaded', () => {
    const openGalleryBtn = document.getElementById('openGalleryBtn');
    const galleryModal = document.getElementById('galleryModal');
    const closeGalleryBtn = galleryModal ? galleryModal.querySelector('.modal-close') : null;
    const modalOverlay = galleryModal ? galleryModal.querySelector('.modal-overlay') : null;
    const mainDisplayImg = document.getElementById('mainDisplayImg');
    const thumbnailBar = document.getElementById('galleryThumbnails');
    const prevBtn = galleryModal ? galleryModal.querySelector('.prev-btn') : null;
    const nextBtn = galleryModal ? galleryModal.querySelector('.next-btn') : null;

    let currentGalleryIndex = 1;
    const TOTAL_PHOTOS = 27;

    // Create Fullscreen Backdrop Spinner Dynamically
    const btnLoader = document.createElement('div');
    btnLoader.className = 'gallery-btn-loader';
    document.body.appendChild(btnLoader);

    const zoomOverlay = document.createElement('div');
    zoomOverlay.className = 'zoom-overlay';
    const zoomImg = document.createElement('img');
    zoomOverlay.appendChild(zoomImg);
    document.body.appendChild(zoomOverlay);

    if (openGalleryBtn && galleryModal && mainDisplayImg && thumbnailBar) {
        buildGalleryStructures();
        switchPhoto(1, false);

        openGalleryBtn.addEventListener('click', () => {
            btnLoader.classList.add('active');

            const targetImg = new Image();
            targetImg.src = `photobook/1 (${currentGalleryIndex}).jpg`;
            
            targetImg.onload = () => {
                btnLoader.classList.remove('active');
                galleryModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                switchPhoto(currentGalleryIndex, false);
            };

            targetImg.onerror = () => {
                btnLoader.classList.remove('active');
                galleryModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                switchPhoto(currentGalleryIndex, false);
            };
        });

        const closeGallery = () => {
            galleryModal.classList.remove('active');
            document.body.style.overflow = '';
        };

        if (closeGalleryBtn) {
            closeGalleryBtn.addEventListener('click', closeGallery);
        }
        if (modalOverlay) {
            modalOverlay.addEventListener('click', closeGallery);
        }

        mainDisplayImg.addEventListener('click', () => {
            zoomImg.src = mainDisplayImg.src;
            zoomOverlay.classList.add('active');
        });

        zoomOverlay.addEventListener('click', () => {
            zoomOverlay.classList.remove('active');
        });

        function buildGalleryStructures() {
            const fragment = document.createDocumentFragment();
            for (let i = 1; i <= TOTAL_PHOTOS; i++) {
                const cell = document.createElement('div');
                cell.className = 'thumb-cell';
                cell.setAttribute('data-idx', i);
                
                const img = document.createElement('img');
                img.src = `photobook/1 (${i}).jpg`;
                img.alt = `Thumb ${i}`;
                img.loading = 'lazy';
                
                cell.appendChild(img);
                fragment.appendChild(cell);
            }
            thumbnailBar.appendChild(fragment);

            thumbnailBar.addEventListener('click', (e) => {
                const cell = e.target.closest('.thumb-cell');
                if (cell) {
                    const targetIdx = parseInt(cell.getAttribute('data-idx'));
                    switchPhoto(targetIdx, true);
                }
            });
        }

        function preloadAdjacentImages(centerIndex) {
            const nextIdx = centerIndex === TOTAL_PHOTOS ? 1 : centerIndex + 1;
            const prevIdx = centerIndex === 1 ? TOTAL_PHOTOS : centerIndex - 1;
            
            [nextIdx, prevIdx].forEach(idx => {
                const imgObj = new Image();
                imgObj.src = `photobook/1 (${idx}).jpg`;
            });
        }

        function switchPhoto(index, shouldScroll = true) {
            if (index < 1 || index > TOTAL_PHOTOS) {
                return;
            }
            currentGalleryIndex = index;
            
            mainDisplayImg.style.opacity = '0.3';
            mainDisplayImg.src = `photobook/1 (${currentGalleryIndex}).jpg`;
            preloadAdjacentImages(currentGalleryIndex);

            mainDisplayImg.onload = () => {
                mainDisplayImg.style.opacity = '1';
            };

            const cells = thumbnailBar.querySelectorAll('.thumb-cell');
            cells.forEach((cell) => {
                const cellIdx = parseInt(cell.getAttribute('data-idx'));
                if (cellIdx === currentGalleryIndex) {
                    cell.classList.add('active');
                    
                    if (shouldScroll) {
                        const containerWidth = thumbnailBar.clientWidth;
                        const cellOffsetLeft = cell.offsetLeft;
                        const cellWidth = cell.clientWidth;
                        thumbnailBar.scrollTo({
                            left: cellOffsetLeft - (containerWidth / 2) + (cellWidth / 2),
                            behavior: 'smooth'
                        });
                    }
                } else {
                    cell.classList.remove('active');
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                let targetIdx = currentGalleryIndex - 1;
                if (targetIdx < 1) {
                    targetIdx = TOTAL_PHOTOS;
                }
                switchPhoto(targetIdx, true);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                let targetIdx = currentGalleryIndex + 1;
                if (targetIdx > TOTAL_PHOTOS) {
                    targetIdx = 1;
                }
                switchPhoto(targetIdx, true);
            });
        }
    }
});

// Wishes Form to Google Sheet Integration with Screen Spinner
document.addEventListener('DOMContentLoaded', () => {
    const wishForm = document.getElementById('wishForm');
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxqYrY-zBrPAbxSltrFfzA981SGeY-AQNCrf3rQ5JINTsKbuWTV-_q32uEIEgwiQCDIbw/exec';

    // Create Form Screen Loader Dynamically
    const formLoader = document.createElement('div');
    formLoader.className = 'form-loader';
    document.body.appendChild(formLoader);

    if (wishForm) {
        wishForm.addEventListener('submit', (e) => {
            e.preventDefault();

            formLoader.classList.add('active');

            const formData = {
                name: document.getElementById('name').value,
                message: document.getElementById('message').value,
                attendance: document.getElementById('attend').checked ? 'Có tham dự' : 'Không tham dự'
            };

            fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(() => {
                alert('Gửi lời chúc thành công!');
                wishForm.reset();
            })
            .catch((error) => {
                console.error('Error:', error);
            })
            .finally(() => {
                formLoader.classList.remove('active');
            });
        });
    }
});
