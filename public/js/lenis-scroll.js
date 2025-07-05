import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  let isMobile = window.innerWidth <= 900;

  const getScrollSettings = (isMobile) =>
    isMobile
      ? {
          smooth: false,               // ❌ Disable smooth scroll on mobile
          duration: 1.2,
          direction: "vertical",
          gestureDirection: "vertical",
          smoothTouch: false,
          touchMultiplier: 0.3,
          infinite: false,
          lerp: 0.1,
          orientation: "vertical",
          smoothWheel: false,
          syncTouch: true,
        }
      : {
          duration: 1.2,
          direction: "vertical",
          gestureDirection: "vertical",
          smooth: true,
          smoothTouch: false,
          touchMultiplier: 2,
          infinite: false,
          lerp: 0.1,
          wheelMultiplier: 0.5,
          orientation: "vertical",
          smoothWheel: true,
          syncTouch: true,
        };

  let lenis = new Lenis(getScrollSettings(isMobile));

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  const handleResize = () => {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 900;

    if (wasMobile !== isMobile) {
      lenis.destroy();
      lenis = new Lenis(getScrollSettings(isMobile));
      lenis.on("scroll", ScrollTrigger.update);
    }
  };

  window.addEventListener("resize", handleResize);
});
