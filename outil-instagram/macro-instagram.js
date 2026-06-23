"use strict";

// ═══ SECTION: LOGO ═══
const LOGO_SRC = "macro-logo.png";

// ═══ SECTION: CONSTANTES DA ═══
const FORMATS = { portrait:[1080,1350], story:[1080,1920] };
const GAME_COLORS = { lol:"#00c2e0", cs2:"#f0c14b", val:"#ff4d57", rl:"#3b9eff", cod:"#e8820c", macro:"#00c2e0" };
const GAME_LABELS = { lol:"League of Legends", cs2:"Counter-Strike 2", val:"Valorant", rl:"Rocket League", cod:"Call of Duty", macro:"Macro" };
const INK = "#070a0d";
const TEMPLATES = {
  "post-image":{ label:"Post image", icon:"IMG" },
  "post-video":{ label:"Post vidéo", icon:"▶" },
  "post-texte":{ label:"Texte seul", icon:"Aa" },
  "score":     { label:"Score", icon:"VS" },
  "breaking":  { label:"Breaking", icon:"!!" },
  "classement":{ label:"Classement", icon:"#1" },
  "statistique":{ label:"Statistique", icon:"∑" },
  "programme": { label:"Programme", icon:"📅" },
  "planning":  { label:"Planning", icon:"📆" },
  "sondage":   { label:"Sondage", icon:"📊" },
  "transfert": { label:"Transfert", icon:"⇄" },
  "tierlist":  { label:"Tier List", icon:"S" },
  "citation":  { label:"Citation", icon:"❝" },
  "mvp":       { label:"MVP", icon:"🏆" },
  "lineup":    { label:"Lineup", icon:"👥" },
  "bracket":   { label:"Bracket", icon:"🏅" },
};

// ═══ SECTION: TEAM LOGOS ═══
const teamLogos = {};
let logosReady = false;
(async function loadLogos(){
  try {
    const resp = await fetch("LOGOS_TEAMS/logos.json");
    const names = await resp.json();
    let pending = names.length;
    if(!pending){ logosReady=true; return; }
    names.forEach(filename => {
      const base = filename.includes("/") ? filename.split("/").pop() : filename;
      const key = base.replace(/\.png$/i,"").toUpperCase().replace(/[_\s]+/g," ").trim();
      const img = new Image();
      img.onload = ()=>{ teamLogos[key] = img; if(--pending===0){ logosReady=true; render(); } };
      img.onerror = ()=>{ if(--pending===0){ logosReady=true; } };
      img.src = "LOGOS_TEAMS/" + filename;
    });
  } catch(e){ logosReady=true; }
})();

function findTeamLogo(name){
  if(!name) return null;
  const key = name.toUpperCase().replace(/[_\s]+/g," ").trim();
  if(teamLogos[key]) return teamLogos[key];
  for(const k in teamLogos){
    if(k.includes(key) || key.includes(k)) return teamLogos[k];
  }
  const abbr = key.slice(0,3);
  for(const k in teamLogos){
    if(k.slice(0,3) === abbr) return teamLogos[k];
  }
  return null;
}

// ═══ SECTION: PLAYER IMAGES ═══
const playerImages = {};
let playersReady = false;
(async function loadPlayers(){
  try {
    const resp = await fetch("PLAYER_IMAGES/players.json");
    const names = await resp.json();
    let pending = names.length;
    if(!pending){ playersReady=true; return; }
    names.forEach(filename => {
      const base = filename.includes("\\") ? filename.split("\\").pop() : filename;
      const key = base.replace(/\.(png|jpe?g|webp)$/i,"").toUpperCase().replace(/[_\s]+/g," ").trim();
      const img = new Image();
      img.onload = ()=>{ playerImages[key] = img; if(--pending===0){ playersReady=true; render(); } };
      img.onerror = ()=>{ if(--pending===0){ playersReady=true; } };
      img.src = "PLAYER_IMAGES/" + filename;
    });
  } catch(e){ playersReady=true; }
})();

function findPlayerImage(name){
  if(!name) return null;
  const key = name.toUpperCase().replace(/[_\s]+/g," ").trim();
  if(playerImages[key]) return playerImages[key];
  for(const k in playerImages){
    if(k.includes(key) || key.includes(k)) return playerImages[k];
  }
  return null;
}

// ═══ SECTION: STATE ═══
const state = {
  images: [], active: 0,
  format: "portrait", reel: false,
  game: "lol", customColor: "#00c2e0",
  watermark: true, gradient: 1,
  titleScale: 1, descScale: 1, zoom: 1,
  descColor: 0.75, imgBright: 1,
  hiColor: "#00c2e0", // auto-synced from game color
  dur: 2.5, trans: "cut", kenburns: true,
};

function newSlide(img, name, tpl){
  return { img: img||null, video: null, name: name||"Texte", tx:{ox:0,oy:0},
           template: tpl || (img ? "post-image" : "post-texte"),
           eyebrow:"", title:"", desc:"", showDesc:true, score:"", showScore:false, scoreY:0, textY:0, textDrag:0, logoA:null, logoB:null,
           badge:"breaking", signature:"", teamA:"", teamB:"",
           standings:"", relegationLine:0, stats:"",
           matches:"", footerText:"", pollOptions:"", pollWinner:0,
           tiers:"", playerName:"", playerRole:"", transferBadge:"officiel", matchResult:"",
           showBgImage: !!img, framedImage: false, photoCredit:"", dur: null, game: null,
           lineup:"", lineupCount:5, lineupTeamRating:"", lineupPhotos:[],
           bracket:"", bracketFormat:"", planningEvents:"", frameY:0, statHighlight:0, mvpBadge:"mvp" };
}
function cur(){ return state.images[state.active] || null; }
function curTpl(){ const it = cur(); return (it && it.template) || "post-image"; }
const EMPTY = { template:"post-image", eyebrow:"", title:"", desc:"", showDesc:false, score:"", showScore:false, badge:"", signature:"", teamA:"", teamB:"", standings:"", relegationLine:0, stats:"", matches:"", footerText:"", pollOptions:"", pollWinner:0, tiers:"", playerName:"", playerRole:"", transferBadge:"officiel", matchResult:"", lineup:"", lineupCount:5, lineupTeamRating:"", bracket:"", bracketFormat:"", planningEvents:"", statHighlight:0, mvpBadge:"mvp" };

// ═══ SECTION: CANVAS INIT ═══
const cv = document.getElementById("cv");
let ctx = cv.getContext("2d");
const logo = new Image();
let logoReady = false;
logo.onload = () => { logoReady = true; document.getElementById("hdrlogo").src = LOGO_SRC; render(); };
logo.src = LOGO_SRC;

const noise = document.createElement("canvas");
noise.width = noise.height = 220;
(function(){
  const nc = noise.getContext("2d");
  const id = nc.createImageData(220,220);
  for(let i=0;i<id.data.length;i+=4){
    const v = Math.random()*255;
    id.data[i]=id.data[i+1]=id.data[i+2]=v;
    id.data[i+3]=Math.random()*40;
  }
  nc.putImageData(id,0,0);
})();
const noisePattern = ctx.createPattern(noise,"repeat");

function accentColor(g){ const game = g || state.game; return game === "custom" ? state.customColor : GAME_COLORS[game]; }
function descBaseColor(){ const v = Math.round(state.descColor * 255); return `rgb(${v},${v},${v})`; }

// ═══ SECTION: DRAW HELPERS ═══
function drawCover(img, x, y, w, h, zoom, ox, oy){
  const iw = img.videoWidth || img.naturalWidth, ih = img.videoHeight || img.naturalHeight;
  const base = Math.max(w/iw, h/ih);
  const scale = base * zoom;
  const dw = iw*scale, dh = ih*scale;
  ctx.drawImage(img, x + (w-dw)/2 + ox, y + (h-dh)/2 + oy, dw, dh);
}

function drawBaseBackground(W,H){
  let g = ctx.createLinearGradient(0,0,W*0.35,H);
  g.addColorStop(0, "#0c1218");
  g.addColorStop(0.55, "#090d11");
  g.addColorStop(1, "#070a0d");
  ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
  const r = ctx.createRadialGradient(W*0.85, H*0.05, 0, W*0.85, H*0.05, W*0.7);
  r.addColorStop(0, "rgba(0,194,224,0.06)");
  r.addColorStop(1, "rgba(0,194,224,0)");
  ctx.fillStyle = r; ctx.fillRect(0,0,W,H);
}
function drawBreakingBackground(W,H){
  let g = ctx.createLinearGradient(W*0.2,0,W*0.8,H);
  g.addColorStop(0,"#161015"); g.addColorStop(0.46,"#0b0a0d"); g.addColorStop(1,"#060608");
  ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
}

function drawSlideMedia(it, W, H, zoom){
  if(it && it.video && it.template === "post-video"){
    drawCover(it.video, 0,0,W,H, zoom, it.tx.ox, it.tx.oy);
  } else if(it && it.img){
    drawCover(it.img, 0,0,W,H, zoom, it.tx.ox, it.tx.oy);
  } else { drawBaseBackground(W,H); }
}

let videoLoopId = null;
function startVideoLoop(){
  if(videoLoopId) return;
  (function loop(){ videoLoopId = requestAnimationFrame(loop); render(); })();
}
function stopVideoLoop(){
  if(videoLoopId){ cancelAnimationFrame(videoLoopId); videoLoopId = null; }
}

function drawFramedImage(it, W, H, zoom){
  const pad = Math.round(W*0.075);
  const scale = W/1080;
  const logoH = Math.round(W*0.135 * (logo.naturalHeight/logo.naturalWidth));
  const barY = Math.round(pad + logoH + 13*scale + Math.max(2, 2.5*scale));
  const frameY = barY + Math.round(20*scale) + (it.frameY||0)*scale;
  const frameX = pad;
  const frameW = W - pad*2;
  const frameH = Math.round(H*0.50);
  const frameR = Math.round(14*scale);
  ctx.save();
  roundRectPath(frameX, frameY, frameW, frameH, frameR);
  ctx.clip();
  drawCover(it.img, frameX, frameY, frameW, frameH, zoom, it.tx.ox, it.tx.oy);
  const fadeH = Math.round(frameH*0.35);
  const fade = ctx.createLinearGradient(0, frameY+frameH-fadeH, 0, frameY+frameH);
  fade.addColorStop(0, "rgba(7,10,13,0)");
  fade.addColorStop(1, "rgba(7,10,13,0.7)");
  ctx.fillStyle = fade; ctx.fillRect(frameX, frameY+frameH-fadeH, frameW, fadeH);
  ctx.restore();
  ctx.strokeStyle = "rgba(31,44,53,0.5)"; ctx.lineWidth = Math.max(1, 1.5*scale);
  roundRectPath(frameX, frameY, frameW, frameH, frameR); ctx.stroke();
}

// ═══ SECTION: EDGE BLUR ═══
const _blurCv = document.createElement("canvas");
function applyEdgeBlur(W,H){
  edge(true); edge(false);
  function edge(top){
    const bh = Math.round((top?0.17:0.22)*H);
    const sy = top ? 0 : H-bh;
    const dw = Math.max(1, Math.round(W/4)), dh = Math.max(1, Math.round(bh/4));
    _blurCv.width = dw; _blurCv.height = dh;
    const mc = _blurCv.getContext("2d");
    mc.clearRect(0,0,dw,dh);
    mc.filter = "blur(4px)";
    mc.drawImage(cv, 0, sy, W, bh, 0, 0, dw, dh);
    mc.filter = "none";
    mc.globalCompositeOperation = "destination-in";
    const g = mc.createLinearGradient(0,0,0,dh);
    if(top){ g.addColorStop(0,"rgba(0,0,0,1)"); g.addColorStop(1,"rgba(0,0,0,0)"); }
    else   { g.addColorStop(0,"rgba(0,0,0,0)"); g.addColorStop(1,"rgba(0,0,0,1)"); }
    mc.fillStyle = g; mc.fillRect(0,0,dw,dh);
    mc.globalCompositeOperation = "source-over";
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(_blurCv, 0, 0, dw, dh, 0, sy, W, bh);
  }
}

function drawEdgeScrims(W,H){
  let g = ctx.createLinearGradient(0,0,0,H*0.20);
  g.addColorStop(0,"rgba(7,10,13,0.55)"); g.addColorStop(1,"rgba(7,10,13,0)");
  ctx.fillStyle = g; ctx.fillRect(0,0,W,Math.round(H*0.20));
  g = ctx.createLinearGradient(0,H*0.82,0,H);
  g.addColorStop(0,"rgba(7,10,13,0)"); g.addColorStop(1,"rgba(7,10,13,0.45)");
  ctx.fillStyle = g; ctx.fillRect(0,Math.round(H*0.82),W,Math.round(H*0.18));
}

// ═══ SECTION: TEXT WRAP + RICH TEXT ═══
function wrapText(text, font, maxW){
  ctx.font = font;
  const paragraphs = (text||"").split(/\n/);
  const lines = [];
  for(const para of paragraphs){
    if(para.trim() === ""){ lines.push(""); continue; }
    const words = para.split(/\s+/).filter(Boolean);
    let line = "";
    for(const w of words){
      const test = line ? line+" "+w : w;
      if(ctx.measureText(test).width > maxW && line){ lines.push(line); line = w; }
      else line = test;
    }
    if(line) lines.push(line);
  }
  return lines;
}

function richWords(text){
  const parts = String(text||"").split("*");
  const words = [];
  parts.forEach((p,i)=>{ if(p==="") return; const hi = i%2===1;
    const lines = p.split(/\n/);
    lines.forEach((line,li)=>{
      if(li > 0) words.push({text:"\n", hi:false, br:true});
      line.split(/\s+/).forEach(tok=>{ if(tok!=="") words.push({text:tok, hi}); });
    });
  });
  return words;
}
function wrapRich(words, font, maxW){
  ctx.font = font;
  const sp = ctx.measureText(" ").width;
  const lines = []; let line = [], w = 0;
  for(const word of words){
    if(word.br){
      if(line.length) lines.push(line);
      else lines.push([]);
      line = []; w = 0;
      continue;
    }
    const ww = measureTextWithFlags(word.text);
    const add = (line.length ? sp : 0) + ww;
    if(line.length && w + add > maxW){ lines.push(line); line = [word]; w = ww; }
    else { line.push(word); w += add; }
  }
  if(line.length) lines.push(line);
  return lines;
}
function drawRichLine(line, x, y, font, hiColor, baseColor){
  ctx.font = font;
  const sp = ctx.measureText(" ").width;
  let cx = x;
  line.forEach((word,i)=>{
    if(i>0) cx += sp;
    ctx.fillStyle = word.hi ? hiColor : baseColor;
    drawTextWithFlags(word.text, cx, y);
    cx += measureTextWithFlags(word.text);
  });
}
function drawRichLineCentered(line, cx, y, font, hiColor, baseColor){
  ctx.font = font;
  const sp = ctx.measureText(" ").width;
  let totalW = 0;
  line.forEach((word,i)=>{ if(i>0) totalW += sp; totalW += measureTextWithFlags(word.text); });
  let x = cx - totalW/2;
  line.forEach((word,i)=>{
    if(i>0) x += sp;
    ctx.fillStyle = word.hi ? hiColor : baseColor;
    drawTextWithFlags(word.text, x, y);
    x += measureTextWithFlags(word.text);
  });
}

// ═══ FLAG EMOJI RENDERING (Twemoji fallback for Windows) ═══
const flagCache = {};
const FLAG_RE = /[\u{1F1E6}-\u{1F1FF}]{2}/gu;
function measureTextWithFlags(text){
  FLAG_RE.lastIndex = 0;
  if(!FLAG_RE.test(text)) return ctx.measureText(text).width;
  FLAG_RE.lastIndex = 0;
  const fontSize = parseFloat(ctx.font.match(/(\d+(?:\.\d+)?)px/)?.[1] || 16);
  let w = 0, lastIdx = 0, m;
  while((m = FLAG_RE.exec(text)) !== null){
    const before = text.slice(lastIdx, m.index);
    if(before) w += ctx.measureText(before).width;
    w += fontSize;
    lastIdx = m.index + m[0].length;
  }
  const tail = text.slice(lastIdx);
  if(tail) w += ctx.measureText(tail).width;
  return w;
}
function isFlagEmoji(str){ return FLAG_RE.test(str); }
function flagToCodepoints(flag){
  const pts = [];
  for(const c of flag) pts.push(c.codePointAt(0).toString(16));
  return pts.join("-");
}
function loadFlagImage(flag){
  const key = flagToCodepoints(flag);
  if(flagCache[key]) return flagCache[key];
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${key}.svg`;
  const entry = { img, loaded:false };
  img.onload = ()=>{ entry.loaded = true; render(); };
  flagCache[key] = entry;
  return entry;
}
function drawTextWithFlags(text, x, y){
  FLAG_RE.lastIndex = 0;
  if(!FLAG_RE.test(text)){ ctx.fillText(text, x, y); return; }
  FLAG_RE.lastIndex = 0;
  let lastIdx = 0, cx = x;
  const fontSize = parseFloat(ctx.font.match(/(\d+(?:\.\d+)?)px/)?.[1] || 16);
  let m;
  while((m = FLAG_RE.exec(text)) !== null){
    const before = text.slice(lastIdx, m.index);
    if(before){ ctx.fillText(before, cx, y); cx += ctx.measureText(before).width; }
    const entry = loadFlagImage(m[0]);
    if(entry.loaded){
      const sz = fontSize * 1.15;
      ctx.drawImage(entry.img, cx, y - sz*0.15, sz, sz);
    }
    cx += fontSize;
    lastIdx = m.index + m[0].length;
  }
  const tail = text.slice(lastIdx);
  if(tail) ctx.fillText(tail, cx, y);
}

let lastTextBox = null;

// ═══ SECTION: COLOR HELPERS ═══
function hexToRgb(hex){ const h=hex.replace("#",""); return {r:parseInt(h.substr(0,2),16), g:parseInt(h.substr(2,2),16), b:parseInt(h.substr(4,2),16)}; }
function rgba(c,a){ const o = typeof c==="string" ? hexToRgb(c) : c; return `rgba(${o.r|0},${o.g|0},${o.b|0},${a})`; }
function mix(h1,h2,t){ const a=hexToRgb(h1), b=hexToRgb(h2); return {r:a.r+(b.r-a.r)*t, g:a.g+(b.g-a.g)*t, b:a.b+(b.b-a.b)*t}; }
function roundRectPath(x,y,w,h,r){
  r = Math.min(r, w/2, h/2);
  ctx.beginPath(); ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath();
}

function drawSpaced(text, x, y, spacing){
  let cx = x;
  for(const ch of text){ ctx.fillText(ch, cx, y); cx += ctx.measureText(ch).width + spacing; }
}

// ═══ SECTION: OVERLAY ═══
function drawOverlay(W, H, slideInfo, content, hasImage){
  const tpl = (content && content.template) || "post-image";
  const slideGame = (content && content.game) || null;
  const acc = accentColor(slideGame);
  const hi = acc;
  const c = content || EMPTY;
  const scale = W/1080;
  const pad = Math.round(W*0.075);
  const maxW = W - pad*2;

  // --- Shared: radial glow ---
  const glowCol = tpl==="breaking" ? "#ff4d57" : acc;
  const glowX = tpl==="breaking" ? 0.50 : 0.85;
  const glowY = tpl==="breaking" ? -0.04 : -0.05;
  const glow = ctx.createRadialGradient(W*glowX, H*glowY, 0, W*glowX, H*glowY, W*0.9);
  glow.addColorStop(0, rgba(glowCol, tpl==="breaking"?0.22:0.16));
  glow.addColorStop(0.6, rgba(glowCol, 0));
  ctx.fillStyle = glow; ctx.fillRect(0,0,W,H);

  // --- Shared: neon curves ---
  ctx.save();
  ctx.strokeStyle = "#00c2e0";
  ctx.shadowColor = "rgba(0,194,224,0.55)"; ctx.shadowBlur = 12*scale; ctx.lineCap = "round";
  ctx.globalAlpha = 0.55; ctx.lineWidth = Math.max(2, 2.8*scale);
  ctx.beginPath();
  ctx.moveTo(W*0.56, -H*0.02);
  ctx.bezierCurveTo(W*0.78, H*0.03, W*0.93, H*0.12, W*1.05, H*0.31);
  ctx.stroke();
  ctx.globalAlpha = 0.28; ctx.lineWidth = Math.max(1, 1.5*scale);
  ctx.beginPath();
  ctx.moveTo(W*0.48, -H*0.04);
  ctx.bezierCurveTo(W*0.74, H*0.0, W*0.92, H*0.07, W*1.10, H*0.25);
  ctx.stroke();
  ctx.restore();

  // --- Bottom gradient (skip for post-texte) ---
  if(tpl !== "post-texte"){
    const gStr = state.gradient;
    const gCol = tpl==="breaking" ? "#ff4d57" : acc;
    const dark = (hasImage || tpl==="score" || tpl==="breaking") ? mix(gCol, INK, 0.80) : hexToRgb(INK);
    const gradH = H*(tpl==="breaking"?0.50:0.62);
    const g = ctx.createLinearGradient(0,H-gradH,0,H);
    g.addColorStop(0, rgba(dark,0));
    g.addColorStop(0.42, rgba(dark, 0.58*gStr));
    g.addColorStop(1, rgba(dark, 0.97*gStr));
    ctx.fillStyle = g; ctx.fillRect(0,H-gradH,W,gradH);
  }

  // --- Shared: noise ---
  if(noisePattern){
    ctx.save();
    ctx.globalAlpha = 0.5; ctx.globalCompositeOperation = "overlay";
    ctx.fillStyle = noisePattern; ctx.fillRect(0,0,W,H);
    ctx.restore();
  }

  // --- Shared: logo + cyan bar ---
  if(state.watermark && logoReady){
    const lw = W*0.135;
    const lh = lw * (logo.naturalHeight/logo.naturalWidth);
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 16;
    ctx.drawImage(logo, pad, pad, lw, lh);
    ctx.restore();
    ctx.fillStyle = GAME_COLORS.macro;
    ctx.fillRect(pad, Math.round(pad + lh + 13*scale), W - pad*2, Math.max(2, Math.round(2.5*scale)));
  }

  // --- Shared: slide counter ---
  let counterBottomY = H - pad;
  if(slideInfo && slideInfo.total > 1){
    const txt = (slideInfo.index+1) + " / " + slideInfo.total;
    const f = Math.round(28*scale);
    ctx.font = `600 ${f}px 'JetBrains Mono', monospace`;
    const tw = ctx.measureText(txt).width;
    const padX = Math.round(16*scale), padY = Math.round(11*scale);
    const boxW = tw + padX*2, boxH = f + padY*2;
    const bx = W - pad - boxW, by = H - pad - boxH;
    ctx.save();
    ctx.fillStyle = "rgba(7,10,13,0.6)";
    roundRectPath(bx, by, boxW, boxH, Math.round(10*scale)); ctx.fill();
    ctx.lineWidth = Math.max(1, Math.round(2*scale)); ctx.strokeStyle = rgba(acc,0.55);
    roundRectPath(bx, by, boxW, boxH, Math.round(10*scale)); ctx.stroke();
    ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(txt, bx + boxW/2, by + boxH/2 + Math.round(scale));
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    ctx.restore();
    counterBottomY = by - Math.round(6*scale);
  }

  // --- Shared: photo credit (bottom-right, under counter) ---
  if(c.photoCredit){
    const credF = Math.round(16*scale);
    ctx.font = `500 ${credF}px 'Manrope', sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.textAlign = "right"; ctx.textBaseline = "bottom";
    ctx.fillText("Photo — " + c.photoCredit, W - pad, counterBottomY);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }

  // --- Template-specific content ---
  switch(tpl){
    case "post-image": drawLayoutBottom(W,H,c,scale,pad,maxW,acc,hi); break;
    case "post-video": drawLayoutBottom(W,H,c,scale,pad,maxW,acc,hi); break;
    case "post-texte": drawLayoutCentered(W,H,c,scale,pad,maxW,acc,hi); break;
    case "score":      drawLayoutScore(W,H,c,scale,pad,maxW,acc,hi); break;
    case "breaking":   drawLayoutBreaking(W,H,c,scale,pad,maxW,hi); break;
    case "classement": drawLayoutClassement(W,H,c,scale,pad,maxW,acc,hi); break;
    case "statistique": drawLayoutCarousel(W,H,c,scale,pad,maxW,acc,hi); break;
    case "programme":  drawLayoutProgramme(W,H,c,scale,pad,maxW,acc,hi); break;
    case "sondage":    drawLayoutSondage(W,H,c,scale,pad,maxW,acc,hi); break;
    case "transfert":  drawLayoutTransfert(W,H,c,scale,pad,maxW,acc,hi); break;
    case "tierlist":   drawLayoutTierList(W,H,c,scale,pad,maxW,acc,hi); break;
    case "citation":   drawLayoutCitation(W,H,c,scale,pad,maxW,acc,hi); break;
    case "mvp":        drawLayoutMVP(W,H,c,scale,pad,maxW,acc,hi); break;
    case "lineup":     drawLayoutLineup(W,H,c,scale,pad,maxW,acc,hi); break;
    case "bracket":    drawLayoutBracket(W,H,c,scale,pad,maxW,acc,hi); break;
    case "planning":   drawLayoutPlanning(W,H,c,scale,pad,maxW,acc,hi); break;
    default:           drawLayoutBottom(W,H,c,scale,pad,maxW,acc,hi); break;
  }
}

