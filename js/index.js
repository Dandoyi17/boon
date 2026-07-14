const topBar = document.querySelector('.top-bar');
const header = document.querySelector('.header');
const logo = document.getElementById('site-logo');
const menuToggle = document.querySelector('.menu-toggle');
const navBar = document.querySelector('.nav-bar');
const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));

if (topBar) {
    let lastScrollTop = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY || window.pageYOffset;

        if (currentScroll > 40 && currentScroll > lastScrollTop) {
            topBar.classList.add('hidden');
        } else {
            topBar.classList.remove('hidden');
        }

        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
}

function updateHeaderState() {
    const scrolled = window.scrollY > 40;

    if (header) {
        header.classList.toggle('scrolled', scrolled);
    }

    if (logo) {
        logo.src = scrolled ? 'images/BOON.png' : 'images/BOON11.png';

        if (scrolled) {
            logo.classList.add('scrolled');
        } else {
            logo.classList.remove('scrolled');
        }
    }
}

function triggerLogoRotation() {
    if (!logo) return;

    logo.classList.remove('scrolled');
    void logo.offsetWidth;
    logo.classList.add('scrolled');
}

if (logo || header) {
    window.addEventListener('scroll', updateHeaderState);
    window.addEventListener('load', updateHeaderState);
}

if (logo) {
    setInterval(() => {
        if (window.scrollY > 40) {
            triggerLogoRotation();
        }
    }, 10000);
}

if (menuToggle && navBar) {
    menuToggle.addEventListener('click', () => {
        const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', String(!expanded));
        navBar.classList.toggle('is-open');
    });

    document.addEventListener('click', (event) => {
        if (window.innerWidth > 1024) return;

        const clickedInside = navBar.contains(event.target) || menuToggle.contains(event.target);
        if (!clickedInside) {
            menuToggle.setAttribute('aria-expanded', 'false');
            navBar.classList.remove('is-open');
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            menuToggle.setAttribute('aria-expanded', 'false');
            navBar.classList.remove('is-open');
        }
    });
}

if (heroSlides.length > 1) {
    let activeIndex = 0;
    const transitionStyles = [
        'fade',
        'push',
        'diamond',
        'dissolve',
        'zoom'
    ];

    const mobileTransitionStyles = [
        'push',
        'zoom',
        'mobile-push-left',
        'mobile-push-right',
        'mobile-zoom-in',
        'mobile-zoom-out',
        'mobile-random'
    ];

    const pickTransition = () => {
        const isMobile = window.matchMedia('(max-width: 1024px)').matches;
        const pool = isMobile ? mobileTransitionStyles : transitionStyles;
        return pool[Math.floor(Math.random() * pool.length)];
    };

    const clearTransitionClasses = (slide) => {
        slide.classList.remove(
            'transition-in',
            'transition-out',
            'transition-fade-in',
            'transition-fade-out',
            'transition-push-in',
            'transition-push-out',
            'transition-diamond-in',
            'transition-diamond-out',
            'transition-dissolve-in',
            'transition-dissolve-out',
            'transition-zoom-in',
            'transition-zoom-out',
            'transition-mobile-push-left-in',
            'transition-mobile-push-left-out',
            'transition-mobile-push-right-in',
            'transition-mobile-push-right-out',
            'transition-mobile-zoom-in',
            'transition-mobile-zoom-out',
            'transition-mobile-random-in',
            'transition-mobile-random-out'
        );
    };

    const changeSlide = () => {
        const previousIndex = activeIndex;
        activeIndex = (activeIndex + 1) % heroSlides.length;
        const currentSlide = heroSlides[previousIndex];
        const nextSlide = heroSlides[activeIndex];
        const transitionType = pickTransition();

        heroSlides.forEach((slide, index) => {
            slide.classList.remove('hero-slide--active');
            clearTransitionClasses(slide);
        });

        currentSlide.classList.add('transition-out', `transition-${transitionType}-out`);
        nextSlide.classList.add('hero-slide--active', 'transition-in', `transition-${transitionType}-in`);

        setTimeout(() => {
            clearTransitionClasses(currentSlide);
            clearTransitionClasses(nextSlide);
            nextSlide.classList.add('hero-slide--active');
        }, 900);
    };

    setInterval(changeSlide, 7000);
}

