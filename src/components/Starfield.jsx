import React, { useRef, useEffect } from 'react';

// Subtle animated star/particle field with slow parallax
export default function Starfield({ className = '' }) {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const rafRef = useRef(null);
  const layerCount = 3;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initStars();
    };

    const initStars = () => {
      const count = Math.floor((canvas.width * canvas.height) / 8000);
      const stars = [];
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.floor(Math.random() * layerCount),
          r: Math.random() * 1.2 + 0.2,
          a: Math.random() * 0.5 + 0.2,
        });
      }
      starsRef.current = stars;
    };

    let t = 0;
    const render = () => {
      t += 0.002;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of starsRef.current) {
        const parallax = (s.z + 1) * 0.15;
        const nx = (s.x + Math.sin(t + s.z) * parallax) % canvas.width;
        const ny = (s.y + Math.cos(t * 0.7 + s.z) * parallax) % canvas.height;
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(nx, ny, 0, nx, ny, s.r * 3);
        gradient.addColorStop(0, `rgba(137,207,240,${0.85 * s.a})`); // cyan glow
        gradient.addColorStop(1, 'rgba(137,207,240,0)');
        ctx.fillStyle = gradient;
        ctx.arc(nx, ny, s.r * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(render);
    };

    resize();
    render();

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
