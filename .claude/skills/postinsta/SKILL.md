---
name: Post Instagram Macro
description: Génère un post Instagram complet pour le site esport Macro. Recherche d'actualité, images Flickr officielles, et JSON importable dans l'outil Instagram.
---

# postinsta

Skill de génération de posts Instagram pour le site esport Macro.

## Pipeline

### 1. Sujet
- L'utilisateur donne un thème/sujet pour un post Instagram esport.
- Si aucun sujet n'est donné, faire des recherches et proposer 3-4 idées d'actualité esport du moment (résultats récents, transferts, événements à venir).

### 2. Recherche
- Faire des recherches web sur le sujet pour avoir des infos fiables et à jour.
- Vérifier les faits : scores, dates, noms de joueurs, résultats.

### 3. Recherche d'images
Chercher des photos officielles pour illustrer le post sur les galeries Flickr des compétitions.

#### Sources Flickr par jeu

**League of Legends** (4 comptes) :
| Compte | URL | Photos |
|--------|-----|--------|
| LoL Esports (principal — Worlds, MSI, etc.) | https://www.flickr.com/photos/lolesports/albums/ | 175 000+ |
| LEC (Europe) | https://www.flickr.com/photos/lecofficial/albums/ | 39 000+ |
| LCK (Corée) | https://www.flickr.com/photos/145885012@N07/albums/ | 164 000+ |
| LCS (Amérique du Nord) | https://www.flickr.com/photos/lcsofficial/albums/ | 31 000+ |

**Valorant** (3 comptes) :
| Compte | URL | Photos |
|--------|-----|--------|
| VCT (principal) | https://www.flickr.com/photos/valorantesports/albums/ | 70 000+ |
| VCT Americas | https://www.flickr.com/photos/vctamericas/albums/ | 35 000+ |
| VCT Pacific | https://www.flickr.com/photos/vctpacific/albums/ | 90 000+ |

**Rocket League** :
| Compte | URL | Photos |
|--------|-----|--------|
| RL Esports | https://www.flickr.com/photos/rlesports/albums/ | 24 000+ |

**TFT** :
| Compte | URL | Photos |
|--------|-----|--------|
| TFT Esports | https://www.flickr.com/photos/tftesports/albums/ | 1 800+ |

**Multi-jeux** :
| Compte | URL | Photos |
|--------|-----|--------|
| Esports World Cup (Fortnite, RL, OW2…) | https://www.flickr.com/photos/esportsworldcup/albums/ | 159 000+ |

**Counter-Strike (CS2)** :
Pas de Flickr officiel. Les photos sont sur HLTV mais **HLTV bloque tout accès programmatique** (pages et CDN images renvoient 403). **Ne pas chercher d'images pour les articles CS2** — l'utilisateur les récupérera lui-même sur HLTV. Laisser les champs `"image"` et `"photoCredit"` vides dans le JSON pour les slides qui auraient besoin d'une photo, et indiquer dans le `credits.txt` les galeries HLTV pertinentes à consulter.
- Galeries HLTV : https://www.hltv.org/galleries

#### Crédit photographe
Le nom du photographe et la source se lisent directement sur chaque page Flickr individuelle (champ "by" sous la photo). Format du crédit : `Prénom Nom / Source` (ex: `Colin Young-Wolff / Riot Games`). La source n'est pas toujours Riot Games — lire ce qui est indiqué sur Flickr ou HLTV.

#### Règles pour les images
- Naviguer dans les albums Flickr pour trouver des photos pertinentes (bon événement, bon joueur, bonne équipe).
- **Toujours récupérer le nom du photographe** visible sur chaque page Flickr individuelle (champ "by" sous la photo).
- Pour télécharger : utiliser l'URL `https://live.staticflickr.com/65535/{photo_id}_{secret}_b.jpg` (taille 1024px). Le `_b` à la fin donne la grande taille.
- Proposer 2-3 images avec : URL de téléchargement, description de la photo, crédit photographe.
- Privilégier les photos récentes et de bonne qualité.
- **Limite connue** : les descriptions Flickr disent "Team A vs Team B" sans préciser quelle équipe est réellement sur la photo. Quand il y a un doute, télécharger plusieurs options et laisser l'utilisateur choisir visuellement. Nommer les options `option-a.jpg`, `option-b.jpg`, etc.
- Pour maximiser les chances d'avoir la bonne équipe : privilégier les events organisés par l'équipe (ex: LEC Roadtrip hébergé par KC à Évry) et les photos de célébration/victoire.
- **S'assurer que l'image correspond à la description de la slide** — une photo d'une équipe adverse ne convient pas pour illustrer un article sur une autre équipe.

