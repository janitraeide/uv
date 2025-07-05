import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SplitText from "gsap/SplitText";

(function() {
  let textAnim;
  const textSplitters = [];

  const doTextLines = () => {
    textAnim && textAnim.progress(1);
    
    // Clear previous instances
    textSplitters.forEach(splitter => splitter.revert());
    textSplitters.length = 0;

    // Process each text element individually
    document.querySelectorAll("[data-split='lines']").forEach(element => {
      // Split text for animation
      const typeSplit = new SplitText(element, { 
        types: "lines", 
        linesClass: "lineChild"
      });
      
      // Create mask for smooth effect
      const maskSplit = new SplitText(element, { 
        types: "lines", 
        linesClass: "lineParent"
      });
      
      textSplitters.push(typeSplit, maskSplit);

      // Animation setup for this element
      gsap.set(typeSplit.lines, { opacity: 1 });
      
      textAnim = gsap.fromTo(typeSplit.lines, { yPercent: 200 }, {
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
      });
    });
  };

  // DOM Ready Event
  document.addEventListener("DOMContentLoaded", () => {
    doTextLines();  // Lines animation with mask
  });

  // Resize event - Optimized debouncing
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      doTextLines();  // Lines animation refresh
    }, 250); // Increased debounce time for better performance
  });
})();