// --- T1: Post image (text at bottom) ---
function drawLayoutBottom(W,H,c,scale,pad,maxW,acc,hi){
  if(c.showScore && c.score && c.score.trim()) drawScoreCenter(W,H,c,scale,maxW,hi);

  const eyeF = Math.round(22*scale);
  const titleF = Math.round((state.format==="story"||state.reel?86:74) * scale * state.titleScale);
  const descF = Math.round(30*scale*state.descScale);
  const titleLH = Math.round(titleF*1.04);
  const descLH = Math.round(descF*1.4);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);
  const descFont = `500 ${descF}px Manrope, sans-serif`;
  const descLines = (c.showDesc && c.desc.trim()) ? wrapRich(richWords(c.desc), descFont, maxW).slice(0,10) : [];
  if(!eyebrow && !titleLines.length && !descLines.length){ lastTextBox=null; return; }

  const accentLineH = Math.round(4*scale);
  const gapAfterLine = Math.round(16*scale);
  const gapAfterEye = Math.round(16*scale);
  const gapAfterTitle = Math.round(22*scale);
  let blockH = accentLineH + gapAfterLine;
  if(eyebrow) blockH += eyeF + gapAfterEye;
  blockH += titleLines.length*titleLH;
  if(descLines.length) blockH += gapAfterTitle + descLines.length*descLH;

  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  const bottomY = H - pad + dragOffset;
  const yTop = bottomY - blockH;
  lastTextBox = { x:pad, y:yTop, w:maxW, h:blockH };

  let y = yTop;
  ctx.fillStyle = acc;
  ctx.fillRect(pad, y, Math.round(54*scale), accentLineH);
  y += accentLineH + gapAfterLine;
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.18);
    y += eyeF + gapAfterEye;
  }
  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 2;
  for(const ln of titleLines){ drawRichLine(ln, pad, y, titleFont, hi, "#ffffff"); y += titleLH; }
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  if(descLines.length){
    let dy = bottomY - descLines.length*descLH;
    for(const ln of descLines){ drawRichLine(ln, pad, dy, descFont, hi, descBaseColor()); dy += descLH; }
  }
}

// --- T2: Texte seul (centered vertically + quote mark + signature) ---
function drawLayoutCentered(W,H,c,scale,pad,maxW,acc,hi){
  const eyeF = Math.round(22*scale);
  const titleF = Math.round((state.format==="story"||state.reel?96:84) * scale * state.titleScale);
  const descF = Math.round(30*scale*state.descScale);
  const titleLH = Math.round(titleF*1.06);
  const descLH = Math.round(descF*1.5);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);
  const descFont = `500 ${descF}px Manrope, sans-serif`;
  const descLines = (c.showDesc && c.desc.trim()) ? wrapRich(richWords(c.desc), descFont, Math.round(maxW*0.92)).slice(0,14) : [];

  const accentLineH = Math.round(4*scale);
  const gap = Math.round(15*scale);
  let blockH = accentLineH + gap;
  if(eyebrow) blockH += eyeF + gap;
  blockH += titleLines.length * titleLH;
  if(descLines.length) blockH += Math.round(18*scale) + descLines.length*descLH;

  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  const centerY = H * 0.48 + dragOffset;
  let y = centerY - blockH/2;
  lastTextBox = { x:pad, y, w:maxW, h:blockH };

  // accent tick
  ctx.fillStyle = acc;
  ctx.fillRect(pad, y, Math.round(54*scale), accentLineH);
  y += accentLineH + gap;

  // eyebrow
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.18);
    y += eyeF + gap;
  }

  // title
  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 2;
  for(const ln of titleLines){ drawRichLine(ln, pad, y, titleFont, hi, "#ffffff"); y += titleLH; }
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

  // description
  if(descLines.length){
    y += Math.round(18*scale);
    for(const ln of descLines){ drawRichLine(ln, pad, y, descFont, hi, descBaseColor()); y += descLH; }
  }

  // signature at bottom
  if(c.signature && c.signature.trim()){
    const sigF = Math.round(24*scale);
    const avatarR = Math.round(34*scale);
    ctx.font = `500 ${sigF}px 'JetBrains Mono', monospace`;
    const initials = c.signature.split(/\s+/).slice(0,2).map(w=>w[0]||"").join("").toUpperCase();
    const sigY = H - pad - avatarR/2;
    // avatar circle
    ctx.save();
    ctx.fillStyle = "#13202a"; ctx.strokeStyle = "#243039"; ctx.lineWidth = Math.max(1,2*scale);
    ctx.beginPath(); ctx.arc(pad + avatarR/2, sigY, avatarR/2, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = acc; ctx.font = `600 ${Math.round(22*scale)}px 'JetBrains Mono', monospace`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(initials, pad + avatarR/2, sigY);
    ctx.restore();
    // text
    ctx.font = `500 ${sigF}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = "#9aa7b0"; ctx.textBaseline = "middle";
    ctx.fillText(c.signature, pad + avatarR + Math.round(11*scale), sigY);
    ctx.textBaseline = "alphabetic";
  }
}

// --- T3: Score (teams + score centered, title at bottom) ---
function drawLayoutScore(W,H,c,scale,pad,maxW,acc,hi){
  const eyeF = Math.round(22*scale);

  // eyebrow centered (competition)
  const eyebrow = (c.eyebrow||"").toUpperCase();
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textAlign = "center"; ctx.textBaseline = "top";
    drawSpaced(eyebrow, W/2 - ctx.measureText(eyebrow).width/2, Math.round(H*0.13), eyeF*0.18);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }

  // score row (teams + score) at ~44% height
  const scoreY = H*0.43 + (c.scoreY||0)*scale;
  const boxSize = Math.round(168*scale);
  const boxR = Math.round(36*scale);
  const teamNameF = Math.round(28*scale);
  const teamAbbrF = Math.round(44*scale);
  const scoreF = Math.round(184*scale);
  const teamGap = Math.round(24*scale);

  // measure score width
  const scoreText = (c.score||"").replace(/\*/g,"");
  ctx.font = `800 ${scoreF}px Sora, sans-serif`;
  let sf = scoreF;
  while(ctx.measureText(scoreText).width > maxW*0.45 && sf > 60){ sf = Math.round(sf*0.9); ctx.font = `800 ${sf}px Sora, sans-serif`; }
  const scoreW = ctx.measureText(scoreText).width;
  const totalRowW = boxSize*2 + scoreW + teamGap*4;
  const rowX = (W - totalRowW)/2;

  // team A box
  const teamAName = c.teamA || "";
  const teamAAbbr = teamAName.slice(0,3).toUpperCase();
  const boxAx = rowX, boxAy = scoreY - boxSize/2;
  const logoA = c.logoA || findTeamLogo(teamAName);
  ctx.fillStyle = "#13161c";
  roundRectPath(boxAx, boxAy, boxSize, boxSize, boxR); ctx.fill();
  ctx.strokeStyle = "#2a2f38"; ctx.lineWidth = Math.max(1,2*scale);
  roundRectPath(boxAx, boxAy, boxSize, boxSize, boxR); ctx.stroke();
  if(logoA){
    const logoPad = Math.round(24*scale);
    const logoSize = boxSize - logoPad*2;
    ctx.save();
    ctx.beginPath(); roundRectPath(boxAx, boxAy, boxSize, boxSize, boxR); ctx.clip();
    ctx.drawImage(logoA, boxAx+logoPad, boxAy+logoPad, logoSize, logoSize);
    ctx.restore();
  } else if(teamAAbbr){
    ctx.font = `800 ${teamAbbrF}px Sora, sans-serif`;
    ctx.fillStyle = "#dfe6ea"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(teamAAbbr, boxAx+boxSize/2, boxAy+boxSize/2);
  }
  if(teamAName){
    ctx.font = `600 ${teamNameF}px Manrope, sans-serif`;
    ctx.fillStyle = "#dfdfdf"; ctx.textAlign = "center"; ctx.textBaseline = "top";
    ctx.fillText(teamAName, boxAx+boxSize/2, boxAy+boxSize+Math.round(12*scale));
  }

  // score digits
  if(c.score && c.score.trim()){
    const parts = String(c.score).split("*");
    const segs = []; parts.forEach((p,i)=>{ if(p!=="") segs.push({text:p, hi:i%2===1}); });
    ctx.font = `800 ${sf}px Sora, sans-serif`;
    const totalSW = segs.reduce((s,seg)=>s+ctx.measureText(seg.text).width, 0);
    let cx = W/2 - totalSW/2;
    ctx.textAlign = "left"; ctx.textBaseline = "middle";
    segs.forEach(seg=>{ ctx.fillStyle = seg.hi ? hi : "#9aa7b0"; ctx.fillText(seg.text, cx, scoreY); cx += ctx.measureText(seg.text).width; });
  }

  // team B box
  const teamBName = c.teamB || "";
  const teamBAbbr = teamBName.slice(0,3).toUpperCase();
  const boxBx = W - rowX - boxSize, boxBy = scoreY - boxSize/2;
  const logoB = c.logoB || findTeamLogo(teamBName);
  ctx.fillStyle = "#13161c";
  roundRectPath(boxBx, boxBy, boxSize, boxSize, boxR); ctx.fill();
  ctx.strokeStyle = "#2a2f38"; ctx.lineWidth = Math.max(1,2*scale);
  roundRectPath(boxBx, boxBy, boxSize, boxSize, boxR); ctx.stroke();
  if(logoB){
    const logoPad = Math.round(24*scale);
    const logoSize = boxSize - logoPad*2;
    ctx.save();
    ctx.beginPath(); roundRectPath(boxBx, boxBy, boxSize, boxSize, boxR); ctx.clip();
    ctx.drawImage(logoB, boxBx+logoPad, boxBy+logoPad, logoSize, logoSize);
    ctx.restore();
  } else if(teamBAbbr){
    ctx.font = `800 ${teamAbbrF}px Sora, sans-serif`;
    ctx.fillStyle = "#dfe6ea"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(teamBAbbr, boxBx+boxSize/2, boxBy+boxSize/2);
  }
  if(teamBName){
    ctx.font = `600 ${teamNameF}px Manrope, sans-serif`;
    ctx.fillStyle = "#dfdfdf"; ctx.textAlign = "center"; ctx.textBaseline = "top";
    ctx.fillText(teamBName, boxBx+boxSize/2, boxBy+boxSize+Math.round(12*scale));
  }

  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

  // title + desc at bottom
  const titleF = Math.round((state.format==="story"||state.reel?76:68) * scale * state.titleScale);
  const descF = Math.round(30*scale*state.descScale);
  const titleLH = Math.round(titleF*1.05);
  const descLH = Math.round(descF*1.4);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);
  const descFont = `500 ${descF}px Manrope, sans-serif`;
  const descLines = (c.showDesc && c.desc.trim()) ? wrapRich(richWords(c.desc), descFont, maxW).slice(0,8) : [];
  if(!titleLines.length && !descLines.length){ lastTextBox=null; return; }

  const accentLineH = Math.round(4*scale);
  const gap = Math.round(14*scale);
  let blockH = accentLineH + gap + titleLines.length*titleLH;
  if(descLines.length) blockH += Math.round(11*scale) + descLines.length*descLH;
  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  const bottomY = H - pad + dragOffset;
  let y = bottomY - blockH;
  lastTextBox = { x:pad, y, w:maxW, h:blockH };

  ctx.fillStyle = acc;
  ctx.fillRect(pad, y, Math.round(54*scale), accentLineH);
  y += accentLineH + gap;
  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 2;
  for(const ln of titleLines){ drawRichLine(ln, pad, y, titleFont, hi, "#ffffff"); y += titleLH; }
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  if(descLines.length){
    y += Math.round(11*scale);
    for(const ln of descLines){ drawRichLine(ln, pad, y, descFont, hi, descBaseColor()); y += descLH; }
  }
}

// --- T4: Breaking / Officiel (badge + centered title + signature) ---
function drawLayoutBreaking(W,H,c,scale,pad,maxW,hi){
  const badge = c.badge || "breaking";
  const badgeColor = badge==="officiel" ? "#f0c14b" : "#ff4d57";
  const badgeLight = badge==="officiel" ? "#f5d06a" : "#ff6b73";
  const badgeLabel = badge==="officiel" ? "OFFICIEL" : "BREAKING";

  const titleF = Math.round((state.format==="story"||state.reel?120:104) * scale * state.titleScale);
  const descF = Math.round((state.format==="story"||state.reel?38:34)*scale*state.descScale);
  const titleLH = Math.round(titleF*1.0);
  const descLH = Math.round(descF*1.5);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);
  const descFont = `500 ${descF}px Manrope, sans-serif`;
  const descLines = (c.showDesc && c.desc.trim()) ? wrapRich(richWords(c.desc), descFont, Math.round(maxW*0.88)).slice(0,8) : [];

  // calculate block height
  const badgeH = Math.round(44*scale);
  const badgeGap = Math.round(30*scale);
  const descGap = Math.round(24*scale);
  let blockH = badgeH + badgeGap + titleLines.length*titleLH;
  if(descLines.length) blockH += descGap + descLines.length*descLH;

  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  const centerY = H*0.50 + dragOffset;
  let y = centerY - blockH/2;

  // badge pill
  const pillF = Math.round((state.format==="story"||state.reel?26:24)*scale);
  ctx.font = `700 ${pillF}px Sora, sans-serif`;
  const pillText = badgeLabel;
  const pillSpacing = pillF*0.2;
  const pillTW = ctx.measureText(pillText).width + (pillText.length-1)*pillSpacing;
  const dotR = Math.round(7*scale);
  const pillPadX = Math.round(18*scale), pillPadY = Math.round(10*scale);
  const pillW = dotR*2 + Math.round(8*scale) + pillTW + pillPadX*2;
  const pillH = pillF + pillPadY*2;
  const pillX = W/2 - pillW/2, pillY = y;

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 16*scale;
  ctx.fillStyle = "rgba(7,10,13,0.7)";
  roundRectPath(pillX, pillY, pillW, pillH, 999); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = rgba(badgeColor, 0.18);
  roundRectPath(pillX, pillY, pillW, pillH, 999); ctx.fill();
  ctx.strokeStyle = rgba(badgeColor, 0.6); ctx.lineWidth = Math.max(1, 2*scale);
  roundRectPath(pillX, pillY, pillW, pillH, 999); ctx.stroke();
  // dot
  ctx.fillStyle = badgeColor;
  ctx.shadowColor = badgeColor; ctx.shadowBlur = 8*scale;
  ctx.beginPath(); ctx.arc(pillX + pillPadX + dotR, pillY + pillH/2, dotR, 0, Math.PI*2); ctx.fill();
  ctx.shadowBlur = 0;
  // label
  ctx.fillStyle = badgeLight;
  ctx.textAlign = "left"; ctx.textBaseline = "middle";
  ctx.font = `700 ${pillF}px Sora, sans-serif`;
  const lblX = pillX + pillPadX + dotR*2 + Math.round(8*scale);
  drawSpaced(pillText, lblX, pillY + pillH/2, pillF*0.2);
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  ctx.restore();

  y += badgeH + badgeGap;

  // title centered
  ctx.textBaseline = "top"; ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 2;
  for(const ln of titleLines){
    const lineFont = titleFont;
    ctx.font = lineFont;
    const sp = ctx.measureText(" ").width;
    const totalLW = ln.reduce((s,w,i)=>s+ctx.measureText(w.text).width+(i?sp:0), 0);
    let cx = W/2 - totalLW/2;
    ctx.textAlign = "left";
    ln.forEach((word,i)=>{
      if(i>0) cx += sp;
      ctx.fillStyle = word.hi ? hi : "#ffffff";
      ctx.fillText(word.text, cx, y);
      cx += ctx.measureText(word.text).width;
    });
    y += titleLH;
  }
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

  // description centered
  if(descLines.length){
    y += descGap;
    ctx.textBaseline = "top";
    for(const ln of descLines){ drawRichLineCentered(ln, W/2, y, descFont, hi, descBaseColor()); y += descLH; }
  }

  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  lastTextBox = null;

  // signature at bottom
  if(c.signature && c.signature.trim()){
    const sigF = Math.round(24*scale);
    ctx.font = `500 ${sigF}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = "#6b7882"; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
    ctx.fillText(c.signature, W/2, H - pad);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }
}

// --- Shared: big score at center (used by T1 when showScore) ---
function drawScoreCenter(W,H,c,scale,maxW,hi){
  const plain = c.score.replace(/\*/g,"");
  let sf = Math.round(220*scale);
  ctx.font = `800 ${sf}px Sora, sans-serif`;
  while(ctx.measureText(plain).width > maxW && sf > 40){ sf = Math.round(sf*0.92); ctx.font = `800 ${sf}px Sora, sans-serif`; }
  const sy = H*0.43 + (c.scoreY||0)*scale;
  const parts = String(c.score).split("*");
  const segs = []; parts.forEach((p,i)=>{ if(p!=="") segs.push({text:p, hi:i%2===1}); });
  const totalW = segs.reduce((s,seg)=>s+ctx.measureText(seg.text).width, 0);
  ctx.save();
  ctx.textAlign = "left"; ctx.textBaseline = "middle";
  let cx = W/2 - totalW/2;
  segs.forEach(seg=>{ ctx.fillStyle = seg.hi ? hi : "#ffffff"; ctx.fillText(seg.text, cx, sy); cx += ctx.measureText(seg.text).width; });
  ctx.restore();
  ctx.textBaseline = "alphabetic";
}

