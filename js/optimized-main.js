import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";
import PerformanceMonitor from "./performance-monitor.js";

// Performance optimized main initialization
class PerformanceOptimizedApp {
  constructor() {
    this.isInitialized = false;
    this.scrollTriggerInstances = [];
    this.textSplitters = [];
    this.isMobile = window.innerWidth <= 900;
    this.resizeTimeout = null;
    
    // Bind methods
    this.handleResize = this.handleResize.bind(this);
    this.initAnimations = this.initAnimations.bind(this);
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.init());
    } else {
      this.init();
    }
  }

  init() {
    if (this.isInitialized) return;
    
    // Register GSAP plugins once
    gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);
    
    // Initialize all components
    this.initAnimations();
    this.initEventListeners();
    
    this.isInitialized = true;
  }

 

  initAnimations() {
    // Clear previous instances for performance
    this.cleanup();

    // Hero image parallax animation
    this.initHeroImageAnimation();
    
    // Scramble text animation
    this.initScrambleText();
    
    // Text line animations
    this.initTextLineAnimations();
    
    // Button animations
    this.initButtonAnimations();
    
    // Project animations
    this.initProjectAnimations();
    
    // Scroll animations
    this.initScrollAnimations();
  }

  initHeroImageAnimation() {
    const trigger = ScrollTrigger.create({
      trigger: ".hero-img-holder",
      start: "top bottom",
      end: "top top",
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set(".hero-img", {
          y: `${-110 + 110 * progress}%`,
          scale: 0.25 + 0.75 * progress,
        });
      },
    });
    this.scrollTriggerInstances.push(trigger);
  }

  initScrambleText() {
    const fullText = [
      { el: document.querySelector(".hero h1:nth-child(1)"), text: "URGE" },
      { el: document.querySelector(".hero h1:nth-child(2)"), text: "VISIONARY" },
    ];

    fullText.forEach(({ el, text }) => {
      if (!el) return;
      el.textContent = "";
      
      gsap.fromTo(el, 
        { scrambleText: { text: "", chars: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", revealDelay: 0, tweenLength: false } },
        {
          scrambleText: {
            text: text,
            chars: ".#123456789-+*-~",
            speed: 1,
            revealDelay: 1,
            tweenLength: false
          },
          duration: 2.5,
          ease: "none"
        }
      );
    });
  }

  initTextLineAnimations() {
    // Clear previous text splitters
    this.textSplitters.forEach(splitter => splitter.revert());
    this.textSplitters.length = 0;

    document.querySelectorAll("[data-split='lines']").forEach(element => {
      const typeSplit = new SplitText(element, { 
        types: "lines", 
        linesClass: "lineChild"
      });
      
      const maskSplit = new SplitText(element, { 
        types: "lines", 
        linesClass: "lineParent"
      });
      
      this.textSplitters.push(typeSplit, maskSplit);

      gsap.set(typeSplit.lines, { opacity: 1 });
      
      const animation = gsap.fromTo(typeSplit.lines, 
        { yPercent: 200 }, 
        {
          yPercent: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.08,
          delay: -0.2,
          ease: "power1.out",
          scrollTrigger: {
            trigger: element,
            start: "top 90%",
            end: "bottom 20%",
            markers: false
          }
        }
      );
    });
  }

  initButtonAnimations() {
    document.querySelectorAll('.btn-cta').forEach((button) => {
      const border = button.querySelector('.btn-cta-border');
      const title = button.querySelector('.btn-cta-title');
      
      if (!border || !title) return;
      
      [border, title].forEach(element => {
        gsap.set(element, {
          y: 100,
          scale: element === border ? 0.1 : 1
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: button,
          start: "top bottom",
          markers: false
        }
      });

      tl.to(border, {
        y: 0,
        scale: 1,
        duration: 0.9,
        ease: "expo.out"
      }).to(title, {
        y: 0,
        duration: 0.7,
        ease: "circ.inOut"
      }, "<0.2");
    });
  }

  initProjectAnimations() {
    const projectWrappers = document.querySelectorAll(".project-wrapper");
    
    projectWrappers.forEach((wrapper) => {
      gsap.fromTo(wrapper,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: wrapper,
            start: "top bottom",
          },
        }
      );
    });
  }

  initScrollAnimations() {
    const svgElement = document.querySelector(".fixed-svg");
    if (svgElement) {
      gsap.to(svgElement, {
        rotation: 360,
        scrollTrigger: {
          trigger: ".centered-section",
          start: "top center",
          end: "bottom top",
          scrub: true,
        }
      });
    }
  }

  initEventListeners() {
    // Optimized resize handler with debouncing
    window.addEventListener("resize", this.handleResize, { passive: true });
  }

  handleResize() {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      const wasMobile = this.isMobile;
      this.isMobile = window.innerWidth <= 900;

      // Reinitialize if mobile state changed
      if (wasMobile !== this.isMobile) {
      }
      
      // Refresh animations
      this.initAnimations();
    }, 250);
  }


  cleanup() {
    // Clean up ScrollTrigger instances
    this.scrollTriggerInstances.forEach(trigger => trigger.kill());
    this.scrollTriggerInstances.length = 0;
    
    // Clean up text splitters
    this.textSplitters.forEach(splitter => splitter.revert());
    this.textSplitters.length = 0;
  }

  destroy() {
 
    window.removeEventListener("resize", this.handleResize);
    clearTimeout(this.resizeTimeout);
  }
}

// Initialize the optimized app
const app = new PerformanceOptimizedApp();

// Initialize performance monitoring in development
const perfMonitor = new PerformanceMonitor();
if (perfMonitor.isDevelopment) {
  setTimeout(() => perfMonitor.start(), 2000);
}
