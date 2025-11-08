import React, { useEffect, useRef } from 'react';

// Subtle animated starfield using canvas. Calm, slow motion.
export default function StarfieldBackground({ className = '' }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const starsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const onResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initStars();
    };

    const initStars = () => {
      const count = Math.min(140, Math.floor((width * height) / 12000));
      starsRef.current = Array.from({ length: count }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.7 + 0.3, // depth
        r: Math.random() * 0.8 + 0.2,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        twinkle: Math.random() * Math.PI * 2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // subtle gradient night sky
      const grd = ctx.createLinearGradient(0, 0, 0, height);
      grd.addColorStop(0, '#0A0E1A');
      grd.addColorStop(1, '#0B132B');
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, width, height);

      starsRef.current.forEach((s) => {
        s.x += s.vx * (0.5 + s.z);
        s.y += s.vy * (0.5 + s.z);
        if (s.x < -10) s.x = width + 10;
        if (s.x > width + 10) s.x = -10;
        if (s.y < -10) s.y = height + 10;
        if (s.y > height + 10) s.y = -10;
        s.twinkle += 0.01 + s.z * 0.01;

        const alpha = 0.4 + Math.sin(s.twinkle) * 0.25;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * (0.8 + s.z * 0.6), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(137, 207, 240, ${alpha})`;
        ctx.fill();
      });

      // softly drifting particles
      ctx.globalCompositeOperation = 'lighter';
      starsRef.current.slice(0, 10).forEach((p, i) => {
        const radius = 60 + Math.sin(p.twinkle + i) * 10;
        const alpha = 0.05;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(39, 70, 144, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      });
      ctx.globalCompositeOperation = 'source-over';

      animationRef.current = requestAnimationFrame(draw);
    };

    initStars();
    draw();
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

    return (
    <div className={`absolute inset-0 ${className}`} aria-hidden>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