// --- T5: Classement / Standings (table with rows) ---
function parseStandings(text){
  return (text||"").split("\n").map(l=>l.trim()).filter(Boolean).map(line=>{
    const m = line.match(/^(.+?)\s+(\d+[\-–]\d+)\s*$/);
    if(m) return { name:m[1].trim(), record:m[2].replace("–","-") };
    return { name:line, record:"" };
  });
}
function drawLayoutClassement(W,H,c,scale,pad,maxW,acc,hi){
  const eyeF = Math.round(22*scale);
  const titleF = Math.round((state.format==="story"||state.reel?68:58) * scale * state.titleScale);
  const titleLH = Math.round(titleF*1.06);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);

  // header block: tick + eyebrow + title
  const accentLineH = Math.round(4*scale);
  const gap = Math.round(13*scale);
  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  let y = Math.round(H*0.16 + 80*scale) + dragOffset;
  ctx.fillStyle = acc;
  ctx.fillRect(pad, y, Math.round(54*scale), accentLineH);
  y += accentLineH + gap;
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.18);
    y += eyeF + Math.round(10*scale);
  }
  ctx.textBaseline = "top";
  for(const ln of titleLines){ drawRichLine(ln, pad, y, titleFont, hi, "#ffffff"); y += titleLH; }

  // table
  const teams = parseStandings(c.standings);
  if(!teams.length){ lastTextBox=null; return; }
  const relLine = c.relegationLine || 0;
  const rowH = Math.round(46*scale);
  const headerH = Math.round(32*scale);
  const tableY = y + Math.round(24*scale);
  const numW = Math.round(32*scale);
  const recW = Math.round(72*scale);
  const nameX = pad + numW;
  const recX = pad + maxW - recW;
  const rowR = Math.round(9*scale);
  const nameF = Math.round(32*scale);
  const recF = Math.round(24*scale);
  const headerF = Math.round(20*scale);

  // column headers
  ctx.font = `600 ${headerF}px 'JetBrains Mono', monospace`;
  ctx.fillStyle = "#6b7882"; ctx.textBaseline = "middle";
  const headerY = tableY + headerH/2;
  ctx.fillText("#", pad + Math.round(14*scale), headerY);
  ctx.fillText("Équipe", nameX + Math.round(14*scale), headerY);
  ctx.textAlign = "right";
  ctx.fillText("V–D", pad + maxW - Math.round(14*scale), headerY);
  ctx.textAlign = "left";

  let ry = tableY + headerH;
  teams.forEach((team,i)=>{
    const rank = i+1;
    const isFirst = rank===1;
    const isReleg = relLine>0 && rank>=relLine;
    const isAlt = rank%2===1;

    // row background
    if(isFirst){
      ctx.fillStyle = rgba(acc, 0.08);
      roundRectPath(pad, ry, maxW, rowH, rowR); ctx.fill();
      ctx.strokeStyle = rgba(acc, 0.22); ctx.lineWidth = Math.max(1, 2*scale);
      roundRectPath(pad, ry, maxW, rowH, rowR); ctx.stroke();
    } else if(isReleg){
      if(rank===relLine){
        ctx.strokeStyle = "#16212a"; ctx.lineWidth = Math.max(1, scale);
        ctx.beginPath(); ctx.moveTo(pad, ry); ctx.lineTo(pad+maxW, ry); ctx.stroke();
      }
      ctx.globalAlpha = 0.62;
      if(isAlt){ ctx.fillStyle = "rgba(255,255,255,0.03)"; roundRectPath(pad, ry, maxW, rowH, rowR); ctx.fill(); }
    } else if(isAlt){
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      roundRectPath(pad, ry, maxW, rowH, rowR); ctx.fill();
    }

    const cy = ry + rowH/2;
    // rank number
    ctx.font = `600 ${recF}px 'JetBrains Mono', monospace`;
    ctx.textBaseline = "middle";
    ctx.fillStyle = isFirst ? acc : (isReleg ? "#ff4d57" : "#9aa7b0");
    ctx.fillText(String(rank), pad + Math.round(14*scale), cy);
    // team name
    ctx.font = `600 ${nameF}px Manrope, sans-serif`;
    ctx.fillStyle = isFirst ? "#ffffff" : "#dfdfdf";
    ctx.fillText(team.name, nameX + Math.round(14*scale), cy);
    // record
    if(team.record){
      ctx.font = `600 ${recF}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = isFirst ? "#dfdfdf" : "#9aa7b0";
      ctx.textAlign = "right";
      ctx.fillText(team.record, pad + maxW - Math.round(14*scale), cy);
      ctx.textAlign = "left";
    }

    if(isReleg) ctx.globalAlpha = 1;
    ry += rowH;
  });

  ctx.textBaseline = "alphabetic";
  lastTextBox = null;
}

// --- T6: Carousel (stats slides — eyebrow section + stat pairs) ---
function parseStats(text){
  return (text||"").split("\n").map(l=>l.trim()).filter(Boolean).map(line=>{
    const sep = line.lastIndexOf(" ");
    if(sep>0) return { label:line.slice(0,sep).trim(), value:line.slice(sep+1).trim() };
    return { label:line, value:"" };
  });
}
function drawLayoutCarousel(W,H,c,scale,pad,maxW,acc,hi){
  const stats = parseStats(c.stats);
  const hasStats = stats.length > 0;

  if(hasStats){
    const eyeF = Math.round(22*scale);
    const titleF = Math.round((state.format==="story"||state.reel?48:42) * scale * state.titleScale);
    const titleLH = Math.round(titleF*1.08);
    const titleFont = `800 ${titleF}px Sora, sans-serif`;
    const eyebrow = (c.eyebrow||"").toUpperCase();
    const titleLines = wrapRich(richWords(c.title), titleFont, maxW);

    const accentLineH = Math.round(4*scale);
    const gapLine = Math.round(13*scale);
    const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
    let y = Math.round(H*0.16 + 80*scale) + dragOffset;
    ctx.fillStyle = acc;
    ctx.fillRect(pad, y, Math.round(54*scale), accentLineH);
    y += accentLineH + gapLine;
    if(eyebrow){
      ctx.font = `700 ${eyeF}px Sora, sans-serif`;
      ctx.fillStyle = acc; ctx.textBaseline = "top";
      drawSpaced(eyebrow, pad, y, eyeF*0.18);
      y += eyeF + Math.round(10*scale);
    }
    ctx.textBaseline = "top";
    for(const ln of titleLines){ drawRichLine(ln, pad, y, titleFont, hi, "#ffffff"); y += titleLH; }

    // stat cards
    y += Math.round(24*scale);
    const hiIdx = (c.statHighlight || 0) - 1;
    const cardH = Math.round(100*scale);
    const cardGap = Math.round(12*scale);
    const cardR = Math.round(14*scale);
    const valueF = Math.round(44*scale);
    const labelF = Math.round(22*scale);

    stats.forEach((stat,i)=>{
      const isHi = i === hiIdx;
      // card background
      ctx.fillStyle = isHi ? rgba(acc, 0.08) : "rgba(255,255,255,0.03)";
      roundRectPath(pad, y, maxW, cardH, cardR); ctx.fill();
      ctx.strokeStyle = isHi ? rgba(acc, 0.25) : "#16212a";
      ctx.lineWidth = Math.max(1, 1.5*scale);
      roundRectPath(pad, y, maxW, cardH, cardR); ctx.stroke();
      // accent bar on left for highlighted
      if(isHi){
        ctx.fillStyle = acc;
        const barW = Math.round(4*scale);
        roundRectPath(pad, y, barW, cardH, barW/2); ctx.fill();
      }
      const innerPad = Math.round(24*scale);
      const cy = y + cardH/2;
      // label (left)
      ctx.font = `500 ${labelF}px Manrope, sans-serif`;
      ctx.fillStyle = isHi ? "#ffffff" : descBaseColor();
      ctx.textBaseline = "middle";
      ctx.fillText(stat.label, pad + innerPad, cy);
      // value (right)
      if(stat.value){
        ctx.font = `700 ${valueF}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = isHi ? acc : "#ffffff";
        ctx.textAlign = "right"; ctx.textBaseline = "middle";
        ctx.fillText(stat.value, pad + maxW - innerPad, cy);
        ctx.textAlign = "left";
      }
      y += cardH + cardGap;
    });

    ctx.textBaseline = "alphabetic";
    lastTextBox = null;
  } else {
    // no stats = accroche slide, same as post-image layout
    drawLayoutBottom(W,H,c,scale,pad,maxW,acc,hi);
  }
}

// --- Shared: diagonal stripe background (for transfert, mvp) ---
function drawStripeBackground(W,H){
  ctx.save();
  ctx.globalAlpha = 0.35;
  const stripe = 88*(W/1080);
  for(let x = -H; x < W+H; x += stripe){
    ctx.fillStyle = (Math.round(x/stripe)%2===0) ? "#11181f" : "#0d141a";
    ctx.beginPath();
    ctx.moveTo(x, 0); ctx.lineTo(x+stripe*0.5, 0);
    ctx.lineTo(x+stripe*0.5-H*Math.tan(35*Math.PI/180), H);
    ctx.lineTo(x-H*Math.tan(35*Math.PI/180), H);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

// --- T7: Programme / Calendrier (match schedule) ---
function parseMatches(text){
  const days = []; let current = null;
  (text||"").split("\n").forEach(line=>{
    line = line.trim(); if(!line) return;
    if(line.startsWith("##")){
      current = { date: line.slice(2).trim(), matches:[] };
      days.push(current);
    } else if(current){
      const m = line.match(/^(\d{1,2}[h:]\d{2})\s+(.+?)\s+vs\s+(.+?)(?:\s+(BO\d))?$/i);
      if(m) current.matches.push({ time:m[1], teamA:m[2].trim(), teamB:m[3].trim(), format:m[4]||"" });
      else{
        const simple = line.match(/^(.+?)\s+vs\s+(.+?)(?:\s+(BO\d))?$/i);
        if(simple) current.matches.push({ time:"", teamA:simple[1].trim(), teamB:simple[2].trim(), format:simple[3]||"" });
      }
    }
  });
  return days;
}
function drawLayoutProgramme(W,H,c,scale,pad,maxW,acc,hi){
  const eyeF = Math.round(22*scale);
  const titleF = Math.round((state.format==="story"||state.reel?64:56)*scale*state.titleScale);
  const titleLH = Math.round(titleF*1.06);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);

  const accentLineH = Math.round(4*scale);
  const gap = Math.round(13*scale);
  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  let y = Math.round(H*0.14 + 80*scale) + dragOffset;
  ctx.fillStyle = acc;
  ctx.fillRect(pad, y, Math.round(54*scale), accentLineH);
  y += accentLineH + gap;
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.18);
    y += eyeF + Math.round(10*scale);
  }
  ctx.textBaseline = "top";
  for(const ln of titleLines){ drawRichLine(ln, pad, y, titleFont, hi, "#ffffff"); y += titleLH; }

  const days = parseMatches(c.matches);
  if(!days.length){ lastTextBox=null; return; }

  y += Math.round(20*scale);
  const dateF = Math.round(24*scale);
  const matchF = Math.round(26*scale);
  const timeF = Math.round(24*scale);
  const fmtF = Math.round(18*scale);
  const rowH = Math.round(84*scale);
  const rowR = Math.round(16*scale);
  const rowGap = Math.round(10*scale);

  for(const day of days){
    // day header
    ctx.font = `700 ${dateF}px Sora, sans-serif`;
    ctx.fillStyle = "#ffffff"; ctx.textBaseline = "middle";
    const dateW = ctx.measureText(day.date).width;
    const hdrY = y + Math.round(16*scale);
    ctx.fillText(day.date, pad, hdrY);
    ctx.strokeStyle = "#16212a"; ctx.lineWidth = Math.max(1, scale);
    ctx.beginPath(); ctx.moveTo(pad+dateW+Math.round(14*scale), hdrY); ctx.lineTo(pad+maxW, hdrY); ctx.stroke();
    const countF = Math.round(18*scale);
    ctx.font = `500 ${countF}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = "#6b7882"; ctx.textAlign = "right";
    ctx.fillText(day.matches.length+" match"+(day.matches.length>1?"s":""), pad+maxW, hdrY);
    ctx.textAlign = "left";
    y = hdrY + Math.round(20*scale);

    for(const match of day.matches){
      // match card
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      roundRectPath(pad, y, maxW, rowH, rowR); ctx.fill();
      ctx.strokeStyle = "#16212a"; ctx.lineWidth = Math.max(1, Math.round(1.5*scale));
      roundRectPath(pad, y, maxW, rowH, rowR); ctx.stroke();

      const cy = y + rowH/2;
      const innerPad = Math.round(24*scale);

      // time
      if(match.time){
        ctx.font = `600 ${timeF}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = "#dfdfdf"; ctx.textBaseline = "middle";
        ctx.fillText(match.time, pad+innerPad, cy);
      }

      // teams centered
      const teamFont = `700 ${matchF}px Sora, sans-serif`;
      ctx.font = teamFont;
      const vsF = Math.round(20*scale);
      const vsText = " vs ";
      ctx.font = `500 ${vsF}px 'JetBrains Mono', monospace`;
      const vsW = ctx.measureText(vsText).width;
      ctx.font = teamFont;
      const aW = ctx.measureText(match.teamA).width;
      const bW = ctx.measureText(match.teamB).width;
      const totalTeamW = aW + vsW + bW;
      const teamStartX = pad + maxW/2 - totalTeamW/2;

      ctx.font = teamFont;
      ctx.fillStyle = "#ffffff"; ctx.textBaseline = "middle";
      ctx.fillText(match.teamA, teamStartX, cy);
      ctx.font = `500 ${vsF}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = "#6b7882";
      ctx.fillText(vsText, teamStartX+aW, cy);
      ctx.font = teamFont;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(match.teamB, teamStartX+aW+vsW, cy);

      // format tag
      if(match.format){
        ctx.font = `500 ${fmtF}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = acc; ctx.textAlign = "right"; ctx.textBaseline = "middle";
        ctx.fillText(match.format.toUpperCase(), pad+maxW-innerPad, cy);
        ctx.textAlign = "left";
      }

      y += rowH + rowGap;
    }
    y += Math.round(8*scale);
  }

  // footer
  if(c.footerText){
    const footF = Math.round(20*scale);
    ctx.font = `500 ${footF}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = "#6b7882"; ctx.textBaseline = "bottom"; ctx.textAlign = "left";
    ctx.fillText(c.footerText, pad, H - pad);
    ctx.textBaseline = "alphabetic";
  }
  lastTextBox = null;
}

// --- T8: Sondage (poll with result bars) ---
function parsePollOptions(text){
  return (text||"").split("\n").map(l=>l.trim()).filter(Boolean).map(line=>{
    const m = line.match(/^(.+?)\s+(\d+)%?\s*$/);
    if(m) return { label:m[1].trim(), pct:parseInt(m[2]) };
    return { label:line, pct:0 };
  });
}
function drawLayoutSondage(W,H,c,scale,pad,maxW,acc,hi){
  const eyeF = Math.round(22*scale);
  const questionF = Math.round((state.format==="story"||state.reel?72:64)*scale*state.titleScale);
  const questionLH = Math.round(questionF*1.08);
  const questionFont = `800 ${questionF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const questionLines = wrapRich(richWords(c.title), questionFont, maxW);

  const accentLineH = Math.round(4*scale);
  const gap = Math.round(13*scale);
  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  let y = Math.round(H*0.14 + 80*scale) + dragOffset;
  ctx.fillStyle = acc;
  ctx.fillRect(pad, y, Math.round(54*scale), accentLineH);
  y += accentLineH + gap;
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.18);
    y += eyeF + Math.round(16*scale);
  }
  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 2;
  for(const ln of questionLines){ drawRichLine(ln, pad, y, questionFont, hi, "#ffffff"); y += questionLH; }
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

  const options = parsePollOptions(c.pollOptions);
  if(!options.length){ lastTextBox=null; return; }

  y += Math.round(32*scale);
  const barH = Math.round(84*scale);
  const barR = Math.round(18*scale);
  const barGap = Math.round(20*scale);
  const labelF = Math.round(28*scale);
  const pctF = Math.round(28*scale);
  const winner = c.pollWinner || 0;

  options.forEach((opt,i)=>{
    const isWinner = i === winner;
    // bar background
    ctx.fillStyle = "#0e151b";
    roundRectPath(pad, y, maxW, barH, barR); ctx.fill();
    // fill bar
    const fillW = Math.max(0, Math.round(maxW*(opt.pct/100)));
    if(fillW > 0){
      ctx.save(); ctx.beginPath();
      roundRectPath(pad, y, maxW, barH, barR); ctx.clip();
      const g = ctx.createLinearGradient(pad, 0, pad+fillW, 0);
      if(isWinner){
        g.addColorStop(0, rgba(acc, 0.28));
        g.addColorStop(1, rgba(acc, 0.08));
      } else {
        g.addColorStop(0, "rgba(255,255,255,0.06)");
        g.addColorStop(1, "rgba(255,255,255,0.02)");
      }
      ctx.fillStyle = g;
      ctx.fillRect(pad, y, fillW, barH);
      ctx.restore();
    }
    // border
    ctx.strokeStyle = isWinner ? rgba(acc, 0.4) : "#1f2c35";
    ctx.lineWidth = Math.max(1, Math.round(1.5*scale));
    roundRectPath(pad, y, maxW, barH, barR); ctx.stroke();
    // label
    const innerPad = Math.round(28*scale);
    ctx.font = `600 ${labelF}px Manrope, sans-serif`;
    ctx.fillStyle = isWinner ? "#ffffff" : "#dfdfdf";
    ctx.textBaseline = "middle";
    ctx.fillText(opt.label, pad+innerPad, y+barH/2);
    // percentage
    ctx.font = `600 ${pctF}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = isWinner ? acc : "#9aa7b0";
    ctx.textAlign = "right";
    ctx.fillText(opt.pct+"%", pad+maxW-innerPad, y+barH/2);
    ctx.textAlign = "left";

    y += barH + barGap;
  });

  // footer (votes + CTA)
  if(c.footerText){
    const footF = Math.round(21*scale);
    ctx.font = `500 ${footF}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = "#6b7882"; ctx.textBaseline = "bottom"; ctx.textAlign = "center";
    ctx.fillText(c.footerText, W/2, H - pad);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }
  lastTextBox = null;
}

// --- T9: Transfert Market (player signing with badge) ---
function drawLayoutTransfert(W,H,c,scale,pad,maxW,acc,hi){
  // bottom scrim (heavier for text readability over photo)
  const scrimH = Math.round(H*0.68);
  const scrim = ctx.createLinearGradient(0, H-scrimH, 0, H);
  const tint = mix(acc, INK, 0.85);
  scrim.addColorStop(0, rgba(tint, 0));
  scrim.addColorStop(0.36, rgba(tint, 0.94));
  scrim.addColorStop(1, rgba(INK, 0.98));
  ctx.fillStyle = scrim; ctx.fillRect(0, H-scrimH, W, scrimH);
  // top fade
  const topH = Math.round(130*scale);
  const topG = ctx.createLinearGradient(0, 0, 0, topH);
  topG.addColorStop(0, "rgba(7,10,13,0.72)"); topG.addColorStop(1, "rgba(7,10,13,0)");
  ctx.fillStyle = topG; ctx.fillRect(0, 0, W, topH);

  // status badge
  const badgeType = c.transferBadge || "officiel";
  const badgeColors = { officiel:"#1cc079", rumeur:"#f0c14b", negociation:"#3b9eff" };
  const badgeLabels = { officiel:"OFFICIEL", rumeur:"RUMEUR", negociation:"EN NÉGOCIATION" };
  const bCol = badgeColors[badgeType] || "#1cc079";
  const bLabel = badgeLabels[badgeType] || "OFFICIEL";

  const pillF = Math.round(20*scale);
  ctx.font = `700 ${pillF}px Sora, sans-serif`;
  const pillTW = ctx.measureText(bLabel).width + bLabel.length*pillF*0.18;
  const dotR = Math.round(6*scale);
  const pillPadX = Math.round(16*scale), pillPadY = Math.round(12*scale);
  const pillW = dotR*2 + Math.round(8*scale) + pillTW + pillPadX*2;
  const pillH = pillF + pillPadY*2;
  const pillX = W/2 - pillW/2;
  const pillY = Math.round(232*scale);

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 16*scale;
  ctx.fillStyle = "rgba(7,10,13,0.7)";
  roundRectPath(pillX, pillY, pillW, pillH, 999); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = rgba(bCol, 0.18);
  roundRectPath(pillX, pillY, pillW, pillH, 999); ctx.fill();
  ctx.strokeStyle = rgba(bCol, 0.6); ctx.lineWidth = Math.max(1, 1.5*scale);
  roundRectPath(pillX, pillY, pillW, pillH, 999); ctx.stroke();
  ctx.fillStyle = bCol;
  ctx.shadowColor = bCol; ctx.shadowBlur = 8*scale;
  ctx.beginPath(); ctx.arc(pillX+pillPadX+dotR, pillY+pillH/2, dotR, 0, Math.PI*2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = bCol;
  ctx.font = `700 ${pillF}px Sora, sans-serif`;
  ctx.textAlign = "left"; ctx.textBaseline = "middle";
  drawSpaced(bLabel, pillX+pillPadX+dotR*2+Math.round(8*scale), pillY+pillH/2, pillF*0.18);
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  ctx.restore();

  // bottom text
  const eyeF = Math.round(22*scale);
  const titleF = Math.round((state.format==="story"||state.reel?80:72)*scale*state.titleScale);
  const descF = Math.round(28*scale*state.descScale);
  const titleLH = Math.round(titleF*1.04);
  const descLH = Math.round(descF*1.4);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);
  const descFont = `500 ${descF}px Manrope, sans-serif`;
  const descLines = (c.showDesc && c.desc.trim()) ? wrapRich(richWords(c.desc), descFont, maxW).slice(0,8) : [];

  const accentLineH = Math.round(4*scale);
  const gapLine = Math.round(14*scale);
  const gapEye = Math.round(14*scale);
  const gapTitle = Math.round(20*scale);
  let blockH = accentLineH + gapLine;
  if(eyebrow) blockH += eyeF + gapEye;
  blockH += titleLines.length*titleLH;
  if(descLines.length) blockH += gapTitle + descLines.length*descLH;

  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  let y = H - pad - blockH + dragOffset;
  ctx.fillStyle = acc;
  ctx.fillRect(pad, y, Math.round(54*scale), accentLineH);
  y += accentLineH + gapLine;
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.18);
    y += eyeF + gapEye;
  }
  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 2;
  for(const ln of titleLines){ drawRichLine(ln, pad, y, titleFont, hi, "#ffffff"); y += titleLH; }
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  if(descLines.length){
    y += gapTitle;
    for(const ln of descLines){ drawRichLine(ln, pad, y, descFont, hi, descBaseColor()); y += descLH; }
  }
  lastTextBox = null;
}

