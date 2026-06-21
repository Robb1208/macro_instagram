---
name: Programme du jour
description: Génère un post Instagram "programme du jour" pour le site esport Macro — une slide programme par jeu (LoL, Valorant, CS2, Rocket League, CoD), avec la couleur d'accent du jeu sur chaque slide. À utiliser quand l'utilisateur demande un post insta "programme du jour" / "programme du jour esport".
---

# programme-du-jour

Skill spécialisé pour générer un post Instagram **"programme du jour"** : le récap des matchs esport de la journée, **une slide par jeu**, template `programme` partout.

C'est une variante cadrée du skill `postinsta`. Réutiliser ses mécaniques (recherche web, génération JSON, dossier `presets/`, ZIP, caption, import dans l'outil) mais suivre **strictement** les règles ci-dessous pour la structure.

## Règles (obligatoires)

- **1 slide par jeu**, template `programme` sur chaque slide.
- **DA (couleur d'accent) par slide selon le jeu** — chaque slide porte la couleur de son jeu via le champ `"game"` de la slide (pas le `game` global). Voir tableau des clés.
- **Si aucun match prévu pour un jeu → pas de slide pour ce jeu.** Ne jamais créer de slide vide.
- **Jeux couverts** (dans cet ordre) : League of Legends → Valorant → CS2 → Rocket League → Call of Duty → autres si matchs majeurs.
- **Inclure uniquement les gros tournois et grosses équipes** : LEC, LCK, LPL, LCS, Worlds, MSI, First Stand / VCT, Masters, Champions, BLAST, IEM, ESL, Majors, RLCS, CDL Major, etc.
- **Exception équipes françaises** : toujours inclure leurs matchs même en petits tournois (LFL, LFL Division 2, VCT Challengers / Game Changers FR, etc.). Équipes FR de référence : Karmine Corp (KC), Team Vitality, Team BDS, Gentle Mates (M8), Solary, Mandatory, Joblife, GO2…
- **Horaires en heure de Paris (CET/CEST)**, toujours. Convertir depuis le fuseau de l'event (KST, PST, BST…). Mettre `"footerText": "Horaires CEST"` (ou `"Horaires CET"` selon la saison).
- **Eyebrow** : `"PROGRAMME DU JOUR"` ou `"PROGRAMME — <NOM DU JEU>"` (ex: `PROGRAMME — VALORANT`).
- **Ordre des slides** : Slide 1 LoL, Slide 2 Valorant, Slide 3 CS2, Slide 4 Rocket League, etc. — en **sautant** les jeux sans match.
- **Dernière slide optionnelle** : `post-texte` avec signature `"Macro"` si un commentaire/take court vaut le coup (1-2 phrases). Sinon, ne pas en mettre.

## Pipeline

### 1. Date
- Par défaut : **aujourd'hui** (utiliser la date courante fournie dans le contexte).
- Si l'utilisateur précise une date, l'utiliser.

### 2. Recherche des matchs
Faire des recherches web pour chaque jeu et **vérifier les faits** (équipes, heure, tournoi). Sources fiables :

| Jeu | Sources |
|-----|---------|
| **LoL** | lolesports.com, Leaguepedia (`lol.fandom.com`), Liquipedia LoL — ligues : LEC, LCK, LPL, LCS, LFL, Worlds, MSI, First Stand |
| **Valorant** | vlr.gg/matches, Liquipedia Valorant — VCT (EMEA/Americas/Pacific/China), Masters, Champions, Challengers FR, Game Changers |
| **CS2** | hltv.org/matches, Liquipedia CS — BLAST, IEM, ESL, Majors, ESL Pro League |
| **Rocket League** | octane.gg, liquipedia RL — RLCS, Majors, Opens |
| **CoD** | Liquipedia CoD — CDL (Call of Duty League), Majors |

- Croiser au moins 2 sources quand un horaire ou un matchup est ambigu.
- **Toujours convertir les horaires en heure de Paris.** Ex : 17:00 KST = 10h00 CEST ; 5pm CEST = 17h00.

### 3. Filtrage (appliquer les règles ci-dessus)
Pour chaque jeu, garder uniquement :
- les matchs de **gros tournois** (voir liste), **ou**
- les matchs impliquant une **équipe française**, quel que soit le tournoi.

Si après filtrage un jeu n'a aucun match → **pas de slide** pour ce jeu.

### 4. Génération du JSON

Direction artistique — **clé `game` par slide** :

| Clé | Jeu | Couleur |
|-----|-----|---------|
| `lol` | League of Legends | Cyan `#00c2e0` |
| `val` | Valorant | Rouge `#ff4d57` |
| `cs2` | Counter-Strike 2 | Or `#f0c14b` |
| `rl` | Rocket League | Bleu `#3b9eff` |
| `cod` | Call of Duty | Orange `#e8820c` |
| `macro` | Macro (générique, ex. slide signature) | Cyan `#00c2e0` |

**Attention aux clés exactes** : Valorant = `val` (pas `valorant`), CS2 = `cs2` (pas `cs`).

#### Comment la DA par slide fonctionne dans l'outil
L'outil supporte une couleur par slide via le champ `"game"` **dans chaque slide** du JSON (l'import fait `slide.game = s.game`, et le rendu utilise la couleur de la slide). À l'import, ça revient à **décocher "Appliquer à toutes les slides"** pour la DA : chaque slide garde la couleur de son jeu.
- Mettre le champ `"game"` **sur chaque slide**.
- Mettre aussi `"game"` au niveau racine = celui de la **première slide** (cohérence de l'UI au chargement) ; les valeurs par slide priment de toute façon.

#### Format du champ `matches` (template programme)
Chaîne multi-lignes. Lignes d'en-tête préfixées de `##` (utilisées comme titre de section : nom du tournoi / phase). Lignes de match au format `HHhMM Équipe A vs Équipe B BO<n>` :

```
## LEC Summer — Playoffs
18h00 Karmine Corp vs G2 Esports BO5
## LFL Summer — Demi-finale
20h00 Vitality.Bee vs Solary BO3
```

Règles de parsing :
- Heure : `15h00` ou `15:00` (`\d{1,2}[h:]\d{2}`).
- Le `BO<n>` (BO1, BO3, BO5…) est optionnel mais **recommandé**.
- Max **6 matchs par slide** — si plus, prioriser les plus gros / les équipes FR.
- L'en-tête `##` sert à grouper par tournoi (pas obligatoire s'il n'y a qu'un tournoi).

