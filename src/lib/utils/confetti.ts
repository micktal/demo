export function fireConfetti(container: HTMLElement, count = 120) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const rect = container.getBoundingClientRect();
  canvas.width = rect.width;
  canvas.height = rect.height;
  canvas.style.position = 'absolute';
  canvas.style.inset = '0';
  canvas.style.pointerEvents = 'none';
  container.appendChild(canvas);

  const colors = ['#16a34a', '#22c55e', '#d4f8e8', '#0ea5e9', '#f59e0b'];
  const particles = Array.from({ length: count }).map(() => ({
    x: Math.random() * canvas.width,
    y: -10,
    w: 6 + Math.random() * 6,
    h: 8 + Math.random() * 8,
    color: colors[(Math.random() * colors.length) | 0],
    vx: -2 + Math.random() * 4,
    vy: 2 + Math.random() * 3,
    rot: Math.random() * Math.PI,
    vr: -0.2 + Math.random() * 0.4
  }));

  let raf = 0;
  const tick = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    }
    if (particles.some((p) => p.y < canvas.height + 20)) raf = requestAnimationFrame(tick);
    else cleanup();
  };
  const cleanup = () => { cancelAnimationFrame(raf); canvas.remove(); };
  raf = requestAnimationFrame(tick);
  setTimeout(cleanup, 2500);
}
