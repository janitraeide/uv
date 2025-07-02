// ✅ vertexShader.js
export const vertexShader = `
  varying vec2 v_uv;

  void main() {
    v_uv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// ✅ fragmentShader.js (Smoke-style lens with RGB distortion)
export const fragmentShader = `
 precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_mouse;
uniform vec2 u_mouseDelta;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_radius;
uniform float u_speed;
uniform float u_imageAspect;
uniform float u_turbulenceIntensity;

varying vec2 v_uv;

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898,78.233))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(rand(i + vec2(0.0, 0.0)), rand(i + vec2(1.0, 0.0)), u.x),
    mix(rand(i + vec2(0.0, 1.0)), rand(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 3; i++) {
    value += noise(p) * amplitude;
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

void main() {
  vec2 uv = v_uv;
  float screenAspect = u_resolution.x / u_resolution.y;
  float ratio = u_imageAspect / screenAspect;

  vec2 correctedUV = uv;
  correctedUV.x *= screenAspect;
  vec2 correctedMouse = u_mouse;
  correctedMouse.x *= screenAspect;

  float dist = distance(correctedUV, correctedMouse);

  float smoke = fbm(uv * 4.0 + u_mouseDelta * 2.0 + u_time * 0.2);
  float jaggedDist = dist + smoke * 0.07;

  float mask = smoothstep(u_radius + 0.025, u_radius - 0.025, jaggedDist);
  mask *= step(0.001, u_radius);

  vec2 baseTexCoord = vec2(
    mix(0.5 - 0.5 / ratio, 0.5 + 0.5 / ratio, uv.x),
    uv.y
  );
  vec4 baseTex = texture2D(u_texture, baseTexCoord);

  float rgbOffset = 0.015 + u_radius * 0.01;

  vec2 offset = rgbOffset * vec2(
    cos(dist * 30.0 + u_time),
    sin(dist * 20.0 - u_time)
  );

  vec4 rgbTex = vec4(
    texture2D(u_texture, baseTexCoord + offset).r,
    texture2D(u_texture, baseTexCoord).g,
    texture2D(u_texture, baseTexCoord - offset).b,
    1.0
  );

  float gray = dot(rgbTex.rgb, vec3(0.299, 0.587, 0.114));
  vec3 inverted = vec3(1.0 - gray);

  float edge = smoothstep(u_radius + 0.012, u_radius - 0.012, jaggedDist);
  vec3 glow = vec3(0.01) * edge * 0.5;

  vec3 finalColor = mix(baseTex.rgb, inverted, mask);
  finalColor += glow;

  gl_FragColor = vec4(finalColor, 1.0);
}

`;
