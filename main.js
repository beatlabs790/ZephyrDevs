document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Particles Background
  initCanvasBackground();

  // 2. Floating Top Pill-Nav Sliding Indicator
  initTopPillNav();

  // 3. Scroll Reveal Observer
  initScrollReveal();

  // 4. Budget Planner Slide Indicator
  initBudgetSlider();

  // 5. Contact Form Submission & Genie Success modal (with custom Formspree URL)
  initContactForm();

  // 6. FAQ Accordion Collapse/Expand
  initFAQAccordion();

  // 7. Interactive AI Sandbox Terminal Toggles
  initAISandbox();

  // 8. Custom Devreon Interactive Features
  initDevreonBackdrop();

  // 9. Initialize Firebase Proxy & Control Center
  initFirebaseProxy();

  // 10. Bottom Tech Stack Announcement Ticker
  initTechTicker();

  // 11. Interactive Mock Chatbot
  initChatbot();

  // 12. Theme Switcher (Light/Dark Toggle)
  initThemeToggle();

  // 13. Live Website Preview Modal
  initLivePreviewModal();
});

/* =========================================================================
   1. Interactive Live Canvas Background & GPU Spotlight Glow
   ========================================================================= */
function initCanvasBackground() {
  const canvas = document.getElementById('background-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let ripples = [];
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  function resolveColor(colorStr) {
    if (!colorStr) return '#ffffff';
    if (colorStr.startsWith('var(')) {
      const varName = colorStr.match(/var\(([^)]+)\)/)[1];
      return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#ffffff';
    }
    return colorStr;
  }

  // 3 Layers of Particles for 3D Parallax Depth (Optimized)
  const layers = [
    { count: Math.min(10, Math.floor(width / 150)), sizeRange: [4, 7], speedRange: [0.05, 0.12], opacity: 0.1, blur: true, colors: ['#12131c', '#270e3a'] }, // Background (Slow, large, pre-blurred gradient)
    { count: Math.min(18, Math.floor(width / 100)), sizeRange: [2, 3], speedRange: [0.12, 0.22], opacity: 0.3, blur: false, colors: ['#94a3b8', 'var(--neon-cyan)'] },  // Midground (Normal)
    { count: Math.min(18, Math.floor(width / 100)), sizeRange: [1, 1.5], speedRange: [0.22, 0.4], opacity: 0.6, blur: false, colors: ['var(--neon-green)', 'var(--neon-violet)'] } // Foreground (Fast, glowing violet/rose)
  ];

  const mouse = { x: null, y: null, radius: 180 };
  const glow = document.getElementById('flashlight-glow');

  class Particle {
    constructor(layerConfig) {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      
      const speed = Math.random() * (layerConfig.speedRange[1] - layerConfig.speedRange[0]) + layerConfig.speedRange[0];
      const angle = Math.random() * Math.PI * 2;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      
      this.baseRadius = Math.random() * (layerConfig.sizeRange[1] - layerConfig.sizeRange[0]) + layerConfig.sizeRange[0];
      this.radius = this.baseRadius;
      this.opacity = layerConfig.opacity;
      this.blur = layerConfig.blur;
      this.colors = layerConfig.colors;
      this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    update() {
      // Bounce off walls
      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      this.x += this.vx;
      this.y += this.vy;

      // Interaction with mouse gravity orbit
      if (mouse.x !== null && mouse.y !== null) {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          
          this.x += Math.sin(angle) * force * 1.2;
          this.y -= Math.cos(angle) * force * 1.2;
          this.radius = this.baseRadius + force * 1.2;
        } else {
          if (this.radius > this.baseRadius) this.radius -= 0.05;
        }
      }

      // Interaction with click ripples
      ripples.forEach(ripple => {
        const dx = this.x - ripple.x;
        const dy = this.y - ripple.y;
        const dist = Math.hypot(dx, dy);
        
        if (dist < ripple.currentRadius && dist > ripple.currentRadius - 40) {
          const pushForce = (1 - dist / ripple.maxRadius) * 6;
          const angle = Math.atan2(dy, dx);
          this.x += Math.cos(angle) * pushForce;
          this.y += Math.sin(angle) * pushForce;
        }
      });
    }

    draw() {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.globalAlpha = this.opacity;

      const resolvedColor = resolveColor(this.color);

      if (this.blur) {
        // Fast radial gradient instead of slow context filter blurs
        const radialGrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        radialGrad.addColorStop(0, resolvedColor);
        radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radialGrad;
      } else {
        ctx.fillStyle = resolvedColor;
        if (this.color.includes('green') || this.color.includes('cyan')) {
          ctx.shadowBlur = 6;
          ctx.shadowColor = resolveColor('var(--neon-green-glow)');
        }
      }
      
      ctx.fill();
      ctx.restore();
    }
  }

  class Ripple {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.currentRadius = 0;
      this.maxRadius = 240;
      this.speed = 4;
      this.opacity = 0.5;
    }

    update() {
      this.currentRadius += this.speed;
      this.opacity = 1 - (this.currentRadius / this.maxRadius);
    }

    draw() {
      if (this.opacity <= 0) return;
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.currentRadius, 0, Math.PI * 2);
      ctx.strokeStyle = resolveColor(`var(--neon-cyan-glow)`);
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = resolveColor('var(--neon-cyan-glow)');
      ctx.stroke();
      ctx.restore();
    }
  }

  function setup() {
    particles = [];
    ripples = [];
    layers.forEach(layerConfig => {
      for (let i = 0; i < layerConfig.count; i++) {
        particles.push(new Particle(layerConfig));
      }
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Update and draw ripples
    ripples = ripples.filter(r => r.currentRadius < r.maxRadius);
    ripples.forEach(r => {
      r.update();
      r.draw();
    });

    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Connect close midground/foreground particles (Skip background items to optimize O(N^2))
    const connectable = particles.filter(p => !p.blur);
    for (let i = 0; i < connectable.length; i++) {
      for (let j = i + 1; j < connectable.length; j++) {
        const dx = connectable[i].x - connectable[j].x;
        const dy = connectable[i].y - connectable[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < 80) { // Keep search distance tight for performance
          const alpha = (80 - dist) / 80 * 0.1;
          const grad = ctx.createLinearGradient(connectable[i].x, connectable[i].y, connectable[j].x, connectable[j].y);
          grad.addColorStop(0, resolveColor(connectable[i].color));
          grad.addColorStop(1, resolveColor(connectable[j].color));
          
          ctx.strokeStyle = grad;
          ctx.globalAlpha = alpha;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(connectable[i].x, connectable[i].y);
          ctx.lineTo(connectable[j].x, connectable[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  // Mouse move tracks coordinates & spotlight transform (compositor GPU accelerated)
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    if (glow) {
      glow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate3d(-50%, -50%, 0)`;
    }
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Spawn ripple on click
  window.addEventListener('click', (e) => {
    if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.nav-pill')) return;
    ripples.push(new Ripple(e.clientX, e.clientY));
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      mouse.x = touchX;
      mouse.y = touchY;
      if (glow) {
        glow.style.transform = `translate3d(${touchX}px, ${touchY}px, 0) translate3d(-50%, -50%, 0)`;
      }
    }
  });

  window.addEventListener('touchend', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Resize throttle
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      setup();
    }, 200);
  });

  setup();
  animate();
}

/* =========================================================================
   2. Floating Top Pill-Nav Sliding Indicator & Drawer Menu
   ========================================================================= */
function initTopPillNav() {
  const navContainer = document.querySelector('.nav-links-container');
  const indicator = document.querySelector('.nav-indicator');
  const navLinks = document.querySelectorAll('.nav-link-item');
  const burger = document.getElementById('nav-burger-btn');
  const drawer = document.getElementById('mobile-drawer-menu');
  const drawerLinks = document.querySelectorAll('.mobile-nav-link');

  if (!navContainer || !indicator) return;

  // Function to move active bubble position
  function updateIndicator(activeLink) {
    indicator.style.width = `${activeLink.offsetWidth}px`;
    indicator.style.transform = `translateX(${activeLink.offsetLeft}px)`;
  }

  // Set initial position matching active page route
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  let activeFound = false;

  navLinks.forEach((link) => {
    const page = link.getAttribute('onclick').match(/'([^']+)'/)[1];
    if (currentPath === page) {
      link.classList.add('active');
      updateIndicator(link);
      activeFound = true;
    } else {
      link.classList.remove('active');
    }
  });

  drawerLinks.forEach((link) => {
    const page = link.getAttribute('onclick').match(/'([^']+)'/)[1];
    if (currentPath === page) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Default to home link if page is not matches
  if (!activeFound && navLinks.length > 0) {
    navLinks[0].classList.add('active');
    updateIndicator(navLinks[0]);
  }

  // Recalculate indicators on resize
  window.addEventListener('resize', () => {
    const activeLink = navContainer.querySelector('.nav-link-item.active');
    if (activeLink) {
      updateIndicator(activeLink);
    }
  });

  // Mobile Hamburger Toggle
  if (burger && drawer) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      drawer.classList.toggle('open');
    });
  }
}

/* =========================================================================
   3. Scroll Reveal Transition Observer
   ========================================================================= */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  reveals.forEach((element) => {
    revealObserver.observe(element);
  });
}

/* =========================================================================
   4. Budget Range Slider Indicator (INR)
   ========================================================================= */
function initBudgetSlider() {
  const planCards = document.querySelectorAll('.plan-selector-card');
  const addonCards = document.querySelectorAll('.addon-card');
  const totalValueEl = document.getElementById('estimated-total-value');
  if (planCards.length === 0) return;

  const basePrices = {
    starter: 1999,
    pro: 2999,
    enterprise: 4999
  };

  function calculateTotal() {
    let total = 0;
    const activePlan = document.querySelector('.plan-selector-card.active');
    if (activePlan) {
      const planVal = activePlan.dataset.plan;
      total += basePrices[planVal] || 1999;
    }

    addonCards.forEach(card => {
      const checkbox = card.querySelector('.addon-checkbox');
      if (checkbox && checkbox.checked) {
        total += parseInt(card.dataset.price) || 0;
      }
    });

    if (totalValueEl) {
      totalValueEl.textContent = `₹${total.toLocaleString('en-IN')}`;
    }
  }

  planCards.forEach(card => {
    card.addEventListener('click', () => {
      planCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const radio = card.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
      calculateTotal();
    });
  });

  addonCards.forEach(card => {
    card.addEventListener('click', () => {
      const checkbox = card.querySelector('.addon-checkbox');
      if (checkbox) {
        checkbox.checked = !checkbox.checked;
        card.classList.toggle('active', checkbox.checked);
        calculateTotal();
      }
    });
  });

  calculateTotal();
}

/* =========================================================================
   5. Contact Form Submission & Formspree (xojovjda)
   ========================================================================= */
function initContactForm() {
  const form = document.getElementById('contact-project-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('contact-name').value;
    const email = document.getElementById('contact-email').value;
    const company = document.getElementById('contact-company').value;
    const phone = document.getElementById('contact-phone').value;
    const desc = document.getElementById('project-desc').value;
    
    const activeCard = document.querySelector('.plan-selector-card.active');
    const planText = activeCard ? `${activeCard.querySelector('.plan-name').textContent.trim()} (${activeCard.querySelector('.plan-price').textContent.trim()})` : 'Starter (₹1,999/yr)';

    const selectedAddons = [];
    document.querySelectorAll('input[name="addons"]:checked').forEach(cb => {
      const addonCard = cb.closest('.addon-card');
      if (addonCard) {
        selectedAddons.push(addonCard.querySelector('.addon-name').textContent.trim());
      }
    });

    const totalValueEl = document.getElementById('estimated-total-value');
    const totalText = totalValueEl ? totalValueEl.textContent : '₹1,999';

    // Display loading state on submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `Sending Brief... <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: loader-spin 1s linear infinite; margin-left: 6px;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`;

    // Create payload
    const payload = {
      name: name,
      email: email,
      phone: phone,
      company: company || 'N/A',
      selectedPlan: planText,
      addonsSelected: selectedAddons.join(', ') || 'None',
      estimatedTotal: totalText,
      description: desc
    };

    // Submits directly to your verified Formspree inbox (xojovjda)
    fetch('https://formspree.io/f/xojovjda', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })
    .then(response => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
      
      if (response.ok) {
        showGenieModal('success-modal', `
          <div class="success-container">
            <div class="success-icon-circle">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
            </div>
            <h3>Project Brief Delivered!</h3>
            <p style="color: var(--text-secondary); margin-bottom: 20px;">
              Thanks, <strong>${name}</strong>. Your project brief has been sent to our founders. We will review details and reach out shortly!
            </p>
            <button class="btn btn-primary" onclick="closeGenieModal('success-modal')">Close</button>
          </div>
        `);
        form.reset();
        
        // Reset addon cards UI
        document.querySelectorAll('.addon-card').forEach(card => {
          const cb = card.querySelector('.addon-checkbox');
          if (cb) cb.checked = false;
          card.classList.remove('active');
        });
        
        // Reset plan selector to default (Starter)
        const defaultCard = document.querySelector('.plan-selector-card[data-plan="starter"]');
        if (defaultCard) defaultCard.click();
      } else {
        throw new Error('Formspree response not ok');
      }
    })
    .catch(error => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;

      // Fallback: trigger local client prefilled templates
      const subject = encodeURIComponent(`Project Brief - ${company || name}`);
      const bodyText = encodeURIComponent(
        `Hi ZephyrDevs,\n\n` +
        `My name is ${name}.\n` +
        `Email: ${email}\n` +
        `Phone: ${phone}\n` +
        `Company: ${company || 'N/A'}\n` +
        `Plan Selected: ${planText}\n` +
        `Add-ons Selected: ${selectedAddons.join(', ') || 'None'}\n` +
        `Estimated Total: ${totalText}\n\n` +
        `Project Description:\n${desc}`
      );
      window.location.href = `mailto:zephyrdevsofficial@gmail.com?subject=${subject}&body=${bodyText}`;

      showGenieModal('success-modal', `
        <div class="success-container">
          <div class="success-icon-circle" style="border-color: #ffbd2e; background: rgba(255, 189, 46, 0.1); color: #ffbd2e; box-shadow: 0 0 15px rgba(255, 189, 46, 0.2);">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z"></path><path d="m22 9-9.3 5.4a2 2 0 0 1-2.2 0L2 9"></path></svg>
          </div>
          <h3>Email Client Opened</h3>
          <p style="color: var(--text-secondary); margin-bottom: 20px;">
            We prefilled your project details. Please click **Send** inside your email client to deliver the brief directly to **zephyrdevsofficial@gmail.com**!
          </p>
          <button class="btn btn-primary" onclick="closeGenieModal('success-modal')">Close</button>
        </div>
      `);
    });
  });
}

/* =========================================================================
   6. FAQ Accordion Collapse/Expand
   ========================================================================= */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (faqItems.length === 0) return;

  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-question-btn');
    const answer = item.querySelector('.faq-answer');

    questionBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other items
      faqItems.forEach((otherItem) => {
        otherItem.classList.remove('open');
        otherItem.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = `${answer.scrollHeight}px`;
      }
    });
  });
}

/* =========================================================================
   7. Interactive AI Sandbox Terminal
   ========================================================================= */
function initAISandbox() {
  const tabBtns = document.querySelectorAll('.sandbox-tab-btn');
  const actionBtns = document.querySelectorAll('.sandbox-action-btn');
  const consoleOutput = document.getElementById('sandbox-output-text');
  const loader = document.getElementById('sandbox-loader-element');

  if (!consoleOutput || !loader) return;

  let activeAI = 'gemini'; // default

  let activeTypingTimeout = null;

  // Tab switching
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (activeTypingTimeout) clearTimeout(activeTypingTimeout);
      tabBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeAI = btn.dataset.ai;
      
      // Clear console and show welcome text
      consoleOutput.innerHTML = `<span style="color: var(--text-muted);">// System ready. Choose an action below to query ${activeAI === 'gemini' ? 'Google Gemini' : 'Anthropic Claude'}...</span>`;
    });
  });

  const sandboxDatabase = {
    gemini: {
      analyze: `[Google Gemini 1.5 Pro API]
> Analysis Result: Page components successfully loaded.
> Core Speed Index: 99.8% (FCP: 0.62s)
> Structure check: Fully semantic tags utilized. No missing alt tags.
> SEO rating: 100/100. Google bots indexed successfully.`,
      backend: `[Google Gemini 1.5 Pro API]
> Schema check: Firebase Firestore collections resolved.
> Connection State: Connected to Node.js backend.
> Secure Auth: Token verification set to HS256 active.
> Recommendation: Firebase storage cache is optimized for 24h.`,
      prompt: `[Google Gemini 1.5 Pro API]
> Prompt generated: "Contextual system parsing for developer queries."
> Token cost: 18 tokens.
> Response: System connected. Ready to index incoming query details.`,
      tuning: `[Google Gemini 1.5 Pro API]
> Tuning State: Prompt temperature set to 0.4 (low variance).
> Safety settings: Block rate parameters set to strict.
> Model size: Gemini 1.5 Flash activated for quick responses.`
    },
    claude: {
      analyze: `[Anthropic Claude 3.5 Sonnet API]
> Code Analysis: Found connection loop in main.js.
> Optimizing connectable[]: Connected nodes restricted to foreground.
> Performance update: Connection loops complexity reduced by 60%.
> Render speed: Framerate optimized to stable 60fps compositor layers.`,
      backend: `[Anthropic Claude 3.5 Sonnet API]
> Logic audit: Form inputs serialized successfully.
> Forwarding check: Connected to Formspree xojovjda endpoint.
> Security rules: Firebase Firestore rules configured. Write allowed only on valid emails.`,
      prompt: `[Anthropic Claude 3.5 Sonnet API]
> Prompt template: "Act as ZephyrDevs AI Agent. Draft project scope response."
> Input token count: 145 tokens.
> Execution output: Project request processed. Lead forwarded to founders.`,
      tuning: `[Anthropic Claude 3.5 Sonnet API]
> System instructions: Strict technical context output enabled.
> Response speed: Claude 3.5 Haiku activated.
> Token budget: Setup complete with standard rate limit configurations.`
    }
  };

  function typeConsoleOutput(responseText) {
    if (activeTypingTimeout) clearTimeout(activeTypingTimeout);
    consoleOutput.innerHTML = '';

    const lines = responseText.split('\n');
    let currentLineIndex = 0;
    let currentCharIndex = 0;
    let currentLineElement = null;

    const cursor = document.createElement('span');
    cursor.className = 'console-cursor';
    cursor.innerHTML = '&#9608;'; // Block cursor

    function typeNextChar() {
      if (currentLineIndex >= lines.length) {
        cursor.remove();
        return;
      }

      const lineText = lines[currentLineIndex];

      if (currentCharIndex === 0) {
        currentLineElement = document.createElement('div');
        currentLineElement.className = 'console-line';
        
        if (lineText.startsWith('[')) {
          currentLineElement.style.color = 'var(--neon-violet)';
        } else if (lineText.startsWith('>')) {
          currentLineElement.style.color = 'var(--neon-green)';
        } else {
          currentLineElement.style.color = 'var(--text-primary)';
        }

        consoleOutput.appendChild(currentLineElement);
        currentLineElement.appendChild(cursor);
      }

      if (currentCharIndex < lineText.length) {
        const char = lineText[currentCharIndex];
        const textNode = document.createTextNode(char);
        currentLineElement.insertBefore(textNode, cursor);
        currentCharIndex++;
        activeTypingTimeout = setTimeout(typeNextChar, 10);
      } else {
        currentCharIndex = 0;
        currentLineIndex++;
        activeTypingTimeout = setTimeout(typeNextChar, 60);
      }
    }

    typeNextChar();
  }

  // Action clicks
  actionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      
      if (activeTypingTimeout) clearTimeout(activeTypingTimeout);
      consoleOutput.innerHTML = '';
      loader.style.display = 'flex';

      setTimeout(() => {
        loader.style.display = 'none';
        const responseText = sandboxDatabase[activeAI][action];
        typeConsoleOutput(responseText);
      }, 600);
    });
  });
}