const ctaButton = document.querySelector('.cta-button');
const rotatingCtaTexts = [
    'Explore Our Services',
    'Ticketing and Airport Pick-up',
    'Visa Consultancy',
    'Flight and Hotel Bookings',
    'Travel Insurance and Assistance',
    '24/7 Customer Support'
];
const rotationDelay = 3600;
let ctaTextIndex = 0;

function buildCtaText(text) {
    const wrapper = document.createElement('span');
    wrapper.className = 'cta-text-rotating';
    wrapper.setAttribute('aria-hidden', 'true');

    Array.from(text).forEach((char) => {
        const charElement = document.createElement('span');
        charElement.className = 'cta-char';
        charElement.textContent = char === ' ' ? '\u00A0' : char;
        wrapper.appendChild(charElement);
    });

    return wrapper;
}

function animateCtaText(text) {
    if (!ctaButton) return;

    const existing = ctaButton.querySelector('.cta-text-rotating');
    const newText = buildCtaText(text);
    const srLabel = ctaButton.querySelector('.cta-text-sr-only');

    if (!srLabel) {
        const srSpan = document.createElement('span');
        srSpan.className = 'cta-text-sr-only';
        srSpan.setAttribute('aria-live', 'polite');
        ctaButton.appendChild(srSpan);
    }

    ctaButton.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            node.remove();
        }
    });

    if (existing) {
        existing.classList.add('outgoing');
    }

    const srText = ctaButton.querySelector('.cta-text-sr-only');
    if (srText) {
        srText.textContent = text;
    }

    ctaButton.prepend(newText);
    newText.getBoundingClientRect();

    newText.querySelectorAll('.cta-char').forEach((charNode, index) => {
        charNode.style.transitionDelay = `${index * 0.05}s`;
        requestAnimationFrame(() => {
            charNode.classList.add('visible');
        });
    });

    if (existing) {
        setTimeout(() => {
            existing.remove();
        }, 420);
    }
}

function startCtaRotation() {
    if (!ctaButton) return;

    animateCtaText(rotatingCtaTexts[ctaTextIndex]);

    setInterval(() => {
        ctaTextIndex = (ctaTextIndex + 1) % rotatingCtaTexts.length;
        animateCtaText(rotatingCtaTexts[ctaTextIndex]);
    }, rotationDelay);
}

startCtaRotation();

const aboutSection = document.querySelector('.second-section');
const aboutContent = aboutSection?.querySelector('.about-content');
const aboutImage = aboutSection?.querySelector('.image-container');

if (aboutSection && aboutContent && aboutImage) {
    const revealAboutSection = () => {
        const rect = aboutSection.getBoundingClientRect();

        if (rect.top < window.innerHeight * 0.88) {
            aboutContent.classList.add('is-visible');
            aboutImage.classList.add('is-visible');
            window.removeEventListener('scroll', revealAboutSection);
        }
    };

    window.addEventListener('scroll', revealAboutSection, { passive: true });
    window.addEventListener('load', revealAboutSection);
    revealAboutSection();
}

const servicesSection = document.querySelector('.our-services');
const serviceButtons = Array.from(document.querySelectorAll('.service-trigger'));
const servicePanels = Array.from(document.querySelectorAll('.service-panel'));
const servicesVisual = document.querySelector('.services-visual');
const servicesImage = servicesVisual?.querySelector('img');

function updateServicesVisual(button) {
    if (!servicesImage) return;

    const nextSrc = button?.getAttribute('data-image');
    const nextAlt = button?.getAttribute('data-alt') || 'Service image';

    if (!nextSrc) return;

    servicesImage.style.opacity = '0';
    servicesImage.style.transform = 'scale(1.02)';

    setTimeout(() => {
        servicesImage.src = nextSrc;
        servicesImage.alt = nextAlt;
        servicesImage.style.opacity = '1';
        servicesImage.style.transform = 'scale(1)';
    }, 120);
}