#### Structure JSON

```json
{
  "format": "portrait",
  "game": "lol",
  "watermark": true,
  "gradient": 100,
  "titleSize": 100,
  "slides": [
    {
      "template": "programme",
      "game": "lol",
      "eyebrow": "PROGRAMME — LEAGUE OF LEGENDS",
      "title": "Le *programme* LoL du jour",
      "matches": "## LEC Summer — Playoffs\n18h00 Karmine Corp vs G2 Esports BO5",
      "footerText": "Horaires CEST"
    },
    {
      "template": "programme",
      "game": "val",
      "eyebrow": "PROGRAMME — VALORANT",
      "title": "Au programme sur *Valorant*",
      "matches": "## VCT EMEA\n19h00 Team Vitality vs Fnatic BO3",
      "footerText": "Horaires CEST"
    }
  ]
}
```

- Ne remplir que les champs pertinents : `template`, `game`, `eyebrow`, `title`, `matches`, `footerText`.
- Titre court (~60 car.) avec un `*mot*` en surbrillance (s'affichera dans la couleur du jeu de la slide).
- Slide signature optionnelle en fin : `{"template":"post-texte","game":"macro","title":"...","desc":"...","showDesc":true,"signature":"Macro"}`.

### 5. Output
Créer un dossier dans `outil-instagram/presets/` (ex: `programme-<jj>-<mois>-<aaaa>/`) avec :
- `post.json` — le JSON du post.
- `credits.txt` — non nécessaire ici (slides `programme` sans image) ; en créer un seulement si une slide utilise une image.
- Le dossier `presets/` est **gitignoré** : ne pas commit/push. Zipper le dossier et l'envoyer à l'utilisateur (`SendUserFile`) pour qu'il l'importe localement.

> Les slides `programme` (et `post-texte`) n'utilisent **pas d'image** → pas de recherche Flickr/HLTV nécessaire pour ce type de post.

### 6. Import dans l'outil
L'utilisateur dézippe puis clique **"Importer un dossier"** dans l'outil Instagram et sélectionne le dossier. L'outil reconstruit le post, **chaque slide avec la couleur de son jeu**.

### 7. Caption Instagram
Écrire une caption prête à copier-coller (français), structure : accroche → corps (les affiches du jour) → CTA → ligne `·` → 8-15 hashtags (génériques esport + jeux + compétitions + équipes FR). Voir les règles de caption du skill `postinsta`.

## Rappels
- Pas de slide pour un jeu sans match.
- Une couleur par slide (`game` sur chaque slide).
- Horaires Paris + `footerText` "Horaires CEST/CET".
- Ordre : LoL → Valorant → CS2 → Rocket League → CoD → autres.
- Vérifier les horaires et matchups sur 2 sources en cas de doute.
