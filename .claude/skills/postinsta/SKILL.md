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
      "template": "post-image",
      "image": "slide-1.jpg",
      "photoCredit": "Prénom Nom / Source",
      "eyebrow": "SURTITRE EN MAJUSCULES",
      "title": "Titre avec *mots en surbrillance*",
      "desc": "Description du slide",
      "showDesc": true
    }
  ]
}
```

**Ne remplir que les champs pertinents au template** — omettre tous les champs vides/par défaut. L'outil les remplira automatiquement. Champs communs : `template`, `eyebrow`, `title`. Champs conditionnels :

| Template | Champs spécifiques à inclure |
|----------|------------------------------|
| `post-image` | `image`, `photoCredit`, `desc`, `showDesc` |
| `post-texte` | `desc`, `showDesc`, `signature` (dernière slide = `"Macro"`) |
| `score` | `teamA`, `teamB`, `score`, `showScore: true` |
| `breaking` | `badge`, `desc`, `showDesc` |
| `classement` | `standings`, `relegationLine` (si applicable) |
| `statistique` | `stats` |
| `programme` | `matches`, `footerText` |
| `bracket` | `bracket`, `bracketFormat`, `bracketWinnerLabel`, `bracketDates` (voir section Bracket ci-dessous) |
| `sondage` | `pollOptions`, `pollWinner` |
| `tierlist` | `tiers` |
| `transfert` | `playerName`, `playerRole`, `transferBadge`, `image` |
| `spotlight` | `playerName`, `playerRole`, `image`, `stats` |
| `mvp` | `playerName`, `playerRole`, `image`, `matchResult` |
| `citation` | `desc`, `playerName`, `playerRole` |

- `"image"` : nom du fichier image dans le même dossier. L'outil associe automatiquement les images aux slides à l'import.
- `"photoCredit"` : affiché en bas à droite du canvas. Inclure uniquement pour les slides avec image.

#### Template Bracket — format du champ `bracket`

**Quand l'utilisateur demande un bracket, toujours utiliser le template `bracket`, jamais `programme`.**

Le champ `bracket` est une chaîne de texte multi-ligne. Chaque match = 2 lignes (`NomÉquipe score`). Les rounds sont séparés par une **ligne vide**. Les sections Upper/Lower/Grand Final sont séparées par `---`.

**Single élimination** (pas de `---`) :
```
Team1 0
Team2 0
Team3 0
Team4 0

TBD 0
TBD 0
```

**Double élimination** (séparées par `---`) :
```
Upper R1 match 1 teams...
Upper R1 match 2 teams...

Upper R2 teams...

Upper Final teams...
---
Lower R1 teams...

Lower R2 teams...

Lower Semi teams...

Lower Final teams...
---
Grand Final teams...
```

Structure standard double élim 8 équipes :
- **Upper** : 3 rounds (4 matchs → 2 → 1)
- **Lower** : 4 rounds (2 → 2 → 1 → 1)
- **Grand Final** : 1 match

Les matchs pas encore joués : mettre `TBD 0`. Les matchs joués : mettre le vrai score (ex: `G2 3\nT1 1`).

`bracketFormat` : texte affiché en footer (ex: `"Bo5 · Fearless Draft · 3–12 juillet"`).

`bracketWinnerLabel` : `"champion"` (défaut) ou `"qualifie"` — label affiché sous le match final quand un vainqueur est déterminé.

`bracketDates` : JSON optionnel avec les dates/heures **en heure française (CEST/CET)** pour chaque match. Clés : `ub-{round}-{match}` pour l'Upper Bracket, `lb-{round}-{match}` pour le Lower Bracket, `"gf"` pour la Grand Final. Format recommandé : `"3 juil · 14h"`.

Exemple :
```json
"bracketDates": "{\"ub-0-0\":\"3 juil · 10h\",\"ub-0-1\":\"3 juil · 13h\",\"lb-0-0\":\"5 juil · 10h\",\"gf\":\"12 juil · 11h\"}"
```

**Rappel fuseau horaire** : les matchs en Corée (KST) se convertissent en CEST avec **-7h** (ex: 17h KST = 10h CEST). Chine (CST) : **-6h**. USA Est (EDT) : **+6h**. Toujours vérifier les horaires sur Liquipedia/lolesports et convertir avant de remplir.

Si les horaires exacts ne sont pas encore annoncés, ne pas inclure `bracketDates` — les dates s'ajoutent ensuite manuellement dans le builder.

### 5. Output
Créer un dossier dans `outil-instagram/presets/` avec :
- `post.json` — le fichier JSON du post
- `slide-1.jpg`, `slide-2.jpg`, etc. — images numérotées par slide (sauter les numéros des slides sans image)
- `option-a.jpg`, `option-b.jpg`, etc. — images alternatives quand il y a un doute sur le contenu
- `credits.txt` — crédits photographes avec sources Flickr

Si le téléchargement direct n'est pas possible, fournir les liens de téléchargement Flickr pour que l'utilisateur les récupère manuellement.

### 6. Import dans l'outil
L'utilisateur clique "Importer un dossier" dans l'outil Instagram et sélectionne le dossier généré. L'outil retrouve le JSON et les images et reconstruit le post automatiquement.

### 7. Description Instagram (caption)
Après avoir fourni le dossier/ZIP, écrire directement dans la conversation une **description prête à copier-coller** pour accompagner le post Instagram.

#### Structure de la caption
1. **Accroche** (1-2 phrases) — résumé percutant du sujet, ton engageant mais pas clickbait. Peut utiliser des émojis pertinents (🏆⚡🔥🎯 etc.) sans en abuser (2-3 max dans l'accroche).
2. **Corps** (2-4 phrases) — contexte, chiffres clés, détails importants. Aller à l'essentiel.
3. **Call-to-action** (1 phrase) — question ou invitation à interagir ("Qui prend le titre selon vous ?", "Swipe pour voir le programme 👉", etc.).
4. **Ligne de séparation** — un simple `·` ou `—` sur une ligne seule.
5. **Hashtags** (8-15) — mélange de :
   - Hashtags génériques esport : `#esport` `#esportfr` `#competitive`
   - Hashtags du jeu : `#LeagueOfLegends` `#LoL` `#CS2` `#Valorant` `#RocketLeague`
   - Hashtags de la compétition : `#LFL` `#LEC` `#Worlds` `#VCT` `#RLCS`
   - Hashtags des équipes/joueurs mentionnés : `#KarmineCorporation` `#Vitality` `#G2`
   - Hashtags engagement : `#gaming` `#esportnews` `#gamingcommunity`