// --- T10: Tier List (S/A/B/C ranking) ---
function parseTiers(text){
  return (text||"").split("\n").map(l=>l.trim()).filter(Boolean).map(line=>{
    const m = line.match(/^([A-Z]):?\s*(.+)$/i);
    if(m) return { tier:m[1].toUpperCase(), teams:m[2].split(",").map(t=>t.trim()).filter(Boolean) };
    return null;
  }).filter(Boolean);
}
function drawLayoutTierList(W,H,c,scale,pad,maxW,acc,hi){
  const eyeF = Math.round(22*scale);
  const titleF = Math.round((state.format==="story"||state.reel?64:56)*scale*state.titleScale);
  const titleLH = Math.round(titleF*1.06);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);

  const accentLineH = Math.round(4*scale);
  const gap = Math.round(13*scale);
  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  let y = Math.round(H*0.14 + 80*scale) + dragOffset;
  ctx.fillStyle = acc;
  ctx.fillRect(pad, y, Math.round(54*scale), accentLineH);
  y += accentLineH + gap;
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.18);
    y += eyeF + Math.round(10*scale);
  }
  ctx.textBaseline = "top";
  for(const ln of titleLines){ drawRichLine(ln, pad, y, titleFont, hi, "#ffffff"); y += titleLH; }

  const tiers = parseTiers(c.tiers);
  if(!tiers.length){ lastTextBox=null; return; }

  y += Math.round(24*scale);

  const tierColors = {
    S:{ grad:["#ffe08a","#f0c14b"], text:"#241b04", border:0.34, bgA:0.10 },
    A:{ grad:["#e6bd54","#c79a37"], text:"#241b04", border:0.26, bgA:0.08 },
    B:{ grad:["#9c8a52","#7c6d3f"], text:"#f3eede", border:0.22, bgA:0.07 },
    C:{ grad:["#6b7882","#4d5860"], text:"#eef1f3", border:0.18, bgA:0.05 },
    D:{ grad:["#4d5860","#3a4248"], text:"#eef1f3", border:0.14, bgA:0.04 },
  };
  const rowH = Math.round(120*scale);
  const rowGap = Math.round(16*scale);
  const letterBoxW = Math.round(104*scale);
  const letterR = Math.round(18*scale);
  const chipPadX = Math.round(16*scale);
  const chipPadY = Math.round(9*scale);
  const chipR = Math.round(12*scale);
  const chipGap = Math.round(12*scale);
  const chipF = Math.round(24*scale);
  const letterF = Math.round(48*scale);
  const containerGap = Math.round(18*scale);

  for(const tier of tiers){
    const tc = tierColors[tier.tier] || tierColors.C;
    // letter box
    const g = ctx.createLinearGradient(pad, y, pad+letterBoxW, y+rowH);
    g.addColorStop(0, tc.grad[0]); g.addColorStop(1, tc.grad[1]);
    ctx.fillStyle = g;
    roundRectPath(pad, y, letterBoxW, rowH, letterR); ctx.fill();
    ctx.font = `800 ${letterF}px Sora, sans-serif`;
    ctx.fillStyle = tc.text; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(tier.tier, pad+letterBoxW/2, y+rowH/2);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    // chips container
    const cX = pad + letterBoxW + containerGap;
    const cW = maxW - letterBoxW - containerGap;
    ctx.fillStyle = rgba(tc.grad[1], tc.bgA);
    roundRectPath(cX, y, cW, rowH, letterR); ctx.fill();
    ctx.strokeStyle = rgba(tc.grad[1], tc.border); ctx.lineWidth = Math.max(1, 1.5*scale);
    roundRectPath(cX, y, cW, rowH, letterR); ctx.stroke();

    // draw chips (logo if available, text fallback)
    ctx.font = `700 ${chipF}px Sora, sans-serif`;
    let cx = cX + Math.round(20*scale);
    const chipY = y + rowH/2;
    const logoChipSize = Math.round(rowH * 0.65);
    for(const team of tier.teams){
      const logoImg = findTeamLogo(team);
      if(logoImg){
        const cw = logoChipSize + chipPadX*2;
        const ch = logoChipSize + chipPadY*2;
        ctx.fillStyle = "#13202a";
        roundRectPath(cx, chipY-ch/2, cw, ch, chipR); ctx.fill();
        ctx.strokeStyle = "#243039"; ctx.lineWidth = Math.max(1, scale);
        roundRectPath(cx, chipY-ch/2, cw, ch, chipR); ctx.stroke();
        ctx.drawImage(logoImg, cx+chipPadX, chipY-logoChipSize/2, logoChipSize, logoChipSize);
        cx += cw + chipGap;
      } else {
        const tw = ctx.measureText(team).width;
        const cw = tw + chipPadX*2;
        const ch = chipF + chipPadY*2;
        ctx.fillStyle = "#13202a";
        roundRectPath(cx, chipY-ch/2, cw, ch, chipR); ctx.fill();
        ctx.strokeStyle = "#243039"; ctx.lineWidth = Math.max(1, scale);
        roundRectPath(cx, chipY-ch/2, cw, ch, chipR); ctx.stroke();
        ctx.fillStyle = tier.tier==="C" || tier.tier==="D" ? "#dfdfdf" : "#ffffff";
        ctx.textBaseline = "middle";
        ctx.fillText(team, cx+chipPadX, chipY);
        cx += cw + chipGap;
      }
    }

    y += rowH + rowGap;
  }

  // footer
  if(c.footerText){
    const footF = Math.round(20*scale);
    ctx.font = `500 ${footF}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = "#6b7882"; ctx.textBaseline = "bottom"; ctx.textAlign = "center";
    ctx.fillText(c.footerText, W/2, H - pad);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }
  lastTextBox = null;
}

// --- T11: Citation (quote with attribution) ---
function drawLayoutCitation(W,H,c,scale,pad,maxW,acc,hi){
  const eyeF = Math.round(22*scale);
  const quoteF = Math.round((state.format==="story"||state.reel?76:68)*scale*state.titleScale);
  const quoteLH = Math.round(quoteF*1.12);
  const quoteFont = `800 ${quoteF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const quoteLines = wrapRich(richWords(c.title), quoteFont, maxW);

  // eyebrow at top
  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  let y = Math.round(H*0.18) + dragOffset;
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.18);
    y += eyeF + Math.round(20*scale);
  }

  // giant decorative quote mark
  const decoF = Math.round(260*scale);
  ctx.font = `800 ${decoF}px Sora, sans-serif`;
  ctx.fillStyle = rgba(acc, 0.18);
  ctx.textBaseline = "top";
  ctx.fillText("“", pad - Math.round(8*scale), y - decoF*0.25);

  // quote text
  y += Math.round(160*scale);
  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 2;
  for(const ln of quoteLines){ drawRichLine(ln, pad, y, quoteFont, hi, "#ffffff"); y += quoteLH; }
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

  // attribution at bottom
  const nameF = Math.round(38*scale);
  const roleF = Math.round(26*scale);
  const avatarR = Math.round(48*scale);
  const attrY = H - pad - Math.round(20*scale);

  // avatar circle
  const avX = pad + avatarR;
  const avY = attrY - avatarR/2;
  ctx.save();
  ctx.fillStyle = "#13202a"; ctx.strokeStyle = "#243039"; ctx.lineWidth = Math.max(1, 2*scale);
  ctx.beginPath(); ctx.arc(avX, avY, avatarR, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  // initials in avatar
  const pName = c.playerName || "";
  const initials = pName.split(/\s+/).slice(0,2).map(w=>w[0]||"").join("").toUpperCase();
  ctx.fillStyle = acc; ctx.font = `700 ${Math.round(28*scale)}px Sora, sans-serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(initials, avX, avY);
  ctx.restore();

  // name + role
  const textX = pad + avatarR*2 + Math.round(22*scale);
  ctx.font = `800 ${nameF}px Sora, sans-serif`;
  ctx.fillStyle = "#ffffff"; ctx.textBaseline = "bottom";
  ctx.fillText(pName, textX, avY + Math.round(4*scale));
  if(c.playerRole){
    ctx.font = `500 ${roleF}px Manrope, sans-serif`;
    ctx.fillStyle = "#9aa7b0"; ctx.textBaseline = "top";
    ctx.fillText(c.playerRole, textX, avY + Math.round(8*scale));
  }
  ctx.textBaseline = "alphabetic";
  lastTextBox = null;
}

// --- T12: Player Spotlight (player card with stats) ---

// --- T13: MVP du Match (gold badge + player photo + stats) ---
function drawLayoutMVP(W,H,c,scale,pad,maxW,acc,hi){
  // bottom scrim — subtle warm tint, mostly dark
  const scrimH = Math.round(H*0.58);
  const scrim = ctx.createLinearGradient(0, H-scrimH, 0, H);
  scrim.addColorStop(0, "rgba(7,10,13,0)");
  scrim.addColorStop(0.30, "rgba(12,11,8,0.65)");
  scrim.addColorStop(0.60, "rgba(9,9,10,0.92)");
  scrim.addColorStop(1, "rgba(7,10,13,0.98)");
  ctx.fillStyle = scrim; ctx.fillRect(0, H-scrimH, W, scrimH);
  // top fade
  const topH = Math.round(130*scale);
  const topG = ctx.createLinearGradient(0, 0, 0, topH);
  topG.addColorStop(0, "rgba(7,10,13,0.72)"); topG.addColorStop(1, "rgba(7,10,13,0)");
  ctx.fillStyle = topG; ctx.fillRect(0, 0, W, topH);

  // badge mode: "mvp" (gold) or "macro" (accent)
  const isMvpBadge = (c.mvpBadge||"mvp") === "mvp";
  const gold = isMvpBadge ? "#f0c14b" : acc;

  const gc = hexToRgb(gold);
  const goldGlow = ctx.createRadialGradient(W*0.5, Math.round(240*scale), 0, W*0.5, Math.round(240*scale), W*0.22);
  goldGlow.addColorStop(0, `rgba(${gc.r},${gc.g},${gc.b},0.06)`);
  goldGlow.addColorStop(0.7, `rgba(${gc.r},${gc.g},${gc.b},0.015)`);
  goldGlow.addColorStop(1, `rgba(${gc.r},${gc.g},${gc.b},0)`);
  ctx.fillStyle = goldGlow; ctx.fillRect(0,0,W,H);

  // badge pill (centered)
  const pillF = Math.round(20*scale);
  ctx.font = `800 ${pillF}px Sora, sans-serif`;
  const mvpLabel = isMvpBadge ? "MVP DU MATCH" : "MACRO";
  const pillTW = ctx.measureText(mvpLabel).width + mvpLabel.length*pillF*0.2;
  const pillPadX = Math.round(24*scale), pillPadY = Math.round(10*scale);
  const pillW = pillTW + pillPadX*2;
  const pillH = pillF + pillPadY*2;
  const pillX = W/2 - pillW/2;
  const pillY = Math.round(232*scale);

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 16*scale;
  ctx.fillStyle = "rgba(7,10,13,0.55)";
  roundRectPath(pillX, pillY, pillW, pillH, 999); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();
  if(isMvpBadge){
    const goldG = ctx.createLinearGradient(pillX, pillY, pillX+pillW, pillY+pillH);
    goldG.addColorStop(0, "#ffe08a"); goldG.addColorStop(1, "#f0c14b");
    ctx.fillStyle = goldG;
  } else {
    ctx.fillStyle = acc;
  }
  roundRectPath(pillX, pillY, pillW, pillH, 999); ctx.fill();
  ctx.save();
  ctx.shadowColor = rgba(gold, 0.25); ctx.shadowBlur = 10*scale;
  roundRectPath(pillX, pillY, pillW, pillH, 999); ctx.fill();
  ctx.restore();
  ctx.font = `800 ${pillF}px Sora, sans-serif`;
  ctx.fillStyle = isMvpBadge ? "#231c08" : "#ffffff"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
  const spacedW = pillTW;
  drawSpaced(mvpLabel, pillX + (pillW - spacedW)/2, pillY+pillH/2, pillF*0.2);
  ctx.textBaseline = "alphabetic";

  // bottom text
  const eyeF = Math.round(22*scale);
  const titleF = Math.round((state.format==="story"||state.reel?80:72)*scale*state.titleScale);
  const descF = Math.round(28*scale*state.descScale);
  const titleLH = Math.round(titleF*1.04);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);
  const result = c.matchResult || "";

  // stats
  const stats = parseStats(c.stats);
  const statBoxH = Math.round(110*scale);
  const statBoxGap = Math.round(16*scale);
  const statBoxR = Math.round(18*scale);
  const statValueF = Math.round(48*scale);
  const statLabelF = Math.round(21*scale);
  const showStats = stats.length >= 1;

  // layout from bottom
  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  let bottomEdge = H - pad + dragOffset;
  let statsY = bottomEdge;
  if(showStats){
    statsY = bottomEdge - statBoxH;
    bottomEdge = statsY - Math.round(24*scale);
  }

  // result line
  if(result){
    ctx.font = `500 ${descF}px Manrope, sans-serif`;
    ctx.fillStyle = descBaseColor(); ctx.textBaseline = "bottom";
    ctx.fillText(result, pad, bottomEdge);
    bottomEdge -= descF + Math.round(18*scale);
  }

  // title
  const accentLineH = Math.round(4*scale);
  const gapLine = Math.round(14*scale);
  const gapEye = Math.round(14*scale);
  let blockH = accentLineH + gapLine + titleLines.length*titleLH;
  if(eyebrow) blockH += eyeF + gapEye;
  let y = bottomEdge - titleLines.length*titleLH;

  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 2;
  for(const ln of titleLines){ drawRichLine(ln, pad, y, titleFont, gold, "#ffffff"); y += titleLH; }
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

  y = bottomEdge - titleLines.length*titleLH;
  if(eyebrow){
    y -= eyeF + gapEye;
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = gold; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.18);
    y -= accentLineH + gapLine;
  } else {
    y -= accentLineH + gapLine;
  }
  ctx.fillStyle = gold;
  ctx.fillRect(pad, y, Math.round(54*scale), accentLineH);

  // stat boxes
  if(showStats){
    const mvpHiIdx = (c.statHighlight || 0) - 1;
    const count = Math.min(stats.length, 3);
    const boxW = (maxW - (count-1)*statBoxGap) / count;
    let bx = pad;
    for(let i=0; i<count; i++){
      const isHi = i===mvpHiIdx;
      ctx.fillStyle = isHi ? rgba(gold, 0.06) : "rgba(255,255,255,0.03)";
      roundRectPath(bx, statsY, boxW, statBoxH, statBoxR); ctx.fill();
      ctx.strokeStyle = isHi ? rgba(gold, 0.2) : "#16212a"; ctx.lineWidth = Math.max(1, 1.5*scale);
      roundRectPath(bx, statsY, boxW, statBoxH, statBoxR); ctx.stroke();
      ctx.font = `600 ${statValueF}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = isHi ? gold : "#ffffff";
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText(stats[i].value, bx+boxW/2, statsY + Math.round(16*scale));
      ctx.font = `500 ${statLabelF}px Manrope, sans-serif`;
      ctx.fillStyle = "#9aa7b0";
      ctx.fillText(stats[i].label, bx+boxW/2, statsY + statBoxH - Math.round(28*scale));
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      bx += boxW + statBoxGap;
    }
  }
  lastTextBox = null;
}

// --- T15: Lineup ---
function parseLineup(text){
  return (text||"").split("\n").map(l=>l.trim()).filter(Boolean).map(line=>{
    const parts = line.split("/").map(s=>s.trim());
    return { name: parts[0]||"", role: parts[1]||"", rating: parts[2]||"" };
  });
}
function drawLayoutLineup(W,H,c,scale,pad,maxW,acc,hi){
  const players = parseLineup(c.lineup);
  const count = c.lineupCount || 5;
  const teamRating = (c.lineupTeamRating||"").trim();
  const showRatings = players.some(p => p.rating !== "");

  const eyeF = Math.round(22*scale);
  const titleF = Math.round((state.format==="story"||state.reel?80:72)*scale*state.titleScale);
  const titleLH = Math.round(titleF*1.04);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);

  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);

  // header block
  const accentLineH = Math.round(4*scale);
  const gapLine = Math.round(14*scale);
  const gapEye = Math.round(14*scale);
  let headerY = Math.round(210*scale) + dragOffset;

  ctx.fillStyle = hi;
  ctx.fillRect(pad, headerY, Math.round(54*scale), accentLineH);
  headerY += accentLineH + gapLine;

  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = hi; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, headerY, eyeF*0.18);
    headerY += eyeF + gapEye;
  }

  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 2;
  for(const ln of titleLines){ drawRichLine(ln, pad, headerY, titleFont, hi, "#ffffff"); headerY += titleLH; }
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

  // player cards — fill available space
  const cardGap = Math.round(14*scale);
  const cardR = Math.round(16*scale);
  const teamRatingH = teamRating ? Math.round(120*scale) : 0;
  const bottomPad = Math.round(180*scale);
  const cardsTop = headerY + Math.round(36*scale);
  const cardsBottom = H - bottomPad - teamRatingH;
  const availableH = cardsBottom - cardsTop;
  const cardH = Math.floor((availableH - (count-1)*cardGap) / count);
  const photoInset = Math.round(10*scale);
  const photoSize = cardH - photoInset*2;
  const photoR = Math.round(12*scale);
  const nameF = Math.round(32*scale);
  const roleF = Math.round(20*scale);
  const ratingF = Math.round(52*scale);
  for(let i=0; i<count; i++){
    const p = players[i] || { name:"", role:"", rating:"" };
    const cy = cardsTop + i*(cardH + cardGap);

    // card bg
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    roundRectPath(pad, cy, maxW, cardH, cardR); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = Math.max(1, 1.5*scale);
    roundRectPath(pad, cy, maxW, cardH, cardR); ctx.stroke();

    // photo — auto-match by player name, fallback to manual lineupPhotos, else empty
    const photoX = pad + photoInset;
    const photoY = cy + photoInset;
    const autoImg = findPlayerImage(p.name);
    const manualImg = c.lineupPhotos && c.lineupPhotos[i];
    const pImg = autoImg || manualImg;
    if(pImg){
      ctx.save();
      roundRectPath(photoX, photoY, photoSize, photoSize, photoR); ctx.clip();
      const iw = pImg.naturalWidth || pImg.width, ih = pImg.naturalHeight || pImg.height;
      const coverScale = Math.max(photoSize/iw, photoSize/ih);
      const dw = iw*coverScale, dh = ih*coverScale;
      ctx.drawImage(pImg, photoX+(photoSize-dw)/2, photoY+(photoSize-dh)/2, dw, dh);
      ctx.restore();
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      roundRectPath(photoX, photoY, photoSize, photoSize, photoR); ctx.fill();
    }

    // name + role
    const textX = photoX + photoSize + Math.round(20*scale);
    if(p.name){
      ctx.font = `700 ${nameF}px Sora, sans-serif`;
      ctx.fillStyle = "#ffffff"; ctx.textBaseline = "middle";
      const nameY = p.role ? cy + cardH*0.38 : cy + cardH/2;
      ctx.fillText(p.name, textX, nameY);
    }
    if(p.role){
      ctx.font = `500 ${roleF}px Manrope, sans-serif`;
      ctx.fillStyle = "#9aa7b0"; ctx.textBaseline = "middle";
      ctx.fillText(p.role, textX, cy + cardH*0.65);
    }

    // rating
    if(p.rating){
      ctx.font = `800 ${ratingF}px Sora, sans-serif`;
      const ratingNum = parseFloat(p.rating);
      if(ratingNum >= 7) ctx.fillStyle = hi;
      else if(ratingNum >= 5) ctx.fillStyle = "#ffffff";
      else ctx.fillStyle = "#ff4d57";
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      ctx.fillText(p.rating, pad + maxW - Math.round(24*scale), cy + cardH/2);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    }
  }

  // team rating
  if(teamRating){
    const trY = cardsBottom + Math.round(10*scale);
    const trF = Math.round(72*scale);
    const trLabelF = Math.round(18*scale);
    ctx.font = `800 ${trF}px Sora, sans-serif`;
    ctx.fillStyle = hi; ctx.textAlign = "center"; ctx.textBaseline = "top";
    ctx.fillText(teamRating, W/2, trY);
    ctx.font = `700 ${trLabelF}px Sora, sans-serif`;
    ctx.fillStyle = "#9aa7b0";
    drawSpaced("NOTE ÉQUIPE", W/2 - ctx.measureText("NOTE ÉQUIPE").width/2, trY + trF + Math.round(6*scale), trLabelF*0.25);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }

  lastTextBox = null;
}

// --- T16: Bracket ---
function parseBracketRounds(text){
  if(!text || !text.trim()) return [];
  const rounds = [];
  let current = [];
  const lines = text.split("\n");
  for(const raw of lines){
    const line = raw.trim();
    if(!line){
      if(current.length) rounds.push(current);
      current = [];
      continue;
    }
    const m = line.match(/^(.+?)\s+(\d+)\s*$/);
    if(m) current.push({ name: m[1].trim(), score: parseInt(m[2]) });
    else current.push({ name: line, score: 0 });
  }
  if(current.length) rounds.push(current);
  const result = [];
  for(const round of rounds){
    const matches = [];
    for(let i=0; i<round.length; i+=2){
      const a = round[i];
      const b = round[i+1] || { name:"TBD", score:0 };
      matches.push({ teamA: a, teamB: b, winner: a.score > b.score ? "A" : (b.score > a.score ? "B" : null) });
    }
    result.push(matches);
  }
  return result;
}
function parseBracket(text){
  if(!text || !text.trim()) return [];
  if(text.includes("---")){
    const sections = text.split(/^---$/m);
    const upper = parseBracketRounds(sections[0]||"");
    const lower = parseBracketRounds(sections[1]||"");
    const gf = parseBracketRounds(sections[2]||"");
    return { doubleElim: true, upper, lower, grandFinal: gf.length ? gf[0] : [] };
  }
  return parseBracketRounds(text);
}