if (servicesSection) {
    const revealServices = () => {
        const rect = servicesSection.getBoundingClientRect();

        if (rect.top < window.innerHeight * 0.88) {
            servicesSection.classList.add('is-visible');
            if (servicesVisual) {
                servicesVisual.classList.add('is-visible');
            }
            window.removeEventListener('scroll', revealServices);
        }
    };

    window.addEventListener('scroll', revealServices, { passive: true });
    window.addEventListener('load', revealServices);
    revealServices();
}

if (serviceButtons.length) {
    const activeButton = serviceButtons.find((button) => button.classList.contains('is-active')) || serviceButtons[0];
    updateServicesVisual(activeButton);
}

serviceButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        const targetPanel = document.getElementById(targetId);
        const isOpen = button.classList.contains('is-active');

        serviceButtons.forEach((entry) => {
            entry.classList.remove('is-active');
            entry.setAttribute('aria-expanded', 'false');
        });

        servicePanels.forEach((panel) => panel.classList.remove('is-open'));

        if (!isOpen && targetPanel) {
            button.classList.add('is-active');
            button.setAttribute('aria-expanded', 'true');
            targetPanel.classList.add('is-open');
            updateServicesVisual(button);
        }
    });
});

const vissionSection = document.querySelector('.vission');
const vissionScrollContainer = document.querySelector('.vission-scroll-container');
const vissionCards = Array.from(document.querySelectorAll('.vission-card'));
const vissionBackground = document.querySelector('.vission-background');

if (vissionSection) {
    const revealVissionSection = () => {
        const rect = vissionSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.82) {
            vissionSection.classList.add('is-visible');
            window.removeEventListener('scroll', revealVissionSection);
        }
    };

    window.addEventListener('scroll', revealVissionSection, { passive: true });
    window.addEventListener('load', revealVissionSection);
    revealVissionSection();
}

if (vissionScrollContainer && vissionCards.length) {
    let ticking = false;

    const updateVissionBackground = () => {
        if (!vissionBackground) return;
        const scrollProgress = Math.min(1, Math.max(0, vissionScrollContainer.scrollTop / (vissionScrollContainer.scrollHeight - vissionScrollContainer.clientHeight)));
        vissionBackground.style.setProperty('--vission-ring-x', `${30 + scrollProgress * 20}%`);
        vissionBackground.style.setProperty('--vission-ring-y', `${20 + scrollProgress * 15}%`);
    };

    const updateActiveVissionCard = () => {
        const containerRect = vissionScrollContainer.getBoundingClientRect();
        const centerY = containerRect.top + containerRect.height / 2;
        let closestCard = null;
        let minDistance = Infinity;

        vissionCards.forEach((card) => {
            const rect = card.getBoundingClientRect();
            const cardCenter = rect.top + rect.height / 2;
            const distance = Math.abs(cardCenter - centerY);
            if (distance < minDistance) {
                minDistance = distance;
                closestCard = card;
            }
        });

        if (closestCard) {
            vissionCards.forEach((card) => card.classList.toggle('is-active', card === closestCard));
        }
    };

    const handleVissionScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            updateActiveVissionCard();
            updateVissionBackground();
            ticking = false;
        });
    };

    vissionScrollContainer.addEventListener('scroll', handleVissionScroll, { passive: true });
    window.addEventListener('load', handleVissionScroll);
    updateActiveVissionCard();
    updateVissionBackground();
}

/* Appointment section reveal + simple submit handling */
const apointSection = document.querySelector('.apoint');
const apointForm = document.querySelector('.apoint-form');

if (apointSection) {
    const revealApoint = () => {
        const rect = apointSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
            apointSection.classList.add('is-visible');
            window.removeEventListener('scroll', revealApoint);
        }
    };

    window.addEventListener('scroll', revealApoint, { passive: true });
    window.addEventListener('load', revealApoint);
    revealApoint();
}

