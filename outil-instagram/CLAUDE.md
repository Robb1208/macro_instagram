# Outil Instagram Macro

Générateur de posts Instagram pour le site esport Macro. Application mono-page (HTML + CSS + JS vanilla, pas de framework). Servir avec `npx http-server -p 8123` depuis ce dossier.

## Fichiers

- `index.html` — structure du panneau de contrôle + scène canvas
- `macro-instagram.js` — toute la logique (rendu canvas 2D, templates, état, export PNG/JPG/vidéo)
- `macro-instagram.css` — styles dark theme, variables CSS dans `:root`
- `macro-logo.png` — logo Macro affiché dans le header et sur le canvas (watermark)
- `Macro Templates Instagram v4.html` — maquettes de référence (Claude Design), ne pas modifier

## Architecture

### État global (`state`)
Objet mutable avec format, game, couleurs, watermark, gradient, zoom, textY (-80 par défaut), durée reel, etc. **Pas de template global** — le template est par slide.

### Slides (`state.images[]`)
Chaque slide est un objet créé par `newSlide(img, name, tpl)`. Champs clés : `template`, `eyebrow`, `title`, `desc`, `score`, `standings`, `stats`, `badge`, `signature`, `teamA`, `teamB`, `photoCredit`, etc.

### Templates (13)
Définis dans la constante `TEMPLATES`. Chaque slide a son propre template indépendant (`slide.template`). Helper `curTpl()` retourne le template du slide actif.

| Clé | Nom | Fonction de rendu |
|-----|-----|-------------------|
| `post-image` | Post image | `drawLayoutBottom` — texte en bas sur image |
| `post-texte` | Texte seul | `drawLayoutCentered` — texte centré, guillemet déco |
| `score` | Score | `drawLayoutScore` — boîtes équipes + score central (police Sora 800) |
| `breaking` | Breaking | `drawLayoutBreaking` — badge + fond dramatique |
| `classement` | Classement | `drawLayoutClassement` — tableau standings |
| `statistique` | Statistique | `drawLayoutCarousel` — paires label/valeur stats |
| `programme` | Programme | `drawLayoutProgramme` — matchs et dates |
| `sondage` | Sondage | `drawLayoutSondage` — options de vote |
| `tierlist` | Tierlist | `drawLayoutTierlist` — tiers S/A/B/C |
| `transfert` | Transfert | `drawLayoutTransfert` — annonce joueur |
| `mvp` | MVP | `drawLayoutMVP` — MVP doré ou badge Macro |
| `citation` | Citation | `drawLayoutCitation` — citation avec nom/rôle |
| `planning` | Planning | `drawLayoutPlanning` — calendrier hebdo esport |

### Rendu canvas
`render()` → dessine l'image de fond → `drawOverlay(W, H, slideInfo, content, hasImage)` qui dispatche vers la bonne fonction de layout selon `content.template`.

Éléments partagés dans `drawOverlay` : glow radial, courbes néon, dégradé bas, bruit, logo Macro + barre cyan, compteur de slides (bas-droite), crédit photo (bas-droite, au-dessus du compteur).

Dimensions exactes Instagram : Portrait 1080×1350 (défaut), Story/Reel 1080×1920.

### Crédit photo
Champ `photoCredit` par slide, affiché en bas à droite au-dessus du compteur de slides. Format : `"Photo — Nom / Source"`. Texte Manrope 500, blanc 35% opacité.

### Couleur d'accent
Déterminée par le jeu sélectionné (`accentColor()`). La couleur de surbrillance (`hiColor`, pour la syntaxe `*mot*`) est auto-synchronisée avec la couleur du jeu — pas de picker séparé.

### Champs conditionnels
`syncInputs()` montre/cache les champs du panneau selon le template du slide actif (ex: `#standingsRow` visible seulement pour classement, `#statsRow` pour statistique).

### Import dossier (JSON + images)
`applyJsonPreset(data, imageFiles)` restaure un post complet depuis un dossier contenant un JSON + des images. Chaque slide peut référencer une image via le champ `"image": "nom-fichier.jpg"` dans le JSON. L'import associe automatiquement les fichiers images aux slides correspondants.

## Conventions de code

- Vanilla JS, pas de modules, pas de build step
- Fonctions utilitaires courtes : `$(id)`, `cur()`, `curTpl()`, `accentColor()`
- Canvas 2D uniquement (pas de WebGL)
- Polices : Sora (titres), Manrope (body), JetBrains Mono (mono)
- Couleurs CSS : `--cyan`, `--ink`, `--fg`, `--red`, `--gold`, etc. dans `:root`
- `roundRectPath` avec clamping de rayon (`Math.min(r, w/2, h/2)`)
- `drawSpaced` : le letter spacing doit être compté dans les calculs de largeur de pill
- Responsive mobile : breakpoint 820px, canvas en haut (order:-1)

## Skill postinsta

Le skill `/postinsta` génère des posts complets (JSON + images + crédits). Voir `.claude/skills/postinsta/SKILL.md` pour le détail du pipeline.

Pipeline : sujet → recherche web → recherche photos Flickr/HLTV → JSON + images + credits.txt → import dossier dans l'outil.

## Ce qu'il ne faut pas faire

- Ne pas ajouter de template global — c'est par slide
- Ne pas réintroduire un picker de couleur de surbrillance — c'est auto-sync avec le jeu
- Ne pas toucher au fichier de maquettes `.html` dans ce dossier
- Ne pas ajouter de dépendances npm ou de bundler — c'est volontairement simple
