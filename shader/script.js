import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { vertexShader, fragmentShader } from "./shaders.js";

const config = {
  maskRadius: 0.25,
  maskSpeed: 8.75,
  lerpFactor: 0.2,
  radiusLerpSpeed: 0.1,
  turbulenceIntensity: 0.075,
};

document.querySelectorAll(".inversion-lens").forEach((container) => {
  initHoverEffect(container);
});

function initHoverEffect(container) {
  let scene, camera, renderer, uniforms;
  let lastMouseMoveTime = Date.now();
  let mouseInactiveDelay = 50;

  const targetMouse = new THREE.Vector2(0.5, 0.5);
  const lerpedMouse = new THREE.Vector2(0.5, 0.5);
  let targetRadius = 0.0;
  let prevMouse = new THREE.Vector2(0.5, 0.5);

  let isInView = false;
  let isMouseInsideContainer = false;
  let lastMouseX = 0;
  let lastMouseY = 0;

  const img = container.querySelector("img");
  const loader = new THREE.TextureLoader();

  loader.load(img.src, (texture) => {
    setupScene(texture);
    setupEventListeners();
    startAnimation(); // Use optimized animation start
  });

  const setupScene = (texture) => {
    const imageAspect = texture.image.width / texture.image.height;

    texture.minFilter = THREE.LinearMipMapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.anisotropy = 16;

    scene = new THREE.Scene();
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    uniforms = {
      u_texture: { value: texture },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_mouseDelta: { value: new THREE.Vector2(0.0, 0.0) },
      u_time: { value: 0.0 },
      u_resolution: { value: new THREE.Vector2(width, height) },
      u_radius: { value: 0.0 },
      u_speed: { value: config.maskSpeed },
      u_imageAspect: { value: imageAspect },
      u_turbulenceIntensity: { value: config.turbulenceIntensity },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader, 
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({
      antialias: false, // Disable for better performance
      powerPreference: "high-performance",
      stencil: false,
      depth: false
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio
    renderer.setSize(width, height);

    container.appendChild(renderer.domElement);
  };

  const setupEventListeners = () => {
    document.addEventListener("mousemove", (e) => {
      lastMouseMoveTime = Date.now();
      updateCursorState(e.clientX, e.clientY);
      startAnimation(); // Start animation on mouse move
    });

    window.addEventListener("scroll", () => {
      updateCursorState(lastMouseX, lastMouseY);
    }, { passive: true });

    // Yeh naya listener mouse ke bahar jane par radius ko zero karega
    container.addEventListener("mouseleave", () => {
      targetRadius = 0.0;
    });

    container.addEventListener("mouseenter", () => {
      startAnimation(); // Start animation on mouse enter
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isInView = entry.isIntersecting;
          if (!isInView) {
            targetRadius = 0.0;
          } else {
            startAnimation(); // Start animation when in view
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(container);
  };

  const updateCursorState = (x, y) => {
    lastMouseX = x;
    lastMouseY = y;

    const rect = container.getBoundingClientRect();
    const inside =
      x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;

    isMouseInsideContainer = inside;

    if (inside) {
      targetMouse.x = (x - rect.left) / rect.width;
      targetMouse.y = 1.0 - (y - rect.top) / rect.height;
      targetRadius = config.maskRadius;
    } else {
      targetRadius = 0.0;
    }
  };

let isAnimating = false;

const animate = () => {
  lerpedMouse.lerp(targetMouse, config.lerpFactor);

  // Only hide the mask if mouse is outside the container
  if (!isMouseInsideContainer && Date.now() - lastMouseMoveTime > mouseInactiveDelay) {
    targetRadius = 0.0;
  }

  if (uniforms) {
    uniforms.u_mouse.value.copy(lerpedMouse);
    uniforms.u_mouseDelta.value.copy(
      new THREE.Vector2().subVectors(lerpedMouse, prevMouse)
    );
    prevMouse.copy(lerpedMouse);
    uniforms.u_time.value += 0.01;
    uniforms.u_radius.value +=
      (targetRadius - uniforms.u_radius.value) * config.radiusLerpSpeed;
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }

  // Continue animation only if needed
  if (isInView && (isMouseInsideContainer || uniforms.u_radius.value > 0.001)) {
    requestAnimationFrame(animate);
  } else {
    isAnimating = false;
  }
};

const startAnimation = () => {
  if (!isAnimating) {
    isAnimating = true;
    animate();
  }
};

}
