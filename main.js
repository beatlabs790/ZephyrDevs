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

  // 3 Layers of Particles for 3D Parallax Depth (Optimized)
  const layers = [
    { count: Math.min(10, Math.floor(width / 150)), sizeRange: [4, 7], speedRange: [0.05, 0.12], opacity: 0.1, blur: true, colors: ['#12131c', '#082f1b'] }, // Background (Slow, large, pre-blurred gradient)
    { count: Math.min(18, Math.floor(width / 100)), sizeRange: [2, 3], speedRange: [0.12, 0.22], opacity: 0.3, blur: false, colors: ['#94a3b8', '#00f0ff'] },  // Midground (Normal)
    { count: Math.min(18, Math.floor(width / 100)), sizeRange: [1, 1.5], speedRange: [0.22, 0.4], opacity: 0.6, blur: false, colors: ['#00e676', '#00ff88'] } // Foreground (Fast, glowing green)
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

      if (this.blur) {
        // Fast radial gradient instead of slow context filter blurs
        const radialGrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
        radialGrad.addColorStop(0, this.color);
        radialGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = radialGrad;
      } else {
        ctx.fillStyle = this.color;
        if (this.color === '#00e676' || this.color === '#00ff88') {
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(0, 230, 118, 0.4)';
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
      ctx.strokeStyle = `rgba(0, 230, 118, ${this.opacity * 0.3})`;
      ctx.lineWidth = 1.5;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(0, 230, 118, 0.3)';
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
          grad.addColorStop(0, connectable[i].color);
          grad.addColorStop(1, connectable[j].color);
          
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
  const slider = document.getElementById('project-budget');
  const display = document.getElementById('budget-display');
  if (!slider || !display) return;

  const budgetTiers = [
    { max: 0, label: 'Free Tier / MVP' },
    { max: 40000, label: 'Starter Web App (₹15,000 - ₹40,000)' },
    { max: 150000, label: 'Custom Web App + Node Backend (₹40,000 - ₹1,50,000)' },
    { max: 300000, label: 'Enterprise App + Google AI (₹1,50,000 - ₹3,00,000)' },
    { max: 500000, label: 'Custom dual-LLM Architecture (₹3,00,000 - ₹5,00,000+)' },
  ];

  function updateLabel() {
    const val = parseInt(slider.value);
    let matchedLabel = budgetTiers[budgetTiers.length - 1].label;

    for (const tier of budgetTiers) {
      if (val <= tier.max) {
        matchedLabel = tier.label;
        break;
      }
    }
    display.textContent = matchedLabel;
  }

  slider.addEventListener('input', updateLabel);
  updateLabel();
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
    const desc = document.getElementById('project-desc').value;
    
    const budgetDisplay = document.getElementById('budget-display');
    const budgetText = budgetDisplay ? budgetDisplay.textContent : 'Not Specified';

    const techList = [];
    document.querySelectorAll('input[name="tech"]:checked').forEach(checkbox => {
      techList.push(checkbox.parentNode.textContent.trim());
    });

    // Display loading state on submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `Sending Brief... <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation: loader-spin 1s linear infinite; margin-left: 6px;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>`;

    // Create payload
    const payload = {
      name: name,
      email: email,
      company: company || 'N/A',
      budget: budgetText,
      technologies: techList.join(', '),
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
        const budgetSlider = document.getElementById('project-budget');
        if (budgetSlider) budgetSlider.dispatchEvent(new Event('input'));
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
        `Company: ${company || 'N/A'}\n` +
        `Budget: ${budgetText}\n` +
        `Tech Preferred: ${techList.join(', ')}\n\n` +
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

  // Tab switching
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
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

  // Action clicks
  actionBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      
      // Show loading spinner
      consoleOutput.innerHTML = '';
      loader.style.display = 'flex';

      setTimeout(() => {
        loader.style.display = 'none';
        const responseText = sandboxDatabase[activeAI][action];
        
        // Colorize lines inside output
        const lines = responseText.split('\n').map(line => {
          if (line.startsWith('[')) return `<span style="color: var(--neon-violet);">${line}</span>`;
          if (line.startsWith('>')) return `<span style="color: var(--neon-green);">${line}</span>`;
          return line;
        }).join('<br>');

        consoleOutput.innerHTML = lines;
      }, 750);
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

// Handle route pre-fills & loading screen removals
window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const selectedPlan = urlParams.get('plan');
  if (selectedPlan) {
    const descTextarea = document.getElementById('project-desc');
    const budgetSlider = document.getElementById('project-budget');
    if (descTextarea) {
      descTextarea.value = `I am interested in starting a project using the [${selectedPlan.toUpperCase()} Plan]. `;
    }
    if (budgetSlider) {
      if (selectedPlan === 'free') budgetSlider.value = 0;
      else if (selectedPlan === 'pro') budgetSlider.value = 40000;
      else if (selectedPlan === 'enterprise') budgetSlider.value = 150000;
      
      budgetSlider.dispatchEvent(new Event('input'));
    }
  }
  
  // Fade out loading screen
  const loader = document.getElementById('loading-screen');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('fade-out');
    }, 700);
  }
  
  document.body.style.opacity = '1';
  document.body.style.transition = 'opacity 0.25s ease';
});
