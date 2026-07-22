---
name: Reel Instagram esport
description: Génère un Reel Instagram 9:16 en HyperFrames — vidéo de fond + textes français racontant une histoire esport, style Macro dark + couleur accent du jeu. Produit un dossier HyperFrames prêt à render.
---

# reel

Skill pour créer des Reels Instagram esport pour Macro avec HyperFrames (HTML → MP4).

## Format

- **Dimensions** : 1080×1920 (9:16 vertical)
- **Durée** : calée sur la durée exacte de la vidéo source (pas plus, pas moins)
- **Framework** : HyperFrames (compositions HTML, GSAP, `npx hyperframes render`)

## Direction artistique

### Couleurs
- **Fond** : `#05060a` (noir profond)
- **Texte principal** : `#ffffff` (blanc) / `#e0e0e0` (body)
- **Couleur accent** : dépend du jeu (voir table ci-dessous)
- **Texte dim** : `rgba(255,255,255,0.4)`
- **Texte rouge** (bans, cheat, danger) : `#ff3b3b` avec glow `rgba(255,59,59,0.6)`

### Couleurs par jeu
| Jeu | Couleur accent | Hex |
|-----|---------------|-----|
| CS2 / Counter-Strike | Jaune/or | `#f0c14b` |
| League of Legends | Cyan Macro | `#00e5ff` |
| Valorant | Rouge Valorant | `#ff4655` |
| Rocket League | Bleu RL | `#0077ff` |
| Fortnite | Violet | `#9d4dfa` |

L'accent est utilisé partout : badge titre, barre glow, overlay gradient (teinte en bas), séparateurs, `<em>` et `.accent`.

### Polices
- **Sora** : titres, badges, gros texte impact (700-800)
- **Manrope** : body text, narration (500-700)
- **JetBrains Mono** : éléments techniques, code, fichiers (600-700)

Charger via Google Fonts (HyperFrames les résout automatiquement).

### Overlay sur vidéo
Gradient sombre sur la vidéo pour lisibilité du texte :
```css
linear-gradient(180deg,
  rgba(5,6,10,0.72) 0%,       /* sombre en haut (logo) */
  rgba(5,6,10,0.35) 25%,      /* dégagé au centre (vidéo visible) */
  rgba(5,6,10,0.30) 50%,
  rgba(ACCENT,0.55) 75%,      /* teinte accent en bas */
  rgba(ACCENT,0.18) 100%
);
```

## Structure de la composition

### Éléments persistants (durée = vidéo complète)
1. **Vidéo de fond** (`#bg-video`) — track 0, `muted`, plein écran `object-fit: cover`
2. **Overlay gradient** (`#overlay`) — track 1, lisibilité texte
3. **Glow bar** (`#glow-bar`) — track 2, barre 4px en bas, couleur accent + box-shadow glow
4. **Top bar** (`#top-bar`) — track 15, logo Macro (`assets/macro-logo.png`) + ligne dégradée
5. **Titre** (`#title-block`) — track 16, badge catégorie + titre jeu
6. **Audio** (`#bg-audio`) — track 20, même src que vidéo, `data-volume="0.7"`

### Scènes texte
- Positionnées à `top: 560px` (laisser le centre de la vidéo visible)
- Class `.scene` : absolute, flexbox column, centré, padding 60px latéral
- Chaque scène = un `class="clip"` avec `data-start`, `data-duration`, `data-track-index`
- Répartir les scènes uniformément sur la durée de la vidéo
- **5-6 scènes max** pour un reel de 15-20s

### Exit tweens — IMPORTANT
Les tweens de sortie (fade out entre scènes) doivent cibler un **div wrapper intérieur** (`#sN-inner`), pas le clip directement. Terminer par un `tl.set("#sN-inner", { opacity: 0 })` au moment exact de fin du clip.

Exemple :
```js
tl.to("#s1-inner", { opacity: 0, duration: 0.25, ease: "power2.in" }, 3.2);
tl.set("#s1-inner", { opacity: 0 }, 3.5);
```