/* =========================================================================
   8. Genie-Style Modal Helper Controls & Navigation
   ========================================================================= */
window.showGenieModal = function (modalId, contentHTML) {
  let overlay = document.getElementById(modalId);
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = modalId;
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-box glass-panel">
        <div class="modal-close-btn" onclick="closeGenieModal('${modalId}')">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </div>
        <div class="modal-body-content"></div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  const modalBox = overlay.querySelector('.modal-box');
  const bodyContent = overlay.querySelector('.modal-body-content');
  if (contentHTML) bodyContent.innerHTML = contentHTML;

  overlay.classList.add('active');

  modalBox.classList.remove('genie-close-transition');
  modalBox.classList.add('genie-open-transition');
};

window.closeGenieModal = function (modalId) {
  const overlay = document.getElementById(modalId);
  if (!overlay) return;

  const modalBox = overlay.querySelector('.modal-box');

  modalBox.classList.remove('genie-open-transition');
  modalBox.classList.add('genie-close-transition');

  setTimeout(() => {
    overlay.classList.remove('active');
  }, 480);
};

window.navigateTo = function (page) {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.25s ease';
  
  // Close mobile drawer if open
  const burger = document.getElementById('nav-burger-btn');
  const drawer = document.getElementById('mobile-drawer-menu');
  if (burger && drawer) {
    burger.classList.remove('open');
    drawer.classList.remove('open');
  }

  setTimeout(() => {
    window.location.href = page;
  }, 250);
};

