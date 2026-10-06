"use client";

import { useEffect, useRef, useState } from "react";
import { Picture } from "@/components/picture";
import { useIntroReady } from "@/lib/intro";
import { cn } from "@/lib/cn";

// Where the square character art sits in the hero. The CSS fallback image and
// the shader both read these, so swapping one for the other is seamless.
// fx/fy: centre as a fraction of the hero; s: art height as a fraction of it.
const WIDE = { fx: 0.66, fy: 0.5, s: 1.12 };
const TALL = { fx: 0.5, fy: 0.4, s: 0.84 };
const TALL_QUERY = "(max-aspect-ratio: 11/10)";

const vertex = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const fragment = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform float uDpr;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform float uReveal;
uniform vec3 uLayout;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

vec2 center() { return vec2(uRes.x * uLayout.x, uRes.y * (1.0 - uLayout.y)); }

// Canvas pixel (y up) to art UV (y down, as the image is stored).
vec2 artUv(vec2 px) {
  vec2 uv = (px - center()) / (uRes.y * uLayout.z) + 0.5;
  return vec2(uv.x, 1.0 - uv.y);
}

void main() {
  vec2 px = vUv * uRes;
  float t = uTime;

  // Slow drift and breathing zoom, like a held camera.
  float zoom = 1.0 + 0.04 * (0.5 + 0.5 * sin(t * 0.13));
  vec2 drift = vec2(sin(t * 0.07), cos(t * 0.05)) * 6.0 * uDpr;

  // Pointer: parallax plus a ripple around the cursor.
  vec2 m = uMouse * uRes;
  vec2 parallax = (uMouse - 0.5) * vec2(-22.0, -14.0) * uDpr * uHover;
  float d = distance(px, m);
  float spread = uRes.y * 0.2;
  float fall = exp(-(d * d) / (2.0 * spread * spread)) * uHover;
  vec2 dir = normalize(px - m + 0.0001);
  vec2 ripple = dir * sin(d / (22.0 * uDpr) - t * 3.0) * 7.0 * uDpr * fall;

  // Now and then a few rows jump sideways, like a signal glitch.
  float gt = floor(t * 9.0);
  float glitch = step(0.972, hash(vec2(gt, 3.1)));
  float row = floor(px.y / (uRes.y * 0.03));
  float shift = (hash(vec2(row, gt)) - 0.5) * 50.0 * uDpr * glitch * step(0.55, hash(vec2(row * 1.7, gt)));

  vec2 c = center();
  vec2 p = (px - c) / zoom + c + drift + parallax + ripple + vec2(shift, 0.0);

  // Chromatic split, stronger near the cursor and during a glitch.
  float split = (1.2 + 7.0 * fall + 12.0 * glitch) * uDpr;
  vec2 uv = artUv(p);
  vec3 art = vec3(
    texture2D(uTex, artUv(p + vec2(split, 0.0))).r,
    texture2D(uTex, uv).g,
    texture2D(uTex, artUv(p - vec2(split, 0.0))).b
  );
  float mask = smoothstep(0.0, 0.24, uv.x) * smoothstep(1.0, 0.97, uv.x)
             * smoothstep(0.0, 0.05, uv.y) * smoothstep(1.0, 0.9, uv.y);

  // Background: notch black with a coral and magenta halftone spill.
  float size = uRes.y * uLayout.z;
  vec2 glowCenter = vec2(c.x - size * 0.42, c.y - size * 0.05);
  float g = exp(-pow(distance(px, glowCenter) / (uRes.y * 0.7), 2.0));
  float beat = 0.82 + 0.18 * sin(t * 2.2);
  vec3 coral = vec3(0.996, 0.329, 0.302);
  vec3 magenta = vec3(0.757, 0.082, 0.404);
  vec3 glow = mix(magenta, coral, smoothstep(0.2, 1.0, g));
  float cell = 7.0 * uDpr;
  vec2 cellUv = fract(px / cell) - 0.5;
  float radius = 0.5 * g * beat;
  float dots = 1.0 - smoothstep(radius - 0.1, radius, length(cellUv));
  vec3 bg = vec3(0.024, 0.024, 0.031) + glow * (0.18 * g + 0.5 * dots * g);

  vec3 col = mix(bg, art, mask);

  // Intro: horizontal blinds open from the top, one after another.
  float stripes = 14.0;
  float y = (1.0 - vUv.y) * stripes;
  float local = clamp(uReveal * 1.6 - floor(y) / stripes * 0.6, 0.0, 1.0);
  col *= step(fract(y), local);

  // Scanlines, grain and a soft vignette.
  col *= 0.93 + 0.07 * sin(px.y * 3.14159 / (1.5 * uDpr));
  col += (hash(px + fract(t) * 91.0) - 0.5) * 0.045;
  vec2 q = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
  col *= mix(0.6, 1.0, smoothstep(1.3, 0.3, length(q)));

  gl_FragColor = vec4(col, 1.0);
}`;

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader));
    return null;
  }
  return shader;
}

type Phase = "fallback" | "ready" | "live";

/**
 * The hero's moving picture: the app icon's character rendered through a small
 * WebGL shader. The plain image underneath is the LCP image, the no-JS view,
 * and the fallback for reduced motion or missing WebGL.
 */
export function HeroArt({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const introReady = useIntroReady();
  const introRef = useRef(introReady);
  const [phase, setPhase] = useState<Phase>("fallback");

  useEffect(() => {
    introRef.current = introReady;
  }, [introReady]);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = canvasRef.current;
    const img = imgWrapRef.current?.querySelector("img");
    if (!canvas || !img) return;

    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
    if (!gl) return;

    let disposed = false;
    let raf = 0;
    let visible = true;
    const cleanups: (() => void)[] = [];

    const start = () => {
      if (disposed) return;
      const vs = compile(gl, gl.VERTEX_SHADER, vertex);
      const fs = compile(gl, gl.FRAGMENT_SHADER, fragment);
      const program = gl.createProgram();
      if (!vs || !fs || !program) return;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
      gl.useProgram(program);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const aPos = gl.getAttribLocation(program, "aPos");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      // Reuse the <img> the browser already chose (AVIF or WebP, right size).
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      const pot = (n: number) => (n & (n - 1)) === 0;
      if (pot(img.naturalWidth) && pot(img.naturalHeight)) {
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      const u = (name: string) => gl.getUniformLocation(program, name);
      const uRes = u("uRes");
      const uDpr = u("uDpr");
      const uTime = u("uTime");
      const uMouse = u("uMouse");
      const uHover = u("uHover");
      const uReveal = u("uReveal");
      const uLayout = u("uLayout");

      const tall = matchMedia(TALL_QUERY);
      let dpr = 1;
      const resize = () => {
        dpr = Math.min(window.devicePixelRatio || 1, 1.75);
        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = Math.max(1, Math.round(width * dpr));
        canvas.height = Math.max(1, Math.round(height * dpr));
        gl.viewport(0, 0, canvas.width, canvas.height);
        const layout = tall.matches ? TALL : WIDE;
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uDpr, dpr);
        gl.uniform3f(uLayout, layout.fx, layout.fy, layout.s);
      };
      resize();
      const observer = new ResizeObserver(resize);
      observer.observe(canvas);
      cleanups.push(() => observer.disconnect());

      // Pointer, eased in the render loop.
      const target = { x: 0.5, y: 0.5, hover: 0 };
      const eased = { x: 0.5, y: 0.5, hover: 0 };
      const onMove = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;
        const rect = canvas.getBoundingClientRect();
        target.x = (event.clientX - rect.left) / rect.width;
        target.y = 1 - (event.clientY - rect.top) / rect.height;
        target.hover = event.clientY < rect.bottom ? 1 : 0;
      };
      const onLeave = () => (target.hover = 0);
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
      cleanups.push(() => {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("pointerleave", onLeave);
      });

      // Only render while the hero is on screen.
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(frame);
      });
      io.observe(canvas);
      cleanups.push(() => io.disconnect());

      // If the art arrives after the intro already played, skip the blinds.
      let reveal = introRef.current ? 1 : 0;
      let revealStart = -1;
      const t0 = performance.now();
      let last = t0;

      function frame(now: number) {
        raf = 0;
        if (disposed || !visible || document.hidden) return;
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        const k = 1 - Math.exp(-dt * 4);
        eased.x += (target.x - eased.x) * k;
        eased.y += (target.y - eased.y) * k;
        eased.hover += (target.hover - eased.hover) * (1 - Math.exp(-dt * 2.5));

        if (reveal < 1 && introRef.current) {
          if (revealStart < 0) revealStart = now;
          reveal = Math.min((now - revealStart) / 1500, 1);
        }
        const easedReveal = 1 - Math.pow(1 - reveal, 3);

        gl!.uniform1f(uTime, (now - t0) / 1000);
        gl!.uniform2f(uMouse, eased.x, eased.y);
        gl!.uniform1f(uHover, eased.hover);
        gl!.uniform1f(uReveal, easedReveal);
        gl!.drawArrays(gl!.TRIANGLES, 0, 3);
        raf = requestAnimationFrame(frame);
      }

      const onVisibility = () => {
        if (!document.hidden && visible && !raf) {
          last = performance.now();
          raf = requestAnimationFrame(frame);
        }
      };
      document.addEventListener("visibilitychange", onVisibility);
      cleanups.push(() => document.removeEventListener("visibilitychange", onVisibility));

      raf = requestAnimationFrame(frame);
      setPhase(reveal === 1 ? "live" : "ready");
    };

    if (img.complete && img.naturalWidth) start();
    else {
      img.addEventListener("load", start, { once: true });
      cleanups.push(() => img.removeEventListener("load", start));
    }

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      cleanups.forEach((cleanup) => cleanup());
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return (
    <div className={cn("absolute inset-0 overflow-hidden bg-ink", className)}>
      {/* Fallback art, positioned like the shader draws it. */}
      <div
        ref={imgWrapRef}
        data-hero-art
        className={cn(
          "hero-layout absolute inset-0 transition-opacity duration-700",
          phase === "ready" ? "opacity-0 duration-0" : "opacity-100",
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_42%_50%,rgb(193_21_103/0.35),transparent_70%)]" />
        <Picture
          slug="character"
          alt="Ririku's character: an anime girl with a black and red bob and a cybernetic neck, in coral and magenta."
          sizes="(max-aspect-ratio: 11/10) 84vh, 112vh"
          priority
          className="absolute top-[calc(var(--fy)*100%)] left-[calc(var(--fx)*100%)] block aspect-square h-[calc(var(--s)*100%)] -translate-x-1/2 -translate-y-1/2"
          imgClassName="size-full object-cover [mask-image:linear-gradient(to_right,transparent,#000_24%,#000_97%,transparent),linear-gradient(to_bottom,transparent,#000_5%,#000_90%,transparent)] [mask-composite:intersect]"
        />
      </div>
      <canvas
        ref={canvasRef}
        aria-hidden
        className={cn(
          "absolute inset-0 size-full transition-opacity duration-700",
          phase === "fallback" ? "opacity-0" : "opacity-100",
        )}
      />
    </div>
  );
}