/* Floating draggable WhatsApp and Email buttons */
(function () {
    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
    const buttons = Array.from(document.querySelectorAll('.floating-action-btn'));
    const storeKey = (name) => `floatingBtnPosition_${name}`;

    const savePosition = (name, left, top) => {
        window.localStorage.setItem(storeKey(name), JSON.stringify({ left, top }));
    };

    const loadPosition = (name) => {
        try {
            const stored = window.localStorage.getItem(storeKey(name));
            return stored ? JSON.parse(stored) : null;
        } catch (error) {
            return null;
        }
    };

    const clampButton = (button) => {
        const rect = button.getBoundingClientRect();
        const minLeft = 8;
        const minTop = 8;
        const maxLeft = window.innerWidth - rect.width - 8;
        const maxTop = window.innerHeight - rect.height - 8;
        const left = clamp(parseFloat(button.style.left || button.getBoundingClientRect().left), minLeft, maxLeft);
        const top = clamp(parseFloat(button.style.top || button.getBoundingClientRect().top), minTop, maxTop);
        button.style.left = `${left}px`;
        button.style.top = `${top}px`;
        button.style.right = 'auto';
    };

    buttons.forEach((button) => {
        const name = button.classList.contains('floating-whatsapp') ? 'whatsapp' : 'email';
        const stored = loadPosition(name);
        if (stored && typeof stored.left === 'number' && typeof stored.top === 'number') {
            button.style.left = `${stored.left}px`;
            button.style.top = `${stored.top}px`;
            button.style.right = 'auto';
        }

        let startX = 0;
        let startY = 0;
        let startLeft = 0;
        let startTop = 0;
        let dragging = false;

        const onMove = (event) => {
            if (!dragging) return;
            const left = clamp(startLeft + event.clientX - startX, 8, window.innerWidth - button.offsetWidth - 8);
            const top = clamp(startTop + event.clientY - startY, 8, window.innerHeight - button.offsetHeight - 8);
            button.style.left = `${left}px`;
            button.style.top = `${top}px`;
            button.style.right = 'auto';
            event.preventDefault();
        };

        const onUp = (event) => {
            if (!dragging) return;
            dragging = false;
            button.releasePointerCapture(event.pointerId);
            button.style.cursor = 'grab';
            savePosition(name, parseFloat(button.style.left), parseFloat(button.style.top));
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
        };

        button.addEventListener('pointerdown', (event) => {
            if (event.button !== 0) return;
            startX = event.clientX;
            startY = event.clientY;
            const rect = button.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            dragging = true;
            button.setPointerCapture(event.pointerId);
            button.style.cursor = 'grabbing';
            if (button.style.right) {
                button.style.left = `${rect.left}px`;
                button.style.right = 'auto';
            }
            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onUp);
            event.preventDefault();
        });

        button.addEventListener('click', (event) => {
            if (dragging) {
                event.preventDefault();
            }
        });
    });

    window.addEventListener('resize', () => {
        buttons.forEach(clampButton);
    });
})();

