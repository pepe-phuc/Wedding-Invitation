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
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

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

    if (daysEl) { daysEl.innerText = d < 10 ? '0' + d : d; }
    if (hoursEl) { hoursEl.innerText = h < 10 ? '0' + h : h; }
    if (minutesEl) { minutesEl.innerText = m < 10 ? '0' + m : m; }
    if (secondsEl) { secondsEl.innerText = s < 10 ? '0' + s : s; }
}, 1000);

// Navigation Controls - Optimized using IntersectionObserver instead of scroll listener
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
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
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

// Gallery Modal Functionality - 5 Photos from Google Drive
document.addEventListener('DOMContentLoaded', () => {
    const openGalleryBtn = document.getElementById('openGalleryBtn');
    const galleryModal = document.getElementById('galleryModal');
    const closeGalleryBtn = galleryModal ? galleryModal.querySelector('.modal-close') : null;
    const modalOverlay = galleryModal ? galleryModal.querySelector('.modal-overlay') : null;
    const mainDisplayImg = document.getElementById('mainDisplayImg');
    const thumbnailBar = document.getElementById('galleryThumbnails');
    const prevBtn = galleryModal ? galleryModal.querySelector('.prev-btn') : null;
    const nextBtn = galleryModal ? galleryModal.querySelector('.next-btn') : null;

    let currentGalleryIndex = 0;
    
    // Đổi YOUR_IMAGE_FILE_ID_X thành ID thực tế của ảnh trên Google Drive của bạn
    const driveImages = [
        "https://photos.fife.usercontent.google.com/pw/AP1GczNyCcEpEYBgRfzZ9jOilKzp4z6IXS1qzIq_bXaZYUkkyYajGolv0Qo86lsS0T2Kq627L23mkbUB7Mtg9T31n6tWMji4IQY=w629-h419-s-no-gm?authuser=0",
        "https://photos.fife.usercontent.google.com/pw/AP1GczPwKJL726n1HUOgi1D6eOvZdA1OZRtsMF_54CxRgyuimxlwLdmsfxLTr374GEg4tlzqIQE27zBoAVGQGjx4OvpoEPncMQY=w947-h632-s-no-gm?authuser=0",
        "https://photos.fife.usercontent.google.com/pw/AP1GczNzd1fcMotxh2HI7YM4vjwHrdfGq3an_b26qQPtNoA-UaHG8NMWYXoR8XMBu73XYQoSHx8bIL4000ViZHwBXiMU4sTX5Ak=w159-h239-s-no-gm?authuser=0",
        "https://photos.fife.usercontent.google.com/pw/AP1GczNWv-xR-wEh2NYoQ6tleUKub0fKsVHrfzfHLS07NIiwSIbj7yWxqHDZVbawKfVJAUHFhyB6b8C1_YsgLYmQoFxz6AnzBpc=w152-h239-s-no-gm?authuser=0",
        "https://photos.fife.usercontent.google.com/pw/AP1GczMVG4bxLkEOt-q24A4UarJbnltm-R4QJ4O5_FjxdxMujGNYAO4kzBFIp-hJaGCkd4cQc8aDT5pA0LRFPTYzI4otdHuDIwI=w179-h239-s-no-gm?authuser=0"
    ];

    const TOTAL_PHOTOS = driveImages.length;
    const preloadedImages = {};

    const btnLoader = document.createElement('div');
    btnLoader.className = 'gallery-btn-loader';
    document.body.appendChild(btnLoader);

    const zoomOverlay = document.createElement('div');
    zoomOverlay.className = 'zoom-overlay';
    const zoomImg = document.createElement('img');
    zoomOverlay.appendChild(zoomImg);
    document.body.appendChild(zoomOverlay);

    function preloadAllGalleryImages() {
        for (let i = 0; i < TOTAL_PHOTOS; i++) {
            const img = new Image();
            img.src = driveImages[i];
            preloadedImages[i] = img;
        }
    }

    function buildGalleryStructures() {
        if (!thumbnailBar) {
            return;
        }
        thumbnailBar.innerHTML = '';
        const fragment = document.createDocumentFragment();
        
        for (let i = 0; i < TOTAL_PHOTOS; i++) {
            const cell = document.createElement('div');
            cell.className = 'thumb-cell';
            cell.setAttribute('data-idx', i);
            
            const img = document.createElement('img');
            img.src = driveImages[i];
            img.alt = `Thumb ${i + 1}`;
            
            cell.appendChild(img);
            fragment.appendChild(cell);
        }
        thumbnailBar.appendChild(fragment);

        thumbnailBar.addEventListener('click', (e) => {
            const cell = e.target.closest('.thumb-cell');
            if (cell) {
                const targetIdx = parseInt(cell.getAttribute('data-idx'), 10);
                switchPhoto(targetIdx, true);
            }
        });
    }

    function switchPhoto(index, shouldScroll = true) {
        if (index < 0 || index >= TOTAL_PHOTOS || !mainDisplayImg) {
            return;
        }
        currentGalleryIndex = index;
        
        mainDisplayImg.src = preloadedImages[currentGalleryIndex].src;

        const cells = thumbnailBar.querySelectorAll('.thumb-cell');
        cells.forEach((cell) => {
            const cellIdx = parseInt(cell.getAttribute('data-idx'), 10);
            if (cellIdx === currentGalleryIndex) {
                cell.classList.add('active');
                
                if (shouldScroll) {
                    requestAnimationFrame(() => {
                        const containerWidth = thumbnailBar.clientWidth;
                        const cellOffsetLeft = cell.offsetLeft;
                        const cellWidth = cell.clientWidth;
                        thumbnailBar.scrollTo({
                            left: cellOffsetLeft - (containerWidth / 2) + (cellWidth / 2),
                            behavior: 'smooth'
                        });
                    });
                }
            } else {
                cell.classList.remove('active');
            }
        });
    }

    preloadAllGalleryImages();

    if (openGalleryBtn && galleryModal && mainDisplayImg && thumbnailBar) {
        buildGalleryStructures();
        switchPhoto(0, false);

        openGalleryBtn.addEventListener('click', () => {
            galleryModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            switchPhoto(currentGalleryIndex, false);
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

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                let targetIdx = currentGalleryIndex - 1;
                if (targetIdx < 0) {
                    targetIdx = TOTAL_PHOTOS - 1;
                }
                switchPhoto(targetIdx, true);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                let targetIdx = currentGalleryIndex + 1;
                if (targetIdx >= TOTAL_PHOTOS) {
                    targetIdx = 0;
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