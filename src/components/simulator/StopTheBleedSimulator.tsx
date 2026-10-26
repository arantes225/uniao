import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, ShieldCheck, AlertTriangle, CheckCircle2, Activity, Droplet, MessageCircle, SearchCheck, PlayCircle } from 'lucide-react';
import { getCasoById, type CasoStopTheBleed } from '../../data/simulator/stop-the-bleed/casosConfig';

const baseAssets = `${import.meta.env.BASE_URL}simulador/personagens/stop-the-bleed/`;

const W = 1200;
const H = 675;

const MEMBRO_CONFIGS = {
  coxa: { scale: 1.35, tqW: 130, bandW: 66, handScale: 1.25, flowMod: 1.35, groundY: 570, canTourniquet: true, tqIndicado: true },
  perna: { scale: 1.10, tqW: 105, bandW: 54, handScale: 1.10, flowMod: 1.05, groundY: 565, canTourniquet: true, tqIndicado: true },
  braco: { scale: 0.95, tqW: 90, bandW: 46, handScale: 0.95, flowMod: 0.90, groundY: 545, canTourniquet: true, tqIndicado: true },
  antebraco: { scale: 0.80, tqW: 78, bandW: 40, handScale: 0.85, flowMod: 0.75, groundY: 535, canTourniquet: true, tqIndicado: true },
  juncao: { scale: 1.30, tqW: 110, bandW: 75, handScale: 1.20, flowMod: 1.25, groundY: 560, canTourniquet: true, tqIndicado: false },
  peito: { scale: 1.00, tqW: 95, bandW: 60, handScale: 1.00, flowMod: 1.10, groundY: 550, canTourniquet: true, tqIndicado: false },
  abdome: { scale: 1.05, tqW: 95, bandW: 65, handScale: 1.05, flowMod: 1.15, groundY: 550, canTourniquet: true, tqIndicado: false },
  rosto: { scale: 0.85, tqW: 85, bandW: 45, handScale: 0.90, flowMod: 0.95, groundY: 530, canTourniquet: true, tqIndicado: false }
};

type Drop = {
  x: number;
  y: number;
  px: number;
  py: number;
  vx: number;
  vy: number;
  r: number;
  age: number;
  maxAge: number;
  jet: boolean;
};

type FeedbackState = {
  type: 'success' | 'penalty';
  title: string;
  description: string;
  recommendation: string;
} | null;

type DecisionPanel = 'perguntas' | 'exames' | 'acoes';

