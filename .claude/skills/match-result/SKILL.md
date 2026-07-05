---
name: Résultat de match esport
description: Génère un post Instagram de résultat de match esport pour Macro. 4+ slides (Spoiler + Score + MVP + Lineup/Notes). Recherche d'images Flickr, stats du match, et JSON importable dans l'outil Instagram. Utilise ce skill dès que l'utilisateur demande un post de résultat de match, score, ou récap de match.
---

# match-result

Skill de génération de posts Instagram "Résultat de match" pour Macro.

## Format obligatoire : 4 slides minimum

### Slide 1 — Spoiler (template `score`)
- **Images** : double image (`dualImage: true`) — une photo de chaque équipe (gauche = équipe A, droite = équipe B)
- **eyebrow** : `"NOM_TOURNOI · PHASE"` (ex: `"MSI 2026 · BRACKET STAGE"`)
- **title** : `"*EquipeA* vs *EquipeB*"` (neutre, pas de spoil)
- **score** : `"SPOILER"` (texte littéral, pas le vrai score)
- **showScore** : `true`
- **scoreY** : `302`
- **teamA** : tag de l'équipe à gauche
- **teamB** : tag de l'équipe à droite
- **dualImage** : `true`
- **image** : `"team-a.jpg"` (photo équipe A / perdante)
- **image2** : `"team-b.jpg"` (photo équipe B / gagnante)
- **imgBright** : `84`

### Slide 2 — Score (template `score`)
- **Images** : double image (`dualImage: true`) — mêmes photos que slide 1
- **eyebrow** : même que slide 1
- **title** : phrase de résultat avec noms en gras via `*nom*` (ex: `"*T1* balaye *KC*"`)
  - Adapter le verbe au score : 3-0 = "balaye/écrase", 3-1 = "domine", 3-2 = "s'impose face à", 2-1 = "bat", 2-0 = "sweep"
- **score** : format `"X - *Y*"` avec le score du gagnant en gras via `*`
- **showScore** : `true`
- **scoreY** : `302`
- **teamA** : tag de l'équipe à gauche (perdante)
- **teamB** : tag de l'équipe à droite (gagnante)
- **dualImage** : `true`
- **image** : `"team-a.jpg"`
- **image2** : `"team-b.jpg"`
- **imgBright** : `84`

### Slide 3 — MVP (template `mvp`)
- **Image** : photo du joueur MVP (portrait individuel de préférence)
- **eyebrow** : même que slide 1
- **title** : `"*NomDuJoueur*"` en gras
- **playerName** : nom du joueur MVP
- **playerRole** : `"Rôle · Équipe"` (ex: `"Support · T1"`)
- **matchResult** : `"Victoire X-Y vs Adversaire"` (ex: `"Victoire 3-0 vs Karmine Corp"`)
- **stats** : 3 lignes de stats clés, format `"Label Valeur\nLabel Valeur\nLabel Valeur"`
  - Exemples LoL : KDA, Kill participation %, Assists, CS/min, DMG share
  - Exemples CS2 : Rating, ADR, K-D, KAST%, Impact
  - Exemples Valorant : ACS, K/D, ADR, First Kills
- **mvpBadge** : `"mvp"`
- **photoCredit** : crédit photo Flickr (ex: `"Colin Young-Wolff / Riot Games"`)

### Slide 4 — Lineup/Notes (template `lineup`)
- **Pas d'image** (fond sombre par défaut)
- **eyebrow** : même que slides précédents
- **title** : `"Les notes de *NomÉquipe*"` en gras

#### Quelle équipe noter ?
- **Si une équipe française est impliquée** → noter cette équipe (même si elle a perdu)
- **Sinon** → noter l'équipe gagnante

#### Équipes françaises (liste non exhaustive)
Karmine Corp (KC), Vitality (VIT), Gentle Mates (GM), Solary, GameWard, LDLC, BDS, Mandatory, Misa Esport

#### Format lineup
```
Joueur1 / Rôle / Note
Joueur2 / Rôle / Note
...
```
- **Notes** : échelle de 1 à 10, demi-points autorisés (ex: 6.5)
- **lineupCount** : nombre de joueurs (5 pour LoL/Valorant/CS2, 3 pour RL)
- **lineupTeamRating** : note globale de l'équipe (moyenne arrondie ou pondérée)

#### Icônes de rôle (LoL)
Les icônes `LOGOS_ROLES/*.webp` s'affichent automatiquement si le rôle correspond à un nom reconnu. **Toujours utiliser ces noms exacts** dans le champ rôle :