#### Exemple de caption
```
🏆 Karmine Corp remporte la LFL Summer 2026 avec un reverse sweep historique face à Vitality !

Après avoir été menés 0-2, les joueurs de KC ont enchaîné trois victoires consécutives pour décrocher leur 4e titre LFL. Une finale qui restera dans les mémoires.

Qui a regardé ce comeback en live ? 🔥

·

#esport #esportfr #LeagueOfLegends #LoL #LFL #KarmineCorporation #Vitality #KCwin #gaming #esportnews #competitive #LFLSummer
```

#### Règles
- Écrire en français.
- Pas de mention @ (on ne connaît pas les handles Instagram exacts).
- Pas de lien (Instagram ne rend pas les liens cliquables dans les captions).
- Adapter le ton au sujet : plus sérieux pour un transfert officiel, plus hype pour un résultat de match.
- La caption doit tenir seule — quelqu'un qui lit sans voir le post doit comprendre le sujet.

### 8. Suggestion musicale (Reels uniquement)
Si le post est un Reel (format vidéo, `"format": "story"` + mode reel), ou si l'utilisateur demande un Reel, proposer **2-3 musiques** pour accompagner la vidéo.

#### Critères de sélection
- **Trending sur Instagram** — privilégier les sons populaires/viraux du moment pour maximiser la portée.
- **Énergie adaptée au sujet** :
  - Match hype / highlight → musique énergique, drop, bass (EDM, trap, phonk)
  - Transfert / annonce officielle → musique épique, cinématique
  - Récap / classement → musique chill, lo-fi, ambient
  - Breaking news → musique tendue, dramatique
- **Durée** — indiquer le moment clé du morceau (drop, refrain) pour caler les transitions.
- **Disponible sur Instagram** — ne proposer que des morceaux connus/mainstream susceptibles d'être dans la bibliothèque Instagram.

#### Format de suggestion
```
🎵 Musiques suggérées pour le Reel :

1. "Artiste — Titre" — [genre/vibe]. Utiliser le passage à 0:XX pour le drop.
2. "Artiste — Titre" — [genre/vibe]. Refrain à 0:XX, bon pour les transitions.
3. "Artiste — Titre" — [genre/vibe]. Ambiance plus calme, bon pour un récap.
```

Ne pas suggérer de musique pour les posts carrousel classiques (non-Reel).

## Bonnes pratiques éditoriales

- **Ton** : informatif, concis, engageant. Pas de clickbait. Court et punchy > long et détaillé.
- **Slide 1** : accroche visuelle (template `post-image` avec photo forte) — titre court et percutant.
- **Slides suivantes** : développer le sujet (contexte, programme, analyse).
- **Dernière slide** : souvent un `post-texte` avec signature "Macro" — opinion ou conclusion courte (1-2 phrases max).
- Le texte entre `*astérisques*` sera affiché en couleur d'accent (couleur du jeu).
- Eyebrow = contexte court (nom de la compétition, date, phase).
- 2 à 5 slides par post en général.
- **Privilégier les templates visuels/data** (`score`, `statistique`, `mvp`, `classement`, `tierlist`) sur les slides `post-texte`. Les chiffres parlent mieux que les paragraphes.
- **Max 1 slide `post-texte` pour les posts résultat.** Aucune si les stats suffisent.
- **Max 2 slides texte consécutives sans image** — casser le rythme avec des templates visuels.
- La description ne doit pas entrer en conflit avec le crédit photo (le texte par défaut est remonté de -80px).
- **Horaires : toujours convertir en heure de Paris (CET/CEST)**, quel que soit le jeu ou le lieu de l'événement. Ne jamais afficher les horaires dans le fuseau local de l'événement (ex: pas KST pour la Corée, pas PST pour Los Angeles). Indiquer "Horaires CEST" ou "Horaires CET" dans le footer.

