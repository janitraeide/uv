import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';




document.addEventListener("DOMContentLoaded", () => {

  gsap.registerPlugin(ScrollTrigger);

  let scrollTriggerInstance = null;

  const initAnimations = () => {
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
    }

    scrollTriggerInstance = ScrollTrigger.create({
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
  };

  initAnimations();

  window.addEventListener("resize", () => {
    initAnimations();
  });
});


// SCRAMBLE TEXT 
  document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrambleTextPlugin);

    const fullText = [
      { el: document.querySelector(".hero h1:nth-child(1)"), text: "URGE" },
      { el: document.querySelector(".hero h1:nth-child(2)"), text: "VISIONARY" },
    ];

    fullText.forEach(({ el, text }) => {
      el.textContent = ""; // Empty first
    });

    // Animate both together like a hacker reveal
    fullText.forEach(({ el, text }) => {
      gsap.fromTo(
        el,
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
  });

// GIFS 
  document.addEventListener("DOMContentLoaded", () => {

   document.querySelectorAll(".gif").forEach((gif) => {
    gsap.set(gif, {
        y: 100,
        opacity: 0,
    });

    gsap.to(gif, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: gif,
            start: "top bottom",
        }
    });
});
});

// FOR BUTTON REVEAL ANIMATION
  document.addEventListener("DOMContentLoaded", () => {
(function() {
  document.querySelectorAll('.btn-cta').forEach((button) => {
    // Target elements within each button
    const border = button.querySelector('.btn-cta-border');
    const title = button.querySelector('.btn-cta-title');
    
    // Initial setup for elements
    [border, title].forEach(element => {
      gsap.set(element, {
        y: 100,
        scale: element === border ? 0.1 : 1
      });
    });

    // Animation timeline for coordinated effects
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: button,
        start: "top bottom",
        markers: false
      }
    });

    // Sequence animations
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
})();
});

  document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(ScrollTrigger);

    const projectWrappers = document.querySelectorAll(".project-wrapper");
  
    projectWrappers.forEach((wrapper) => {
      gsap.fromTo(
        wrapper,
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
  });


  
// SCROLLER ANIMATION 
  document.addEventListener("DOMContentLoaded", () => {
gsap.to(".fixed-svg", {
    rotation: 360,
    scrollTrigger: {
        trigger: ".centered-section",
        start: "top center",
        end: "bottom top",
        scrub: true,
    }
});

document.querySelectorAll(".text-row").forEach((text) => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: text,
            start: "top 70%",
            end: "bottom 20%",
            scrub: true,
        }
    });

    tl.fromTo(
        text,
        { gap: "0.5rem" }, // Starting gap
        { gap: "12rem" }
    ).to(
        text,
        { gap: "0.5rem" }    // Smoothly revert to 0.5rem
    );
});

});


// 3D 
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger);

  const canvas = document.getElementById('three-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 3, 5);

  const light = new THREE.AmbientLight(0xffffff, 1);
  scene.add(light);

  let model;
  let animateMixers = [];
  const clock = new THREE.Clock();

  const loader = new GLTFLoader();
  loader.load('/models/robot.glb', (gltf) => {
    model = gltf.scene;
    model.scale.set(5.5, 5.5, 5.5);
    model.position.set(0, 0, 0);
    scene.add(model);

    // Auto play all animations
    const mixer = new THREE.AnimationMixer(model);
    gltf.animations.forEach((clip) => {
      mixer.clipAction(clip).play();
    });
    animateMixers.push(mixer);

    setupScrollAnimation();
    ScrollTrigger.refresh();
  });

  function setupScrollAnimation() {
    const positions = [
      { x: 0, y: 0, z: 0 },
      { x: 1, y: -6.5, z: 0 },
      { x: -1, y: 0, z: 0 },
      { x: 0, y: -6.5, z: 0 },
      { x: -1, y: 0.5, z: 0 }
    ];

    const rotations = [
      { x: 0, y: 0, z: 0 },
      { x: 0, y: -1.4, z: 0 },
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 1.4, z: 0 },
    ];

    gsap.to({}, {
      scrollTrigger: {
        trigger: ".scroll-steps",
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        markers: false,
        onUpdate: (self) => {
          const totalSteps = positions.length - 1;
          const progress = self.progress * totalSteps;
          const index = Math.floor(progress);
          const nextIndex = Math.min(index + 1, totalSteps);
          const t = progress - index;

          if (!model) return;

          model.position.x = gsap.utils.interpolate(positions[index].x, positions[nextIndex].x, t);
          model.position.y = gsap.utils.interpolate(positions[index].y, positions[nextIndex].y, t);
          model.position.z = gsap.utils.interpolate(positions[index].z, positions[nextIndex].z, t);

          model.rotation.x = gsap.utils.interpolate(rotations[index].x, rotations[nextIndex].x, t);
          model.rotation.y = gsap.utils.interpolate(rotations[index].y, rotations[nextIndex].y, t);
          model.rotation.z = gsap.utils.interpolate(rotations[index].z, rotations[nextIndex].z, t);
        }
      }
    });
  }

  ScrollTrigger.create({
    trigger: ".canvas-wrapper",
    start: "top top",
    end: "bottom+=3000 top",
    pin: true,
    pinSpacing: false
  });

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    animateMixers.forEach(mixer => mixer.update(delta));

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});

// SCRAMBLE TEXT 
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrambleTextPlugin, ScrollTrigger);

  const fullText = Array.from(document.querySelectorAll(".text")).map((el) => {
    return { el, text: el.textContent };
  });

  // Clear all text initially
  fullText.forEach(({ el }) => {
    el.textContent = "";
  });

  // Animate each when it comes into view
  fullText.forEach(({ el, text }) => {
    ScrollTrigger.create({
      trigger: el,
      start: "top 80%",
      onEnter: () => {
        gsap.fromTo(
          el,
          {
            scrambleText: {
              chars: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
              revealDelay: 0,
              tweenLength: false
            }
          },
          {
            scrambleText: {
              text: text,
              chars: ".#123456789-+*-~",
              speed: 0.5,
              revealDelay: 0.05,
              tweenLength: false
            },
            duration: 1,
            ease: "none"
          }
        );
      },
      once: true // Run animation only once
    });
  });
});


