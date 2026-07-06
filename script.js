document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const welcomeScreen = document.getElementById('welcome-screen');
    const btnOpenWedding = document.getElementById('btn-open-wedding');
    const sections = document.querySelectorAll('section');
    const dots = document.querySelectorAll('#nav-dots .dot');
    const openGalleryBtn = document.getElementById('openGalleryBtn');
    const galleryModal = document.getElementById('galleryModal');
    const mainDisplayImg = document.getElementById('mainDisplayImg');
    const thumbnailBar = document.getElementById('galleryThumbnails');
    const wishForm = document.getElementById('wishForm');

    const closeGalleryBtn = galleryModal ? galleryModal.querySelector('.modal-close') : null;
    const modalOverlay = galleryModal ? galleryModal.querySelector('.modal-overlay') : null;
    const prevBtn = galleryModal ? galleryModal.querySelector('.prev-btn') : null;
    const nextBtn = galleryModal ? galleryModal.querySelector('.next-btn') : null;

    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxqYrY-zBrPAbxSltrFfzA981SGeY-AQNCrf3rQ5JINTsKbuWTV-_q32uEIEgwiQCDIbw/exec';
    
    let isScrolling = false;
    let currentGalleryIndex = 0;
    const preloadedImages = {};

    const driveImages = [
        "https://lh3.googleusercontent.com/pw/AP1GczPkIVucjsEk0OfhDTmGQYG0cjtJSNLztYzVcA4qIprW3smpLtyODORAA6hDxKMEw_QYxHVOxIgD794PArNtUIkcU1aJlRKkd_j2UXkBBW7d3zGViQal-fslBTYCKc3HJIe7fWQQNoAN1Z3nDchJLyiOJA=w615-h819-s-no-gm",
        "https://lh3.googleusercontent.com/pw/AP1GczPmbVsk_BAtd52IU4oxJSGbPrS5CBBvxvDctOkIqHqAorjUJRwOJ3d6Ea1aJa_uUjoYw5ti0wPm_1x9f8qFPJ9L7Ohmdrh4vvJeP_e3JqDHLWHN22GviZUeRGuRFSVvc1oKTKw0YJNy03D3jvEKRj0EoQ=w212-h333-s-no-gm",
        "https://lh3.googleusercontent.com/pw/AP1GczPpqIoF61ez2c9U_ZUOTJAsmmGU_PbcU62t1zsLO5TWaDkVKqYQ0Ot-9BaNrc-JTF5u0XysCKmhDJHDbhJn1_L2Cvyd2b1B5-RrwpZ3RGUStPzAwmW0YEeutEh--79ftdz_R_6oBTlSnzUkL_sEA7nkqw=w504-h336-s-no-gm",
        "https://lh3.googleusercontent.com/pw/AP1GczM5A0uHZMZqtM04-1B9x4LZ301ue3YgfIyDNqdhYuTtUKcbcTeyUt3S1nYBSGDkCzsMKqceZcbXv0LEMy-r6c9ci9XUHudtCNcmGqATEuYRb2_q1-Pv9s2GMbSb1Z0Jlwc7hiK3LUEbPZXWmpR9C4vrQA=w504-h336-s-no-gm",
        "https://lh3.googleusercontent.com/pw/AP1GczMjqQLduYBPELEQfTKl9YRG-KeIehpGYOp2QYDGiGAfWihNBHsLDHDBMEF-N1b-p7rFJzIapQkfiIdfx0JqyEoh8c_UDP9tICdpReGZzhmDT8w6RbD_Uh3ywYS907UNyrnta2QPr3AN2q2Lst0yv30OWg=w504-h336-s-no-gm",
        "https://lh3.googleusercontent.com/pw/AP1GczMTtvQOtdKBgWKemnSIgQ5Nx9UtTMHiApv0hEcgLsWIV7yVQ91p0PPKMSSe36HGmO69VXpY2aE-HesSNQeKbZivnuBTt-JMhfuY8Z2kEvkf3kDFTYfe9fCzlJUx69O9l94q_EEuw3-DoYVW3HI6uPiepg=w242-h161-s-no-gm",
        "https://lh3.googleusercontent.com/pw/AP1GczPzpSr5HdiT8w4pDkZ0sbO5ZSZKN5y7FeKR-NyrjG5lNp_sNXpL2kk-X6K3sscG4wsOlAF2eLJcQ9-pPgQdwyFYMG4ZpiGlSJJuZxr4emDOIytq_yD1jU7ErYla2rTg38HaChg5wMxDmyPWnUNGoQ-qSQ=w107-h161-s-no-gm",
        "https://lh3.googleusercontent.com/pw/AP1GczPq6RXNQoujLNPT-wj2vptkHzdpHKqjd0ne0VHx7v9bYQEK84A0PuVtX50nKgPYZz69lBHvN8x2eTUNyJozsLPqc8phh3DXqb9_TwVYDMPFB_OwMxSrO-4v3uKsP7Aj4Qa7Y_9TK39kOwszo7Lr78vi5w=w168-h252-s-no-gm",
        "https://lh3.googleusercontent.com/pw/AP1GczP5MBfMg_Zz9kbZja93lvIe1QvWYkvuo5tp1l0kBO7HmmDY8hC5ZR5JJjHU71ukgyjgVr45iKlGDP7AyMiXBMxYbAxMn9itFz-tSIezCkA7evfQYdUjN5VAxmIDwIdeamRp1lrcfe8KABGp3cVuL3NUpw=w168-h252-s-no-gm",
        "https://lh3.googleusercontent.com/pw/AP1GczOCDfYNsw62L4w6XSmOyiRwV-QlG5EtrfWdQr3SbGqMR0iY17L8xYkeoHGIafMcVAanZRjit_Y0mNLpTnlmFLN6qUlLmDJcsi66H3g_xGqMtmfKkE4JA_loMJ-eg0aTEbXD0PensTjUIbqcoELkYBq8yw=w378-h252-s-no-gm"
    ];
    const TOTAL_PHOTOS = driveImages.length;

    // --- Prevent Scrolling on Welcome Screen ---
    if (welcomeScreen && !welcomeScreen.classList.contains('opened')) {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    }

    // --- Lazy Shared Loaders and Overlays ---
    const formLoader = document.createElement('div');
    formLoader.className = 'form-loader';
    document.body.appendChild(formLoader);

    const zoomOverlay = document.createElement('div');
    zoomOverlay.className = 'zoom-overlay';
    const zoomImg = document.createElement('img');
    zoomOverlay.appendChild(zoomImg);
    document.body.appendChild(zoomOverlay);

    // --- Audio System ---
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

    function playAudio() {
        if (bgMusic) {
            bgMusic.play().then(() => {
                musicToggle.classList.add('playing');
                musicToggle.classList.remove('manually-paused');
            }).catch(() => {
                console.log("Autoplay blocked by browser.");
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

    // --- Welcome Screen Activation ---
    if (welcomeScreen && btnOpenWedding) {
        btnOpenWedding.addEventListener('click', () => {
            welcomeScreen.classList.add('opened');
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            playAudio();
        });
    }

    // --- Countdown Timer ---
    const targetDate = new Date('August 1, 2026 00:00:00').getTime();
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    if (daysEl || hoursEl || minutesEl || secondsEl) {
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
    }

    // --- Optimized Scroll and Navigation Dots ---
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
            dot.classList.toggle('active', i === index);
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

    // --- Performance Optimized Single-Pass Image Preloading & Gallery ---
    function preloadAndBuildGallery() {
        if (!thumbnailBar) {
            return;
        }
        const fragment = document.createDocumentFragment();

        driveImages.forEach((src, i) => {
            const imgObj = new Image();
            imgObj.src = src;
            preloadedImages[i] = imgObj;

            const cell = document.createElement('div');
            cell.className = 'thumb-cell';
            cell.setAttribute('data-idx', i);

            const thumbImg = document.createElement('img');
            thumbImg.src = src;
            thumbImg.alt = `Thumb ${i + 1}`;

            cell.appendChild(thumbImg);
            fragment.appendChild(cell);
        });

        thumbnailBar.appendChild(fragment);
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
            const isActive = cellIdx === currentGalleryIndex;
            cell.classList.toggle('active', isActive);

            if (isActive && shouldScroll) {
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
        });
    }

    preloadAndBuildGallery();

    if (openGalleryBtn && galleryModal && mainDisplayImg && thumbnailBar) {
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

        if (closeGalleryBtn) { closeGalleryBtn.addEventListener('click', closeGallery); }
        if (modalOverlay) { modalOverlay.addEventListener('click', closeGallery); }

        mainDisplayImg.addEventListener('click', () => {
            zoomImg.src = mainDisplayImg.src;
            zoomOverlay.classList.add('active');
        });

        zoomOverlay.addEventListener('click', () => {
            zoomOverlay.classList.remove('active');
        });

        if (prevBtn) {
            let isTransitioning = false;
            prevBtn.addEventListener('click', () => {
                event.preventDefault();
                 if (isTransitioning) {
                    return;
                }

                isTransitioning = true;
                let targetIdx = currentGalleryIndex - 1;
                if (targetIdx < 0) {
                    targetIdx = TOTAL_PHOTOS - 1;
                }
                switchPhoto(targetIdx, true);
                // Replace 300 with the exact duration of your switchPhoto animation/transition
                setTimeout(() => {
                    isTransitioning = false;
                }, 300); 
            });
        }

        if (nextBtn) {
            let isTransitioning = false;

            nextBtn.addEventListener('click', (event) => {
                // Prevent default double-tap zoom behavior on mobile
                event.preventDefault();

                if (isTransitioning) {
                    return;
                }

                isTransitioning = true;
                
                let targetIdx = currentGalleryIndex + 1;
                if (targetIdx >= TOTAL_PHOTOS) {
                    targetIdx = 0;
                }
                switchPhoto(targetIdx, true);

                // Replace 300 with the exact duration of your switchPhoto animation/transition
                setTimeout(() => {
                    isTransitioning = false;
                }, 300); 
            });
        }

        thumbnailBar.addEventListener('click', (e) => {
            const cell = e.target.closest('.thumb-cell');
            if (cell) {
                const targetIdx = parseInt(cell.getAttribute('data-idx'), 10);
                switchPhoto(targetIdx, true);
            }
        });
    }

    // --- Wish Form System ---
    const hasSubmitted = localStorage.getItem('wedding_wish_submitted');

    if (hasSubmitted && wishForm) {
        disableWishForm();
    }

    if (wishForm && !hasSubmitted) {
        wishForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('name');
            const messageInput = document.getElementById('message');

            const nameValue = nameInput ? nameInput.value.trim() : '';
            const messageValue = messageInput ? messageInput.value.trim() : '';

            if (nameValue === '') {
                showToast('Vui lòng nhập tên của bạn', 'error');
                if (nameInput) { nameInput.focus(); }
                return;
            }

            if (messageValue === '') {
                showToast('Vui lòng nhập lời chúc', 'error');
                if (messageInput) { messageInput.focus(); }
                return;
            }

            formLoader.classList.add('active');

            const formData = {
                name: nameValue,
                message: messageValue,
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
                showToast('Gửi lời chúc thành công!', 'success');
                localStorage.setItem('wedding_wish_submitted', 'true');
                wishForm.reset();
                disableWishForm();
            })
            .catch((error) => {
                console.error('Error:', error);
                showToast('Có lỗi xảy ra, vui lòng thử lại', 'error');
            })
            .finally(() => {
                formLoader.classList.remove('active');
            });
        });
    }

    function disableWishForm() {
        if (!wishForm) {
            return;
        }
        wishForm.innerHTML = `
            <div class="form-submitted-message">
                <div class="submitted-icon">♥</div>
                <h3>Cảm ơn bạn rất nhiều!</h3>
                <p>Lời chúc ý nghĩa của bạn đã được gửi đến cô dâu và chú rể.</p>
            </div>
        `;
    }
});

// --- Toast System ---
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
            if (container.childNodes.length === 0) {
                container.remove();
            }
        }, 300);
    }, 3000);
}