if (apointForm) {
    const feedback = document.querySelector('.apoint-feedback');
    const submitButton = apointForm.querySelector('.btn-primary');
    const serviceId = 'YOUR_SERVICE_ID';
    const templateId = 'YOUR_TEMPLATE_ID';
    const publicKey = 'YOUR_PUBLIC_KEY';

    if (window.emailjs) {
        emailjs.init(publicKey);
    }

    const showFeedback = (message, type = 'success') => {
        if (!feedback) return;
        feedback.textContent = message;
        feedback.classList.toggle('success', type === 'success');
        feedback.classList.toggle('error', type === 'error');
    };

    const setButtonState = (isSubmitting) => {
        if (!submitButton) return;
        submitButton.disabled = isSubmitting;
        submitButton.textContent = isSubmitting ? 'Sending...' : 'Request Appointment';
    };

    apointForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('ap-name')?.value.trim();
        const email = document.getElementById('ap-email')?.value.trim();
        const phone = document.getElementById('ap-phone')?.value.trim();
        const message = document.getElementById('ap-message')?.value.trim();

        if (!name || !email || !phone) {
            showFeedback('Please fill in your name, email, and phone before sending.', 'error');
            return;
        }

        const templateParams = {
            to_email: 'dandoyi444@gmail.com,booncompanionconsults@gmail.com',
            from_name: name,
            from_email: email,
            phone_number: phone,
            message: message || '(no message provided)',
            timestamp: new Date().toLocaleString(),
            subject: `Appointment request from ${name}`
        };

        if (window.emailjs && serviceId && templateId && publicKey && serviceId !== 'YOUR_SERVICE_ID') {
            setButtonState(true);
            emailjs.send(serviceId, templateId, templateParams)
                .then(() => {
                    setButtonState(false);
                    showFeedback('Appointment request sent successfully. Admins have been notified.', 'success');
                    apointForm.reset();
                    openApointModal('Appointment Request Sent', 'Your appointment request has been delivered to the admin team. Someone will reach out soon.');
                })
                .catch(() => {
                    setButtonState(false);
                    showFeedback('Unable to send via mailer service. Please use the manual email app option below.', 'error');
                });
            return;
        }

        const subject = `Appointment request from ${name}`;
        const bodyLines = [
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone}`,
            `Message: ${message || '(no message provided)'}`,
            `Date: ${new Date().toLocaleString()}`
        ];
        const body = encodeURIComponent(bodyLines.join('\n'));
        const mailToLink = `mailto:dandoyi444@gmail.com,booncompanionconsults@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

        showFeedback('Email client opened. If it did not, please send the request manually.', 'success');
        window.location.href = mailToLink;
    });

    const modal = document.querySelector('.apoint-modal');
    const modalClose = document.querySelector('.apoint-modal-close');

    const openApointModal = (title, body) => {
        if (!modal) return;
        modal.querySelector('.apoint-modal-title').textContent = title;
        modal.querySelector('.apoint-modal-body').textContent = body;
        modal.classList.add('is-visible');
        modal.setAttribute('aria-hidden', 'false');
    };

    const closeApointModal = () => {
        if (!modal) return;
        modal.classList.remove('is-visible');
        modal.setAttribute('aria-hidden', 'true');
    };

    modalClose?.addEventListener('click', closeApointModal);
    modal?.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeApointModal();
        }
    });
}

/* Partners marquee duplication and behavior */
const partnersTrack = document.querySelector('.partners-track');
const partnersViewport = document.querySelector('.partners-viewport');

if (partnersTrack && partnersViewport) {
    // duplicate content for seamless scrolling
    partnersTrack.innerHTML = partnersTrack.innerHTML + partnersTrack.innerHTML;

    const setMarqueeDuration = () => {
        // total width of one set
        const children = Array.from(partnersTrack.children);
        let total = 0;
        // consider only first half (original set)
        const half = children.slice(0, children.length / 2);
        half.forEach((el) => {
            total += el.getBoundingClientRect().width + parseFloat(getComputedStyle(partnersTrack).gap || 24);
        });

        const speedPxPerSec = 80; // feel free to tweak
        const duration = Math.max(8, total / speedPxPerSec);
        partnersTrack.style.animationDuration = `${duration}s`;
    };

    // recalculate on load and resize
    window.addEventListener('load', setMarqueeDuration);
    window.addEventListener('resize', () => { clearTimeout(window._pt); window._pt = setTimeout(setMarqueeDuration, 120); });
    setMarqueeDuration();

    // pause on hover / touch
    partnersViewport.addEventListener('mouseenter', () => partnersTrack.classList.add('paused'));
    partnersViewport.addEventListener('mouseleave', () => partnersTrack.classList.remove('paused'));
    partnersViewport.addEventListener('touchstart', () => partnersTrack.classList.add('paused'));
    partnersViewport.addEventListener('touchend', () => partnersTrack.classList.remove('paused'));
}

/* Footer newsletter handling */
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = newsletterForm.querySelector('.btn-subscribe');
        const input = newsletterForm.querySelector('input[name="email"]');
        if (!input || !input.value) {
            input?.focus();
            return;
        }
        btn.textContent = 'Subscribed ✓';
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = 'Subscribe';
            btn.disabled = false;
            newsletterForm.reset();
        }, 2000);
    });
}