function drawLayoutBracket(W,H,c,scale,pad,maxW,acc,hi){
  const eyeF = Math.round(22*scale);
  const titleF = Math.round((state.format==="story"||state.reel?72:60)*scale*state.titleScale);
  const titleLH = Math.round(titleF*1.06);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);
  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);

  const accentLineH = Math.round(4*scale);
  const gapLine = Math.round(13*scale);
  let y = Math.round(H*0.085 + 80*scale) + dragOffset;
  ctx.fillStyle = acc;
  ctx.fillRect(pad, y, Math.round(54*scale), accentLineH);
  y += accentLineH + gapLine;
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.18);
    y += eyeF + Math.round(10*scale);
  }
  ctx.textBaseline = "top";
  for(const ln of titleLines){ drawRichLine(ln, pad, y, titleFont, hi, "#ffffff"); y += titleLH; }

  const parsed = parseBracket(c.bracket);
  const isDE = parsed && parsed.doubleElim;
  const rounds = isDE ? null : (Array.isArray(parsed) ? parsed : []);
  if(!isDE && (!rounds || !rounds.length)){ lastTextBox=null; return; }

  const RG = Math.round(40*scale);
  const cardR = Math.round(8*scale);
  const rowPad = Math.round(10*scale);
  const fmtBlockH = (c.bracketFormat||"").trim() ? Math.round(36*scale) : 0;

  // shared card drawing helper
  const drawMatchCard = (rx, my, MW, MH, match, isFinal, teamF, scoreF, logoSize) => {
    const halfH = MH/2;
    const cardBg = isFinal ? rgba(acc, 0.06) : "rgba(255,255,255,0.04)";
    const cardStroke = isFinal ? rgba(acc, 0.30) : "rgba(255,255,255,0.08)";
    ctx.fillStyle = cardBg;
    roundRectPath(rx, my, MW, MH, cardR); ctx.fill();
    ctx.strokeStyle = cardStroke; ctx.lineWidth = Math.max(1, (isFinal?2:1.5)*scale);
    roundRectPath(rx, my, MW, MH, cardR); ctx.stroke();
    if(match.winner){
      const winY = match.winner==="A" ? my : my+halfH;
      ctx.fillStyle = rgba(acc, 0.15);
      ctx.save(); ctx.beginPath(); roundRectPath(rx, my, MW, MH, cardR); ctx.clip();
      ctx.fillRect(rx, winY, MW, halfH); ctx.restore();
      ctx.fillStyle = acc;
      ctx.save(); ctx.beginPath(); roundRectPath(rx, my, MW, MH, cardR); ctx.clip();
      ctx.fillRect(rx, winY, Math.round(3*scale), halfH); ctx.restore();
    }
    ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = Math.max(1, scale);
    ctx.beginPath(); ctx.moveTo(rx, my+halfH); ctx.lineTo(rx+MW, my+halfH); ctx.stroke();
    const drawTeamRow = (team, isWinner, rowY) => {
      const alpha = isWinner || match.winner===null ? 1 : 0.4;
      ctx.globalAlpha = alpha;
      const logoImg = findTeamLogo(team.name);
      const textX = rx + rowPad + (logoImg ? logoSize + Math.round(8*scale) : 0);
      if(logoImg){ ctx.drawImage(logoImg, rx+rowPad, rowY+(halfH-logoSize)/2, logoSize, logoSize); }
      ctx.font = `600 ${teamF}px Manrope, sans-serif`;
      ctx.fillStyle = isWinner ? "#ffffff" : "#dfdfdf";
      ctx.textBaseline = "middle"; ctx.textAlign = "left";
      const maxNameW = MW - rowPad*2 - (logoImg ? logoSize+Math.round(8*scale) : 0) - Math.round(36*scale);
      let name = team.name;
      while(ctx.measureText(name).width > maxNameW && name.length > 3) name = name.slice(0,-1);
      if(name !== team.name) name += "…";
      ctx.fillText(name, textX, rowY + halfH/2);
      ctx.font = `800 ${scoreF}px Sora, sans-serif`;
      ctx.fillStyle = isWinner ? acc : "#6b7882";
      ctx.textAlign = "right";
      ctx.fillText(String(team.score), rx+MW-rowPad, rowY+halfH/2);
      ctx.textAlign = "left"; ctx.globalAlpha = 1;
    };
    drawTeamRow(match.teamA, match.winner==="A", my);
    drawTeamRow(match.teamB, match.winner==="B", my+halfH);
  };

  // shared sub-bracket drawing: returns { yPositions, MW, MH } for connector use
  const drawSubBracket = (subRounds, regionTop, regionBottom, bracketLeft, MW, isFinalBracket, deMode) => {
    const availH = regionBottom - regionTop;
    const matchTop = regionTop;
    const numR = subRounds.length;
    const baseIdx = subRounds.reduce((best,r,i) => r.length >= subRounds[best].length ? i : best, 0);
    const baseCount = subRounds[baseIdx].length;
    const maxMH = Math.round((deMode ? 62 : 82)*scale);
    const minMH = Math.round((deMode ? 40 : 48)*scale);
    const idealMH = Math.floor(availH * 0.85 / Math.max(1, baseCount));
    const MH = Math.min(maxMH, Math.max(minMH, idealMH));
    const remainH = availH - baseCount * MH;
    const MG = Math.max(Math.round(6*scale), Math.floor(remainH / Math.max(1, baseCount-1)));
    const teamF = Math.min(Math.round(22*scale), Math.max(Math.round(14*scale), Math.round(MH*0.30)));
    const scoreF = Math.round(teamF * 1.1);
    const logoSize = Math.min(Math.round(24*scale), Math.max(Math.round(14*scale), Math.round(MH*0.32)));

    const yPos = subRounds.map(()=>[]);
    const baseBlockH = baseCount * MH + (baseCount-1) * MG;
    const baseOff = (availH - baseBlockH) / 2;
    yPos[baseIdx] = subRounds[baseIdx].map((_,i) => matchTop + baseOff + i*(MH+MG));
    for(let r=baseIdx+1; r<numR; r++){
      const prev = subRounds[r-1]; const curr = subRounds[r];
      if(curr.length === prev.length){
        for(let m=0;m<curr.length;m++) yPos[r][m] = yPos[r-1][m];
      } else if(curr.length===1 && prev.length>=1){
        yPos[r][0] = (yPos[r-1][0] + yPos[r-1][prev.length-1]) / 2;
      } else {
        for(let m=0;m<curr.length;m++){
          const f1=m*2, f2=m*2+1;
          if(f2<prev.length) yPos[r][m] = (yPos[r-1][f1]+yPos[r-1][f2])/2;
          else if(f1<prev.length) yPos[r][m] = yPos[r-1][f1];
          else yPos[r][m] = matchTop + m*(MH+MG);
        }
      }
    }
    for(let r=baseIdx-1; r>=0; r--){
      const next = subRounds[r+1]; const curr = subRounds[r];
      if(curr.length === next.length){
        for(let m=0;m<curr.length;m++) yPos[r][m] = yPos[r+1][m];
      } else {
        for(let m=0;m<curr.length;m++){
          const target = Math.floor(m/2);
          if(target<next.length){
            const ny = yPos[r+1][target];
            yPos[r][m] = m%2===0 ? ny-(MH+MG)/2 : ny+(MH+MG)/2;
          } else yPos[r][m] = matchTop + m*(MH+MG);
        }
      }
    }

    // connectors
    ctx.lineWidth = Math.max(1, 1.5*scale);
    for(let r=0; r<numR-1; r++){
      const fromX = bracketLeft + r*(MW+RG)+MW;
      const toX = bracketLeft + (r+1)*(MW+RG);
      const midX = fromX + RG/2;
      const curr = subRounds[r]; const next = subRounds[r+1];
      const sameSize = curr.length === next.length;
      for(let m=0;m<curr.length;m++){
        const fromY = yPos[r][m]+MH/2;
        const targetM = sameSize ? m : Math.floor(m/2);
        if(targetM>=next.length) continue;
        const isTop = m%2===0;
        const toY = yPos[r+1][targetM] + (sameSize ? MH/2 : (isTop ? MH*0.25 : MH*0.75));
        ctx.strokeStyle = rgba(acc, curr[m].winner ? 0.35 : 0.15);
        ctx.beginPath(); ctx.moveTo(fromX, fromY); ctx.lineTo(midX, fromY);
        ctx.lineTo(midX, toY); ctx.lineTo(toX, toY); ctx.stroke();
      }
    }
    // cards
    for(let r=0; r<numR; r++){
      const rx = bracketLeft + r*(MW+RG);
      const isF = isFinalBracket && r===numR-1;
      for(let m=0; m<subRounds[r].length; m++){
        drawMatchCard(rx, yPos[r][m], MW, MH, subRounds[r][m], isF, teamF, scoreF, logoSize);
      }
    }
    return { yPos, MH, teamF, scoreF, logoSize };
  };

  if(isDE){
    // ── DOUBLE ELIMINATION ──
    const upper = parsed.upper;
    const lower = parsed.lower;
    const gf = parsed.grandFinal;
    const uRounds = upper.length;
    const lRounds = lower.length;
    const maxCols = Math.max(uRounds, lRounds) + (gf.length ? 1 : 0);
    const totalGapW = (maxCols-1)*RG;
    const MW = Math.min(Math.round(220*scale), Math.floor((maxW - totalGapW) / maxCols));
    const totalBracketW = maxCols * MW + (maxCols-1) * RG;
    const bracketLeft = (W - totalBracketW) / 2;

    const sectionLabelF = Math.round(13*scale);
    const sectionLabelH = Math.round(22*scale);
    const bracketTop = y + Math.round(30*scale);
    const bracketBottom = H - pad - fmtBlockH - Math.round(20*scale);
    const totalH = bracketBottom - bracketTop;

    const uMaxCol = Math.max(...upper.map(r => r.length));
    const lMaxCol = Math.max(...lower.map(r => r.length));
    const uRatio = uMaxCol / Math.max(1, uMaxCol + lMaxCol);
    const dividerGap = Math.round(40*scale);
    const dividerY = bracketTop + (totalH - dividerGap) * Math.max(0.30, Math.min(0.72, uRatio)) + dividerGap/2;

    // upper section label
    ctx.font = `700 ${sectionLabelF}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = rgba(acc, 0.5); ctx.textBaseline = "top";
    drawSpaced("UPPER BRACKET", pad, bracketTop, sectionLabelF*0.08);

    // upper region (below label)
    const upperTop = bracketTop + sectionLabelH;
    const upperBottom = dividerY - Math.round(24*scale);
    const uResult = drawSubBracket(upper, upperTop, upperBottom, bracketLeft, MW, false, true);

    // divider
    ctx.strokeStyle = rgba(acc, 0.12); ctx.lineWidth = Math.max(1, scale);
    ctx.beginPath(); ctx.moveTo(pad, dividerY); ctx.lineTo(W-pad, dividerY); ctx.stroke();

    // lower section label
    ctx.font = `700 ${sectionLabelF}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = rgba(acc, 0.5); ctx.textBaseline = "top";
    drawSpaced("LOWER BRACKET", pad, dividerY + Math.round(14*scale), sectionLabelF*0.08);

    // lower region (below label)
    const lowerTop = dividerY + Math.round(14*scale) + sectionLabelH;
    const lowerBottom = gf.length ? bracketBottom - Math.round(10*scale) : bracketBottom;
    const lResult = drawSubBracket(lower, lowerTop, lowerBottom, bracketLeft, MW, false, true);

    // drop connectors: UB losers fall into LB
    // Standard mapping: UB round i losers → LB round (i*2) for i>0, UB round 0 → LB round 0
    ctx.save();
    ctx.setLineDash([Math.round(4*scale), Math.round(4*scale)]);
    ctx.lineWidth = Math.max(1, scale);
    for(let r=0; r<uRounds; r++){
      const lbTarget = r === 0 ? 0 : Math.min(r * 2 - 1, lRounds - 1);
      if(lbTarget >= lRounds) continue;
      const ubX = bracketLeft + r*(MW+RG);
      const ubMidX = ubX + MW/2;
      for(let m=0; m<upper[r].length; m++){
        if(!uResult.yPos[r] || uResult.yPos[r][m] === undefined) continue;
        const ubBottomY = uResult.yPos[r][m] + uResult.MH;
        // find target LB match
        const lbMatchIdx = r === 0 ? Math.floor(m / 2) : (m < (lower[lbTarget]||[]).length ? m : 0);
        if(!lResult.yPos[lbTarget] || lResult.yPos[lbTarget][lbMatchIdx] === undefined) continue;
        const lbTopY = lResult.yPos[lbTarget][lbMatchIdx];
        const lbX = bracketLeft + lbTarget*(MW+RG) + MW/2;
        ctx.strokeStyle = rgba(acc, 0.12);
        ctx.beginPath();
        ctx.moveTo(ubMidX, ubBottomY);
        ctx.lineTo(ubMidX, dividerY);
        ctx.lineTo(lbX, dividerY);
        ctx.lineTo(lbX, lbTopY);
        ctx.stroke();
      }
    }
    ctx.restore();

    // grand final
    if(gf.length){
      const gfCol = maxCols - 1;
      const gfX = bracketLeft + gfCol * (MW + RG);
      const gfMH = Math.round(78*scale);
      const gfY = bracketTop + totalH/2 - gfMH/2;
      const gfTeamF = Math.min(Math.round(22*scale), Math.round(gfMH*0.30));
      const gfScoreF = Math.round(gfTeamF*1.1);
      const gfLogoSize = Math.min(Math.round(24*scale), Math.round(gfMH*0.32));

      // connectors from UB final and LB final to GF
      ctx.lineWidth = Math.max(1, 1.5*scale);
      if(uResult.yPos.length && uResult.yPos[uRounds-1] && uResult.yPos[uRounds-1].length){
        const ubLastX = bracketLeft + (uRounds-1)*(MW+RG) + MW;
        const ubLastY = uResult.yPos[uRounds-1][0] + uResult.MH/2;
        const midX = ubLastX + RG/2;
        ctx.strokeStyle = rgba(acc, 0.2);
        ctx.beginPath(); ctx.moveTo(ubLastX, ubLastY); ctx.lineTo(midX, ubLastY);
        ctx.lineTo(midX, gfY + gfMH*0.25); ctx.lineTo(gfX, gfY + gfMH*0.25); ctx.stroke();
      }
      if(lResult.yPos.length && lResult.yPos[lRounds-1] && lResult.yPos[lRounds-1].length){
        const lbLastX = bracketLeft + (lRounds-1)*(MW+RG) + MW;
        const lbLastY = lResult.yPos[lRounds-1][0] + lResult.MH/2;
        const midX = lbLastX + RG/2;
        ctx.strokeStyle = rgba(acc, 0.2);
        ctx.beginPath(); ctx.moveTo(lbLastX, lbLastY); ctx.lineTo(midX, lbLastY);
        ctx.lineTo(midX, gfY + gfMH*0.75); ctx.lineTo(gfX, gfY + gfMH*0.75); ctx.stroke();
      }

      drawMatchCard(gfX, gfY, MW, gfMH, gf[0], true, gfTeamF, gfScoreF, gfLogoSize);

      // winner label
      if(gf[0].winner){
        const winnerName = gf[0].winner==="A" ? gf[0].teamA.name : gf[0].teamB.name;
        const champLabelF = Math.round(13*scale);
        const champNameF = Math.round(28*scale);
        const champY = gfY + gfMH + Math.round(12*scale);
        ctx.font = `600 ${champLabelF}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = "#6b7882"; ctx.textBaseline = "top"; ctx.textAlign = "center";
        drawSpaced("QUALIFIÉ", gfX+MW/2 - ctx.measureText("QUALIFIÉ").width/2, champY, champLabelF*0.2);
        ctx.font = `800 ${champNameF}px Sora, sans-serif`;
        ctx.fillStyle = acc; ctx.textAlign = "center";
        ctx.fillText(winnerName, gfX+MW/2, champY+champLabelF+Math.round(6*scale));
        ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      }
    }
  } else {
    // ── SINGLE ELIMINATION (original) ──
    const numRounds = rounds.length;
    const bracketTop = y + Math.round(44*scale);
    const championBlockH = Math.round(70*scale);
    const bracketBottom = H - pad - fmtBlockH - championBlockH;
    const totalGapW = (numRounds-1)*RG;
    const MW = Math.min(Math.round(260*scale), Math.floor((maxW - totalGapW) / numRounds));
    const totalBracketW = numRounds * MW + (numRounds-1) * RG;
    const bracketLeft = (W - totalBracketW) / 2;
    drawSubBracket(rounds, bracketTop, bracketBottom, bracketLeft, MW, true, false);

    // champion label for single elim
    const lastR = rounds[rounds.length-1];
    if(lastR && lastR.length===1 && lastR[0].winner){
      const finalMatch = lastR[0];
      const winnerName = finalMatch.winner==="A" ? finalMatch.teamA.name : finalMatch.teamB.name;
      const finalRx = bracketLeft + (numRounds-1)*(MW+RG);
      const finalCx = finalRx + MW/2;
      const champLabelF = Math.round(14*scale);
      const champNameF = Math.round(32*scale);
      const champY = bracketBottom + Math.round(16*scale);
      ctx.font = `600 ${champLabelF}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = "#6b7882"; ctx.textBaseline = "top"; ctx.textAlign = "center";
      drawSpaced("CHAMPION", finalCx - ctx.measureText("CHAMPION").width/2, champY, champLabelF*0.2);
      ctx.font = `800 ${champNameF}px Sora, sans-serif`;
      ctx.fillStyle = acc; ctx.textAlign = "center";
      ctx.fillText(winnerName, finalCx, champY+champLabelF+Math.round(8*scale));
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    }
  }

  // footer format
  const fmt = (c.bracketFormat||"").trim();
  if(fmt){
    const fmtF = Math.round(18*scale);
    ctx.font = `500 ${fmtF}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = "#6b7882"; ctx.textAlign = "center"; ctx.textBaseline = "top";
    ctx.fillText(fmt, W/2, H - Math.round(80*scale));
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }
  lastTextBox = null;
}

// --- T17: Planning hebdomadaire (weekly calendar grid) ---
function parsePlanningEvents(text){
  const days = []; let current = null;
  (text||"").split("\n").forEach(line=>{
    line = line.trim(); if(!line) return;
    if(line.startsWith("##")){
      const parts = line.slice(2).trim().split(/\s+/);
      current = { abbr: parts[0]||"", date: parts[1]||"", events:[] };
      days.push(current);
    } else if(current){
      const m = line.match(/^(\d{1,2})[h:]?-(\d{1,2})[h:]?\s+(.+?)\s+(lol|cs2|val|rl|cod)$/i);
      if(m) current.events.push({ start:parseInt(m[1]), end:parseInt(m[2]), name:m[3].trim(), game:m[4].toLowerCase() });
    }
  });
  return days;
}
function drawLayoutPlanning(W,H,c,scale,pad,maxW,acc,hi){
  const eyeF = Math.round(20*scale);
  const titleF = Math.round((state.format==="story"||state.reel?52:44)*scale*state.titleScale);
  const titleLH = Math.round(titleF*1.08);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);

  const accentLineH = Math.round(3*scale);
  const gap = Math.round(10*scale);
  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  let y = Math.round(H*0.08 + 60*scale) + dragOffset;

  ctx.fillStyle = acc;
  ctx.fillRect(pad, y, Math.round(42*scale), accentLineH);
  y += accentLineH + gap;
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.16);
    y += eyeF + Math.round(6*scale);
  }
  ctx.textBaseline = "top";
  for(const ln of titleLines){ drawRichLine(ln, pad, y, titleFont, hi, "#ffffff"); y += titleLH; }

  const days = parsePlanningEvents(c.planningEvents);
  if(!days.length){ lastTextBox=null; return; }

  // Grid layout
  const legendH = Math.round(44*scale);
  const gridTop = y + Math.round(20*scale);
  const gridBottom = H - pad - legendH;
  const timeLabelW = Math.round(44*scale);
  const gridLeft = pad + timeLabelW;
  const gridRight = W - pad;
  const gridW = gridRight - gridLeft;
  const numCols = days.length;
  const colW = gridW / numCols;

  // Time range from data
  let minH = 24, maxH = 0;
  for(const day of days){
    for(const ev of day.events){
      minH = Math.min(minH, ev.start);
      const endH = ev.end <= ev.start ? ev.end + 24 : ev.end;
      maxH = Math.max(maxH, endH);
    }
  }
  minH = Math.max(0, Math.floor(minH/2)*2);
  maxH = Math.min(26, Math.ceil(maxH/2)*2 + 1);
  if(minH >= maxH){ minH = 12; maxH = 24; }
  const timeRange = maxH - minH;

  // Day headers
  const dayAbbrF = Math.round(20*scale);
  const dayDateF = Math.round(22*scale);
  const headerH = Math.round(44*scale);
  const headerY = gridTop;
  const bodyTop = gridTop + headerH;
  const bodyH = gridBottom - bodyTop;
  const pxPerHour = bodyH / timeRange;

  for(let i = 0; i < numCols; i++){
    const cx = gridLeft + i*colW + colW/2;
    ctx.font = `700 ${dayAbbrF}px Sora, sans-serif`;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center"; ctx.textBaseline = "top";
    ctx.fillText(days[i].abbr, cx, headerY);
    ctx.font = `400 ${dayDateF}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = "#6b7882";
    ctx.fillText(days[i].date, cx, headerY + dayAbbrF + Math.round(2*scale));
  }

  // Horizontal grid lines + time labels
  const timeF = Math.round(16*scale);
  for(let h = minH; h <= maxH; h += 2){
    const yPos = bodyTop + (h - minH) * pxPerHour;
    ctx.font = `400 ${timeF}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = "#4d5860";
    ctx.textAlign = "right"; ctx.textBaseline = "middle";
    ctx.fillText((h%24)+"h", gridLeft - Math.round(10*scale), yPos);
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = Math.max(1, scale);
    ctx.beginPath(); ctx.moveTo(gridLeft, yPos); ctx.lineTo(gridRight, yPos); ctx.stroke();
  }

  // Vertical column separators — visible lines between days
  const colGap = Math.round(6*scale);
  for(let i = 0; i <= numCols; i++){
    const x = gridLeft + i*colW;
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = Math.max(1, Math.round(1.5*scale));
    ctx.beginPath(); ctx.moveTo(x, headerY); ctx.lineTo(x, gridBottom); ctx.stroke();
  }

  // Event blocks — with side-by-side layout for overlapping events
  const blockInset = Math.round(7*scale);
  const blockGap = Math.round(3*scale);
  const blockR = Math.round(8*scale);
  const evNameF = Math.round(15*scale);
  const evTimeF = Math.round(13*scale);

  for(let i = 0; i < numCols; i++){
    const dayX = gridLeft + i*colW + blockInset;
    const dayW = colW - blockInset*2;
    const evts = days[i].events.map(ev => {
      const endH = ev.end <= ev.start ? ev.end + 24 : ev.end;
      return { ...ev, endH };
    }).sort((a,b) => a.start - b.start || a.endH - b.endH);

    // Assign sub-columns for overlapping events
    const placed = [];
    for(const ev of evts){
      let col = 0;
      while(placed.some(p => p.col === col && p.start < ev.endH && ev.start < p.endH)) col++;
      ev.subCol = col;
      placed.push({ col, start: ev.start, endH: ev.endH });
    }
    // Per-event: count how many concurrent columns in its overlap group
    for(const ev of evts){
      let maxInGroup = ev.subCol + 1;
      for(const other of evts){
        if(other.start < ev.endH && ev.start < other.endH){
          maxInGroup = Math.max(maxInGroup, other.subCol + 1);
        }
      }
      ev.groupCols = maxInGroup;
    }

    for(const ev of evts){
      const gc = GAME_COLORS[ev.game] || acc;
      const nCols = ev.groupCols;
      const bw = (dayW - (nCols-1)*blockGap) / nCols;
      const colX = dayX + ev.subCol * (bw + blockGap);
      const evTop = bodyTop + (ev.start - minH) * pxPerHour;
      const evBot = bodyTop + (ev.endH - minH) * pxPerHour;
      const evH = Math.max(evBot - evTop, Math.round(28*scale));

      // Block fill
      ctx.save();
      const bg = ctx.createLinearGradient(0, evTop, 0, evTop + evH);
      bg.addColorStop(0, rgba(gc, 0.18));
      bg.addColorStop(1, rgba(gc, 0.08));
      ctx.fillStyle = bg;
      roundRectPath(colX, evTop, bw, evH, blockR); ctx.fill();
      ctx.strokeStyle = rgba(gc, 0.30);
      ctx.lineWidth = Math.max(1, 1.5*scale);
      roundRectPath(colX, evTop, bw, evH, blockR); ctx.stroke();
      ctx.restore();

      // Text inside block — vertical when narrow
      const tp = Math.round(7*scale);
      const narrow = bw < Math.round(60*scale);

      if(narrow){
        // Vertical text mode
        const vNameF = Math.round(13*scale);
        const vTimeF = Math.round(11*scale);
        ctx.save();
        ctx.translate(colX + bw/2, evTop + tp);
        ctx.rotate(-Math.PI/2);
        // Name (reads bottom-to-top)
        ctx.font = `700 ${vNameF}px Sora, sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "right"; ctx.textBaseline = "middle";
        let name = ev.name;
        const availH = evH - tp*2;
        while(ctx.measureText(name).width > availH && name.length > 2) name = name.slice(0,-1);
        if(name !== ev.name) name = name.trim()+".";
        ctx.fillText(name, 0, 0);
        // Time below name
        const timeStr = (ev.endH - ev.start) <= 1 ? ev.start+"h" : ev.start+"~"+(ev.end%24)+"h";
        ctx.font = `500 ${vTimeF}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = rgba(gc, 0.85);
        ctx.fillText(timeStr, 0, vNameF + Math.round(2*scale));
        ctx.restore();
      } else {
        // Normal horizontal text
        const availW = bw - tp*2;
        const nameF2 = nCols >= 2 ? Math.round(13*scale) : evNameF;
        const timeF2 = nCols >= 2 ? Math.round(11*scale) : evTimeF;

        ctx.font = `700 ${nameF2}px Sora, sans-serif`;
        ctx.fillStyle = "#ffffff";
        ctx.textAlign = "left"; ctx.textBaseline = "top";
        let name = ev.name;
        while(ctx.measureText(name).width > availW && name.length > 2) name = name.slice(0,-1);
        if(name !== ev.name) name = name.trim()+".";
        ctx.fillText(name, colX + tp, evTop + tp);

        const timeStr = (ev.endH - ev.start) <= 1 ? ev.start+"h" : ev.start+"~"+(ev.end%24)+"h";
        ctx.font = `500 ${timeF2}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = rgba(gc, 0.85);
        if(evH > Math.round(38*scale)){
          ctx.fillText(timeStr, colX + tp, evTop + tp + nameF2 + Math.round(2*scale));
        }
      }

      // Game dot
      if(evH > Math.round(50*scale) && !narrow){
        const dotR = Math.round(3.5*scale);
        ctx.fillStyle = gc;
        ctx.beginPath();
        ctx.arc(colX + bw - tp - dotR, evTop + evH - tp - dotR, dotR, 0, Math.PI*2);
        ctx.fill();
      }
    }
  }

  // Legend at bottom
  const legendY = gridBottom + legendH/2 + Math.round(4*scale);
  const legendGames = [
    {key:"lol",label:"LoL"},{key:"cs2",label:"CS2"},{key:"val",label:"Valo"},{key:"rl",label:"RL"},{key:"cod",label:"CoD"}
  ];
  const legendF = Math.round(16*scale);
  const dotR = Math.round(5*scale);
  const itemGap = Math.round(30*scale);

  ctx.font = `500 ${legendF}px Manrope, sans-serif`;
  let totalLW = 0;
  for(const g of legendGames) totalLW += dotR*2 + Math.round(6*scale) + ctx.measureText(g.label).width;
  totalLW += (legendGames.length-1)*itemGap;

  let lx = W/2 - totalLW/2;
  for(const g of legendGames){
    ctx.fillStyle = GAME_COLORS[g.key];
    ctx.beginPath(); ctx.arc(lx+dotR, legendY, dotR, 0, Math.PI*2); ctx.fill();
    lx += dotR*2 + Math.round(6*scale);
    ctx.font = `500 ${legendF}px Manrope, sans-serif`;
    ctx.fillStyle = "#9aa7b0";
    ctx.textBaseline = "middle"; ctx.textAlign = "left";
    ctx.fillText(g.label, lx, legendY);
    lx += ctx.measureText(g.label).width + itemGap;
  }

  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  lastTextBox = null;
}

