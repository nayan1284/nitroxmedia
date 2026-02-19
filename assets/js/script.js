/* ============================================
   NITROX MEDIA - UNIFIED JAVASCRIPT
   Consolidated from all Stitch AI sections
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ---- MOBILE MENU (Compact Dropdown Version) ----
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (hamburgerBtn && mobileMenu) {
        const toggleMenu = (e) => {
            e.stopPropagation();
            const isOpen = mobileMenu.classList.contains('open');
            const iconSpan = hamburgerBtn.querySelector('.material-symbols-outlined');

            if (isOpen) {
                mobileMenu.classList.remove('open');
                if (iconSpan) iconSpan.textContent = 'menu';
            } else {
                mobileMenu.classList.add('open');
                if (iconSpan) iconSpan.textContent = 'close';
            }
        };

        hamburgerBtn.addEventListener('click', toggleMenu);

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                mobileMenu.classList.remove('open');
                const iconSpan = hamburgerBtn.querySelector('.material-symbols-outlined');
                if (iconSpan) iconSpan.textContent = 'menu';
            }
        });

        // Close menu when clicking a nav link
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                const iconSpan = hamburgerBtn.querySelector('.material-symbols-outlined');
                if (iconSpan) iconSpan.textContent = 'menu';
            });
        });
    }

    // ---- FAQ ACCORDION ----
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const button = item.querySelector('button');
        if (!button) return;
        button.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all others
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherBtn = otherItem.querySelector('button');
                    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                }
            });

            if (!isActive) {
                item.classList.add('active');
                button.setAttribute('aria-expanded', 'true');
            } else {
                item.classList.remove('active');
                button.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // ---- CINEMATIC MOTION & SMART REVEAL ----
    const animateCounter = (el) => {
        const target = parseInt(el.innerText);
        const suffix = el.innerText.replace(/[0-9]/g, '');
        let count = 0;
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16);

        const update = () => {
            count += increment;
            if (count < target) {
                el.innerText = Math.floor(count) + suffix;
                requestAnimationFrame(update);
            } else {
                el.innerText = target + suffix;
            }
        };
        update();
    };

    const revealElements = document.querySelectorAll('.reveal, .reveal-group, .process-step');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // If this is a reveal group, we can trigger children sequentially if needed
                // But CSS transition-delay approach is better for performance.

                // Trigger counters if they exist inside this element
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => animateCounter(counter));

                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));


    // ---- SMOOTH SCROLL WITH OFFSET (FIXED HEADER) ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#top') return; // Let default behavior handle top

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();

                // Header Height Offset (approx 90px for safety)
                const headerOffset = 90;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // ---- COMING SOON TOAST ----
    const startChatBtn = document.getElementById('start-chat-btn');
    const toast = document.getElementById('coming-soon-toast');

    if (startChatBtn && toast) {
        startChatBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        });
    }


    // ---- STICKY HEADER — SCROLL-AWARE GLASS STATE ----
    const header = document.getElementById('top');
    if (header) {
        let ticking = false;
        const SCROLL_THRESHOLD = 50; // Triggers earlier for better feel

        const updateHeader = () => {
            if (window.scrollY > SCROLL_THRESHOLD) {
                header.classList.add('header-scrolled');
            } else {
                header.classList.remove('header-scrolled');
            }
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }, { passive: true });

        // Run once on load
        updateHeader();
    }

    // ---- WORK SECTION TABS & SHUFFLE ----
    const workTabs = document.querySelectorAll('.featured-v2-tab');
    const workItems = document.querySelectorAll('.project-card');
    const scrollContainer = document.getElementById('featured-projects-row');

    // Shuffle Function
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Auto Shuffle on load
    function shuffleProjects() {
        if (!scrollContainer) return;

        const allCards = Array.from(workItems);
        const categories = [...new Set(allCards.map(card => card.getAttribute('data-category')))];

        // Clear container temporarily
        scrollContainer.innerHTML = '';

        categories.forEach(cat => {
            const catCards = allCards.filter(card => card.getAttribute('data-category') === cat);
            const shuffled = shuffleArray(catCards);
            shuffled.forEach(card => scrollContainer.appendChild(card));
        });
    }

    function filterItems(filter) {
        const items = document.querySelectorAll('.project-card'); // Re-select after shuffle append
        items.forEach(item => {
            const category = item.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                item.classList.add('animate-fade-in-up');
            } else {
                item.style.display = 'none';
                item.classList.remove('animate-fade-in-up');
            }
        });

        if (scrollContainer) scrollContainer.scrollLeft = 0;
    }

    if (workTabs.length > 0 && workItems.length > 0) {
        shuffleProjects(); // Shuffle first

        const activeTab = document.querySelector('.featured-v2-tab.active');
        if (activeTab) {
            filterItems(activeTab.getAttribute('data-filter'));
        }

        workTabs.forEach(tab => {
            tab.addEventListener('click', function () {
                workTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                filterItems(this.getAttribute('data-filter'));
            });
        });
    }

    // ---- FEATURED VIDEO INTERACTION, CONTROLS & ULTRA-SMOOTH SCROLL ----
    const fbVideos = document.querySelectorAll('.featured-video');

    // 1. Ultra-Smooth Mouse Drag & Momentum Scroll
    if (scrollContainer) {
        let isDown = false;
        let startX;
        let scrollLeft;
        let velocity = 0;
        let lastX = 0;
        let rafId = null;

        const startDragging = (e) => {
            isDown = true;
            scrollContainer.classList.add('cursor-grabbing');
            startX = (e.pageX || e.touches[0].pageX) - scrollContainer.offsetLeft;
            scrollLeft = scrollContainer.scrollLeft;
            cancelAnimationFrame(rafId);
        };

        const stopDragging = () => {
            isDown = false;
            scrollContainer.classList.remove('cursor-grabbing');
            applyMomentum();
        };

        const move = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = (e.pageX || e.touches[0].pageX) - scrollContainer.offsetLeft;
            const walk = (x - startX) * 2;

            velocity = x - lastX;
            lastX = x;

            scrollContainer.scrollLeft = scrollLeft - walk;
        };

        const applyMomentum = () => {
            if (Math.abs(velocity) > 0.5) {
                scrollContainer.scrollLeft -= velocity;
                velocity *= 0.94; // Friction
                rafId = requestAnimationFrame(applyMomentum);
            }
        };

        scrollContainer.addEventListener('mousedown', startDragging);
        scrollContainer.addEventListener('touchstart', startDragging, { passive: true });
        window.addEventListener('mouseup', stopDragging);
        window.addEventListener('touchend', stopDragging);
        scrollContainer.addEventListener('mousemove', move);
        scrollContainer.addEventListener('touchmove', move, { passive: false });
    }

    // 2. Video Controls & Intersection Logic
    // NOTE: Do NOT autoplay videos on enter. Pause videos when out of view.
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (!entry.isIntersecting) {
                try { video.pause(); } catch (e) { /* ignore */ }
            }
            // Intentionally do NOT call video.play() here to avoid autoplay.
        });
    }, { threshold: 0.1 });

    fbVideos.forEach(video => {
        videoObserver.observe(video);
        const card = video.closest('.project-card');
        if (!card) return;

        const playPauseBtn = card.querySelector('.play-pause-btn');
        const muteBtn = card.querySelector('.mute-btn');

        // Play/Pause Toggle
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const icon = playPauseBtn.querySelector('span');
                if (video.paused) {
                    // When user explicitly plays, unmute so audio plays with video
                    try { video.muted = false; } catch (err) { }
                    video.play();
                    icon.textContent = 'pause';
                    if (muteBtn) {
                        const micon = muteBtn.querySelector('span');
                        if (micon) micon.textContent = 'volume_up';
                    }
                } else {
                    video.pause();
                    icon.textContent = 'play_arrow';
                }
            });
        }

        // Mute Toggle
        if (muteBtn) {
            muteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const icon = muteBtn.querySelector('span');
                video.muted = !video.muted;
                icon.textContent = video.muted ? 'volume_off' : 'volume_up';
            });
        }

        // Fullscreen disabled (no event listener added)
    });

    // ---- FEATURED PROJECTS: Section-level autoplay when visible ----
    // Play all featured videos (muted) when the featured projects row becomes visible,
    // pause them when it leaves. This restores the previous behavior while avoiding
    // autoplay from individual video intersections (prevents double-play and flicker).
    const featuredRow = document.getElementById('featured-projects-row');
    if (featuredRow && fbVideos.length > 0) {
        const onSectionIntersect = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Section is visible: play all featured videos muted for autoplay compatibility
                    fbVideos.forEach(v => {
                        try {
                            if (v.paused) {
                                v.muted = true;
                                v.play().catch(() => {});
                            }
                            // update UI icons if present
                            const card = v.closest('.project-card');
                            if (card) {
                                const pp = card.querySelector('.play-pause-btn span');
                                const mbtn = card.querySelector('.mute-btn span');
                                if (pp) pp.textContent = v.paused ? 'play_arrow' : 'pause';
                                if (mbtn) mbtn.textContent = v.muted ? 'volume_off' : 'volume_up';
                            }
                        } catch (e) { }
                    });
                } else {
                    // Section not visible: pause all featured videos
                    fbVideos.forEach(v => {
                        try { v.pause(); } catch (e) { }
                        const card = v.closest('.project-card');
                        if (card) {
                            const pp = card.querySelector('.play-pause-btn span');
                            if (pp) pp.textContent = 'play_arrow';
                        }
                    });
                }
            });
        };

        const sectionObserver = new IntersectionObserver(onSectionIntersect, { threshold: 0.25 });
        sectionObserver.observe(featuredRow);
    }

    const testimonialCarousel = document.getElementById('testimonial-carousel');

    // Testimonial Carousel Drag & Infinite Loop
    if (testimonialCarousel) {
        let slides = Array.from(testimonialCarousel.querySelectorAll('.testimonial-slide'));
        
        // Clone for infinite loop
        if (slides.length > 1) {
            const firstClone = slides[0].cloneNode(true);
            const lastClone = slides[slides.length - 1].cloneNode(true);
            
            testimonialCarousel.appendChild(firstClone);
            testimonialCarousel.insertBefore(lastClone, slides[0]);
            
            // Set initial position
            testimonialCarousel.scrollLeft = slides[0].offsetWidth;

            // Infinite Loop Handler
            testimonialCarousel.addEventListener('scroll', () => {
                const scrollPos = testimonialCarousel.scrollLeft;
                const totalWidth = testimonialCarousel.scrollWidth;
                const slideWidth = slides[0].offsetWidth;

                if (scrollPos <= 0.5) { // Small buffer for sub-pixel issues
                    testimonialCarousel.style.scrollBehavior = 'auto';
                    testimonialCarousel.style.scrollSnapType = 'none';
                    testimonialCarousel.scrollLeft = totalWidth - (slideWidth * 2);
                    setTimeout(() => {
                        testimonialCarousel.style.scrollSnapType = 'x mandatory';
                        testimonialCarousel.style.scrollBehavior = 'smooth';
                    }, 10);
                } else if (scrollPos >= totalWidth - slideWidth - 0.5) {
                    testimonialCarousel.style.scrollBehavior = 'auto';
                    testimonialCarousel.style.scrollSnapType = 'none';
                    testimonialCarousel.scrollLeft = slideWidth;
                    setTimeout(() => {
                        testimonialCarousel.style.scrollSnapType = 'x mandatory';
                        testimonialCarousel.style.scrollBehavior = 'smooth';
                    }, 10);
                }
            });
        }

        // Mouse Drag Support
        let isDown = false;
        let startX;
        let scrollLeft;

        testimonialCarousel.addEventListener('mousedown', (e) => {
            isDown = true;
            testimonialCarousel.classList.add('cursor-grabbing');
            startX = e.pageX - testimonialCarousel.offsetLeft;
            scrollLeft = testimonialCarousel.scrollLeft;
            testimonialCarousel.style.scrollSnapType = 'none';
        });

        testimonialCarousel.addEventListener('mouseleave', () => {
            isDown = false;
            testimonialCarousel.classList.remove('cursor-grabbing');
            testimonialCarousel.style.scrollSnapType = 'x mandatory';
        });

        testimonialCarousel.addEventListener('mouseup', () => {
            isDown = false;
            testimonialCarousel.classList.remove('cursor-grabbing');
            testimonialCarousel.style.scrollSnapType = 'x mandatory';
        });

        testimonialCarousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - testimonialCarousel.offsetLeft;
            const walk = (x - startX) * 2;
            testimonialCarousel.scrollLeft = scrollLeft - walk;
        });

        testimonialCarousel.addEventListener('touchstart', () => {
            testimonialCarousel.style.scrollSnapType = 'none';
        }, { passive: true });

        testimonialCarousel.addEventListener('touchend', () => {
            testimonialCarousel.style.scrollSnapType = 'x mandatory';
        }, { passive: true });
    }

    // ---- CUSTOM TESTIMONIAL VIDEO PLAYER (Attached after cloning) ----
    const testimonialVideos = document.querySelectorAll('.testimonial-video');

    if (testimonialVideos.length > 0) {
        testimonialVideos.forEach(video => {
            const container = video.closest('.testimonial-video-container');
            if (!container) return;
            
            const overlay = container.querySelector('.video-custom-overlay');
            const playIcon = overlay ? overlay.querySelector('.material-symbols-outlined') : null;

            const togglePlay = () => {
                if (video.paused) {
                    testimonialVideos.forEach(v => {
                        if (v !== video) {
                            v.pause();
                            v.muted = true;
                        }
                    });
                    video.muted = false;
                    video.play();
                } else {
                    video.pause();
                }
            };

            if (overlay) overlay.addEventListener('click', togglePlay);
            
            video.addEventListener('click', () => {
                if (!video.paused) video.pause();
                else togglePlay();
            });

            video.addEventListener('pause', () => {
                if (overlay) overlay.classList.remove('hidden');
                if (playIcon) playIcon.textContent = 'play_arrow';
            });

            video.addEventListener('play', () => {
                if (overlay) overlay.classList.add('hidden');
                if (playIcon) playIcon.textContent = 'pause';
            });
            
            video.addEventListener('dblclick', (e) => e.preventDefault());
        });
    }

    // ---- NEWSLETTER FORM HANDLER (Lightweight client-side validation) ----
    const newsletterForm = document.getElementById('newsletter-form');
    const newsletterBtn = document.getElementById('newsletter-submit');
    if (newsletterForm && newsletterBtn) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[name="email"]');
            const email = emailInput ? (emailInput.value || '').trim() : '';
            const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            if (!valid) {
                // Simple inline feedback without changing styles: swap button label briefly
                const old = newsletterBtn.textContent;
                newsletterBtn.textContent = 'Enter valid email';
                setTimeout(() => newsletterBtn.textContent = old, 1800);
                return;
            }

            // If a backend endpoint is added later, a `data-action` attribute on the form
            // can be used to POST the subscription. For now show a lightweight success state.
            newsletterBtn.textContent = 'Subscribed';
            newsletterBtn.disabled = true;
            if (emailInput) emailInput.value = '';
        });
    }



    // ---- CASE STUDY VIDEO PLAYER ----
    const caseVideo = document.getElementById('case-study-v');
    const caseOverlay = document.getElementById('case-study-overlay');
    const caseIcon = caseOverlay ? caseOverlay.querySelector('.material-symbols-outlined') : null;

    if (caseVideo && caseOverlay) {
        caseOverlay.addEventListener('click', () => {
            if (caseVideo.paused) {
                caseVideo.play();
            } else {
                caseVideo.pause();
            }
        });

        caseVideo.addEventListener('click', () => {
            if (!caseVideo.paused) {
                caseVideo.pause();
            } else {
                caseVideo.play();
            }
        });

        caseVideo.addEventListener('pause', () => {
            caseOverlay.classList.remove('hidden');
            if (caseIcon) caseIcon.textContent = 'play_arrow';
        });

        caseVideo.addEventListener('play', () => {
            caseOverlay.classList.add('hidden');
            if (caseIcon) caseIcon.textContent = 'pause';
        });

        caseVideo.addEventListener('dblclick', (e) => e.preventDefault());
    }

});

function showToast() {
    const toast = document.getElementById('coming-soon-toast');
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