| Rôle | Nom à utiliser | Aliases aussi reconnus |
|------|---------------|----------------------|
| Top | `Top` | — |
| Jungle | `Jgl` | `Jungle`, `Jungler` |
| Mid | `Mid` | — |
| Bot / ADC | `Bot` | `ADC`, `Bottom` |
| Support | `Support` | `Supp`, `Sup` |

Exemple LoL :
```
Zeus / Top / 7.5
Oner / Jgl / 6
Faker / Mid / 8.5
Gumayusi / Bot / 7
Keria / Support / 8
```

#### Barème de notation indicatif
| Note | Signification |
|------|--------------|
| 9-10 | Performance légendaire, carry absolu |
| 7-8 | Très bonne perf, au-dessus de son niveau habituel |
| 5-6 | Correct, dans la moyenne |
| 3-4 | En dessous, erreurs notables |
| 1-2 | Catastrophique |

### Slide 5 (optionnelle) — Notes équipe adverse
Si l'utilisateur le demande, ou si les deux équipes méritent d'être notées, ajouter une slide lineup supplémentaire pour l'autre équipe (même format que slide 4).

## Pipeline de production

### 1. Collecter les infos du match
- Score exact, tournoi, phase, noms des joueurs des deux équipes
- Stats individuelles pour le MVP — **obligatoire, toujours chercher des stats réelles**
- Si l'utilisateur donne les infos → les utiliser directement
- Si l'utilisateur donne juste "KC vs T1" → rechercher le résultat récent

#### Sources de stats par jeu
| Jeu | Source prioritaire | Fallback |
|-----|-------------------|----------|
| LoL | **RFT.gg** (stats match, KDA, CS, DMG) | Leaguepedia, Liquipedia |
| CS2 | **HLTV.org** (rating, ADR, KAST) | Liquipedia |
| Valorant | **VLR.gg** (ACS, K/D, ADR) | TheSpike.gg |
| Rocket League | **Liquipedia** | Octane.gg |

### 2. Rechercher des images
Utiliser les galeries Flickr officielles (voir skill postinsta pour les URLs).
- **Slides 1 et 2 (score/spoiler)** : chercher une photo pour CHAQUE équipe (double image)
  - Photo équipe A → `team-a.jpg`
  - Photo équipe B → `team-b.jpg`
- **Slide 3 (MVP)** : portrait du joueur MVP → `slide-mvp.jpg`
- Fournir 2 options (option-a.jpg, option-b.jpg) pour le MVP quand possible
- Toujours inclure le crédit photo

### 3. Générer le JSON
Produire un fichier `post.json` suivant exactement la structure ci-dessous.