// ═══ SECTION: RENDER ═══
function render(){
  const [W,H] = state.reel ? FORMATS.story : FORMATS[state.format];
  if(cv.width!==W || cv.height!==H){ cv.width=W; cv.height=H; }
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = INK; ctx.fillRect(0,0,W,H);

  const item = cur();
  const tpl = curTpl();
  const showVideo = item && item.video && tpl === "post-video" && item.showBgImage !== false;
  const showImg = (item && item.img && item.showBgImage !== false) || showVideo;
  const framed = showImg && item.framedImage && !showVideo;
  if(showImg && !framed){
    if(tpl==="transfert") drawStripeBackground(W,H);
    drawSlideMedia(item, W, H, state.zoom);
    if(state.imgBright < 1){
      ctx.fillStyle = `rgba(0,0,0,${1 - state.imgBright})`;
      ctx.fillRect(0,0,W,H);
    }
    applyEdgeBlur(W,H);
  } else if(framed){
    drawBaseBackground(W,H);
    drawFramedImage(item, W, H, state.zoom);
    if(state.imgBright < 1){
      ctx.fillStyle = `rgba(0,0,0,${1 - state.imgBright})`;
      ctx.fillRect(0,0,W,H);
    }
  } else if(item){
    if(tpl==="breaking") drawBreakingBackground(W,H);
    else if(tpl==="transfert"){ drawBaseBackground(W,H); drawStripeBackground(W,H); }
    else drawBaseBackground(W,H);
  } else {
    drawBaseBackground(W,H);
    ctx.fillStyle = "#3a4c57";
    ctx.font = `600 ${Math.round(W*0.028)}px Manrope`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("Ajoute une image ou une slide texte", W/2, H/2);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }
  drawOverlay(W, H, { index: state.active, total: state.images.length }, item, showImg);
}

// ═══ SECTION: UPLOAD + SLIDES ═══
const fileInput = document.getElementById("file");
const drop = document.getElementById("drop");
drop.onclick = ()=> $("bgImageFile").click();
fileInput.onchange = e => addFiles(e.target.files);
drop.ondragover = e => { e.preventDefault(); drop.style.borderColor="var(--cyan)"; };
drop.ondragleave = ()=> drop.style.borderColor="";
drop.ondrop = e => { e.preventDefault(); drop.style.borderColor=""; addFiles(e.dataTransfer.files); };

function setActive(i){ state.active = i; refreshThumbs(); syncInputs(); render(); }

function updateSlideNav(){
  const total = state.images.length;
  const cur = state.active;
  if($("slideNavLabel")) $("slideNavLabel").textContent = total ? (cur+1)+" / "+total : "–";
  if($("prevSlide")) $("prevSlide").disabled = cur <= 0;
  if($("nextSlide")) $("nextSlide").disabled = cur >= total - 1;
}

function addFiles(files){
  const arr = [...files].filter(f=>f.type.startsWith("image/"));
  let pending = arr.length;
  if(!pending) return;
  arr.forEach(f=>{
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = ()=>{
      state.images.push(newSlide(img, f.name));
      if(--pending===0){ state.active = state.images.length-1; refreshThumbs(); syncInputs(); updateReelAvailability(); render(); }
    };
    img.src = URL.createObjectURL(f);
  });
}

function addTextSlide(tpl){
  state.images.push(newSlide(null, "Texte", tpl));
  state.active = state.images.length-1;
  refreshThumbs(); syncInputs(); updateReelAvailability(); render();
}

let dragSrc = null;
function refreshThumbs(){
  const box = document.getElementById("thumbs");
  box.innerHTML = "";
  state.images.forEach((it,i)=>{
    const t = document.createElement("div");
    t.className = "thumb"+(i===state.active?" active":"");
    const media = it.img ? `<img src="${it.img.src}">` : `<div class="thumb-text">Aa</div>`;
    t.innerHTML = media + `<span class="num">${i+1}</span><span class="x">×</span>`;
    t.onclick = ()=> setActive(i);
    t.querySelector(".x").onclick = (e)=>{ e.stopPropagation(); removeImage(i); };
    t.draggable = true;
    t.ondragstart = e=>{ dragSrc = i; t.classList.add("dragging"); e.dataTransfer.effectAllowed = "move"; };
    t.ondragend = ()=>{ t.classList.remove("dragging"); document.querySelectorAll(".thumb").forEach(x=>x.classList.remove("drop-target")); };
    t.ondragover = e=>{ e.preventDefault(); e.dataTransfer.dropEffect = "move"; if(dragSrc!==i) t.classList.add("drop-target"); };
    t.ondragleave = ()=> t.classList.remove("drop-target");
    t.ondrop = e=>{ e.preventDefault(); t.classList.remove("drop-target"); reorderSlides(dragSrc, i); };
    box.appendChild(t);
  });
  document.getElementById("slideHint").style.display = state.images.length>1 ? "block" : "none";
  updateSlideNav();
}
function reorderSlides(from, to){
  if(from==null || from===to) return;
  const moved = state.images.splice(from,1)[0];
  state.images.splice(to,0,moved);
  state.active = to;
  dragSrc = null;
  refreshThumbs(); syncInputs(); render();
}
function removeImage(i){
  state.images.splice(i,1);
  if(state.active>=state.images.length) state.active=Math.max(0,state.images.length-1);
  refreshThumbs(); syncInputs(); updateReelAvailability(); render();
}
function updateReelAvailability(){
  const t = document.getElementById("reelToggle");
  const hasVideo = state.images.some(s => s.video && s.template === "post-video");
  const ok = state.images.length>=2 || hasVideo;
  t.disabled = !ok;
  if(!ok && t.checked){ t.checked=false; setReel(false); }
}

// ═══ SECTION: SYNC INPUTS ═══
function syncInputs(){
  const it = cur();
  const has = !!it;
  const tpl = curTpl();
  ["eyebrow","title","desc","score"].forEach(id=>{ $(id).disabled = !has; });
  $("showDesc").disabled = !has; $("showScore").disabled = !has;
  $("eyebrow").value = has ? it.eyebrow : "";
  $("title").value   = has ? it.title : "";
  $("desc").value    = has ? it.desc : "";
  $("score").value   = has ? it.score : "";
  $("showDesc").checked  = has ? it.showDesc : true;
  $("showScore").checked = has ? it.showScore : false;
  $("scoreY").disabled = !has;
  $("scoreY").value = has ? (it.scoreY||0) : 0;
  $("scoreYV").textContent = has ? (it.scoreY||0) : 0;
  $("textY").disabled = !has;
  $("textY").value = has ? (it.textY||0) : 0;
  $("textYV").textContent = has ? (it.textY||0) : 0;
  $("contentSlideTag").textContent = has && state.images.length>1 ? `· slide ${state.active+1}` : "";

  if($("dur") && $("durAll")){
    const allMode = $("durAll").checked;
    const d = allMode ? state.dur : (has && it.dur ? it.dur : state.dur);
    $("dur").value = d;
    $("durV").textContent = d+"s";
    if($("durSlideTag")) $("durSlideTag").textContent = (!allMode && state.images.length>1) ? `· slide ${state.active+1}` : "";
  }

  if($("game") && $("gameAll")){
    const allMode = $("gameAll").checked;
    const g = allMode ? state.game : (has && it.game ? it.game : state.game);
    $("game").value = g;
    $("customRow").style.display = g==="custom" ? "flex" : "none";
    if($("gameSlideTag")) $("gameSlideTag").textContent = (!allMode && state.images.length>1) ? `· slide ${state.active+1}` : "";
  }

  // new fields
  if($("badge")) { $("badge").value = has ? (it.badge||"breaking") : "breaking"; $("badge").disabled = !has; }
  if($("signature")) { $("signature").value = has ? (it.signature||"") : ""; $("signature").disabled = !has; }
  if($("teamA")) { $("teamA").value = has ? (it.teamA||"") : ""; $("teamA").disabled = !has; }
  if($("teamB")) { $("teamB").value = has ? (it.teamB||"") : ""; $("teamB").disabled = !has; }
  if($("standings")) { $("standings").value = has ? (it.standings||"") : ""; $("standings").disabled = !has; }
  if($("relegationLine")) { $("relegationLine").value = has ? (it.relegationLine||0) : 0; $("relegationLineV").textContent = has ? (it.relegationLine||0) : 0; $("relegationLine").disabled = !has; }
  if($("stats")) { $("stats").value = has ? (it.stats||"") : ""; $("stats").disabled = !has; }
  if($("matches")) { $("matches").value = has ? (it.matches||"") : ""; $("matches").disabled = !has; }
  if($("footerText")) { $("footerText").value = has ? (it.footerText||"") : ""; $("footerText").disabled = !has; }
  if($("pollOptions")) { $("pollOptions").value = has ? (it.pollOptions||"") : ""; $("pollOptions").disabled = !has; }
  if($("pollWinner")) { $("pollWinner").value = has ? (it.pollWinner||0) : 0; $("pollWinnerV").textContent = has ? (it.pollWinner||0) : 0; $("pollWinner").disabled = !has; }
  if($("statHighlight")) { const sv = has ? (it.statHighlight||0) : 0; $("statHighlight").value = sv; $("statHighlightV").textContent = sv; $("statHighlight").disabled = !has; }
  if($("tiers")) { $("tiers").value = has ? (it.tiers||"") : ""; $("tiers").disabled = !has; }
  if($("playerName")) { $("playerName").value = has ? (it.playerName||"") : ""; $("playerName").disabled = !has; }
  if($("playerRole")) { $("playerRole").value = has ? (it.playerRole||"") : ""; $("playerRole").disabled = !has; }
  if($("transferBadge")) { $("transferBadge").value = has ? (it.transferBadge||"officiel") : "officiel"; $("transferBadge").disabled = !has; }
  if($("matchResult")) { $("matchResult").value = has ? (it.matchResult||"") : ""; $("matchResult").disabled = !has; }
  if($("mvpBadge")) { $("mvpBadge").value = has ? (it.mvpBadge||"mvp") : "mvp"; $("mvpBadge").disabled = !has; }
  if($("lineup")) { $("lineup").value = has ? (it.lineup||"") : ""; $("lineup").disabled = !has; }
  if($("lineupTeamRating")) { $("lineupTeamRating").value = has ? (it.lineupTeamRating||"") : ""; $("lineupTeamRating").disabled = !has; }
  if($("bracket")) { $("bracket").value = has ? (it.bracket||"") : ""; $("bracket").disabled = !has; }
  if($("bracketFormat")) { $("bracketFormat").value = has ? (it.bracketFormat||"") : ""; $("bracketFormat").disabled = !has; }
  if($("planningEvents")) { $("planningEvents").value = has ? (it.planningEvents||"") : ""; $("planningEvents").disabled = !has; }
  if($("lineupCountSeg")) { document.querySelectorAll("#lineupCountSeg button").forEach(b=>{ b.classList.toggle("on", parseInt(b.dataset.lc)===(has ? (it.lineupCount||5) : 5)); }); }
  if($("lineupPhotoCount")) { const n = has && it.lineupPhotos ? it.lineupPhotos.filter(Boolean).length : 0; $("lineupPhotoCount").textContent = n ? n+" photo"+(n>1?"s":"") : ""; }
  if($("showBgImage")) { $("showBgImage").checked = has ? (it.showBgImage !== false) : true; $("showBgImage").disabled = !has; }
  if($("framedImage")) { $("framedImage").checked = has ? !!it.framedImage : false; $("framedImage").disabled = !has; }
  if($("photoCredit")) { $("photoCredit").value = has ? (it.photoCredit||"") : ""; $("photoCredit").disabled = !has; }
  if($("bgImageClear")) { $("bgImageClear").style.display = (has && it.img) ? "" : "none"; }
  if($("frameY")) { $("frameY").value = has ? (it.frameY||0) : 0; $("frameYV").textContent = has ? (it.frameY||0) : 0; $("frameY").disabled = !has; }
  const showFrameY = has && !!it.framedImage;
  const frameYEl = document.getElementById("frameYRow");
  if(frameYEl) frameYEl.style.display = showFrameY ? "" : "none";
  if($("bgImageBtn")) { $("bgImageBtn").disabled = !has; }

  // template-specific field visibility
  const show = (id, vis) => { const el = document.getElementById(id); if(el) el.style.display = vis ? "" : "none"; };
  const hasImage = tpl!=="post-texte" && tpl!=="planning";
  show("scoreRow", tpl==="post-image" || tpl==="post-video" || tpl==="score");
  show("scoreYRow", tpl==="post-image" || tpl==="post-video" || tpl==="score");
  show("scoreCheckRow", tpl==="post-image" || tpl==="post-video");
  show("badgeRow", tpl==="breaking");
  show("signatureRow", tpl==="post-texte" || tpl==="breaking");
  show("teamRow", tpl==="score");
  show("gradientRow", tpl==="post-image" || tpl==="post-video" || tpl==="score" || tpl==="statistique" || tpl==="transfert");
  show("videoRow", tpl==="post-video");
  show("zoomRow", hasImage);
  show("imgBrightRow", hasImage);
  show("textYRow", true);
  show("resetView", hasImage);
  show("standingsRow", tpl==="classement");
  show("relegationRow", tpl==="classement");
  show("statsRow", tpl==="statistique" || tpl==="mvp");
  show("matchesRow", tpl==="programme");
  show("planningRow", tpl==="planning");
  show("footerRow", tpl==="programme" || tpl==="sondage" || tpl==="tierlist");
  show("pollRow", tpl==="sondage");
  show("tiersRow", tpl==="tierlist");
  show("playerNameRow", tpl==="citation" || tpl==="mvp");
  show("playerRoleRow", tpl==="citation");
  show("transferBadgeRow", tpl==="transfert");
  show("matchResultRow", tpl==="mvp");
  show("mvpBadgeRow", tpl==="mvp");
  show("lineupRow", tpl==="lineup");
  show("bracketRow", tpl==="bracket");
  show("bracketFormatRow", tpl==="bracket");

  // for score template, force showScore on
  if(tpl==="score" && has){
    it.showScore = true;
    $("showScore").checked = true;
  }

  // video loop management
  if(tpl === "post-video" && has && it.video && !it.video.paused){
    startVideoLoop();
  } else {
    stopVideoLoop();
  }
  if($("videoAudio")) $("videoAudio").checked = has && it.video ? !it.video.muted : false;

  // template buttons active state
  document.querySelectorAll("#tplGrid .tpl-btn").forEach(b=>{
    b.classList.toggle("on", b.dataset.tpl === tpl);
  });
}

// ═══ SECTION: BINDINGS ═══
const $ = id => document.getElementById(id);
function setField(k, v){ const it = cur(); if(it){ it[k] = v; render(); } }
$("eyebrow").oninput = e => setField("eyebrow", e.target.value);
$("title").oninput = e => setField("title", e.target.value);
$("desc").oninput = e => setField("desc", e.target.value);
$("showDesc").onchange = e => setField("showDesc", e.target.checked);
$("score").oninput = e => setField("score", e.target.value);
$("showScore").onchange = e => setField("showScore", e.target.checked);
$("scoreY").oninput = e => { const v=parseFloat(e.target.value); $("scoreYV").textContent=v; setField("scoreY", v); };
$("watermark").onchange = e => { state.watermark=e.target.checked; render(); };
$("addText").onclick = ()=> addTextSlide();