// Handle route pre-fills & cinematic intro gate
function handlePageLoad() {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedPlan = urlParams.get('plan');
  if (selectedPlan) {
    const planName = (selectedPlan === 'free') ? 'starter' : selectedPlan;
    const descTextarea = document.getElementById('project-desc');
    if (descTextarea) {
      descTextarea.value = `I am interested in starting a project using the [${planName.toUpperCase()} Plan]. `;
    }
    const targetPlanCard = document.querySelector(`.plan-selector-card[data-plan="${planName}"]`);
    if (targetPlanCard) {
      targetPlanCard.click();
    }
  }
  
  // --- Cinematic Intro Gate ---
  const gate = document.getElementById('intro-gate');
  const taglineEl = document.getElementById('intro-tagline');
  const progressFill = document.getElementById('intro-progress');
  const counterVal = document.getElementById('intro-counter-val');

  if (gate) {
    if (gate.classList.contains('fast-loader')) {
      // Super fast curtain split transition for other pages
      setTimeout(() => {
        gate.classList.add('lifted');
        document.body.classList.remove('loading-active');
        setTimeout(() => {
          gate.classList.add('done');
        }, 1000);
      }, 150);
    } else if (taglineEl) {
      // Full cinematic loader (only on homepage)
      // Build char-by-char tagline: "redesigned for speed"
      const words = [
        { text: 'redesigned', accent: false },
        { text: ' ', accent: false },
        { text: 'for', accent: false },
        { text: ' ', accent: false },
        { text: 'speed', accent: true }
      ];

      let charIndex = 0;
      words.forEach(word => {
        if (word.text === ' ') {
          taglineEl.appendChild(document.createTextNode('\u00A0'));
          return;
        }
        const wordSpan = document.createElement('span');
        if (word.accent) wordSpan.classList.add('intro-accent');

        word.text.split('').forEach(char => {
          const charSpan = document.createElement('span');
          charSpan.classList.add('intro-char');
          charSpan.textContent = char;
          charSpan.style.animationDelay = `${0.15 + charIndex * 0.035}s`;
          wordSpan.appendChild(charSpan);
          charIndex++;
        });

        taglineEl.appendChild(wordSpan);
      });

      // Animate progress bar & 0-100% counter
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += Math.random() * 12 + 4;
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);
        }
        if (progressFill) progressFill.style.width = `${progress}%`;
        if (counterVal) {
          counterVal.textContent = String(Math.round(progress)).padStart(3, '0');
        }
      }, 120);

      // Lift the curtain after the sequence
      const liftDelay = 2200;
      setTimeout(() => {
        clearInterval(progressInterval);
        if (progressFill) progressFill.style.width = '100%';
        if (counterVal) counterVal.textContent = '100';
        
        setTimeout(() => {
          gate.classList.add('lifted');
          document.body.classList.remove('loading-active');

          // Remove from DOM after transition completes
          setTimeout(() => {
            gate.classList.add('done');
          }, 1000);
        }, 300);
      }, liftDelay);
    } else {
      document.body.classList.remove('loading-active');
    }
  } else {
    // Fallback: just unlock scroll if no gate found
    document.body.classList.remove('loading-active');
  }
  
  document.body.style.opacity = '1';
  document.body.style.transition = 'opacity 0.25s ease';
}

if (document.readyState === 'complete') {
  handlePageLoad();
} else {
  window.addEventListener('load', handlePageLoad);
}


/* =========================================================================
   9. Custom Devreon Interactive Features
   ========================================================================= */