### 4. Télécharger les images
- Télécharger les photos Flickr trouvées via WebFetch (URL directe de l'image)
- Si le téléchargement échoue ou n'est pas possible : **créer le zip quand même sans images** et prévenir l'utilisateur qu'il doit ajouter les images manuellement
- Dans le JSON, garder les champs `"image"` / `"image2"` même si l'image n'est pas dans le zip — l'utilisateur les ajoutera

### 5. Packager le dossier
Créer un dossier ZIP avec :
```
nom-du-match/
  post.json
  team-a.jpg      (photo équipe A — pour slides 1 & 2 en double image)
  team-b.jpg      (photo équipe B — pour slides 1 & 2 en double image)
  slide-mvp.jpg   (photo pour le MVP — si téléchargée)
  option-b.jpg    (alternative MVP optionnelle — si téléchargée)
```
Le ZIP doit être créé dans le dossier Downloads de l'utilisateur (`C:\Users\robin\Downloads\`).

## Structure JSON de référence

```json
{
  "format": "portrait",
  "game": "lol",
  "watermark": true,
  "gradient": 100,
  "titleSize": 100,
  "descSize": 100,
  "descColor": 75,
  "imgBright": 100,
  "slides": [
    {
      "template": "score",
      "eyebrow": "TOURNOI · PHASE",
      "title": "*EquipeA* vs *EquipeB*",
      "desc": "",
      "showDesc": true,
      "score": "SPOILER",
      "showScore": true,
      "scoreY": 302,
      "textY": 0,
      "badge": "breaking",
      "signature": "",
      "teamA": "TAG_A",
      "teamB": "TAG_B",
      "standings": "",
      "relegationLine": 0,
      "stats": "",
      "matches": "",
      "footerText": "",
      "pollOptions": "",
      "pollWinner": 0,
      "statHighlight": 0,
      "tiers": "",
      "playerName": "",
      "playerRole": "",
      "transferBadge": "officiel",
      "matchResult": "",
      "mvpBadge": "mvp",
      "photoCredit": "",
      "showBgImage": true,
      "framedImage": false,
      "dualImage": true,
      "dur": null,
      "game": null,
      "lineup": "",
      "lineupCount": 5,
      "lineupTeamRating": "",
      "bracket": "",
      "bracketFormat": "",
      "planningEvents": "",
      "frameY": 0,
      "imgBright": 84,
      "image": "team-a.jpg",
      "image2": "team-b.jpg"
    },
    {
      "template": "score",
      "eyebrow": "TOURNOI · PHASE",
      "title": "*Gagnant* verbe *Perdant*",
      "desc": "",
      "showDesc": true,
      "score": "X - *Y*",
      "showScore": true,
      "scoreY": 302,
      "textY": 0,
      "badge": "breaking",
      "signature": "",
      "teamA": "TAG_PERDANT",
      "teamB": "TAG_GAGNANT",
      "standings": "",
      "relegationLine": 0,
      "stats": "",
      "matches": "",
      "footerText": "",
      "pollOptions": "",
      "pollWinner": 0,
      "statHighlight": 0,
      "tiers": "",
      "playerName": "",
      "playerRole": "",
      "transferBadge": "officiel",
      "matchResult": "",
      "mvpBadge": "mvp",
      "photoCredit": "",
      "showBgImage": true,
      "framedImage": false,
      "dualImage": true,
      "dur": null,
      "game": null,
      "lineup": "",
      "lineupCount": 5,
      "lineupTeamRating": "",
      "bracket": "",
      "bracketFormat": "",
      "planningEvents": "",
      "frameY": 0,
      "imgBright": 84,
      "image": "team-a.jpg",
      "image2": "team-b.jpg"
    },
    {
      "template": "mvp",
      "eyebrow": "TOURNOI · PHASE",
      "title": "*NomJoueur*",
      "desc": "",
      "showDesc": true,
      "score": "",
      "showScore": false,
      "scoreY": 0,
      "textY": 0,
      "badge": "breaking",
      "signature": "",
      "teamA": "",
      "teamB": "",
      "standings": "",
      "relegationLine": 0,
      "stats": "Stat1 Valeur1\nStat2 Valeur2\nStat3 Valeur3",
      "matches": "",
      "footerText": "",
      "pollOptions": "",
      "pollWinner": 0,
      "statHighlight": 0,
      "tiers": "",
      "playerName": "NomJoueur",
      "playerRole": "Role · Equipe",
      "transferBadge": "officiel",
      "matchResult": "Victoire X-Y vs Adversaire",
      "mvpBadge": "mvp",
      "photoCredit": "Photographe / Source",
      "showBgImage": true,
      "framedImage": false,
      "dur": null,
      "game": null,
      "lineup": "",
      "lineupCount": 5,
      "lineupTeamRating": "",
      "bracket": "",
      "bracketFormat": "",
      "planningEvents": "",
      "frameY": 0,
      "image": "slide-mvp.jpg"
    },
    {
      "template": "lineup",
      "eyebrow": "TOURNOI · PHASE",
      "title": "Les notes de *Equipe*",
      "desc": "",
      "showDesc": true,
      "score": "",
      "showScore": false,
      "scoreY": 0,
      "textY": 0,
      "badge": "breaking",
      "signature": "",
      "teamA": "",
      "teamB": "",
      "standings": "",
      "relegationLine": 0,
      "stats": "",
      "matches": "",
      "footerText": "",
      "pollOptions": "",
      "pollWinner": 0,
      "statHighlight": 0,
      "tiers": "",
      "playerName": "",
      "playerRole": "",
      "transferBadge": "officiel",
      "matchResult": "",
      "mvpBadge": "mvp",
      "photoCredit": "",
      "showBgImage": false,
      "framedImage": false,
      "dur": null,
      "game": null,
      "lineup": "Joueur1 / Top / Note\nJoueur2 / Jgl / Note\nJoueur3 / Mid / Note\nJoueur4 / Bot / Note\nJoueur5 / Support / Note",
      "lineupCount": 5,
      "lineupTeamRating": "6",
      "bracket": "",
      "bracketFormat": "",
      "planningEvents": "",
      "frameY": 0
    }
  ]
}
```

## Règles de style

- **Slide spoiler** : toujours en première position, titre neutre `"*A* vs *B*"`, score = `"SPOILER"`
- **Titre slide score** : toujours en français, verbe adapté au score
- **Eyebrow** : MAJUSCULES, format `"TOURNOI · PHASE"`
- **Score** : le score du gagnant est toujours en gras (`*3*`)
- **Game** : adapter selon le jeu (`lol`, `cs2`, `val`, `rl`, `cod`)
- **Les stats MVP** : 3 stats pertinentes au jeu, pas plus
- **Notes lineup** : être honnête et objectif, pas de complaisance
- **Double image** : slides spoiler et score utilisent toujours `dualImage: true` avec une photo par équipe