// template-specific fields
if($("badge")) $("badge").onchange = e => setField("badge", e.target.value);
if($("signature")) $("signature").oninput = e => setField("signature", e.target.value);
if($("teamA")) $("teamA").oninput = e => setField("teamA", e.target.value);
if($("teamB")) $("teamB").oninput = e => setField("teamB", e.target.value);
if($("logoAFile")) $("logoAFile").onchange = e => { const f=e.target.files[0]; if(!f) return; const img=new Image(); img.onload=()=>{ setField("logoA", img); }; img.src=URL.createObjectURL(f); };
if($("logoBFile")) $("logoBFile").onchange = e => { const f=e.target.files[0]; if(!f) return; const img=new Image(); img.onload=()=>{ setField("logoB", img); }; img.src=URL.createObjectURL(f); };
if($("videoFile")) $("videoFile").onchange = e => {
  const f = e.target.files[0]; if(!f) return;
  const it = cur(); if(!it) return;
  const vid = document.createElement("video");
  vid.crossOrigin = "anonymous"; vid.muted = true; vid.loop = true; vid.playsInline = true;
  vid.onloadeddata = ()=>{
    it.video = vid; it.videoFile = f; it.showBgImage = true;
    const p = vid.play();
    if(p && p.catch) p.catch(()=>{});
    startVideoLoop(); updateReelAvailability(); render();
  };
  vid.src = URL.createObjectURL(f);
};
if($("videoPlayPause")) $("videoPlayPause").onclick = ()=>{
  const it = cur(); if(!it || !it.video) return;
  if(it.video.paused){ it.video.play(); startVideoLoop(); $("videoPlayPause").textContent = "⏸ Pause"; }
  else { it.video.pause(); stopVideoLoop(); render(); $("videoPlayPause").textContent = "▶ Play"; }
};
if($("videoAudio")) $("videoAudio").onchange = e => {
  const it = cur(); if(!it || !it.video) return;
  it.video.muted = !e.target.checked;
};
if($("standings")) $("standings").oninput = e => setField("standings", e.target.value);
if($("relegationLine")) $("relegationLine").oninput = e => { const v=parseInt(e.target.value)||0; $("relegationLineV").textContent=v; setField("relegationLine", v); };
if($("stats")) $("stats").oninput = e => setField("stats", e.target.value);
if($("matches")) $("matches").oninput = e => setField("matches", e.target.value);
if($("footerText")) $("footerText").oninput = e => setField("footerText", e.target.value);
if($("pollOptions")) $("pollOptions").oninput = e => setField("pollOptions", e.target.value);
if($("pollWinner")) $("pollWinner").oninput = e => { const v=parseInt(e.target.value)||0; $("pollWinnerV").textContent=v; setField("pollWinner", v); };
if($("statHighlight")) $("statHighlight").oninput = e => { const v=parseInt(e.target.value)||0; $("statHighlightV").textContent=v; setField("statHighlight", v); };
if($("tiers")) $("tiers").oninput = e => setField("tiers", e.target.value);
if($("playerName")) $("playerName").oninput = e => setField("playerName", e.target.value);
if($("playerRole")) $("playerRole").oninput = e => setField("playerRole", e.target.value);
if($("transferBadge")) $("transferBadge").onchange = e => setField("transferBadge", e.target.value);
if($("matchResult")) $("matchResult").oninput = e => setField("matchResult", e.target.value);
if($("mvpBadge")) $("mvpBadge").onchange = e => setField("mvpBadge", e.target.value);
if($("photoCredit")) $("photoCredit").oninput = e => setField("photoCredit", e.target.value);
if($("lineup")) $("lineup").oninput = e => setField("lineup", e.target.value);
if($("lineupTeamRating")) $("lineupTeamRating").oninput = e => setField("lineupTeamRating", e.target.value);
if($("bracket")) $("bracket").oninput = e => setField("bracket", e.target.value);
if($("bracketFormat")) $("bracketFormat").oninput = e => setField("bracketFormat", e.target.value);

// ── Bracket Builder ──
(function(){
  const teamsEl = $("bracketTeams");
  const deEl = $("bracketDoubleElim");
  const genBtn = $("bracketGenerate");
  const matchesEl = $("bracketMatches");
  if(!teamsEl || !genBtn || !matchesEl) return;

  function getTeamLogoURL(name){
    const img = findTeamLogo(name);
    return img ? img.src : null;
  }

  function buildRounds(names){
    const rounds = [];
    let curr = [];
    for(let i=0; i<names.length; i+=2){
      const a = names[i];
      const b = (i+1 < names.length) ? names[i+1] : "BYE";
      curr.push({ a, b, sa: 0, sb: 0, bye: b === "BYE" });
    }
    rounds.push(curr);
    let prevCount = curr.length;
    while(prevCount > 1){
      const next = [];
      for(let i=0; i<prevCount; i+=2){
        next.push({ a: "TBD", b: "TBD", sa: 0, sb: 0 });
      }
      rounds.push(next);
      prevCount = next.length;
    }
    return rounds;
  }

  function generateBracket(){
    const raw = teamsEl.value;
    const hasSeparator = raw.includes("---");
    if(hasSeparator && deEl) deEl.checked = true;
    const isDE = deEl && deEl.checked;

    let ubNames, lbNames = [];
    if(isDE && hasSeparator){
      const parts = raw.split(/^---$/m);
      ubNames = (parts[0]||"").split("\n").map(s=>s.trim()).filter(Boolean);
      lbNames = (parts[1]||"").split("\n").map(s=>s.trim()).filter(Boolean);
    } else {
      ubNames = raw.split("\n").map(s=>s.trim()).filter(Boolean);
    }
    if(ubNames.length < 2) return;

    const ubRounds = buildRounds(ubNames);

    let lbRounds = [];
    if(isDE){
      if(lbNames.length >= 2){
        lbRounds = buildRounds(lbNames);
      } else {
        const ubR = ubRounds.length;
        for(let i = 0; i < (ubR - 1) * 2; i++){
          const count = Math.max(1, Math.ceil(ubRounds[0].length / Math.pow(2, Math.floor(i/2 + 1))));
          const round = [];
          for(let m = 0; m < count; m++) round.push({ a: "TBD", b: "TBD", sa: 0, sb: 0 });
          lbRounds.push(round);
        }
      }
    }

    // store in slide
    const it = cur();
    if(it){
      it._ubRounds = ubRounds;
      it._lbRounds = lbRounds;
      it._isDE = isDE;
    }

    renderMatchInputs();
    syncBracketText();
  }

  function syncBracketText(){
    const it = cur();
    if(!it || !it._ubRounds) return;
    const ub = it._ubRounds;
    const lb = it._lbRounds || [];
    const isDE = it._isDE;

    let lines = [];
    ub.forEach((round, ri) => {
      if(ri > 0) lines.push("");
      round.forEach(m => {
        if(m.bye) return;
        lines.push(m.a + " " + m.sa);
        lines.push(m.b + " " + m.sb);
      });
    });

    if(isDE && lb.length){
      lines.push("---");
      lb.forEach((round, ri) => {
        if(ri > 0) lines.push("");
        round.forEach(m => {
          lines.push(m.a + " " + m.sa);
          lines.push(m.b + " " + m.sb);
        });
      });
      // grand final
      lines.push("---");
      const ubFinal = ub[ub.length-1];
      const lbFinal = lb[lb.length-1];
      const gfA = (ubFinal && ubFinal[0]) ? (getWinner(ubFinal[0]) || "TBD") : "TBD";
      const gfB = (lbFinal && lbFinal[0]) ? (getWinner(lbFinal[0]) || "TBD") : "TBD";
      const gfSa = it._gfSa || 0;
      const gfSb = it._gfSb || 0;
      lines.push(gfA + " " + gfSa);
      lines.push(gfB + " " + gfSb);
    }

    const text = lines.join("\n");
    $("bracket").value = text;
    setField("bracket", text);
  }

  function getWinner(m){
    if(m.bye) return m.a === "BYE" ? m.b : m.a;
    if(m.sa > m.sb) return m.a;
    if(m.sb > m.sa) return m.b;
    return null;
  }

  function advanceRounds(rounds){
    for(let r = 0; r < rounds.length - 1; r++){
      const curr = rounds[r];
      const next = rounds[r+1];
      for(let m = 0; m < curr.length; m++){
        const w = getWinner(curr[m]);
        const nextMi = Math.floor(m / 2);
        if(nextMi >= next.length) continue;
        const slot = m % 2 === 0 ? "a" : "b";
        next[nextMi][slot] = w || "TBD";
      }
    }
  }

  function getLoser(m){
    if(m.bye) return null;
    const w = getWinner(m);
    if(!w) return null;
    return w === m.a ? m.b : m.a;
  }

  function advanceLB(lb){
    for(let r = 0; r < lb.length - 1; r++){
      const curr = lb[r];
      const next = lb[r+1];
      const sameSize = curr.length === next.length;
      for(let m = 0; m < curr.length; m++){
        const w = getWinner(curr[m]);
        if(sameSize){
          if(next[m]) next[m].a = w || "TBD";
        } else {
          const ni = Math.floor(m / 2);
          const slot = m % 2 === 0 ? "a" : "b";
          if(ni < next.length) next[ni][slot] = w || "TBD";
        }
      }
    }
  }

  function advanceWinners(it){
    if(!it._ubRounds) return;
    const ub = it._ubRounds;
    const lb = it._lbRounds || [];

    advanceRounds(ub);

    if(lb.length){
      for(let r = 0; r < ub.length; r++){
        for(let m = 0; m < ub[r].length; m++){
          const loser = getLoser(ub[r][m]);
          if(!loser || loser === "TBD" || loser === "BYE") continue;
          if(r === 0){
            const li = Math.floor(m / 2);
            const slot = m % 2 === 0 ? "a" : "b";
            if(lb[0] && lb[0][li]) lb[0][li][slot] = loser;
          } else {
            const lbR = 2 * r - 1;
            if(lb[lbR] && lb[lbR][m]) lb[lbR][m].b = loser;
          }
        }
      }
      advanceLB(lb);
    }
  }

  function renderMatchInputs(){
    const it = cur();
    if(!it || !it._ubRounds){ matchesEl.innerHTML = ""; return; }
    const ub = it._ubRounds;
    const lb = it._lbRounds || [];
    const isDE = it._isDE;
    let html = "";

    function matchHTML(section, ri, mi, m){
      if(m.bye) return "";
      const logoA = getTeamLogoURL(m.a);
      const logoB = getTeamLogoURL(m.b);
      const wA = m.sa > m.sb ? " winner" : (m.sb > m.sa ? " loser" : "");
      const wB = m.sb > m.sa ? " winner" : (m.sa > m.sb ? " loser" : "");
      return `<div class="bk-match">
        <div class="bk-team${wA}">${logoA ? `<img src="${logoA}">` : ""}<span class="bk-name">${m.a}</span></div>
        <input class="bk-score" type="number" min="0" value="${m.sa}" data-sec="${section}" data-ri="${ri}" data-mi="${mi}" data-side="a">
        <div class="bk-vs"></div>
        <input class="bk-score" type="number" min="0" value="${m.sb}" data-sec="${section}" data-ri="${ri}" data-mi="${mi}" data-side="b">
        <div class="bk-team${wB}" style="justify-content:flex-end">${logoB ? `<img src="${logoB}">` : ""}<span class="bk-name">${m.b}</span></div>
      </div>`;
    }

    // upper bracket
    if(isDE) html += `<div class="bk-section"><div class="bk-section-label">Upper Bracket</div>`;
    ub.forEach((round, ri) => {
      const label = isDE ? `UB Round ${ri+1}` : (ub.length === 1 ? "Finale" : (ri === ub.length-1 ? "Finale" : (ri === ub.length-2 ? "Demis" : `Round ${ri+1}`)));
      html += `<div class="bk-round"><div class="bk-round-label">${label}</div>`;
      round.forEach((m, mi) => { html += matchHTML("ub", ri, mi, m); });
      html += `</div>`;
    });
    if(isDE) html += `</div>`;

    // lower bracket
    if(isDE && lb.length){
      html += `<hr class="bk-divider"><div class="bk-section"><div class="bk-section-label">Lower Bracket</div>`;
      lb.forEach((round, ri) => {
        html += `<div class="bk-round"><div class="bk-round-label">LB Round ${ri+1}</div>`;
        round.forEach((m, mi) => { html += matchHTML("lb", ri, mi, m); });
        html += `</div>`;
      });
      html += `</div>`;
      html += `<hr class="bk-divider"><div class="bk-section"><div class="bk-section-label">Grand Final</div>`;
      const ubFinalM = ub[ub.length-1] ? ub[ub.length-1][0] : null;
      const lbFinalM = lb[lb.length-1] ? lb[lb.length-1][0] : null;
      const gfA = ubFinalM ? (getWinner(ubFinalM) || "TBD") : "TBD";
      const gfB = lbFinalM ? (getWinner(lbFinalM) || "TBD") : "TBD";
      const gfSa = it._gfSa || 0;
      const gfSb = it._gfSb || 0;
      const logoGfA = getTeamLogoURL(gfA);
      const logoGfB = getTeamLogoURL(gfB);
      const wGfA = gfSa > gfSb ? " winner" : (gfSb > gfSa ? " loser" : "");
      const wGfB = gfSb > gfSa ? " winner" : (gfSa > gfSb ? " loser" : "");
      html += `<div class="bk-match">
        <div class="bk-team${wGfA}">${logoGfA ? `<img src="${logoGfA}">` : ""}<span class="bk-name">${gfA}</span></div>
        <input class="bk-score" type="number" min="0" value="${gfSa}" data-sec="gf" data-ri="0" data-mi="0" data-side="a">
        <div class="bk-vs"></div>
        <input class="bk-score" type="number" min="0" value="${gfSb}" data-sec="gf" data-ri="0" data-mi="0" data-side="b">
        <div class="bk-team${wGfB}" style="justify-content:flex-end">${logoGfB ? `<img src="${logoGfB}">` : ""}<span class="bk-name">${gfB}</span></div>
      </div></div>`;
    }

    matchesEl.innerHTML = html;

    // bind score inputs
    matchesEl.querySelectorAll(".bk-score").forEach(inp => {
      inp.oninput = () => {
        const sec = inp.dataset.sec;
        const ri = parseInt(inp.dataset.ri);
        const mi = parseInt(inp.dataset.mi);
        const side = inp.dataset.side;
        const val = parseInt(inp.value) || 0;
        if(sec === "ub" && it._ubRounds[ri] && it._ubRounds[ri][mi]){
          it._ubRounds[ri][mi][side === "a" ? "sa" : "sb"] = val;
        } else if(sec === "lb" && it._lbRounds[ri] && it._lbRounds[ri][mi]){
          it._lbRounds[ri][mi][side === "a" ? "sa" : "sb"] = val;
        } else if(sec === "gf"){
          it[side === "a" ? "_gfSa" : "_gfSb"] = val;
        }
        advanceWinners(it);
        syncBracketText();
        renderMatchInputs();
      };
    });
  }

  genBtn.onclick = generateBracket;

  // Rebuild match UI when switching to bracket slide
  const origSync = window.syncInputs;
  window.syncInputs = function(){
    origSync.apply(this, arguments);
    const it = cur();
    if(it && curTpl() === "bracket" && it._ubRounds){
      renderMatchInputs();
      // restore teams textarea
      if(it._bracketTeams) teamsEl.value = it._bracketTeams;
      if(deEl) deEl.checked = !!it._isDE;
    } else if(curTpl() === "bracket"){
      matchesEl.innerHTML = "";
    }
  };

  // Save teams text
  teamsEl.oninput = () => {
    const it = cur();
    if(it) it._bracketTeams = teamsEl.value;
  };
})();
if($("planningEvents")) $("planningEvents").oninput = e => setField("planningEvents", e.target.value);
if($("frameY")) $("frameY").oninput = e => { const v=parseFloat(e.target.value); $("frameYV").textContent=v; setField("frameY", v); };
document.querySelectorAll("#lineupCountSeg button").forEach(b=>{
  b.onclick = ()=>{
    document.querySelectorAll("#lineupCountSeg button").forEach(x=>x.classList.remove("on"));
    b.classList.add("on");
    setField("lineupCount", parseInt(b.dataset.lc));
  };
});
if($("lineupPhotoBtn")) $("lineupPhotoBtn").onclick = ()=> $("lineupPhotoInput").click();
if($("lineupPhotoInput")) $("lineupPhotoInput").onchange = e => {
  const it = cur(); if(!it) return;
  const files = Array.from(e.target.files);
  if(!files.length) return;
  it.lineupPhotos = [];
  let loaded = 0;
  files.forEach((f,i) => {
    const img = new Image();
    img.onload = ()=>{ it.lineupPhotos[i] = img; loaded++; if(loaded===files.length){ render(); if($("lineupPhotoCount")) $("lineupPhotoCount").textContent = loaded+" photo"+(loaded>1?"s":""); } };
    img.src = URL.createObjectURL(f);
  });
  e.target.value = "";
};

// background image per slide
if($("bgImageFile")) $("bgImageFile").onchange = e => {
  const f = e.target.files[0]; if(!f) return;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = ()=>{
    let it = cur();
    if(!it){ state.images.push(newSlide(img, f.name)); state.active = state.images.length-1; refreshThumbs(); updateReelAvailability(); }
    else { it.img = img; it.showBgImage = true; }
    syncInputs(); render();
  };
  img.src = URL.createObjectURL(f);
  e.target.value = "";
};
if($("bgImageClear")) $("bgImageClear").onclick = ()=> {
  const it = cur(); if(!it) return;
  it.img = null; it.showBgImage = false;
  syncInputs(); render();
};
if($("showBgImage")) $("showBgImage").onchange = e => { setField("showBgImage", e.target.checked); };
if($("framedImage")) $("framedImage").onchange = e => { setField("framedImage", e.target.checked); };

// template switching (per-slide)
document.querySelectorAll("#tplGrid .tpl-btn").forEach(b=>{
  b.onclick = ()=>{
    const tpl = b.dataset.tpl;
    const it = cur();
    if(it){
      it.template = tpl;
      syncInputs(); render();
    } else {
      // no slide yet — create one with this template
      addTextSlide(tpl);
    }
  };
});

// Folder import (JSON + images)
if($("folderImport")) $("folderImport").onclick = ()=> $("folderInput").click();
if($("folderInput")) $("folderInput").onchange = e => {
  const files = Array.from(e.target.files); if(!files.length) return;
  const jsonFile = files.find(f => f.name.endsWith(".json"));
  if(!jsonFile){ alert("Aucun fichier JSON trouvé dans le dossier."); return; }
  const imageFiles = files.filter(f => /\.(jpe?g|png|webp|gif|bmp|avif)$/i.test(f.name));
  const reader = new FileReader();
  reader.onload = ev => {
    try{
      const data = JSON.parse(ev.target.result);
      applyJsonPreset(data, imageFiles);
    }catch(err){ alert("Erreur de lecture JSON : " + err.message); }
  };
  reader.readAsText(jsonFile);
  e.target.value = "";
};