export function StopTheBleedSimulator({ caseId }: { caseId: number | string }) {
  const currentCase: CasoStopTheBleed = getCasoById(caseId);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoRef = useRef<HTMLImageElement | null>(null);
  const handRef = useRef<HTMLImageElement | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isCloseup, setIsCloseup] = useState(true);
  const [bleedMode, setBleedMode] = useState<'pulse' | 'continuous'>('pulse');
  const [feedback, setFeedback] = useState<FeedbackState>(null);
  const [decisionPanel, setDecisionPanel] = useState<DecisionPanel>('acoes');
  // Estados dos tratamentos
  const treatmentRef = useRef({
    pack: 0,
    bandage: 0,
    hand: 0,
    tourniquet: 0,
    packTarget: false,
    bandageTarget: false,
    handTarget: false,
    tourniquetTarget: false,
    tourniquetTime: null as string | null,
    soak: 0
  });

  const [treatmentState, setTreatmentState] = useState({
    packActive: false,
    bandageActive: false,
    handActive: false,
    tqActive: false,
    tqTime: null as string | null
  });

  const flowRef = useRef(1);
  const filmTimeRef = useRef(0);
  const stateRef = useRef({
    mode: 'pulse' as 'continuous' | 'pulse',
    strength: 0.85,
    time: 0,
    paused: false,
    close: true
  });

  const dropsRef = useRef<Drop[]>([]);
  const seedRef = useRef(7043);
  const woundLayerRef = useRef<HTMLCanvasElement | null>(null);

  const random = useCallback(() => {
    seedRef.current = (1664525 * seedRef.current + 1013904223) >>> 0;
    return seedRef.current / 4294967296;
  }, []);

  const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));
  const smooth = (a: number, b: number, n: number) => {
    const v = clamp((n - a) / (b - a), 0, 1);
    return v * v * (3 - 2 * v);
  };

  const ellipse = (c: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, angle = 0) => {
    c.beginPath();
    c.ellipse(x, y, rx, ry, angle, 0, Math.PI * 2);
  };

  // Prepara curvas do corte longitudinal
  const cutTopRef = useRef<[number, number][]>([]);
  const cutBottomRef = useRef<[number, number][]>([]);
  const stainsRef = useRef<{ x: number; y: number; r: number; a: number }[]>([]);

  useEffect(() => {
    const cutTop: [number, number][] = [];
    const cutBottom: [number, number][] = [];
    for (let i = 0; i <= 44; i++) {
      const x = i - 22;
      const taper = Math.pow(Math.max(0, 1 - Math.pow(x / 22, 2)), 0.65);
      cutTop.push([x, -taper * (2.1 + random() * 0.75) + Math.sin(i * 1.9) * 0.25 * taper]);
      cutBottom.push([x, taper * (1.45 + random() * 0.9) + Math.sin(i * 1.6) * 0.3 * taper]);
    }
    cutTopRef.current = cutTop;
    cutBottomRef.current = cutBottom;

    const stains = [];
    for (let i = 0; i < 140; i++) {
      stains.push({
        x: random() * 49 - 24.5,
        y: (random() + random() - 1) * 15,
        r: 0.15 + random() * 0.8,
        a: 0.05 + random() * 0.2
      });
    }
    stainsRef.current = stains;
  }, [random]);

  const cutPath = (c: CanvasRenderingContext2D, scale = 1) => {
    c.beginPath();
    c.moveTo(-22 * scale, 0);
    for (const [x, y] of cutTopRef.current) c.lineTo(x * scale, y * scale);
    for (let i = cutBottomRef.current.length - 1; i >= 0; i--) {
      c.lineTo(cutBottomRef.current[i][0] * scale, cutBottomRef.current[i][1] * scale);
    }
    c.closePath();
  };

  // Reset de tratamentos e física ao mudar de caso
  useEffect(() => {
    treatmentRef.current = {
      pack: 0,
      bandage: 0,
      hand: 0,
      tourniquet: 0,
      packTarget: false,
      bandageTarget: false,
      handTarget: false,
      tourniquetTarget: false,
      tourniquetTime: null,
      soak: 0
    };
    dropsRef.current = [];
    flowRef.current = 1;
    filmTimeRef.current = 0;
    stateRef.current.time = 0;
    setTreatmentState({
      packActive: false,
      bandageActive: false,
      handActive: false,
      tqActive: false,
      tqTime: null
    });
    setFeedback(null);
  }, [currentCase.id]);

  // Caminhos de escorrimento de sangue (Rivulets) da ferida para baixo
  const getRivulets = useCallback(() => {
    if (!currentCase) return [];
    const f = currentCase.ferida;
    const mConfig = MEMBRO_CONFIGS[currentCase.membro] || MEMBRO_CONFIGS.perna;
    const ground = mConfig.groundY || 560;
    const dy = Math.max(25, (ground - f.y) * 0.75);
    const mult = f.escalaManual !== undefined ? f.escalaManual : 1.0;
    const r = (currentCase.woundShape === 'round' ? 5.2 : 18) * mConfig.scale * mult;

    if (currentCase.woundShape === 'round') {
      return [
        { p: [[f.x, f.y + r * 0.8], [f.x + 1, f.y + r * 1.5 + dy * 0.25], [f.x + 3, f.y + dy * 0.65], [f.x + 4, f.y + dy]], width: 1.8, delay: 0 },
        { p: [[f.x + r * 0.5, f.y + r * 0.6], [f.x + r * 0.8 + 4, f.y + dy * 0.3], [f.x + 12, f.y + dy * 0.7], [f.x + 16, f.y + dy * 1.05]], width: 1.1, delay: 0.6 },
        { p: [[f.x - r * 0.4, f.y + r * 0.7], [f.x - 4, f.y + dy * 0.28], [f.x - 3, f.y + dy * 0.6], [f.x - 1, f.y + dy * 0.95]], width: 0.8, delay: 1.4 }
      ];
    }

    return [
      { p: [[f.x - 2, f.y + 2], [f.x, f.y + dy * 0.3], [f.x + 3, f.y + dy * 0.65], [f.x + 5, f.y + dy]], width: 2.2, delay: 0 },
      { p: [[f.x + 6, f.y + 3], [f.x + 12, f.y + dy * 0.35], [f.x + 22, f.y + dy * 0.7], [f.x + 32, f.y + dy * 1.05]], width: 1.3, delay: 0.5 },
      { p: [[f.x - 8, f.y + 1], [f.x - 10, f.y + dy * 0.3], [f.x - 8, f.y + dy * 0.6], [f.x - 5, f.y + dy * 0.95]], width: 0.9, delay: 1.2 }
    ];
  }, [currentCase]);

  const sampleRivulet = (r: { p: number[][] }, t: number) => {
    const f = clamp(t, 0, 1) * (r.p.length - 1);
    const i = Math.min(r.p.length - 2, Math.floor(f));
    const u = f - i;
    const a = r.p[Math.max(0, i - 1)];
    const b = r.p[i];
    const c = r.p[i + 1];
    const d = r.p[Math.min(r.p.length - 1, i + 2)];
    const k = (j: number) => 0.5 * (2 * b[j] + (-a[j] + c[j]) * u + (2 * a[j] - 5 * b[j] + 4 * c[j] - d[j]) * u * u + (-a[j] + 3 * b[j] - 3 * c[j] + d[j]) * u * u * u);
    return { x: k(0), y: k(1) };
  };

  const drawFilm = (c: CanvasRenderingContext2D, r: { p: number[][]; delay: number }, t: number, width: number) => {
    const end = clamp((t - r.delay) / 6, 0, 1);
    if (end <= 0) return;
    const left: [number, number][] = [];
    const right: [number, number][] = [];
    const n = Math.ceil(100 * end);
    for (let i = 0; i <= n; i++) {
      const p = (i / n) * end;
      const v = sampleRivulet(r, p);
      const next = sampleRivulet(r, Math.min(1, p + 0.006));
      const dx = next.x - v.x;
      const dy = next.y - v.y;
      const len = Math.hypot(dx, dy) || 1;
      const wave = 0.85 + 0.24 * Math.sin(p * 39 + r.delay);
      const front = 0.5 + 0.5 * smooth(0, 0.04, end - p);
      const w = width * wave * front * (1 - 0.3 * p);
      left.push([v.x - (dy / len) * w, v.y + (dx / len) * w]);
      right.push([v.x + (dy / len) * w, v.y - (dx / len) * w]);
    }
    c.beginPath();
    c.moveTo(...left[0]);
    for (const p of left) c.lineTo(...p);
    for (const p of right.reverse()) c.lineTo(...p);
    c.closePath();
    const g = c.createLinearGradient(r.p[0][0] - 6, 0, r.p[0][0] + 30, 0);
    g.addColorStop(0, '#773528bf');
    g.addColorStop(0.35, '#831f16d9');
    g.addColorStop(0.7, '#a23521b8');
    g.addColorStop(1, '#60170fb0');
    c.save();
    c.globalCompositeOperation = 'multiply';
    c.fillStyle = g;
    c.fill();
    c.strokeStyle = '#7a2c1e44';
    c.lineWidth = 0.75;
    c.stroke();
    c.restore();
  };

  // Desenho da ferida hiper-realista
  const desenharFerida = useCallback((c: CanvasRenderingContext2D) => {
    if (!currentCase) return;
    const f = currentCase.ferida;
    const mConfig = MEMBRO_CONFIGS[currentCase.membro] || MEMBRO_CONFIGS.perna;
    const mult = f.escalaManual !== undefined ? f.escalaManual : 1.0;
    const escala = mConfig.scale * mult;

    c.clearRect(0, 0, W, H);
    c.save();
    c.translate(f.x, f.y);
    c.rotate(f.rotacao);

    if (currentCase.woundShape === 'round') {
      // 🎯 BURACO REDONDO REALISTA (PAF)
      const r = 5.2 * escala;
      const rEscoriacao = r * 1.55;
      const rEquimose = r * 3.4;

      // 1. EQUIMOSE PERILESIONAL SUBDÉRMICA
      const halo = c.createRadialGradient(0, 0, r * 0.4, 0, 0, rEquimose);
      halo.addColorStop(0, 'rgba(95, 20, 18, 0.45)');
      halo.addColorStop(0.35, 'rgba(115, 30, 24, 0.28)');
      halo.addColorStop(0.7, 'rgba(80, 22, 35, 0.12)');
      halo.addColorStop(1, 'rgba(65, 18, 15, 0)');
      c.save();
      c.scale(1, 0.88);
      c.fillStyle = halo;
      c.beginPath();
      c.arc(0, 0, rEquimose, 0, Math.PI * 2);
      c.fill();
      c.restore();

      // 2. MICRO-TATUAGEM DE PÓLVORA
      for (let i = 0; i < 85; i++) {
        const angle = random() * Math.PI * 2;
        const dist = r * 0.95 + random() * (rEquimose * 0.8 - r * 0.95);
        const px = Math.cos(angle) * dist;
        const py = Math.sin(angle) * dist * 0.9;
        const size = 0.15 + random() * 0.45;
        const alpha = 0.08 + random() * 0.28;
        c.fillStyle = `rgba(32, 10, 8, ${alpha})`;
        c.beginPath();
        c.arc(px, py, size, 0, Math.PI * 2);
        c.fill();
      }

      // 3. ORLA DE ESCORIAÇÃO / DESNUDAMENTO EPIDÉRMICO
      const nPts = 32;
      c.beginPath();
      for (let i = 0; i <= nPts; i++) {
        const a = (i / nPts) * Math.PI * 2;
        const noise = 1 + 0.06 * Math.sin(a * 7) + 0.04 * Math.cos(a * 11) + 0.03 * Math.sin(a * 17);
        const rad = rEscoriacao * noise;
        const px = Math.cos(a) * rad;
        const py = Math.sin(a) * rad * 0.92;
        if (i === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
      const gradEscoriacao = c.createRadialGradient(0, 0, r * 0.75, 0, 0, rEscoriacao);
      gradEscoriacao.addColorStop(0, '#58140ee0');
      gradEscoriacao.addColorStop(0.5, '#7c251ace');
      gradEscoriacao.addColorStop(0.85, '#9d3d2ed0');
      gradEscoriacao.addColorStop(1, '#b0604cb0');
      c.fillStyle = gradEscoriacao;
      c.fill();

      // 4. ORLA DE ENXUGAMENTO
      c.beginPath();
      for (let i = 0; i <= nPts; i++) {
        const a = (i / nPts) * Math.PI * 2;
        const noise = 1 + 0.05 * Math.sin(a * 9) + 0.03 * Math.cos(a * 13);
        const rad = (r + 0.75) * noise;
        const px = Math.cos(a) * rad;
        const py = Math.sin(a) * rad * 0.92;
        if (i === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
      c.fillStyle = '#220806f5';
      c.fill();

      // 5. CAVIDADE CENTRAL PROFUNDA
      c.beginPath();
      for (let i = 0; i <= nPts; i++) {
        const a = (i / nPts) * Math.PI * 2;
        const noise = 1 + 0.04 * Math.sin(a * 11 + 0.4) + 0.03 * Math.cos(a * 7);
        const rad = r * noise;
        const px = Math.cos(a) * rad;
        const py = Math.sin(a) * rad * 0.92;
        if (i === 0) c.moveTo(px, py);
        else c.lineTo(px, py);
      }
      c.closePath();
      const gradCavidade = c.createRadialGradient(-r * 0.25, -r * 0.25, 0.4, 0, 0, r);
      gradCavidade.addColorStop(0, '#0a0202');
      gradCavidade.addColorStop(0.55, '#190504');
      gradCavidade.addColorStop(0.85, '#380c08');
      gradCavidade.addColorStop(1, '#54140c');
      c.fillStyle = gradCavidade;
      c.fill();

      // 6. MENISCO E BRILHO ÚMIDO ESPECULAR
      c.fillStyle = '#8f281cee';
      c.beginPath();
      c.ellipse(r * 0.1, r * 0.18, r * 0.55, r * 0.35, 0.2, 0, Math.PI * 2);
      c.fill();

      c.fillStyle = 'rgba(255, 235, 220, 0.5)';
      c.beginPath();
      c.ellipse(-r * 0.18, -r * 0.22, r * 0.22, r * 0.12, -0.4, 0, Math.PI * 2);
      c.fill();
    } else {
      // 🔪 BURACO LONGITUDINAL (Corte)
      const halo = c.createRadialGradient(0, 0, 2, 0, 0, 30 * escala);
      halo.addColorStop(0, '#813b2b31');
      halo.addColorStop(0.5, '#8c3d2826');
      halo.addColorStop(1, '#7d281c00');
      c.save();
      c.scale(1, 0.38);
      c.fillStyle = halo;
      ellipse(c, 0, 0, 32 * escala, 32 * escala);
      c.fill();
      c.restore();

      for (const s of stainsRef.current) {
        c.fillStyle = `rgba(93,22,13,${s.a})`;
        ellipse(c, s.x * escala, s.y * escala, s.r, s.r * 0.5);
        c.fill();
      }

      c.fillStyle = '#76312499';
      cutPath(c, 1.06 * escala);
      c.fill();

      const rim = c.createLinearGradient(0, -4, 0, 4);
      rim.addColorStop(0, '#bd897466');
      rim.addColorStop(0.35, '#a0523c99');
      rim.addColorStop(0.6, '#68221999');
      rim.addColorStop(1, '#cc958366');
      c.strokeStyle = rim;
      c.lineWidth = 0.7;
      cutPath(c, escala);
      c.stroke();

      c.fillStyle = '#4f100ccf';
      cutPath(c, 0.97 * escala);
      c.fill();

      c.save();
      cutPath(c, 0.97 * escala);
      c.clip();
      const blood = c.createLinearGradient(0, -3, 0, 3);
      blood.addColorStop(0, '#521c13ed');
      blood.addColorStop(0.4, '#320d0ae8');
      blood.addColorStop(0.75, '#6e1f14e0');
      blood.addColorStop(1, '#94523acc');
      c.fillStyle = blood;
      c.fillRect(-26 * escala, -8 * escala, 52 * escala, 16 * escala);
      c.restore();
    }
    c.restore();
  }, [currentCase, random]);

  // Carregamento de imagens
  useEffect(() => {
    let active = true;
    setLoading(true);
    setErrorMsg(null);

    const photo = new Image();
    const hand = new Image();

    // Cria canvas secundário para a camada de ferida
    const woundCanvas = document.createElement('canvas');
    woundCanvas.width = W * 2;
    woundCanvas.height = H * 2;
    const wCtx = woundCanvas.getContext('2d');
    if (wCtx) {
      wCtx.scale(2, 2);
      woundLayerRef.current = woundCanvas;
      desenharFerida(wCtx);
    }

    photo.onload = () => {
      if (!active) return;
      photoRef.current = photo;
      setLoading(false);
    };

    photo.onerror = () => {
      if (!active) return;
      // Tenta caminho direto alternativo
      const fallback = encodeURI(`${baseAssets}casos/${currentCase.file}`);
      if (photo.src !== fallback) {
        photo.src = fallback;
      } else {
        setErrorMsg(`Não foi possível carregar a imagem do caso (${currentCase.file}).`);
        setLoading(false);
      }
    };

    const initialPhotoUrl = encodeURI(`${baseAssets}casos/${currentCase.file}`);
    photo.src = initialPhotoUrl;

    hand.onload = () => {
      handRef.current = hand;
    };
    hand.src = `${baseAssets}mao-compressao.png`;

    return () => {
      active = false;
      photo.onload = null;
      photo.onerror = null;
    };
  }, [currentCase, desenharFerida]);

  // Loop de animação física
  useEffect(() => {
    if (loading || errorMsg) return;

    let rafId = 0;
    let previousTime: number | null = null;
    let accumulator = 0;
    let emission = 0;
    let dripClock = 0;

    const camera = () => {
      if (!stateRef.current.close || !currentCase) return { x: 0, y: 0, w: W, h: H };
      const f = currentCase.ferida;
      const viewW = currentCase.woundShape === 'round' ? 260 : 360;
      const viewH = viewW * (9 / 16);
      return {
        x: clamp(f.x - viewW / 2, 0, W - viewW),
        y: clamp(f.y - viewH / 2, 0, H - viewH),
        w: viewW,
        h: viewH
      };
    };

    const visualFlow = () => {
      const isTqEffective = currentCase && currentCase.tqIndicado === true;
      const tqEffect = isTqEffective ? smooth(0.48, 0.9, treatmentRef.current.tourniquet) : 0;
      return (
        (1 - 0.3 * treatmentRef.current.pack) *
        (1 - 0.18 * treatmentRef.current.bandage) *
        (1 - 0.92 * treatmentRef.current.hand) *
        (1 - tqEffect)
      );
    };

    const updatePhysics = (dt: number) => {
      stateRef.current.time += dt;

      // Avanço dos tratamentos
      const tr = treatmentRef.current;
      if (tr.packTarget && tr.pack < 1) tr.pack = Math.min(1, tr.pack + dt / 6.5);
      if (tr.bandageTarget && tr.bandage < 1) tr.bandage = Math.min(1, tr.bandage + dt / 2.4);
      if (tr.tourniquetTarget && tr.tourniquet < 1) tr.tourniquet = Math.min(1, tr.tourniquet + dt / 5.0);

      const targetHand = tr.handTarget ? 1 : 0;
      if (tr.hand !== targetHand) {
        const step = dt / 0.65;
        tr.hand = targetHand ? Math.min(1, tr.hand + step) : Math.max(0, tr.hand - step);
      }

      const targetFlow = visualFlow();
      flowRef.current =
        Math.abs(targetFlow - flowRef.current) < 0.0005
          ? targetFlow
          : flowRef.current + (targetFlow - flowRef.current) * Math.min(1, dt * 6);

      filmTimeRef.current += dt * flowRef.current;
      if (tr.pack || tr.bandage) tr.soak += dt * flowRef.current;

      const f = currentCase.ferida;
      const beat = (stateRef.current.time % 1.02) / 1.02;
      const pulse = Math.pow(Math.max(0, Math.sin((beat / 0.32) * Math.PI)), 2) * (beat < 0.32 ? 1 : 0);

      // 🩸 1. JATO PULSÁTIL ARTERIAL (Spurting sincronizado com a sístole cardíaca)
      if (stateRef.current.mode === 'pulse') {
        emission += dt * (pulse > 0.03 ? 280 * pulse : 0) * flowRef.current * (1 - tr.bandage);
        while (emission >= 1) {
          emission--;
          const speed = (95 + 175 * stateRef.current.strength) * (0.8 + 0.25 * pulse);
          const dirX = f.x > 950 ? -0.85 : 0.85;
          dropsRef.current.push({
            x: f.x + 1,
            y: f.y + 1,
            px: f.x + 1,
            py: f.y + 1,
            vx: speed * (dirX + (random() - 0.5) * 0.18),
            vy: -speed * 0.32 + (random() - 0.5) * 16,
            r: 0.95 + random() * 1.1,
            age: 0,
            maxAge: 1.8 + random() * 0.4,
            jet: true
          });
        }
      }

      // 🩸 2. FLUXO CONTÍNUO (Hemorragia venosa ou cavitária profusa que jorra e escorre)
      if (stateRef.current.mode === 'continuous') {
        emission += dt * (38 + 75 * stateRef.current.strength) * flowRef.current * (1 - tr.bandage);
        while (emission >= 1) {
          emission--;
          const speed = 50 + 85 * stateRef.current.strength;
          dropsRef.current.push({
            x: f.x + (random() - 0.5) * 8,
            y: f.y + 2,
            px: f.x,
            py: f.y + 2,
            vx: (random() - 0.5) * 28,
            vy: speed * 0.45 + random() * 25,
            r: 1.1 + random() * 0.95,
            age: 0,
            maxAge: 1.6 + random() * 0.4,
            jet: false
          });
        }
      }

      // 🩸 3. GOTAS DE ESCORRIMENTO (Vertem da lesão em direção ao solo desde os primeiros segundos)
      if (filmTimeRef.current > 0.3) {
        dripClock += dt * (0.8 + stateRef.current.strength * 1.8) * flowRef.current * (1 - tr.bandage * 0.75);
        if (dripClock >= 1) {
          dripClock -= 1;
          const dy = Math.max(50, (H - f.y) * 0.65);
          dropsRef.current.push({
            x: f.x + (random() - 0.5) * 12,
            y: f.y + dy * Math.min(1, filmTimeRef.current / 3.5),
            px: f.x,
            py: f.y + dy * Math.min(1, filmTimeRef.current / 3.5),
            vx: (random() - 0.5) * 6,
            vy: 35 + random() * 40,
            r: 1.3 + random() * 0.9,
            age: 0,
            maxAge: 2.2,
            jet: false
          });
        }
      }

      // Gravidade (380 px/s²)
      for (let i = dropsRef.current.length - 1; i >= 0; i--) {
        const d = dropsRef.current[i];
        d.age += dt;
        d.px = d.x;
        d.py = d.y;
        d.vy += 380 * dt;
        d.x += d.vx * dt;
        d.y += d.vy * dt;

        if (d.y > H + 40 || d.x > W + 40 || d.x < -40 || d.age > d.maxAge) {
          dropsRef.current.splice(i, 1);
        }
      }
      if (dropsRef.current.length > 550) dropsRef.current.splice(0, dropsRef.current.length - 550);
    };

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas || !photoRef.current) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      const view = camera();
      ctx.setTransform(canvas.width / view.w, 0, 0, canvas.height / view.h, (-view.x * canvas.width) / view.w, (-view.y * canvas.height) / view.h);

      // 1. Imagem fotográfica de fundo
      ctx.drawImage(photoRef.current, 0, 0, W, H);

      // 2. Escorrimento de sangue ao longo da pele (Rivulets)
      const rivs = getRivulets();
      for (const r of rivs) {
        drawFilm(ctx, r, filmTimeRef.current, r.width * (0.8 + stateRef.current.strength * 0.7));
      }

      // 3. Camada da ferida hiper-realista
      if (woundLayerRef.current) {
        ctx.drawImage(woundLayerRef.current, 0, 0, W, H);
      }

      // 4. Jatos e gotas balísticas de sangue
      let prev: Drop | null = null;
      for (const d of dropsRef.current) {
        const fade = clamp((d.maxAge - d.age) / 0.35, 0, 1);
        const alpha = Math.min(1, d.age * 30 + 0.3) * fade;
        if (d.jet && prev && Math.abs(prev.age - d.age) < 0.035 && Math.hypot(d.x - prev.x, d.y - prev.y) < 26 && d.age < 0.6) {
          ctx.beginPath();
          ctx.moveTo(prev.x, prev.y);
          ctx.lineTo(d.x, d.y);
          ctx.lineWidth = (d.r + prev.r) * 1.5;
          ctx.strokeStyle = `rgba(135, 22, 14, ${0.9 * fade})`;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(Math.atan2(d.vy, d.vx) - Math.PI / 2);
        ctx.globalAlpha = alpha;
        const stretch = 1 + Math.min(1.8, Math.hypot(d.vx, d.vy) / 160);
        const g = ctx.createRadialGradient(-d.r * 0.27, -d.r * 0.2, 0.03, 0, 0, d.r * 1.4);
        g.addColorStop(0, '#ab2818');
        g.addColorStop(0.45, '#78150a');
        g.addColorStop(1, '#470b04');
        ctx.fillStyle = g;
        ellipse(ctx, 0, 0, d.r, d.r * stretch);
        ctx.fill();
        ctx.restore();

        prev = d;
      }

      // 5. Desenho de Tratamentos
      const tr = treatmentRef.current;
      const f = currentCase.ferida;
      const mConfig = MEMBRO_CONFIGS[currentCase.membro] || MEMBRO_CONFIGS.perna;
      const mult = f.escalaManual !== undefined ? f.escalaManual : 1.0;
      const escala = mConfig.scale * mult;

      // Packing (Preenchimento com gaze)
      if (tr.pack > 0) {
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rotacao);

        if (currentCase.woundShape === 'round') {
          const r = 5.2 * escala;
          const layers = Math.floor(tr.pack * 5);
          for (let l = 0; l <= layers; l++) {
            const radius = r * (0.4 + 0.65 * (l / 5));
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fillStyle = l % 2 === 0 ? '#e4ded0' : '#d2cbba';
            ctx.fill();
            ctx.strokeStyle = '#96907d77';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        } else {
          cutPath(ctx, 0.95 * escala);
          ctx.clip();
          for (let layer = 0; layer < 3; layer++) {
            const filled = clamp(tr.pack * 3 - layer, 0, 1);
            if (!filled) continue;
            const extent = 21 * filled * escala;
            ctx.fillStyle = '#e6e1d3';
            ctx.beginPath();
            ctx.ellipse(0, 1.8 - layer * 0.8, extent, 4 * escala, 0, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Absorção de sangue na gaze
        ctx.globalCompositeOperation = 'multiply';
        const stainRadius = (currentCase.woundShape === 'round' ? 7.5 : 16) * escala;
        const stain = ctx.createRadialGradient(0, 0, 1, 0, 0, stainRadius);
        stain.addColorStop(0, `rgba(122, 35, 25, ${0.35 + Math.min(0.35, tr.soak * 0.015)})`);
        stain.addColorStop(1, '#87291e00');
        ctx.fillStyle = stain;
        ctx.beginPath();
        ctx.arc(0, 0, stainRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Bandage (Curativo compressivo)
      if (tr.bandage > 0) {
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.rotate(f.rotacao - 0.2);
        const bw = mConfig.bandW;
        const bh = bw * 0.7;
        const pad = Math.min(1, tr.bandage / 0.25);
        ctx.globalAlpha = pad;
        ctx.fillStyle = '#e5e4d8';
        ctx.beginPath();
        ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 4);
        ctx.fill();
        ctx.strokeStyle = '#bebdb0';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Faixas sobrepostas
        for (let i = 0; i < 3; i++) {
          const p = clamp((tr.bandage - 0.25 - i * 0.2) / 0.25, 0, 1);
          if (!p) continue;
          ctx.fillStyle = '#dcdad0';
          ctx.fillRect(-bw / 2, -bh / 2 + i * (bh / 3), bw * p, bh / 3.5);
        }

        // Mancha de absorção se continuar sangrando
        if (tr.bandage > 0.6) {
          const sRad = 4 + Math.min(12, tr.soak * 0.15);
          const bStain = ctx.createRadialGradient(0, 0, 1, 0, 0, sRad);
          bStain.addColorStop(0, `rgba(130, 30, 20, ${Math.min(0.5, tr.soak * 0.015)})`);
          bStain.addColorStop(1, '#8c3e3100');
          ctx.fillStyle = bStain;
          ctx.beginPath();
          ctx.arc(0, 0, sRad, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // Tourniquet (Torniquete de molinete)
      if (tr.tourniquet > 0 && currentCase.tqSite) {
        const tq = currentCase.tqSite;
        const tw = tq.widthManual || mConfig.tqW;
        const wrap = smooth(0, 0.32, tr.tourniquet);
        const tight = smooth(0.32, 0.8, tr.tourniquet);
        const lock = smooth(0.84, 1, tr.tourniquet);

        ctx.save();
        ctx.translate(tq.x, tq.y);
        ctx.rotate(tq.angle);

        // Cinta preta
        ctx.save();
        ctx.beginPath();
        ctx.rect(-tw / 2, -14, tw * wrap, 28);
        ctx.clip();
        ctx.fillStyle = '#1c2122';
        ctx.beginPath();
        ctx.roundRect(-tw / 2, -13, tw, 26, 2);
        ctx.fill();
        ctx.restore();

        // Molinete
        ctx.save();
        ctx.rotate(Math.PI / 2 + tight * Math.PI * 4);
        ctx.fillStyle = '#4b5563';
        ctx.beginPath();
        ctx.roundRect(-22, -3, 44, 6, 1.5);
        ctx.fill();
        ctx.restore();

        // Etiqueta TIME
        if (lock > 0) {
          ctx.fillStyle = '#dedfc9';
          ctx.beginPath();
          ctx.roundRect(-10, 8, 20, 8, 1);
          ctx.fill();
          ctx.fillStyle = '#1e293b';
          ctx.font = 'bold 3.2px system-ui';
          ctx.textAlign = 'center';
          ctx.fillText(`TIME ${tr.tourniquetTime || '--:--'}`, 0, 13.5);
        }
        ctx.restore();
      }

      // Mão de compressão manual direta
      if (tr.hand > 0 && handRef.current) {
        const p = tr.hand;
        const hScale = mConfig.handScale;
        const arrival = 1 - p * p * (3 - 2 * p);
        ctx.save();
        ctx.translate(f.x + arrival * 50, f.y - arrival * 25);
        ctx.rotate(f.rotacao + 0.15);
        ctx.scale(hScale + arrival * 0.08, hScale + arrival * 0.08);
        ctx.globalAlpha = Math.min(1, p * 2);
        ctx.drawImage(handRef.current, -73, -43, 150, (150 * handRef.current.naturalHeight) / handRef.current.naturalWidth);
        ctx.restore();
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    const frame = (now: number) => {
      if (stateRef.current.paused) {
        previousTime = null;
        rafId = requestAnimationFrame(frame);
        return;
      }
      if (previousTime !== null) {
        accumulator += Math.min((now - previousTime) / 1000, 0.05);
      }
      previousTime = now;

      while (accumulator >= 1 / 120) {
        updatePhysics(1 / 120);
        accumulator -= 1 / 120;
      }
      render();
      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }, [loading, errorMsg, currentCase, random, getRivulets]);

  // Ações de socorro
  const handleApplyTourniquet = () => {
    if (treatmentRef.current.tourniquetTarget) return;
    treatmentRef.current.tourniquetTarget = true;
    treatmentRef.current.tourniquetTime = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    setTreatmentState(prev => ({ ...prev, tqActive: true, tqTime: treatmentRef.current.tourniquetTime }));

    if (currentCase.tqIndicado) {
      setFeedback({
        type: 'success',
        title: 'Torniquete Aplicado Adequadamente (+30 pts)',
        description: 'Torniquete comercial posicionado proximalmente acima da lesão com oclusão arterial mecânica completa! O sangramento foi controlado.',
        recommendation: 'Horário registrado na etiqueta TIME. Mantenha o torniquete visível até a transferência definitiva ao centro cirúrgico.'
      });
    } else {
      let desc = 'Torniquete contraindicado nesta região anatômica.';
      let rec = 'Consulte os protocolos do Stop the Bleed.';

      if (currentCase.membro === 'peito') {
        desc = 'Ferimento no PEITO / TÓRAX. Aplicar torniquete no braço não tem ação sobre vasos intratorácicos e atrasa condutas vitais! Risco iminente de pneumotórax hipertensivo.';
        rec = 'Selo de Tórax Valvulado / Curativo Oclusivo de 3 pontas + compressão manual estéril. NUNCA realizar Wound Packing intratorácico!';
      } else if (currentCase.membro === 'abdome') {
        desc = 'Ferimento no ABDOME. Torniquetes de membro são ineficazes para conter hemorragias cavitárias abdominais internas. O sangramento permanece ativo!';
        rec = 'Compressão direta cuidadosa com campo estéril superficial e rápida evacuação cirúrgica. Não empacotar vísceras profundas.';
      } else if (currentCase.membro === 'rosto') {
        desc = 'Ferimento na FACE / CERVICAL. Torniquetes são TERMINANTEMENTE CONTRAINDICADOS (risco letal de asfixia imediata e oclusão carotídea no pescoço; inútil no membro).';
        rec = 'Compressão manual direta seletiva e contínua com gaze limpa mantendo as vias aéreas livres e alinhamento cervical.';
      } else if (currentCase.membro === 'juncao') {
        desc = 'Ferimento em ZONA JUNCIONAL (Axila). Torniquetes de extremidades NÃO alcançam artérias profundas da raiz do tronco (artéria axilar/subclávia proximal).';
        rec = 'Preenchimento profundo da ferida com gaze hemostática (Wound Packing) + Compressão Manual Direta contínua e vigorosa por 3+ minutos!';
      }

      setFeedback({
        type: 'penalty',
        title: `Torniquete Contraindicado / Ineficaz (-30 pts)`,
        description: desc,
        recommendation: rec
      });
    }
  };

  const handleApplyPacking = () => {
    if (treatmentRef.current.packTarget) return;
    treatmentRef.current.packTarget = true;
    setTreatmentState(prev => ({ ...prev, packActive: true }));

    if (currentCase.membro === 'peito') {
      setFeedback({
        type: 'penalty',
        title: 'Wound Packing Contraindicado no Tórax (-25 pts)',
        description: 'Nunca introduza gaze profunda dentro da cavidade torácica! Pode provocar pneumotórax e colapso pulmonar.',
        recommendation: 'Curativo Valvulado / Selo de Tórax estéril.'
      });
    } else if (currentCase.membro === 'abdome') {
      setFeedback({
        type: 'penalty',
        title: 'Empacotamento Profundo Contraindicado no Abdome (-20 pts)',
        description: 'Não empacote gaze profunda sobre alças intestinais ou vísceras abdominais.',
        recommendation: 'Compressão estéril superficial e transporte cirúrgico de urgência.'
      });
    } else if (currentCase.membro === 'juncao') {
      setFeedback({
        type: 'success',
        title: 'Conduta Correta: Wound Packing Juncional (+25 pts)',
        description: 'Introdução firme de gaze contínua preenchendo toda a cavidade muscular juncional diretamente sobre o vaso sangrante!',
        recommendation: 'Aplique agora compressão manual direta com as duas mãos por 3 minutos!'
      });
    }
  };

  const handleApplyBandage = () => {
    if (treatmentRef.current.bandageTarget) return;
    treatmentRef.current.bandageTarget = true;
    setTreatmentState(prev => ({ ...prev, bandageActive: true }));
  };

  const handleTogglePressure = () => {
    treatmentRef.current.handTarget = !treatmentRef.current.handTarget;
    setTreatmentState(prev => ({ ...prev, handActive: treatmentRef.current.handTarget }));
  };

  const handleReset = () => {
    treatmentRef.current = {
      pack: 0,
      bandage: 0,
      hand: 0,
      tourniquet: 0,
      packTarget: false,
      bandageTarget: false,
      handTarget: false,
      tourniquetTarget: false,
      tourniquetTime: null,
      soak: 0
    };
    dropsRef.current = [];
    flowRef.current = 1;
    filmTimeRef.current = 0;
    stateRef.current.time = 0;
    setTreatmentState({
      packActive: false,
      bandageActive: false,
      handActive: false,
      tqActive: false,
      tqTime: null
    });
    setFeedback(null);
  };

  const handleTogglePause = () => {
    stateRef.current.paused = !stateRef.current.paused;
    setIsPaused(stateRef.current.paused);
  };

  const handleToggleZoom = () => {
    stateRef.current.close = !stateRef.current.close;
    setIsCloseup(stateRef.current.close);
  };

  const handleSetMode = (mode: 'pulse' | 'continuous') => {
    stateRef.current.mode = mode;
    setBleedMode(mode);
  };

  return (
    <div className="space-y-4">
      {/* 1. Barra de Telemetria e Controles do Simulador Real */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Telemetria da vítima</span>
              <span className="text-[11px] text-slate-400">· {currentCase.patientAgeRange || 'idade estimada'} · sexo {currentCase.patientSex || 'não informado'}</span>
            </div>
            <h3 className="text-sm font-bold text-white sm:text-base">{currentCase.titulo}</h3>
            <p className="text-[11px] text-slate-400">{currentCase.subtitulo} · {currentCase.tqIndicado ? 'torniquete indicado' : 'torniquete não indicado'}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Padrão Hemodinâmico */}
          <div className="flex items-center rounded-xl border border-white/10 bg-slate-800/80 p-0.5">
            <button
              type="button"
              onClick={() => handleSetMode('pulse')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                bleedMode === 'pulse'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
              title="Sangramento arterial pulsátil sincronizado com o batimento cardíaco"
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Jato Arterial</span>
            </button>
            <button
              type="button"
              onClick={() => handleSetMode('continuous')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all ${
                bleedMode === 'continuous'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
              title="Sangramento profuso contínuo"
            >
              <Droplet className="h-3.5 w-3.5" />
              <span>Fluxo Contínuo</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleToggleZoom}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700"
          >
            {isCloseup ? <ZoomOut className="h-3.5 w-3.5" /> : <ZoomIn className="h-3.5 w-3.5" />}
            {isCloseup ? 'Cena Inteira' : 'Zoom na Lesão'}
          </button>
          <button
            type="button"
            onClick={handleTogglePause}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700"
          >
            {isPaused ? <Play className="h-3.5 w-3.5 text-emerald-400" /> : <Pause className="h-3.5 w-3.5 text-amber-400" />}
            {isPaused ? 'Continuar' : 'Pausar'}
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800/80 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reiniciar
          </button>
        </div>
      </div>

      {/* 2. Personagem ao centro e comandos laterais no padrão LURIA */}
      <div className="grid items-start gap-4" style={{ width: 'min(100%, calc(100vw - 280px))', gridTemplateColumns: 'minmax(0, 1fr) minmax(190px, 220px)' }}>
        <div className="relative min-w-0 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-white/15 bg-slate-950 shadow-2xl">
          <canvas ref={canvasRef} width={W} height={H} className="h-full w-full object-contain block" />

          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
              <span className="text-sm font-semibold text-emerald-400 animate-pulse">Carregando cenário clínico…</span>
            </div>
          )}

          {errorMsg && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/90 p-6 text-center text-red-300">
              <AlertTriangle className="mb-2 h-8 w-8 text-red-400" />
              <p className="text-sm font-bold">{errorMsg}</p>
            </div>
          )}
        </div>

        <aside className="rounded-2xl border border-white/10 bg-slate-900/90 p-3 shadow-xl backdrop-blur-md" aria-label="Comandos clínicos">
          <div className="mb-2 px-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">Comandos clínicos</span>
            <p className="mt-1 text-[11px] leading-relaxed text-slate-500">Abra uma categoria para ver as opções do caso.</p>
          </div>

          <div className="space-y-1.5" role="tablist" aria-label="Categorias de comandos">
            {([
              { id: 'perguntas' as const, label: 'Perguntas', hint: 'Investigar', icon: MessageCircle },
              { id: 'exames' as const, label: 'Exames', hint: 'Observar', icon: SearchCheck },
              { id: 'acoes' as const, label: 'Ações', hint: 'Intervir', icon: PlayCircle }
            ]).map((tab) => {
              const Icon = tab.icon;
              const active = decisionPanel === tab.id;
              return <button key={tab.id} type="button" role="tab" aria-selected={active} onClick={() => setDecisionPanel(tab.id)} className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${active ? 'border-teal-400 bg-teal-500/15 text-teal-100' : 'border-white/10 bg-slate-950/50 text-slate-400 hover:border-white/20 hover:text-white'}`}>
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="min-w-0"><strong className="block text-[11px] font-black uppercase tracking-wide">{tab.label}</strong><small className="block text-[10px] opacity-70">{tab.hint}</small></span>
              </button>;
            })}
          </div>

          {decisionPanel === 'perguntas' && <div className="mt-3 space-y-2" role="tabpanel" aria-label="Perguntas do caso">
            {['O que aconteceu e há quanto tempo?', 'A vítima responde e consegue falar?', 'O sangramento aumentou ou diminuiu?'].map((question) => <button key={question} type="button" onClick={() => setFeedback({ type: 'success', title: 'Pergunta registrada', description: question, recommendation: 'Use a resposta para priorizar segurança, acionamento do resgate e controle da hemorragia.' })} className="w-full rounded-xl border border-white/10 bg-slate-950/70 p-3 text-left text-[11px] leading-relaxed text-slate-300 transition hover:border-teal-400/60 hover:text-white">{question}</button>)}
          </div>}

          {decisionPanel === 'exames' && <div className="mt-3 space-y-2" role="tabpanel" aria-label="Exames e observações">
            {['Avaliar consciência e respiração', 'Identificar a região anatômica da lesão', 'Verificar padrão e intensidade do sangramento'].map((exam) => <button key={exam} type="button" onClick={() => setFeedback({ type: 'success', title: 'Avaliação registrada', description: exam, recommendation: currentCase.justificativaClinica })} className="w-full rounded-xl border border-white/10 bg-slate-950/70 p-3 text-left text-[11px] leading-relaxed text-slate-300 transition hover:border-amber-400/60 hover:text-white">{exam}</button>)}
          </div>}

          {decisionPanel === 'acoes' && <div className="mt-3 space-y-2" role="tabpanel" aria-label="Ações de socorro">
            <button type="button" onClick={handleApplyTourniquet} disabled={treatmentState.tqActive} className={`w-full rounded-xl border p-3 text-left transition-all ${treatmentState.tqActive ? 'border-emerald-500/50 bg-emerald-950/50 text-emerald-200' : 'border-white/10 bg-slate-950/70 text-white hover:border-emerald-400'}`}><span className="block text-[11px] font-bold">🩹 Aplicar torniquete</span><span className="mt-1 block text-[10px] text-slate-400">{treatmentState.tqActive ? `Aplicado às ${treatmentState.tqTime}` : currentCase.tqIndicado ? 'Indicado para esta extremidade' : 'Não indicado neste caso'}</span></button>
            <button type="button" onClick={handleApplyPacking} disabled={treatmentState.packActive} className={`w-full rounded-xl border p-3 text-left transition-all ${treatmentState.packActive ? 'border-emerald-500/50 bg-emerald-950/50 text-emerald-200' : 'border-white/10 bg-slate-950/70 text-white hover:border-emerald-400'}`}><span className="block text-[11px] font-bold">🧻 Preencher com gaze</span><span className="mt-1 block text-[10px] text-slate-400">{treatmentState.packActive ? 'Cavidade preenchida' : 'Packing profundo quando indicado'}</span></button>
            <button type="button" onClick={handleApplyBandage} disabled={treatmentState.bandageActive} className={`w-full rounded-xl border p-3 text-left transition-all ${treatmentState.bandageActive ? 'border-emerald-500/50 bg-emerald-950/50 text-emerald-200' : 'border-white/10 bg-slate-950/70 text-white hover:border-emerald-400'}`}><span className="block text-[11px] font-bold">🩹 Aplicar bandagem</span><span className="mt-1 block text-[10px] text-slate-400">{treatmentState.bandageActive ? 'Curativo aplicado' : 'Curativo compressivo'}</span></button>
            <button type="button" onClick={handleTogglePressure} className={`w-full rounded-xl border p-3 text-left transition-all ${treatmentState.handActive ? 'border-emerald-500/50 bg-emerald-950/50 text-emerald-200' : 'border-white/10 bg-slate-950/70 text-white hover:border-emerald-400'}`}><span className="block text-[11px] font-bold">✋ Comprimir manualmente</span><span className="mt-1 block text-[10px] text-slate-400">{treatmentState.handActive ? 'Soltar compressão' : 'Pressão direta firme'}</span></button>
          </div>}
        </aside>
      </div>

      {/* 3. Banner de Avaliação Clínica e Pontuação */}
      {feedback && (
        <div
          className={`flex items-start justify-between gap-4 rounded-2xl border p-4.5 shadow-xl transition-all ${
            feedback.type === 'success'
              ? 'border-emerald-500/40 bg-emerald-950/70 text-emerald-100'
              : 'border-red-500/40 bg-red-950/70 text-red-100'
          }`}
        >
          <div className="flex items-start gap-3">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <h4 className="text-sm font-black tracking-wide">{feedback.title}</h4>
              <p className="text-xs leading-relaxed text-slate-200">{feedback.description}</p>
              <p className="text-xs font-semibold text-slate-300 pt-1">
                👉 <strong>Conduta Recomendada:</strong> {feedback.recommendation}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

    </div>
  );
}