La dernière scène n'a PAS besoin d'exit tween (elle se termine avec la vidéo).

## Animations GSAP

### Entrées
- Titres : `from` opacity 0, y 30, duration 0.5, `power3.out`
- Lignes de texte : `from` opacity 0, y 15, duration 0.35-0.4, `power3.out`, staggered 0.3s
- Séparateurs : `from` scaleX 0, duration 0.25, `power2.out`
- Éléments impact (ban, stat) : `from` scale 0.5-0.6, opacity 0, `back.out(1.5-1.7)`
- Logo top bar : `from` opacity 0, x -20
- Ligne top bar : `from` scaleX 0, transformOrigin "left center"

### Effets globaux (toujours inclus)
- **Ken Burns** : zoom lent sur la vidéo de fond (scale 1.0 → 1.08 sur toute la durée, `ease: "none"`)
- **Barre de progression** : la ligne du top bar (`#top-line`, `.bar-line`) s'anime de scaleX 0 → 1 de gauche à droite sur toute la durée. Couleur pleine accent, 4px, glow léger (`box-shadow: 0 0 8px rgba(accent,0.4)`), `border-radius: 2px`. Ne PAS mettre un glow trop fort sinon ça fait un blob flou au début.

```js
tl.fromTo("#bg-video", { scale: 1.0 }, { scale: 1.08, duration: DUREE, ease: "none" }, 0);
tl.fromTo("#top-line", { scaleX: 0, transformOrigin: "left center" }, { scaleX: 1, duration: DUREE, ease: "none" }, 0);
```

### Timeline
```js
window.__timelines = window.__timelines || {};
const tl = gsap.timeline({ paused: true });
// ... effets globaux + tweens ...
window.__timelines["main"] = tl;
```

## Rédaction du texte

- **Langue** : français
- **Ton** : dramatique, percutant, storytelling. Phrases courtes.
- **Structure narrative** : Hook → Contexte → Révélation → Climax → Conséquences
- Utiliser `<em>` ou `.accent` pour les mots-clés importants (colorés en accent)
- `.emphasis` pour le blanc pur sur mots forts
- `.dim` pour les phrases secondaires (rgba blanc 40%)
- Pas de hashtags ni CTA dans le reel lui-même

## Dossier de sortie

Créer dans `outil-instagram/reels/<nom-du-reel>/` :
```
<nom-du-reel>/
├── index.html          # composition HyperFrames
├── package.json        # scripts npm (dev, check, render)
├── meta.json           # metadata projet
├── assets/
│   ├── <video>.mp4     # vidéo source
│   └── macro-logo.png  # copié depuis outil-instagram/
└── renders/            # MP4 générés (par hyperframes render)
```

Initialiser avec `npx hyperframes init` si nouveau projet, ou copier la structure d'un reel existant.

## Pipeline de création

1. Récupérer/copier la vidéo source dans `assets/`
2. Mesurer la durée exacte avec ffprobe
3. Écrire le scénario en français (5-6 scènes, timing calé sur durée vidéo)
4. Coder `index.html` avec tous les éléments (vidéo, overlay, texte, GSAP)
5. `npx hyperframes check` — 0 erreurs obligatoire
6. `npx hyperframes render` — générer le MP4
7. Montrer le résultat à Robin

## Ce qu'il ne faut PAS faire

- Ne pas dépasser la durée de la vidéo source
- Ne pas mettre le texte trop haut (garder `top: 560px` minimum pour voir la vidéo)
- Ne pas utiliser `tl.set` ou `gsap.set` sur les éléments `.clip` directement (seulement sur les wrappers intérieurs)
- Ne pas oublier l'audio séparé (`<audio>` en plus du `<video muted>`)
- Ne pas oublier `class="clip"` sur tout élément avec timing
- Ne pas mettre de `repeat: -1` ni de random/Date.now()