// ZIP import (JSON + images)
if($("zipImport")) $("zipImport").onclick = ()=> $("zipInput").click();
if($("zipInput")) $("zipInput").onchange = async e => {
  const file = e.target.files[0]; if(!file) return;
  if(typeof JSZip === "undefined"){ alert("JSZip non chargé."); return; }
  try{
    const zip = await JSZip.loadAsync(file);
    const entries = Object.values(zip.files).filter(f => !f.dir);
    const jsonEntry = entries.find(f => f.name.replace(/.*\//, "").endsWith(".json"));
    if(!jsonEntry){ alert("Aucun fichier JSON trouvé dans le ZIP."); return; }
    const jsonText = await jsonEntry.async("string");
    const data = JSON.parse(jsonText);
    const imgEntries = entries.filter(f => /\.(jpe?g|png|webp|gif|bmp|avif)$/i.test(f.name));
    const imageFiles = await Promise.all(imgEntries.map(async entry => {
      const blob = await entry.async("blob");
      const name = entry.name.replace(/.*\//, "");
      return new File([blob], name, {type: blob.type || "image/jpeg"});
    }));
    applyJsonPreset(data, imageFiles);
  }catch(err){ alert("Erreur de lecture ZIP : " + err.message); }
  e.target.value = "";
};

// JSON-only import (no images)
if($("jsonImport")) $("jsonImport").onclick = ()=> $("jsonInput").click();
if($("jsonInput")) $("jsonInput").onchange = e => {
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try{
      const data = JSON.parse(ev.target.result);
      applyJsonPreset(data, []);
    }catch(err){ alert("Erreur de lecture JSON : " + err.message); }
  };
  reader.readAsText(file);
  e.target.value = "";
};

// Slide navigation buttons
if($("prevSlide")) $("prevSlide").onclick = ()=>{ if(state.active > 0) setActive(state.active - 1); };
if($("nextSlide")) $("nextSlide").onclick = ()=>{ if(state.active < state.images.length - 1) setActive(state.active + 1); };
updateSlideNav();

function applyJsonPreset(data, imageFiles){
  if(data.format && FORMATS[data.format]) {
    state.format = data.format;
    document.querySelectorAll("#formatSeg button").forEach(x=>{
      x.classList.toggle("on", x.dataset.fmt===data.format);
    });
  }
  if(data.game) {
    state.game = data.game;
    $("game").value = data.game;
    $("customRow").style.display = data.game==="custom"?"flex":"none";
    if(data.customColor){ state.customColor = data.customColor; $("customColor").value = data.customColor; }
    state.hiColor = accentColor();
  }
  if(data.watermark!=null){ state.watermark = data.watermark; $("watermark").checked = data.watermark; }
  if(data.gradient!=null){ state.gradient = data.gradient/100; $("gradient").value = data.gradient; $("gradientV").textContent = data.gradient+"%"; }
  if(data.titleSize!=null){ state.titleScale = data.titleSize/100; $("titleSize").value = data.titleSize; $("titleSizeV").textContent = data.titleSize+"%"; }
  if(data.descSize!=null){ state.descScale = data.descSize/100; $("descSize").value = data.descSize; $("descSizeV").textContent = data.descSize+"%"; }
  if(data.descColor!=null){ state.descColor = data.descColor/100; $("descColor").value = data.descColor; $("descColorV").textContent = data.descColor+"%"; }
  if(data.imgBright!=null){ state.imgBright = data.imgBright/100; $("imgBright").value = data.imgBright; $("imgBrightV").textContent = data.imgBright+"%"; }

  const imgMap = {};
  if(imageFiles && imageFiles.length){
    for(const f of imageFiles) imgMap[f.name.toLowerCase()] = f;
  }

  state.images = [];
  let pending = 0;
  const finalize = ()=>{
    state.active = 0;
    refreshThumbs(); syncInputs(); updateDimLabel(); updateReelAvailability(); render();
  };

  if(!data.slides || !data.slides.length){ finalize(); return; }

  for(let i = 0; i < data.slides.length; i++){
    const s = data.slides[i];
    const slide = newSlide(null, s.title ? s.title.slice(0,20) : "Slide", s.template);
    slide.eyebrow = s.eyebrow || "";
    slide.title = s.title || "";
    slide.desc = s.desc || "";
    slide.showDesc = s.showDesc !== false;
    slide.score = s.score || "";
    slide.showScore = s.showScore || false;
    slide.scoreY = s.scoreY || 0;
    slide.textY = s.textY || 0;
    slide.badge = s.badge || "breaking";
    slide.signature = s.signature || "";
    slide.teamA = s.teamA || "";
    slide.teamB = s.teamB || "";
    slide.standings = s.standings || "";
    slide.relegationLine = s.relegationLine || 0;
    slide.stats = s.stats || "";
    slide.matches = s.matches || "";
    slide.footerText = s.footerText || "";
    slide.pollOptions = s.pollOptions || "";
    slide.pollWinner = s.pollWinner || 0;
    slide.statHighlight = s.statHighlight || 0;
    slide.tiers = s.tiers || "";
    slide.playerName = s.playerName || "";
    slide.playerRole = s.playerRole || "";
    slide.transferBadge = s.transferBadge || "officiel";
    slide.matchResult = s.matchResult || "";
    slide.mvpBadge = s.mvpBadge || "mvp";
    slide.photoCredit = s.photoCredit || "";
    slide.showBgImage = s.showBgImage !== false;
    slide.framedImage = !!s.framedImage;
    slide.dur = s.dur || null;
    slide.game = s.game || null;
    slide.lineup = s.lineup || "";
    slide.lineupCount = s.lineupCount || 5;
    slide.lineupTeamRating = s.lineupTeamRating || "";
    slide.bracket = s.bracket || "";
    slide.bracketFormat = s.bracketFormat || "";
    slide.planningEvents = s.planningEvents || "";
    slide.frameY = s.frameY || 0;
    state.images.push(slide);

    const imgName = s.image;
    if(imgName){
      const file = imgMap[imgName.toLowerCase()];
      if(file){
        pending++;
        const idx = i;
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = ()=>{
          state.images[idx].img = img;
          state.images[idx].name = file.name;
          pending--;
          if(pending === 0) finalize();
        };
        img.onerror = ()=>{ pending--; if(pending === 0) finalize(); };
        img.src = URL.createObjectURL(file);
      }
    }
  }
  if(pending === 0) finalize();
}


$("game").onchange = e => {
  const v = e.target.value;
  if($("gameAll").checked){
    state.game = v;
    state.images.forEach(s => s.game = null);
  } else {
    const it = cur(); if(it) it.game = v;
  }
  $("customRow").style.display = v==="custom" ? "flex" : "none";
  state.hiColor = accentColor();
  const it = cur();
  if(it && !it.eyebrow && v!=="custom"){ it.eyebrow = GAME_LABELS[v]; $("eyebrow").value = it.eyebrow; }
  render();
};
$("gameAll").onchange = ()=>{
  if($("gameAll").checked){
    const v = $("game").value;
    state.game = v;
    state.images.forEach(s => s.game = null);
    render();
  }
};
$("customColor").oninput = e => { state.customColor=e.target.value; state.hiColor=accentColor(); render(); };

document.querySelectorAll("#formatSeg button").forEach(b=>{
  b.onclick = ()=>{
    document.querySelectorAll("#formatSeg button").forEach(x=>x.classList.remove("on"));
    b.classList.add("on");
    state.format = b.dataset.fmt;
    updateDimLabel(); render();
  };
});

$("reelToggle").onchange = e => setReel(e.target.checked);
function setReel(on){
  state.reel = on;
  $("reelGroup").classList.toggle("hide", !on);
  $("exportImage").classList.toggle("hide", on);
  $("exportReel").classList.toggle("hide", !on);
  document.querySelectorAll("#formatSeg button").forEach(x=>x.disabled = on);
  updateDimLabel(); render();
}

function bindSlider(id, key, fmt, scale){
  const el = $(id), out = $(id+"V");
  el.oninput = ()=>{ state[key] = parseFloat(el.value)*scale; out.textContent = fmt(parseFloat(el.value)); render(); };
}
bindSlider("gradient","gradient", v=>v+"%", 0.01);
bindSlider("titleSize","titleScale", v=>v+"%", 0.01);
bindSlider("descSize","descScale", v=>v+"%", 0.01);
bindSlider("zoom","zoom", v=>v+"%", 0.01);
bindSlider("imgBright","imgBright", v=>v+"%", 0.01);
bindSlider("descColor","descColor", v=>v+"%", 0.01);
$("textY").oninput = ()=>{ const v=parseFloat($("textY").value); $("textYV").textContent=v; setField("textY", v); };
$("dur").oninput = ()=>{
  const v = parseFloat($("dur").value);
  $("durV").textContent = v+"s";
  if($("durAll").checked){
    state.dur = v;
    state.images.forEach(s => s.dur = null);
  } else {
    const it = cur(); if(it) it.dur = v;
  }
};
$("durAll").onchange = ()=>{
  if($("durAll").checked){
    const v = parseFloat($("dur").value);
    state.dur = v;
    state.images.forEach(s => s.dur = null);
  }
};
$("trans").onchange = ()=> state.trans=$("trans").value;
$("kenburns").onchange = e => state.kenburns=e.target.checked;

$("resetView").onclick = ()=>{
  const it = state.images[state.active];
  if(it){ it.tx.ox=0; it.tx.oy=0; }
  state.zoom=1; $("zoom").value=100; $("zoomV").textContent="100%";
  const c=cur(); if(c) c.textDrag=0; render();
};

function updateDimLabel(){
  const [W,H] = state.reel ? FORMATS.story : FORMATS[state.format];
  $("dimLabel").textContent = `${W} × ${H}`;
}

// ═══ SECTION: CANVAS DRAG ═══
let dragMode = null, dragStart=null, startTx=null, startTextDrag=0;
function canvasCoords(e){
  const r = cv.getBoundingClientRect();
  const sx = cv.width/r.width, sy = cv.height/r.height;
  const cx = (e.touches?e.touches[0].clientX:e.clientX) - r.left;
  const cy = (e.touches?e.touches[0].clientY:e.clientY) - r.top;
  return { x: cx*sx, y: cy*sy };
}
function startDrag(e){
  const p = canvasCoords(e);
  const b = lastTextBox;
  if(b && p.x>=b.x-20 && p.x<=b.x+b.w+20 && p.y>=b.y-20 && p.y<=b.y+b.h+30){
    dragMode = "text"; startTextDrag = (cur()||{}).textDrag||0;
  } else {
    dragMode = "image";
    const it = state.images[state.active];
    if(!it){ dragMode=null; return; }
    startTx = {...it.tx};
  }
  dragStart = p; cv.classList.add("grabbing");
}
function moveDrag(e){
  if(!dragMode) return;
  e.preventDefault();
  const p = canvasCoords(e);
  if(dragMode==="image"){
    const it = state.images[state.active];
    it.tx.ox = startTx.ox + (p.x-dragStart.x);
    it.tx.oy = startTx.oy + (p.y-dragStart.y);
  } else {
    const it = cur(); if(it) it.textDrag = startTextDrag + (p.y-dragStart.y);
  }
  render();
}
function endDrag(){ dragMode=null; cv.classList.remove("grabbing"); }
cv.addEventListener("mousedown", startDrag);
window.addEventListener("mousemove", moveDrag);
window.addEventListener("mouseup", endDrag);
cv.addEventListener("touchstart", startDrag, {passive:false});
window.addEventListener("touchmove", moveDrag, {passive:false});
window.addEventListener("touchend", endDrag);
cv.addEventListener("wheel", e=>{
  e.preventDefault();
  let z = state.zoom + (e.deltaY<0?0.04:-0.04);
  z = Math.max(0.5, Math.min(2.6, z));
  state.zoom = z;
  $("zoom").value = Math.round(z*100); $("zoomV").textContent = Math.round(z*100)+"%";
  render();
}, {passive:false});

// ═══ SECTION: EXPORT IMAGE ═══
function download(blob, filename){
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 2000);
}
function slug(){
  const first = (state.images.find(s=>s.title && s.title.trim()) || {}).title || "post";
  const s = first.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,40);
  return "macro-"+(s||"post");
}
$("dlPng").onclick = ()=>{ render(); cv.toBlob(b=>download(b, slug()+".png"), "image/png"); };
$("dlJpg").onclick = ()=>{ render(); cv.toBlob(b=>download(b, slug()+".jpg"), "image/jpeg", 0.92); };

// ═══ SECTION: REEL ═══
let _offCv1 = null, _offCtx1 = null, _offCv2 = null, _offCtx2 = null;
function getOffscreen(W, H, n){
  if(n===2){
    if(!_offCv2){ _offCv2 = document.createElement("canvas"); _offCtx2 = _offCv2.getContext("2d"); }
    if(_offCv2.width!==W||_offCv2.height!==H){ _offCv2.width=W; _offCv2.height=H; }
    return [_offCv2, _offCtx2];
  }
  if(!_offCv1){ _offCv1 = document.createElement("canvas"); _offCtx1 = _offCv1.getContext("2d"); }
  if(_offCv1.width!==W||_offCv1.height!==H){ _offCv1.width=W; _offCv1.height=H; }
  return [_offCv1, _offCtx1];
}

function drawFullSlide(targetCtx, W, H, slide, idx, total, zoomMul){
  const origCtx = ctx;
  ctx = targetCtx;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = INK; ctx.fillRect(0,0,W,H);
  const showVideo = slide.video && slide.template === "post-video" && slide.showBgImage !== false;
  const showImg = (slide.img && slide.showBgImage !== false) || showVideo;
  const framed = showImg && slide.framedImage && !showVideo;
  const tpl = slide.template;
  if(showImg && !framed){
    if(tpl==="transfert") drawStripeBackground(W,H);
    drawSlideMedia(slide, W, H, state.zoom * (zoomMul||1));
  } else if(framed){
    drawBaseBackground(W,H); drawFramedImage(slide, W, H, state.zoom);
  } else {
    if(tpl==="breaking") drawBreakingBackground(W,H);
    else if(tpl==="transfert"){ drawBaseBackground(W,H); drawStripeBackground(W,H); }
    else drawBaseBackground(W,H);
  }
  drawEdgeScrims(W,H);
  drawOverlay(W, H, { index: idx, total: total }, slide, showImg);
  ctx = origCtx;
}

function slideDur(s){ return (s.video && s.template==="post-video" && s.video.duration && isFinite(s.video.duration)) ? Math.min(s.video.duration,60)*1000 : (s.dur || state.dur)*1000; }

function drawReelFrame(W, H, tMs){
  const imgs = state.images;
  if(!imgs.length){ ctx.clearRect(0,0,W,H); ctx.fillStyle=INK; ctx.fillRect(0,0,W,H); drawBaseBackground(W,H); drawOverlay(W,H,null,EMPTY); return; }
  const transMs = 600;
  let acc = 0, idx = 0;
  for(let i=0; i<imgs.length; i++){ const d=slideDur(imgs[i]); if(acc+d>tMs||i===imgs.length-1){idx=i;break;} acc+=d; }
  const per = slideDur(imgs[idx]);
  const local = tMs - acc;
  const prog = Math.min(1, local/per);
  const showImg = imgs[idx].img && imgs[idx].showBgImage !== false;
  const framedCur = showImg && imgs[idx].framedImage;
  const kb = (state.kenburns && showImg && !framedCur) ? (1 + 0.07*prog) : 1;

  const next = imgs[idx+1];
  const inTrans = next && local > per - transMs && state.trans !== "cut";

  if(!inTrans){
    drawFullSlide(ctx, W, H, imgs[idx], idx, imgs.length, kb);
  } else {
    const a = (local-(per-transMs))/transMs;
    if(state.trans==="fade"){
      drawFullSlide(ctx, W, H, imgs[idx], idx, imgs.length, kb);
      const [offCv, offCtx] = getOffscreen(W, H, 1);
      drawFullSlide(offCtx, W, H, next, idx+1, imgs.length, 1);
      ctx.save(); ctx.globalAlpha = a;
      ctx.drawImage(offCv, 0, 0);
      ctx.restore();
    } else {
      const [curCv, curCtx] = getOffscreen(W, H, 1);
      const [nxtCv, nxtCtx] = getOffscreen(W, H, 2);
      drawFullSlide(curCtx, W, H, imgs[idx], idx, imgs.length, kb);
      drawFullSlide(nxtCtx, W, H, next, idx+1, imgs.length, 1);
      ctx.clearRect(0,0,W,H);
      ctx.drawImage(curCv, Math.round(-W*a), 0);
      ctx.drawImage(nxtCv, Math.round(W*(1-a)), 0);
    }
  }
}

let playing = false, rafId = null;
function stopTicker(){ if(rafId){ cancelAnimationFrame(rafId); rafId = null; } }
function resetReelUI(){
  $("recbar").classList.remove("on"); $("recprog").style.width = "0%";
  $("dlReel").disabled = false; $("previewReel").disabled = false;
}

function deliverVideo(blob){
  const url = URL.createObjectURL(blob);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    let overlay = document.getElementById("videoOverlay");
    if(overlay) overlay.remove();
    overlay = document.createElement("div");
    overlay.id = "videoOverlay";
    overlay.style.cssText = "position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.9);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;gap:16px;";
    const vid = document.createElement("video");
    vid.src = url; vid.controls = true; vid.playsInline = true; vid.autoplay = true;
    vid.style.cssText = "max-width:90%;max-height:70vh;border-radius:12px;";
    const msg = document.createElement("p");
    msg.textContent = "Appui long sur la vidéo → Enregistrer";
    msg.style.cssText = "color:#fff;font:600 16px Manrope,sans-serif;text-align:center;";
    const close = document.createElement("button");
    close.textContent = "✕ Fermer";
    close.style.cssText = "background:#333;color:#fff;border:none;padding:10px 24px;border-radius:8px;font:500 14px Manrope,sans-serif;cursor:pointer;";
    close.onclick = ()=>{ overlay.remove(); URL.revokeObjectURL(url); };
    overlay.appendChild(vid); overlay.appendChild(msg); overlay.appendChild(close);
    document.body.appendChild(overlay);
    $("status").textContent = "✓ Vidéo prête — appui long pour enregistrer.";
  } else {
    const a = document.createElement("a");
    a.href = url; a.download = slug()+"-reel.mp4"; a.click();
    setTimeout(()=>URL.revokeObjectURL(url), 5000);
    $("status").textContent = "✓ Vidéo exportée.";
  }
}

$("previewReel").onclick = ()=> playReel(false);
$("dlReel").onclick = ()=> playReel(true);

async function playReel(record){
  if(playing) return;
  const hasVideo = state.images.some(s => s.video && s.template === "post-video");
  if(state.images.length < 2 && !hasVideo){ $("status").textContent = "⚠ Ajoute au moins 2 images ou une vidéo pour le Reel."; return; }

  const [W,H] = FORMATS.story;
  if(cv.width!==W || cv.height!==H){ cv.width=W; cv.height=H; }
  let total = 0;
  for(const s of state.images){
    total += slideDur(s);
    if(s.video){ s.video.currentTime = 0; }
  }
  stopVideoLoop();
  playing = true;

  if(!record){
    $("status").textContent = "▶ Lecture de l'aperçu…";
    state.images.forEach(s => { if(s.video){ s.video.currentTime = 0; s.video.muted = true; } });
    const t0 = performance.now();
    function prevTick(){
      const t = performance.now() - t0;
      if(t >= total){ playing = false; state.images.forEach(s => { if(s.video){ s.video.pause(); s.video.muted = true; } }); $("status").textContent = ""; render(); return; }
      // unmute only the active slide's video
      const transMs = 600;
      let acc2 = 0, activeIdx = 0;
      for(let i=0; i<state.images.length; i++){ const d=slideDur(state.images[i]); if(acc2+d>t||i===state.images.length-1){activeIdx=i;break;} acc2+=d; }
      state.images.forEach((s, i) => {
        if(!s.video) return;
        if(i === activeIdx){ s.video.muted = false; if(s.video.paused) s.video.play(); }
        else { s.video.muted = true; }
      });
      drawReelFrame(W, H, t);
      rafId = requestAnimationFrame(prevTick);
    }
    rafId = requestAnimationFrame(prevTick);
    return;
  }

  if(!window.VideoEncoder){ $("status").textContent = "⚠ Ce navigateur ne supporte pas VideoEncoder (Chrome 94+ requis)."; playing=false; return; }
  if(!window.Mp4Muxer){ $("status").textContent = "⚠ mp4-muxer non chargé."; playing=false; return; }

  $("recbar").classList.add("on");
  $("dlReel").disabled = true; $("previewReel").disabled = true;
  $("status").textContent = "● Préparation audio…";

  const FPS = 30;
  const frameDur = 1000 / FPS;
  const totalFrames = Math.ceil(total / frameDur);
  const SAMPLE_RATE = 48000;
  const CHANNELS = 2;

  // Build audio timeline: decode audio from each video slide
  async function buildAudioBuffer(){
    const audioCtx = new OfflineAudioContext(CHANNELS, Math.ceil(total/1000 * SAMPLE_RATE), SAMPLE_RATE);
    const slideTimings = [];
    let acc = 0;
    for(const s of state.images){
      const dur = slideDur(s);
      slideTimings.push({ slide: s, startMs: acc, durMs: dur });
      acc += dur;
    }

    for(const { slide, startMs, durMs } of slideTimings){
      if(!slide.videoFile || slide.template !== "post-video") continue;
      try {
        const arrayBuf = await slide.videoFile.arrayBuffer();
        const audioBuf = await audioCtx.decodeAudioData(arrayBuf);
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuf;
        source.connect(audioCtx.destination);
        const maxDur = durMs / 1000;
        source.start(startMs / 1000, 0, Math.min(audioBuf.duration, maxDur));
      } catch(e) { /* video has no audio track — skip */ }
    }

    return audioCtx.startRendering();
  }

  let mixedAudio = null;
  try { mixedAudio = await buildAudioBuffer(); } catch(e) { /* no audio — continue without */ }

  const hasAudio = mixedAudio && mixedAudio.length > 0;

  const muxer = new Mp4Muxer.Muxer({
    target: new Mp4Muxer.ArrayBufferTarget(),
    video: { codec: "avc", width: W, height: H },
    ...(hasAudio ? { audio: { codec: "aac", numberOfChannels: CHANNELS, sampleRate: SAMPLE_RATE } } : {}),
    fastStart: "in-memory"
  });

  const videoEncoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: e => { $("status").textContent = "⚠ Erreur encodage vidéo : " + e.message; playing=false; resetReelUI(); render(); }
  });
  videoEncoder.configure({
    codec: "avc1.640028",
    width: W, height: H,
    bitrate: 6_000_000,
    framerate: FPS
  });

  let audioEncoder = null;
  if(hasAudio){
    audioEncoder = new AudioEncoder({
      output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
      error: e => { $("status").textContent = "⚠ Erreur encodage audio : " + e.message; }
    });
    audioEncoder.configure({
      codec: "mp4a.40.2",
      numberOfChannels: CHANNELS,
      sampleRate: SAMPLE_RATE,
      bitrate: 128_000
    });

    // Encode all audio in chunks of 1024 samples
    const chunkSize = 1024;
    const totalSamples = mixedAudio.length;
    for(let offset = 0; offset < totalSamples; offset += chunkSize){
      const remaining = Math.min(chunkSize, totalSamples - offset);
      const frameData = new Float32Array(remaining * CHANNELS);
      for(let ch = 0; ch < CHANNELS; ch++){
        const chanData = mixedAudio.getChannelData(ch);
        for(let i = 0; i < remaining; i++){
          frameData[i * CHANNELS + ch] = chanData[offset + i];
        }
      }
      const audioData = new AudioData({
        format: "f32-planar",
        sampleRate: SAMPLE_RATE,
        numberOfFrames: remaining,
        numberOfChannels: CHANNELS,
        timestamp: Math.round(offset / SAMPLE_RATE * 1_000_000),
        data: new Float32Array(remaining * CHANNELS)
      });
      // Fill planar data correctly
      const planarData = new Float32Array(remaining * CHANNELS);
      for(let ch = 0; ch < CHANNELS; ch++){
        const chanData = mixedAudio.getChannelData(ch);
        planarData.set(chanData.subarray(offset, offset + remaining), ch * remaining);
      }
      const ad = new AudioData({
        format: "f32-planar",
        sampleRate: SAMPLE_RATE,
        numberOfFrames: remaining,
        numberOfChannels: CHANNELS,
        timestamp: Math.round(offset / SAMPLE_RATE * 1_000_000),
        data: planarData
      });
      audioEncoder.encode(ad);
      ad.close();
    }
  }

  let frame = 0;

  function getActiveVideosAtTime(tMs){
    const imgs = state.images;
    const transMs = 600;
    let acc = 0, idx = 0;
    for(let i=0; i<imgs.length; i++){ const d=slideDur(imgs[i]); if(acc+d>tMs||i===imgs.length-1){idx=i;break;} acc+=d; }
    const per = slideDur(imgs[idx]);
    const local = tMs - acc;
    const results = [];
    const s = imgs[idx];
    if(s.video && s.template === "post-video") results.push({ video: s.video, time: local / 1000 });
    const next = imgs[idx+1];
    if(next && next.video && next.template === "post-video" && local > per - transMs && state.trans !== "cut"){
      results.push({ video: next.video, time: 0 });
    }
    return results;
  }

  function seekVideos(tMs){
    const entries = getActiveVideosAtTime(tMs);
    if(!entries.length) return Promise.resolve();
    return Promise.all(entries.map(({video, time}) => {
      if(Math.abs(video.currentTime - time) < 0.01) return Promise.resolve();
      return new Promise(resolve => {
        video.onseeked = () => { video.onseeked = null; resolve(); };
        video.currentTime = time;
      });
    }));
  }

  function renderNextFrame(){
    const tMs = frame * frameDur;
    const clampedT = Math.min(tMs, total);

    seekVideos(clampedT).then(() => {
      drawReelFrame(W, H, clampedT);

      const vf = new VideoFrame(cv, { timestamp: frame * (1_000_000 / FPS) });
      const isKey = frame % (FPS * 2) === 0;
      videoEncoder.encode(vf, { keyFrame: isKey });
      vf.close();

      $("recprog").style.width = (frame / totalFrames * 100) + "%";
      $("status").textContent = "● Encodage MP4… " + Math.round(frame/totalFrames*100) + "%";
      frame++;

      if(frame <= totalFrames){
        setTimeout(renderNextFrame, 0);
      } else {
        const flushPromises = [videoEncoder.flush()];
        if(audioEncoder) flushPromises.push(audioEncoder.flush());
        Promise.all(flushPromises).then(()=>{
          muxer.finalize();
          const blob = new Blob([muxer.target.buffer], { type: "video/mp4" });
          resetReelUI();
          playing = false;
          deliverVideo(blob);
          render();
        });
      }
    });
  }
  setTimeout(renderNextFrame, 50);
}

// ═══ SECTION: INIT ═══
(async function init(){
  try{
    await Promise.all([
      document.fonts.load("800 80px Sora"),
      document.fonts.load("700 22px Sora"),
      document.fonts.load("500 30px Manrope"),
    ]);
  }catch(e){}
  syncInputs(); updateDimLabel(); render();
  document.fonts.ready.then(render);
})();