function initDevreonBackdrop() {
  // Mouse interactive grid spotlight position
  window.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${(e.clientX / window.innerWidth) * 100}%`);
    document.documentElement.style.setProperty('--mouse-y', `${(e.clientY / window.innerHeight) * 100}%`);
  });

  // Custom cursor movement
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && ring) {
    window.addEventListener('mousemove', (e) => {
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
      
      ring.animate({
        left: `${e.clientX}px`,
        top: `${e.clientY}px`
      }, { duration: 150, fill: "forwards" });
    });

    const hoverables = document.querySelectorAll('a, button, input, textarea, select, .nav-link-item, .faq-question-btn, [onclick], .btn, .social-link');
    hoverables.forEach(item => {
      item.addEventListener('mouseenter', () => {
        ring.classList.add('hot');
      });
      item.addEventListener('mouseleave', () => {
        ring.classList.remove('hot');
      });
    });
  }
}

/* =========================================================================
   10. Firebase Administration & Maintenance Mode
   ========================================================================= */

// Global State
let dbState = {
  maintenance: false,
  announcement: { active: false, text: '' },
  team: {},
  password: 'admin00', // Default fallback
  loadingText: 'We Levlled Up.',
  customConfig: null,
  themeAccent: 'lime',
  activityLogs: []
};

let firebaseCallbacks = {};

// Helper to make async calls to our Firebase iframe proxy
window.firebaseCall = function (action, data) {
  return new Promise((resolve, reject) => {
    const id = Math.random().toString(36).substring(2);
    firebaseCallbacks[id] = { resolve, reject };
    
    const iframe = document.getElementById('firebase-api-iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({ id, action, data }, '*');
    } else {
      resolve(null);
    }
  });
};

// Initialize the Firebase hidden iframe
window.initFirebaseProxy = function () {
  if (document.getElementById('firebase-api-iframe')) return;

  const iframe = document.createElement('iframe');
  iframe.id = 'firebase-api-iframe';
  iframe.src = 'api.html';
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  // Setup message receiver for responses and real-time updates
  window.addEventListener('message', (e) => {
    const { id, result, error, type, key, val, config } = e.data || {};

    // 1. Handle firebase ready message
    if (type === 'firebaseReady') {
      window.activeFirebaseConfig = config;
      initializeDefaultDataIfEmpty();
      return;
    }

    // 2. Handle async call callbacks
    if (id && firebaseCallbacks[id]) {
      if (error) {
        firebaseCallbacks[id].reject(new Error(error));
      } else {
        firebaseCallbacks[id].resolve(result);
      }
      delete firebaseCallbacks[id];
      return;
    }

    // 3. Handle real-time DB updates
    if (type === 'dbUpdate') {
      dbState[key] = val;
      
      if (key === 'maintenance') {
        handleMaintenanceUpdate(val);
      } else if (key === 'announcement') {
        handleAnnouncementUpdate(val);
      } else if (key === 'team') {
        handleTeamUpdate(val);
      } else if (key === 'themeAccent') {
        applyThemeAccent(val);
      } else if (key === 'activityLogs') {
        renderActivityLogs(val);
      } else if (key === 'loadingText') {
        handleLoadingTextUpdate(val);
      } else if (key === 'customConfig') {
        // If Firebase active config is not ready yet, ignore initial load updates
        if (!window.activeFirebaseConfig) {
          return;
        }

        const active = window.activeFirebaseConfig;
        const newConfig = val;

        const normalizeUrl = (url) => {
          if (!url) return '';
          return url.replace(/\/+$/, '').toLowerCase();
        };

        const activeUrl = normalizeUrl(active ? active.databaseURL : '');
        const newUrl = normalizeUrl(newConfig ? newConfig.databaseURL : '');
        const activeApiKey = active ? active.apiKey : '';
        const newApiKey = newConfig ? newConfig.apiKey : '';

        // 1. If we have a new custom config, and it doesn't match our active config:
        if (newConfig && (newUrl !== activeUrl || newApiKey !== activeApiKey)) {
          console.log("Firebase sync credentials updated. Reconnecting...");
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
        // 2. If the custom config was removed (val is null), but our active database is NOT the default database:
        else if (!newConfig && activeUrl && activeUrl !== normalizeUrl("https://zephyrdevs-905b9-default-rtdb.firebaseio.com")) {
          console.log("Firebase config reset to default. Reconnecting...");
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      }
    }
  });

  // Inject the Admin panel modals when iframe has loaded
  iframe.onload = () => {
    injectAdminModals();
  };
};

// Default co-founders data to initialize Firebase DB if empty
const defaultDbData = {
  maintenance: false,
  announcement: {
    active: false,
    text: "Welcome to ZephyrDevs! We are now booking new projects."
  },
  password: "admin00",
  themeAccent: "lime",
  team: {
    "founder_akshansh": {
      name: "Akshansh Sinha",
      role: "Co-Founder & Tech Architect",
      bio: "Specializes in backend architecture, Google Gemini model tuning, and cloud-native solutions with Node.js and Firebase.",
      instagram: "akshansh_6969",
      initials: "AS",
      gradient: "linear-gradient(135deg, rgba(0, 230, 118, 0.2) 0%, rgba(0, 176, 255, 0.2) 100%)",
      pfp: "https://i.ibb.co/ZpbWz2g9/aksansh.jpg"
    },
    "founder_aarav": {
      name: "Aarav Sharma",
      role: "Co-Founder & Creative Lead",
      bio: "Designs premium glassmorphic UI interfaces, creates fluid custom animations, and manages Claude AI API pipelines.",
      instagram: "aarav_sharma_sui",
      initials: "AS",
      gradient: "linear-gradient(135deg, rgba(0, 176, 255, 0.2) 0%, rgba(200, 0, 255, 0.2) 100%)"
    },
    "founder_arshh": {
      name: "Arshh",
      role: "Co-Founder & Lead AI Engineer",
      bio: "Focuses on advanced Claude AI workflows, neural-network integrations, and high-performance server logic.",
      instagram: "arshhispro_",
      initials: "AR",
      gradient: "linear-gradient(135deg, rgba(200, 0, 255, 0.2) 0%, rgba(0, 230, 118, 0.2) 100%)"
    }
  }
};

async function initializeDefaultDataIfEmpty() {
  try {
    await firebaseCall('initializeDefaultData', defaultDbData);
  } catch (err) {
    console.error('Failed to initialize default DB data:', err);
  }
}

// ---------------------- Loading Text Update ----------------------
function handleLoadingTextUpdate(val) {
  const loadingTextEl = document.querySelector('.intro-loading-text');
  if (loadingTextEl) {
    loadingTextEl.innerText = val || 'We Levlled Up.';
  }
}

// ---------------------- Maintenance Mode ----------------------
function handleMaintenanceUpdate(active) {
  let screen = document.getElementById('maintenance-screen');
  const isAdmin = sessionStorage.getItem('zephyr_admin') === 'true';

  if (active && !isAdmin) {
    if (!screen) {
      screen = document.createElement('div');
      screen.id = 'maintenance-screen';
      screen.className = 'maintenance-screen';
      screen.innerHTML = `
        <div class="maintenance-content">
          <svg class="maintenance-icon" viewBox="0 0 24 24" width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <h2 class="maintenance-title">system maintenance</h2>
          <p class="maintenance-desc">zephyrdevs is currently performing scheduled upgrades. we will be online shortly.</p>
          <span class="maintenance-logo-label">zephyrdevs — 2026</span>
        </div>
        <button class="maintenance-admin-link" onclick="openAdminPanel(event)">[Admin Login]</button>
      `;
      document.body.appendChild(screen);
      document.body.classList.add('loading-active'); // Locks scrolling
    }
  } else {
    if (screen) {
      screen.remove();
      if (!document.body.classList.contains('preloading')) {
        document.body.classList.remove('loading-active'); // Unlocks scrolling
      }
    }
  }
}

// ---------------------- Announcement Bar ----------------------
function handleAnnouncementUpdate(announcement) {
  let bar = document.getElementById('announcement-bar');
  
  if (announcement && announcement.active && announcement.text) {
    document.body.classList.add('has-announcement');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'announcement-bar';
      bar.className = 'announcement-bar';
      document.body.insertBefore(bar, document.body.firstChild);
    }
    bar.innerHTML = `<span class="announcement-dot"></span> <span>${announcement.text}</span>`;
    bar.style.display = 'flex';
  } else {
    document.body.classList.remove('has-announcement');
    if (bar) {
      bar.style.display = 'none';
    }
  }
}

// ---------------------- Team Roster Update ----------------------
function handleTeamUpdate(teamData) {
  const grid = document.querySelector('.founders-grid');
  if (!grid) return; // Only index.html has co-founders grid

  grid.innerHTML = '';
  if (!teamData) return;

  Object.keys(teamData).forEach(key => {
    const m = teamData[key];
    const card = document.createElement('div');
    card.className = 'founder-card glass-panel reveal reveal-scale in'; // instantly reveal
    card.style.opacity = '1';
    card.style.transform = 'translateY(0) scale(1)';
    let avatarStyle = '';
    let avatarContent = '';
    if (m.pfp) {
      avatarStyle = `background-image: url('${m.pfp}'); background-size: cover; background-position: center;`;
    } else {
      avatarStyle = `background: ${m.gradient || 'linear-gradient(135deg, var(--neon-green) 0%, var(--neon-cyan) 100%)'};`;
      avatarContent = m.initials || m.name.split(' ').map(n => n[0]).join('');
    }

    card.innerHTML = `
      <div class="founder-avatar-wrapper">
        <div class="founder-avatar" style="${avatarStyle}">
          ${avatarContent}
        </div>
      </div>
      <span class="founder-role">${m.role}</span>
      <h3 class="founder-name">${m.name}</h3>
      <p class="founder-bio">${m.bio}</p>
      <div class="founder-socials">
        <a href="https://instagram.com/${m.instagram}" target="_blank" rel="noopener" class="social-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          @${m.instagram}
        </a>
      </div>
    `;
    grid.appendChild(card);
  });
}

// ---------------------- Admin Panel Controls & Modals ----------------------
function injectAdminModals() {
  if (document.getElementById('admin-pw-modal')) return;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <!-- Password Modal -->
    <div id="admin-pw-modal" class="admin-modal-overlay">
      <div class="admin-modal-box admin-pw-box">
        <div class="admin-modal-header">
          <h3 class="admin-modal-title" style="font-family: var(--font-mono); text-transform: uppercase; font-size: 1.15rem; letter-spacing: 0.08em;">admin authorization</h3>
          <button class="admin-modal-close" onclick="closeAdminPasswordModal()">&times;</button>
        </div>
        <p class="admin-pw-desc">enter password to access control centre</p>
        <div class="admin-form-group">
          <div style="position: relative; max-width: 260px; margin: 0 auto;">
            <input type="password" id="admin-pw-input" class="admin-input" placeholder="••••••••" style="text-align: center; width: 100%; padding-right: 40px;">
            <button id="admin-pw-toggle-btn" onclick="togglePasscodeVisibility()" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-secondary); cursor: pointer; display: flex; align-items: center; padding: 4px;">
              <svg class="eye-open-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              <svg class="eye-closed-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: none;"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
            </button>
          </div>
          <div id="admin-pw-error" class="admin-pw-error">incorrect security code</div>
        </div>
        <div style="text-align: center; display: flex; gap: 10px; justify-content: center;">
          <button class="admin-btn admin-btn-secondary" onclick="closeAdminPasswordModal()">cancel</button>
          <button class="admin-btn" onclick="submitAdminPassword()">authorize</button>
        </div>
      </div>
    </div>

    <!-- Dashboard Modal -->
    <div id="admin-dashboard-modal" class="admin-modal-overlay">
      <div class="admin-modal-box">
        <div class="admin-modal-header">
          <h3 class="admin-modal-title" style="font-family: var(--font-mono); text-transform: uppercase; font-size: 1.2rem; letter-spacing: 0.1em; color: var(--neon-green);">zephyrdevs control centre</h3>
          <button class="admin-modal-close" onclick="closeAdminDashboard()">&times;</button>
        </div>
        
        <div class="admin-tabs">
          <button class="admin-tab-btn active" id="tab-btn-settings" onclick="switchAdminTab('tab-settings')">system config</button>
          <button class="admin-tab-btn" id="tab-btn-team" onclick="switchAdminTab('tab-team')">team roster</button>
        </div>

        <!-- Tab: System Settings -->
        <div id="tab-settings" class="admin-tab-content active">
          <div class="admin-form-group admin-checkbox-group" style="background: rgba(255,255,255,0.02); padding: 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.04);">
            <input type="checkbox" id="admin-maintenance-cb" class="admin-checkbox" onchange="toggleMaintenanceMode(this.checked)">
            <label for="admin-maintenance-cb" style="margin-bottom:0; cursor:pointer; font-weight: 500;">Enable Maintenance Mode (Site Lock)</label>
          </div>
          
          <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.04); margin: 20px 0;">
            <div class="admin-form-group admin-checkbox-group" style="margin-bottom: 15px;">
              <input type="checkbox" id="admin-announcement-cb" class="admin-checkbox">
              <label for="admin-announcement-cb" style="margin-bottom:0; cursor:pointer; font-weight: 500;">Enable Top Announcement Banner</label>
            </div>
            <div class="admin-form-group">
              <label for="admin-announcement-text">Announcement Banner Text</label>
              <textarea id="admin-announcement-text" class="admin-textarea" rows="2" placeholder="e.g. Now booking projects for Q3 2026!"></textarea>
            </div>
            <button class="admin-btn" style="padding: 8px 16px; font-size: 0.8rem;" onclick="saveAnnouncementSettings()">Save Banner Config</button>
          </div>

          <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.04); margin-bottom: 20px;">
            <div class="admin-form-group">
              <label for="admin-loading-text">Cinematic Loading Text</label>
              <input type="text" id="admin-loading-text" class="admin-input" placeholder="e.g. We Levlled Up.">
            </div>
            <button class="admin-btn" style="padding: 8px 16px; font-size: 0.8rem;" onclick="saveLoadingTextSettings()">Save Loading Text</button>
          </div>

          <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.04); margin-bottom: 20px;">
            <h4 style="color:#fff; margin-bottom:15px; font-size:0.9rem; font-family:var(--font-mono); text-transform:uppercase;">security credentials</h4>
            <div class="admin-form-group">
              <label for="admin-new-pw-input">Change Admin Password</label>
              <input type="password" id="admin-new-pw-input" class="admin-input" placeholder="Enter new admin password...">
            </div>
            <button class="admin-btn" style="padding: 8px 16px; font-size: 0.8rem;" onclick="savePasswordSettings()">Save Password</button>
          </div>

          <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.04); margin-bottom: 20px;">
            <h4 style="color:#fff; margin-bottom:15px; font-size:0.9rem; font-family:var(--font-mono); text-transform:uppercase; color: var(--neon-cyan);">global theme styling</h4>
            <div class="admin-form-group">
              <label for="admin-theme-select">Accent Color Theme</label>
              <select id="admin-theme-select" class="admin-input" style="background: #000; color: #fff; cursor: pointer;" onchange="updateThemeSettings(this.value)">
                <option value="lime">Matrix Lime (Default)</option>
                <option value="cyan">Cyber Cyan</option>
                <option value="violet">Neon Violet</option>
              </select>
            </div>
          </div>

          <div style="background: rgba(255,255,255,0.02); padding: 20px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.04); margin-bottom: 20px;">
            <h4 style="color:#fff; margin-bottom:15px; font-size:0.9rem; font-family:var(--font-mono); text-transform:uppercase; color: var(--neon-cyan);">system activity log</h4>
            <div id="admin-activity-logs" style="font-family: var(--font-mono); font-size: 0.8rem; line-height: 1.4; color: var(--text-secondary);">
              <!-- Dynamically populated -->
            </div>
          </div>
        </div>

        <!-- Tab: Team Management -->
        <div id="tab-team" class="admin-tab-content">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 12px;">
            <h4 style="color:#fff; font-size:0.95rem; font-family: var(--font-mono); text-transform: uppercase;">team members</h4>
            <button class="admin-btn" style="padding: 6px 14px; font-size: 0.75rem;" onclick="showAddTeamMemberForm()">+ add member</button>
          </div>
          
          <div id="admin-team-list" class="admin-team-list">
            <!-- Dynamically populated -->
          </div>

          <!-- Add/Edit Member Form Overlay inside Dashboard -->
          <div id="admin-team-form" style="display:none; background: rgba(5,6,8,0.95); border: 1px solid rgba(255,255,255,0.08); padding:20px; border-radius:12px; margin-top:20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <h4 id="team-form-title" style="color:#fff; margin-bottom:15px; font-size:0.95rem; font-family: var(--font-mono); text-transform: uppercase; border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom: 8px;">add team member</h4>
            <input type="hidden" id="team-member-key">
            
            <div class="admin-form-group">
              <label>full name</label>
              <input type="text" id="team-member-name" class="admin-input" placeholder="e.g. Akshansh Sinha">
            </div>
            <div class="admin-form-group">
              <label>role / title</label>
              <input type="text" id="team-member-role" class="admin-input" placeholder="e.g. Co-Founder & Tech Architect">
            </div>
            <div class="admin-form-group">
              <label>bio description</label>
              <textarea id="team-member-bio" class="admin-textarea" rows="2" placeholder="describe the role and skills..."></textarea>
            </div>
            <div class="admin-form-group">
              <label>instagram username (without @)</label>
              <input type="text" id="team-member-insta" class="admin-input" placeholder="e.g. akshansh_6969">
            </div>
            <div class="admin-form-group">
              <label>profile picture URL</label>
              <input type="text" id="team-member-pfp" class="admin-input" placeholder="e.g. https://i.ibb.co/ZpbWz2g9/aksansh.jpg">
            </div>
            <div style="display:flex; justify-content:flex-end; gap: 10px;">
              <button class="admin-btn admin-btn-secondary" onclick="hideTeamMemberForm()">cancel</button>
              <button class="admin-btn" onclick="saveTeamMember()">save member</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(wrapper);

  // Bind Enter key to password submit
  const pwInput = document.getElementById('admin-pw-input');
  if (pwInput) {
    pwInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        submitAdminPassword();
      }
    });
  }
}

window.openAdminPanel = function (e) {
  if (e) e.preventDefault();
  
  if (sessionStorage.getItem('zephyr_admin') === 'true') {
    showAdminDashboard();
  } else {
    showAdminPasswordModal();
  }
};

function showAdminPasswordModal() {
  const modal = document.getElementById('admin-pw-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.classList.add('loading-active');
    const input = document.getElementById('admin-pw-input');
    if (input) {
      input.value = '';
      input.type = 'password';
      input.focus();
    }
    const btn = document.getElementById('admin-pw-toggle-btn');
    if (btn) {
      const openIcon = btn.querySelector('.eye-open-icon');
      const closedIcon = btn.querySelector('.eye-closed-icon');
      if (openIcon) openIcon.style.display = 'block';
      if (closedIcon) closedIcon.style.display = 'none';
    }
    const err = document.getElementById('admin-pw-error');
    if (err) err.style.display = 'none';
  }
}

window.closeAdminPasswordModal = function () {
  const modal = document.getElementById('admin-pw-modal');
  if (modal) {
    modal.classList.remove('active');
    if (!document.getElementById('maintenance-screen') && !document.body.classList.contains('preloading')) {
      document.body.classList.remove('loading-active');
    }
  }
};

window.submitAdminPassword = function () {
  const input = document.getElementById('admin-pw-input');
  const err = document.getElementById('admin-pw-error');
  const pass = input ? input.value : '';

  // Auth check using database password (or fallback)
  const actualPassword = dbState.password || 'admin00';
  
  if (pass === actualPassword) {
    sessionStorage.setItem('zephyr_admin', 'true');
    closeAdminPasswordModal();
    showAdminDashboard();
  } else {
    if (err) err.style.display = 'block';
  }
};

function showAdminDashboard() {
  const dashboard = document.getElementById('admin-dashboard-modal');
  if (dashboard) {
    dashboard.classList.add('active');
    document.body.classList.add('loading-active');
    
    // Sync current values with UI
    const mCB = document.getElementById('admin-maintenance-cb');
    if (mCB) mCB.checked = dbState.maintenance || false;
    
    const aCB = document.getElementById('admin-announcement-cb');
    if (aCB) aCB.checked = dbState.announcement ? dbState.announcement.active : false;
    
    const aText = document.getElementById('admin-announcement-text');
    if (aText) aText.value = dbState.announcement ? dbState.announcement.text : '';

    const lText = document.getElementById('admin-loading-text');
    if (lText) lText.value = dbState.loadingText || '';

    const newPwInput = document.getElementById('admin-new-pw-input');
    if (newPwInput) newPwInput.value = '';

    const themeSelect = document.getElementById('admin-theme-select');
    if (themeSelect) themeSelect.value = dbState.themeAccent || 'lime';

    // Populate active database configurations
    const active = window.activeFirebaseConfig || {};
    const apiKeyField = document.getElementById('admin-config-apikey');
    if (apiKeyField) apiKeyField.value = active.apiKey || '';
    const dbUrlField = document.getElementById('admin-config-dburl');
    if (dbUrlField) dbUrlField.value = active.databaseURL || '';
    const projIdField = document.getElementById('admin-config-projectid');
    if (projIdField) projIdField.value = active.projectId || '';
    const appIdField = document.getElementById('admin-config-appid');
    if (appIdField) appIdField.value = active.appId || '';

    renderAdminTeamList();
    renderActivityLogs(dbState.activityLogs);
    switchAdminTab('tab-settings');
  }
}

window.closeAdminDashboard = function () {
  const dashboard = document.getElementById('admin-dashboard-modal');
  if (dashboard) {
    dashboard.classList.remove('active');
    
    // Clear admin auth state so it asks for password next time
    sessionStorage.removeItem('zephyr_admin');
    
    // Re-evaluate maintenance mode view (locks screen if active)
    handleMaintenanceUpdate(dbState.maintenance || false);
  }
};

window.switchAdminTab = function (tabId) {
  // Hide all tab contents
  document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
  // Deactivate all tab buttons
  document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));

  // Show selected tab content and active button
  const content = document.getElementById(tabId);
  if (content) content.classList.add('active');

  const btnId = tabId === 'tab-settings' ? 'tab-btn-settings' : 'tab-btn-team';
  const btn = document.getElementById(btnId);
  if (btn) btn.classList.add('active');
  
  hideTeamMemberForm();
};

// ---------------------- DB Update Handlers ----------------------
window.toggleMaintenanceMode = async function (checked) {
  try {
    await firebaseCall('updateMaintenance', checked);
  } catch (err) {
    console.error('Failed to toggle maintenance mode:', err);
  }
};

window.saveAnnouncementSettings = async function () {
  const active = document.getElementById('admin-announcement-cb').checked;
  const text = document.getElementById('admin-announcement-text').value;

  try {
    await firebaseCall('updateAnnouncement', { active, text });
    alert('Announcement settings updated.');
  } catch (err) {
    console.error('Failed to update announcement:', err);
    alert('Failed to update announcement: ' + err.message);
  }
};

window.saveLoadingTextSettings = async function () {
  const text = document.getElementById('admin-loading-text').value.trim();
  try {
    await firebaseCall('updateLoadingText', text);
    alert('Loading text updated.');
  } catch (err) {
    console.error('Failed to update loading text:', err);
    alert('Failed to update loading text: ' + err.message);
  }
};

window.savePasswordSettings = async function () {
  const newPwInput = document.getElementById('admin-new-pw-input');
  const newPw = newPwInput ? newPwInput.value : '';

  if (!newPw) {
    alert('Password cannot be empty.');
    return;
  }

  try {
    await firebaseCall('updatePassword', newPw);
    alert('Security password updated successfully across all devices.');
    if (newPwInput) newPwInput.value = '';
  } catch (err) {
    console.error('Failed to update password:', err);
    alert('Failed to update password: ' + err.message);
  }
};

window.saveCustomConfig = async function () {
  const apiKey = document.getElementById('admin-config-apikey').value.trim();
  const databaseURL = document.getElementById('admin-config-dburl').value.trim();
  const projectId = document.getElementById('admin-config-projectid').value.trim();
  const appId = document.getElementById('admin-config-appid').value.trim();

  if (!apiKey || !databaseURL || !projectId || !appId) {
    alert('Please fill out all 4 core Firebase config fields.');
    return;
  }

  const customConfig = {
    apiKey,
    databaseURL,
    projectId,
    appId,
    authDomain: `${projectId}.firebaseapp.com`,
    storageBucket: `${projectId}.firebasestorage.app`
  };

  if (!confirm('Are you sure you want to change the database config? This will sync to all devices.')) return;

  try {
    await firebaseCall('updateCustomConfig', customConfig);
    alert('Firebase configuration updated and registry synced successfully! Reloading...');
  } catch (err) {
    console.error('Failed to update custom config:', err);
    alert('Failed to update configuration: ' + err.message);
  }
};

window.resetCustomConfig = async function () {
  if (!confirm('Reset Firebase configuration to default? This will sync to all devices.')) return;

  try {
    await firebaseCall('resetCustomConfig');
    alert('Firebase configuration reset to default registry config! Reloading...');
  } catch (err) {
    console.error('Failed to reset config:', err);
    alert('Failed to reset config: ' + err.message);
  }
};

// ---------------------- Admin Team List Roster Controls ----------------------
function renderAdminTeamList() {
  const container = document.getElementById('admin-team-list');
  if (!container) return;

  container.innerHTML = '';
  const team = dbState.team || {};

  if (Object.keys(team).length === 0) {
    container.innerHTML = '<div style="color: var(--text-tertiary); font-size:0.85rem; font-family: var(--font-mono);">No team members in roster.</div>';
    return;
  }

  Object.keys(team).forEach(key => {
    const m = team[key];
    const div = document.createElement('div');
    div.className = 'admin-team-item';
    div.innerHTML = `
      <div class="admin-team-info">
        <h4>${m.name}</h4>
        <p>${m.role} (@${m.instagram})${m.pfp ? ' [has pfp]' : ''}</p>
      </div>
      <div class="admin-team-actions">
        <button class="edit" onclick="showEditTeamMemberForm('${key}')">Edit</button>
        <button class="delete" onclick="deleteTeamMember('${key}')">Delete</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function renderActivityLogs(logs) {
  const container = document.getElementById('admin-activity-logs');
  if (!container) return;

  container.innerHTML = '';
  const logArray = logs || dbState.activityLogs || [];

  if (logArray.length === 0) {
    container.innerHTML = '<div style="color: var(--text-tertiary); font-size:0.8rem; font-family: var(--font-mono);">No recent activities logged.</div>';
    return;
  }

  logArray.forEach(log => {
    const div = document.createElement('div');
    div.style.marginBottom = '6px';
    div.style.borderBottom = '1px solid rgba(255,255,255,0.02)';
    div.style.paddingBottom = '4px';
    div.innerHTML = `<span style="color: var(--neon-green); margin-right: 8px;">[${log.timestamp || ''}]</span> <span>${log.text || ''}</span>`;
    container.appendChild(div);
  });
}

window.showAddTeamMemberForm = function () {
  const form = document.getElementById('admin-team-form');
  const title = document.getElementById('team-form-title');
  if (form && title) {
    title.textContent = 'add team member';
    document.getElementById('team-member-key').value = '';
    document.getElementById('team-member-name').value = '';
    document.getElementById('team-member-role').value = '';
    document.getElementById('team-member-bio').value = '';
    document.getElementById('team-member-insta').value = '';
    document.getElementById('team-member-pfp').value = '';
    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth' });
  }
};

window.showEditTeamMemberForm = function (key) {
  const form = document.getElementById('admin-team-form');
  const title = document.getElementById('team-form-title');
  const m = dbState.team[key];

  if (form && title && m) {
    title.textContent = 'edit team member';
    document.getElementById('team-member-key').value = key;
    document.getElementById('team-member-name').value = m.name || '';
    document.getElementById('team-member-role').value = m.role || '';
    document.getElementById('team-member-bio').value = m.bio || '';
    document.getElementById('team-member-insta').value = m.instagram || '';
    document.getElementById('team-member-pfp').value = m.pfp || '';
    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth' });
  }
};

window.hideTeamMemberForm = function () {
  const form = document.getElementById('admin-team-form');
  if (form) form.style.display = 'none';
};

window.saveTeamMember = async function () {
  const keyInput = document.getElementById('team-member-key').value;
  const name = document.getElementById('team-member-name').value;
  const role = document.getElementById('team-member-role').value;
  const bio = document.getElementById('team-member-bio').value;
  const instagram = document.getElementById('team-member-insta').value;
  const pfp = document.getElementById('team-member-pfp').value.trim();

  if (!name || !role) {
    alert('Name and Role are required.');
    return;
  }

  // Generate safe key if new
  const key = keyInput || 'member_' + Date.now();

  // Generate initials and gradient dynamically
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const gradients = [
    "linear-gradient(135deg, rgba(0, 230, 118, 0.2) 0%, rgba(0, 176, 255, 0.2) 100%)",
    "linear-gradient(135deg, rgba(0, 176, 255, 0.2) 0%, rgba(200, 0, 255, 0.2) 100%)",
    "linear-gradient(135deg, rgba(200, 0, 255, 0.2) 0%, rgba(0, 230, 118, 0.2) 100%)"
  ];
  let code = 0;
  for (let i = 0; i < name.length; i++) {
    code += name.charCodeAt(i);
  }
  const gradient = gradients[code % gradients.length];

  const member = { name, role, bio, instagram, initials, gradient, pfp };

  try {
    await firebaseCall('setTeamMember', { key, member });
    hideTeamMemberForm();
  } catch (err) {
    console.error('Failed to save team member:', err);
    alert('Failed to save member: ' + err.message);
  }
};

window.deleteTeamMember = async function (key) {
  if (!confirm('Are you sure you want to delete this team member?')) return;

  try {
    await firebaseCall('deleteTeamMember', key);
  } catch (err) {
    console.error('Failed to delete team member:', err);
    alert('Failed to delete member: ' + err.message);
  }
};

// ---------------------- Password Eye Toggle ----------------------
window.togglePasscodeVisibility = function () {
  const input = document.getElementById('admin-pw-input');
  const btn = document.getElementById('admin-pw-toggle-btn');
  if (!input || !btn) return;

  const openIcon = btn.querySelector('.eye-open-icon');
  const closedIcon = btn.querySelector('.eye-closed-icon');

  if (input.type === 'password') {
    input.type = 'text';
    if (openIcon) openIcon.style.display = 'none';
    if (closedIcon) closedIcon.style.display = 'block';
  } else {
    input.type = 'password';
    if (openIcon) openIcon.style.display = 'block';
    if (closedIcon) closedIcon.style.display = 'none';
  }
};

// ---------------------- Theme Switcher Sync ----------------------
window.updateThemeSettings = async function (themeValue) {
  try {
    await firebaseCall('updateThemeAccent', themeValue);
  } catch (err) {
    console.error('Failed to update theme settings:', err);
  }
};

function applyThemeAccent(theme) {
  const root = document.documentElement;
  root.classList.remove('theme-cyan', 'theme-violet');
  if (theme === 'cyan') {
    root.classList.add('theme-cyan');
  } else if (theme === 'violet') {
    root.classList.add('theme-violet');
  }

  const themeSelect = document.getElementById('admin-theme-select');
  if (themeSelect) {
    themeSelect.value = theme || 'lime';
  }
}

/* =========================================================================
   UI Redesign Interactions (Bento, Magnetic, Nav)
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // Bento Panel Mouse Tracking
  const updateBentoMouse = (e) => {
    document.querySelectorAll('.bento-panel').forEach(panel => {
      const rect = panel.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      panel.style.setProperty('--mouse-x', `${x}px`);
      panel.style.setProperty('--mouse-y', `${y}px`);
    });
  };
  window.addEventListener('mousemove', updateBentoMouse);

  // Magnetic Buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = `translate(0px, 0px)`;
    });
  });

  // Staggered Reveal Observer
  const bentoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('active');
        }, index * 100);
        bentoObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.bento-reveal').forEach(el => bentoObserver.observe(el));

  // Dynamic Floating Navbar
  const navPill = document.querySelector('.nav-pill');
  if (navPill) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navPill.style.padding = '10px 20px';
        navPill.style.background = 'rgba(10, 11, 28, 0.85)';
        navPill.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
      } else {
        navPill.style.padding = '14px 24px';
        navPill.style.background = 'rgba(10, 11, 28, 0.65)';
        navPill.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.2)';
      }
    });
  }
});

/* =========================================================================
   11. Tech Stack Announcement Ticker
   ========================================================================= */
function initTechTicker() {
  const tickerWrap = document.createElement('div');
  tickerWrap.className = 'tech-ticker-wrap';

  const techs = [
    { name: 'HTML5', logo: '<svg viewBox="0 0 24 24"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/></svg>' },
    { name: 'CSS3', logo: '<svg viewBox="0 0 24 24"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.855L12 19.288l5.373-1.53L18.59 4.414z"/></svg>' },
    { name: 'JavaScript', logo: '<svg viewBox="0 0 24 24"><path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/></svg>' },
    { name: 'Node.js', logo: '<svg viewBox="0 0 24 24"><path d="M12 24c-.3 0-.6-.1-.9-.2l-2.9-1.7c-.4-.2-.2-.3-.1-.4.6-.2.7-.3 1.3-.6.1 0 .2 0 .2.1l2.3 1.3c.1 0 .2 0 .3 0l8.8-5.1c.1-.1.1-.1.1-.2V6.9c0-.1-.1-.2-.1-.2L12.2 1.6c-.1 0-.2 0-.3 0L3.1 6.7c-.1 0-.2.1-.2.2v10.2c0 .1.1.2.1.2l2.4 1.4c1.3.7 2.1-.1 2.1-.9V7.8c0-.1.1-.3.3-.3h1.1c.1 0 .3.1.3.3v10c0 1.7-1 2.7-2.6 2.7-.5 0-.9 0-2-.6L2.3 18.7c-.6-.3-.9-1-.9-1.6V6.9c0-.7.4-1.3.9-1.6l8.8-5.1c.6-.3 1.3-.3 1.8 0l8.8 5.1c.6.3.9 1 .9 1.6v10.2c0 .7-.4 1.3-.9 1.6l-8.8 5.1c-.2.1-.5.2-.8.2z"/></svg>' },
    { name: 'Firebase', logo: '<svg viewBox="0 0 24 24"><path d="M3.9 15.8L2.1 5.4c-.1-.3.2-.5.5-.3l2 1.8 2.9 2.8-3.6 6.1zM21.2 12.3l-2.1-4.2-1.2-2.4c-.1-.3-.6-.3-.7 0L12.5 14.9 9.2 8.7c-.1-.3-.6-.3-.7 0L3.4 18.3c-.1.2 0 .5.3.4l13.8-1.5 3.7-4.4c.2-.2.2-.4 0-.5z"/></svg>' },
    { name: 'Gemini AI', logo: '<svg viewBox="0 0 24 24"><path d="M11 19.3Q12 21.5 12 24q0-2.5 1-4.7 1-2.2 2.6-3.8 1.6-1.6 3.8-2.6Q21.5 12 24 12q-2.5 0-4.7-1a12.3 12.3 0 0 1-3.8-2.6 12.3 12.3 0 0 1-2.6-3.8Q12 2.5 12 0q0 2.5-1 4.7-1 2.2-2.6 3.8a12.3 12.3 0 0 1-3.8 2.6Q2.5 12 0 12q2.5 0 4.7 1 2.2 1 3.8 2.6t2.6 3.8"/></svg>' },
    { name: 'Claude', logo: '<svg viewBox="0 0 24 24"><path d="M17.3 3.5h-3.7l6.7 16.9H24Zm-10.6 0L0 20.5h3.7l1.4-3.6h7l1.4 3.6h3.7L10.5 3.5ZM6.2 13.7l2.3-5.9 2.3 5.9Z"/></svg>' },
    { name: 'OpenAI', logo: '<svg viewBox="0 0 24 24"><path d="M22.2 10.8c-.1-1.1-.5-2.1-1.1-3.1a5.3 5.3 0 0 0-3.3-2.1 5.3 5.3 0 0 0-4.6 1.4L12 9.1l-1.2-2c-.9-1.5-2.4-2.4-4-2.4-.2 0-.4 0-.6.1a5.3 5.3 0 0 0-3.3 2.1c-.9 1-1.3 2.1-1.1 3.1a5.3 5.3 0 0 0 1.5 3.9L5.4 16.3l1.2 2a5.2 5.2 0 0 0 3.9 1.6c.2 0 .4 0 .6-.1a5.3 5.3 0 0 0 3.3-2.1c.9-1 1.3-2.1 1.1-3.1a5.3 5.3 0 0 0-1.5-3.9l-2-1.2-1.2-2c0-.1-.1-.1-.2-.2a.4.4 0 0 0-.4 0c0 .1-.1.1-.2.2L12 7l-1.2 2a.4.4 0 0 0 0 .4c0 .1.1.1.2.2a.4.4 0 0 0 .4 0c.1 0 .1-.1.2-.2l1.2-2 2 1.2a5.3 5.3 0 0 0 1.6 3.9 5.3 5.3 0 0 0-1.1 3.2 5.3 5.3 0 0 0-3.3 2.1c-.2.1-.4.1-.6.1a5.2 5.2 0 0 0-3.9-1.6l-1.2-2-2-1.2a5.3 5.3 0 0 0-1.6-3.9c.2 1 .6 2.1 1.1 3.1a5.3 5.3 0 0 0 3.3 2.1c.2 0 .4.1.6.1a5.2 5.2 0 0 0 3.9-1.6l1.2-2 1.2-2a5.2 5.2 0 0 0 3.9 1.6c.2 0 .4 0 .6-.1a5.3 5.3 0 0 0 3.3-2.1c.9-1 1.3-2.1 1.1-3.1a5.3 5.3 0 0 0-1.5-3.9l-2-1.2-1.2-2a5.2 5.2 0 0 0-3.9-1.6c-.2 0-.4 0-.6.1a5.3 5.3 0 0 0-3.3 2.1c-.9 1-1.3 2.1-1.1 3.1a5.3 5.3 0 0 0 1.5 3.9l2 1.2z"/></svg>' },
    { name: 'Vercel', logo: '<svg viewBox="0 0 24 24"><path d="M24 22.5H0L12 1.5l12 21z"/></svg>' },
    { name: 'Tailwind CSS', logo: '<svg viewBox="0 0 24 24"><path d="M12 6.036c-2.402 0-3.602 1.201-3.602 3.602 0 2.402 1.2 3.602 3.602 3.602 2.4 0 3.6-1.2 3.6-3.602 0-2.401-1.2-3.602-3.6-3.602zM6 12.036c-2.4 0-3.6 1.201-3.6 3.602 0 2.402 1.2 3.602 3.602 3.602 2.4 0 3.6-1.2 3.6-3.602 0-2.401-1.2-3.602-3.6-3.602z"/></svg>' }
  ];

  const repeated = [...techs, ...techs];
  const listItems = repeated.map(tech => `<span>${tech.logo}${tech.name}</span>`).join('<span class="ticker-dot"></span>');

  tickerWrap.innerHTML = `
    <div class="tech-ticker-content">
      ${listItems}
    </div>
  `;

  const footer = document.querySelector('footer');
  if (footer) {
    footer.parentNode.insertBefore(tickerWrap, footer);
  } else {
    document.body.appendChild(tickerWrap);
  }
}

/* =========================================================================
   12. Interactive Mock Chatbot
   ========================================================================= */
function initChatbot() {
  const chatbotContainer = document.createElement('div');
  chatbotContainer.className = 'chatbot-widget-container';

  chatbotContainer.innerHTML = `
    <!-- Trigger Button -->
    <div class="chatbot-trigger" id="chat-trigger">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
    </div>

    <!-- Chat window -->
    <div class="chatbot-window" id="chat-window">
      <div class="chatbot-header">
        <div class="chatbot-profile">
          <div class="chatbot-avatar">Z</div>
          <div class="chatbot-info">
            <h4>Zephyr Assistant</h4>
            <div class="chatbot-status">Online</div>
          </div>
        </div>
        <button class="chatbot-close" id="chat-close">&times;</button>
      </div>

      <div class="chatbot-messages" id="chat-messages-area">
        <div class="chat-msg bot">
          Hey there! 👋 I am the Zephyr assistant. How can I help you build your next project today?
        </div>
      </div>

      <div class="chatbot-suggestions">
        <p>Quick Questions</p>
        <button class="chat-suggest-btn" data-key="starter">Tell me about the Starter Plan (₹1,999/yr)</button>
        <button class="chat-suggest-btn" data-key="pro">Tell me about the Pro Plan (₹2,999/yr)</button>
        <button class="chat-suggest-btn" data-key="enterprise">Tell me about the Enterprise Plan (₹4,999/yr)</button>
        <button class="chat-suggest-btn" data-key="contact">How do I start a project?</button>
      </div>

      <div class="chatbot-input-area">
        <input type="text" class="chatbot-input" id="chat-user-input" placeholder="Type a message...">
        <button class="chatbot-send" id="chat-send-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(chatbotContainer);

  const trigger = document.getElementById('chat-trigger');
  const windowEl = document.getElementById('chat-window');
  const closeBtn = document.getElementById('chat-close');
  const messagesArea = document.getElementById('chat-messages-area');
  const suggestBtns = chatbotContainer.querySelectorAll('.chat-suggest-btn');
  const userInput = document.getElementById('chat-user-input');
  const sendBtn = document.getElementById('chat-send-btn');

  // Toggle open
  trigger.addEventListener('click', () => {
    windowEl.classList.toggle('open');
  });

  // Close
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    windowEl.classList.remove('open');
  });

  const responses = {
    starter: "Our **Starter plan (₹1,999/yr)** is designed for fast, high-performance static websites. It includes premium templates, responsive layout, hosting setup, and essential SEO integration.",
    pro: "Our **Pro plan (₹2,999/yr)** offers dynamic multi-page custom websites. It includes database connections, interactive components, customized forms, and advanced SEO optimization.",
    enterprise: "Our **Enterprise plan (₹4,999/yr)** is a fully tailored solution featuring complex databases, admin dashboards, and custom dual-LLM systems utilizing Google Gemini and Claude APIs.",
    contact: "To start a project, simply go to the **Start Project** page in the navbar, select a plan, input your phone number, and submit. We'll get in touch with you shortly!"
  };

  function appendMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `chat-msg ${sender}`;
    msg.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    messagesArea.appendChild(msg);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  function handleBotResponse(key) {
    // Show loading state
    const loader = document.createElement('div');
    loader.className = 'chat-msg bot typing-indicator';
    loader.innerText = 'typing...';
    messagesArea.appendChild(loader);
    messagesArea.scrollTop = messagesArea.scrollHeight;

    setTimeout(() => {
      messagesArea.removeChild(loader);
      const text = responses[key] || "Thanks for messaging! I'm an automated assistant. For custom queries, please reach out to **zephyrdevsofficial@gmail.com** or select one of the quick options above! 🚀";
      appendMessage(text, 'bot');
    }, 1000);
  }

  suggestBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      const text = btn.innerText;
      appendMessage(text, 'user');
      handleBotResponse(key);
    });
  });

  function sendUserMsg() {
    const val = userInput.value.trim();
    if (!val) return;
    appendMessage(val, 'user');
    userInput.value = '';
    handleBotResponse('custom');
  }

  sendBtn.addEventListener('click', sendUserMsg);
  userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendUserMsg();
    }
  });
}

/* =========================================================================
   13. Theme Switcher (Light/Dark Toggle)
   ========================================================================= */
function initThemeToggle() {
  const navPill = document.querySelector('.nav-pill');
  if (!navPill) return;

  const btn = document.createElement('button');
  btn.id = 'theme-toggle-btn';
  btn.className = 'theme-toggle-btn';
  btn.setAttribute('aria-label', 'Toggle light/dark theme');
  btn.innerHTML = `
    <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="M4.93 4.93l1.41 1.41"></path><path d="M17.66 17.66l1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="M6.34 17.66l-1.41 1.41"></path><path d="M19.07 4.93l-1.41 1.41"></path></svg>
    <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none;"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>
  `;

  const ctaBtn = navPill.querySelector('.nav-cta-btn') || navPill.querySelector('.nav-burger');
  if (ctaBtn) {
    navPill.insertBefore(btn, ctaBtn);
  } else {
    navPill.appendChild(btn);
  }

  const currentTheme = localStorage.getItem('theme') || 'dark';
  if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
    btn.querySelector('.sun-icon').style.display = 'none';
    btn.querySelector('.moon-icon').style.display = 'block';
  }

  btn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    
    if (isLight) {
      btn.querySelector('.sun-icon').style.display = 'none';
      btn.querySelector('.moon-icon').style.display = 'block';
    } else {
      btn.querySelector('.sun-icon').style.display = 'block';
      btn.querySelector('.moon-icon').style.display = 'none';
    }
  });
}

/* =========================================================================
   14. Live Website Preview Modal
   ========================================================================= */
function initLivePreviewModal() {
  if (document.getElementById('live-preview-modal')) return;

  const modal = document.createElement('div');
  modal.id = 'live-preview-modal';
  modal.className = 'preview-modal';
  modal.innerHTML = `
    <div class="preview-modal-container">
      <div class="preview-modal-header">
        <div class="mac-controls">
          <span class="mac-dot close-preview" style="background:#ff5f56; width:12px; height:12px; border-radius:50%; display:inline-block; cursor:pointer;" id="preview-mac-close"></span>
          <span class="mac-dot minimize-preview" style="background:#ffbd2e; width:12px; height:12px; border-radius:50%; display:inline-block; margin-left:4px;"></span>
          <span class="mac-dot maximize-preview" style="background:#27c93f; width:12px; height:12px; border-radius:50%; display:inline-block; margin-left:4px;"></span>
        </div>
        <div class="preview-address-bar">
          <span class="preview-secure-lock">🔒</span>
          <span id="preview-url-text">https://rajdarbars.vercel.app</span>
        </div>
        <button class="preview-tab-btn" id="preview-external-btn" title="Open in new tab">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </button>
        <button class="preview-modal-close" id="preview-close-btn">&times;</button>
      </div>
      <div class="preview-modal-body">
        <div class="preview-loader" id="preview-loader-el">
          <svg class="loader-spinner" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color: var(--neon-cyan);"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
          <span style="margin-top: 8px;">Loading live website preview...</span>
        </div>
        <iframe id="preview-iframe" src="" frameborder="0"></iframe>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const closeBtn = document.getElementById('preview-close-btn');
  const macClose = document.getElementById('preview-mac-close');
  const iframe = document.getElementById('preview-iframe');
  const loader = document.getElementById('preview-loader-el');

  function closeModal() {
    modal.classList.remove('open');
    iframe.src = '';
  }

  closeBtn.addEventListener('click', closeModal);
  macClose.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  iframe.addEventListener('load', () => {
    loader.style.opacity = 0;
    setTimeout(() => {
      loader.style.display = 'none';
    }, 300);
  });
}

function openLivePreview(url, title, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const modal = document.getElementById('live-preview-modal');
  const iframe = document.getElementById('preview-iframe');
  const loader = document.getElementById('preview-loader-el');
  const urlText = document.getElementById('preview-url-text');
  const externalBtn = document.getElementById('preview-external-btn');

  if (!modal || !iframe) return;

  urlText.textContent = url.replace('https://', '');
  externalBtn.onclick = () => {
    window.open(url, '_blank');
  };

  if (loader) {
    loader.style.display = 'flex';
    loader.style.opacity = 1;
  }

  iframe.src = url;
  modal.classList.add('open');
}