### 4. Génération du JSON
Créer un fichier JSON compatible avec l'outil Instagram Macro (`outil-instagram/`).

#### Direction artistique (obligatoire)
Le champ `"game"` définit la couleur d'accent du post (utilisée pour les `*mots en surbrillance*`, le glow, les courbes néon). **Toujours utiliser la clé exacte** — une mauvaise clé rend le texte invisible.

| Clé | Jeu | Couleur |
|-----|-----|---------|
| `lol` | League of Legends | Cyan `#00c2e0` |
| `cs2` | Counter-Strike 2 | Or `#f0c14b` |
| `val` | Valorant | Rouge `#ff4d57` |
| `rl` | Rocket League | Bleu `#3b9eff` |
| `cod` | Call of Duty | Orange `#e8820c` |
| `macro` | Macro (générique) | Cyan `#00c2e0` |

**Attention :** la clé Counter-Strike est `cs2`, pas `cs`. La clé Valorant est `val`, pas `valorant`.

Structure du JSON :
```json
{
  "format": "portrait",
  "game": "lol|cs2|val|rl|cod|macro",
  "watermark": true,
  "gradient": 100,
  "titleSize": 100,
  "slides": [
    {
      "template": "post-image|post-texte|score|breaking|classement|statistique|programme|sondage|tierlist|transfert|spotlight|mvp|citation",
      "image": "slide-1.jpg",
      "photoCredit": "Prénom Nom / Source",
      "eyebrow": "SURTITRE EN MAJUSCULES",
      "title": "Titre avec *mots en surbrillance*",
      "desc": "Description du slide",
      "showDesc": true,
      "score": "",
      "showScore": false,
      "scoreY": 0,
      "badge": "",
      "signature": "Macro",
      "teamA": "",
      "teamB": "",
      "standings": "",
      "relegationLine": 0,
      "stats": "",
      "matches": "",
      "footerText": "",
      "pollOptions": "",
      "pollWinner": 0,
      "tiers": "",
      "playerName": "",
      "playerRole": "",
      "transferBadge": "officiel",
      "matchResult": "",
      "showBgImage": true,
      "framedImage": false
    }
  ]
}
```

- `"image"` : nom du fichier image dans le même dossier. L'outil associe automatiquement les images aux slides à l'import.
- `"photoCredit"` : affiché en bas à droite du canvas au format `"Photo — Crédit"`. Laisser vide pour les slides sans image (programme, post-texte, etc.).
- Ne remplir que les champs utiles au template choisi (les autres restent à `""` ou `0`).

### 5. Output
Créer un dossier dans `outil-instagram/presets/` avec :
- `post.json` — le fichier JSON du post
- `slide-1.jpg`, `slide-2.jpg`, etc. — images numérotées par slide (sauter les numéros des slides sans image)
- `option-a.jpg`, `option-b.jpg`, etc. — images alternatives quand il y a un doute sur le contenu
- `credits.txt` — crédits photographes avec sources Flickr

Si le téléchargement direct n'est pas possible, fournir les liens de téléchargement Flickr pour que l'utilisateur les récupère manuellement.

### 6. Import dans l'outil
L'utilisateur clique "Importer un dossier" dans l'outil Instagram et sélectionne le dossier généré. L'outil retrouve le JSON et les images et reconstruit le post automatiquement.

## Bonnes pratiques éditoriales

- **Ton** : informatif, concis, engageant. Pas de clickbait.
- **Slide 1** : accroche visuelle (template `post-image` avec photo forte) — titre court et percutant.
- **Slides suivantes** : développer le sujet (contexte, programme, analyse).
- **Dernière slide** : souvent un `post-texte` avec signature "Macro" — opinion ou conclusion.
- Le texte entre `*astérisques*` sera affiché en couleur d'accent (couleur du jeu).
- Eyebrow = contexte court (nom de la compétition, date, phase).
- 2 à 5 slides par post en général.
- La description ne doit pas entrer en conflit avec le crédit photo (le texte par défaut est remonté de -80px).