### Structures par type de sujet

| Type de sujet | Nb slides | Structure type |
|---------------|-----------|----------------|
| **Résultat de match** | 3-4 | `post-image` (accroche) → `score` (résultat) → `statistique` ou `mvp` (stats MVP) → optionnel `post-texte` court (take/opinion, pas résumé) |
| **Breaking news** | 2 | `post-image` ou `breaking` (annonce) → `post-texte` (contexte + signature Macro) |
| **Transfert** | 2-3 | `transfert` (annonce joueur) → `post-texte` (contexte/historique) → optionnel `statistique` (stats du joueur) |
| **Preview / analyse** | 4-5 | `post-image` (accroche) → `post-texte` (contexte) → `tierlist` ou `classement` → `programme` (si applicable) → `post-texte` (verdict + signature) |
| **Programme** | 2-3 | `post-image` (accroche) → `programme` (matchs/horaires) → optionnel `sondage` (pronostics) |
| **Récap compétition** | 3-4 | `post-image` → `classement` (standings) → `statistique` (chiffres clés) → `post-texte` (bilan + signature) |
| **Bracket / arbre** | 1-2 | `bracket` (arbre complet) → optionnel `post-texte` (analyse des affiches + signature Macro) |

Ces structures sont des guides, pas des règles rigides — adapter selon le contenu.

### Posts résultat — règles spécifiques

Les posts résultat doivent être **visuels et chiffrés, pas des articles**. Minimiser le texte, maximiser les stats.

#### Structure obligatoire pour un résultat
1. **Slide 1** — `post-image` : photo forte + titre court percutant (pas un résumé, une accroche)
2. **Slide 2** — `score` : score du match avec logos d'équipe
3. **Slide 3** — `statistique` ou `mvp` : le MVP du match avec ses stats clés (voir ci-dessous)
4. **Slide 4** (optionnel) — `post-texte` court : une take/opinion en 1-2 phrases max, pas un résumé du match. Signature "Macro".

**Règle : max 1 slide texte par post résultat.** Le score et les stats parlent d'eux-mêmes.

#### Stats à rechercher par jeu

**Counter-Strike 2** — source : page du match sur HLTV (https://www.hltv.org/matches/)
- K-D (kills - deaths)
- Rating 3.0
- ADR (Average Damage per Round)
- Impact rating
- Format : `"stats": "Rating 3.0 · 1.45\nK-D · 28-14\nADR · 95.2\nImpact · 1.52"`

**Valorant** — source : vlr.gg (page du match)
- K-D (kills - deaths)
- ACS (Average Combat Score)
- Rating
- KAST %
- Format : `"stats": "ACS · 312\nK-D · 45-19\nRating · 1.77\nKAST · 84%"`

**League of Legends** — source : **RFT.gg** (prioritaire), lolesports.com en fallback
- KDA (kills/deaths/assists)
- Damage share (DPM%)
- Kill participation (KP%)
- Gold diff @15 vs opponent
- Format : `"stats": "KDA · 8/1/12\nDmg share · 31.2%\nKP · 78%\nGold @15 · +1.2k"`

**Rocket League** — source : octane.gg / liquipedia
- Score/game
- Goals + assists
- Shots %
- Saves
- Format : `"stats": "Score · 487/game\nGoals · 3\nAssists · 2\nShot % · 42%"`

#### Ton des posts résultat
- **Court, punchy, rythmé.** Pas de phrases longues. Fragments OK.
- Mauvais : "Team Falcons a créé la surprise en éliminant Vitality avec un score de 2-1 dans une série très serrée"
- Bon : "13-11. 13-11. 13-11. Falcons sort Vitality. 💀"
- **Les stats > les descriptions.** Montrer les chiffres, pas les raconter.
- **CTA binaire** : "Vitality ou Falcons ? 🐝🦅" plutôt que "Quel match vous hype le plus ?"

### Limites de texte par template

Respecter ces limites pour éviter que le texte soit coupé sur le canvas :

| Champ | Limite |
|-------|--------|
| **eyebrow** | ~40 caractères |
| **title** | ~60 caractères (avec `*surbrillance*`) |
| **desc** (post-image) | ~150 caractères (2-3 lignes sous le titre) |
| **desc** (post-texte) | ~400 caractères (le template a plus d'espace) |
| **standings** | max 8 lignes |
| **stats** | max 4 paires label/valeur |
| **tiers** | max 5 tiers (S à D) |
| **matches** | max 6 matchs par slide |

Si le contenu dépasse, répartir sur plusieurs slides plutôt que surcharger une seule.
