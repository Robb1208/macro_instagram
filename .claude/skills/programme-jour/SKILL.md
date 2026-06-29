---
name: Programme du jour esport
description: Génère un post Instagram "Programme du jour" avec une slide par jeu (LoL, CS2, Valorant, RL, etc.). Tier 1 uniquement + scène française. Envoie un brouillon Gmail avec le JSON en pièce jointe.
---

# programme-jour

Routine quotidienne : générer un post Instagram avec le programme esport du jour.

## Règles de sélection des matchs

### Tier 1 uniquement
- **LoL** : Worlds, MSI, LEC, LCK, LPL, LCS
- **CS2** : Majors, BLAST Premier, IEM, ESL Pro League, PGL
- **Valorant** : Champions, Masters, VCT EMEA/Pacific/Americas
- **Rocket League** : RLCS Worlds, RLCS Régionaux
- **Call of Duty** : CDL Majors, CDL Championship

### Exception française (toujours inclure)
Tous les matchs impliquant une équipe ou ligue française, même si pas tier 1 :
- **LoL** : LFL, EU Masters (si équipe FR), matchs d'équipes FR (KC, VIT, GM, Solary, GameWard, LDLC, BDS, Mandatory, Misa Esport)
- **Valorant** : VCT Challengers France, matchs d'équipes FR (KC, VIT, GM, Gentle Mates, Apeks)
- **CS2** : matchs d'équipes FR (Vitality, Falcons)
- **Rocket League** : matchs d'équipes FR (KC, Vitality, Solary)

### Pas de matchs = pas de slide
Si un jeu n'a aucun match aujourd'hui → ne pas créer de slide pour ce jeu.
Si aucun jeu n'a de matchs → ne pas créer de post, prévenir Robin.

## Pipeline

### 1. Rechercher les matchs du jour
Chercher sur le web les matchs esport prévus aujourd'hui (date du jour, heure de Paris CET/CEST).

Sources recommandées :
| Jeu | Sources |
|-----|---------|
| LoL | lolesports.com, Liquipedia |
| CS2 | HLTV.org |
| Valorant | VLR.gg |
| Rocket League | Liquipedia, start.gg |
| Call of Duty | callofdutyleague.com |

### 2. Construire le JSON

**Une slide par jeu** qui a des matchs, template `programme`.

Structure de chaque slide :
- **template** : `"programme"`
- **eyebrow** : `"PROGRAMME DU JOUR"` 
- **title** : nom du jeu avec icône (ex: `"*League of Legends*"`)
- **showDesc** : `true`
- **desc** : détails du tournoi ou contexte court
- **matches** : liste des matchs, format `HH:MM Équipe A vs Équipe B · Tournoi`
  - Horaires TOUJOURS en CET/CEST (heure de Paris)
  - Un match par ligne
  - Trier par heure croissante

Exemple de contenu `matches` :
```
14:00 Karmine Corp vs T1 · MSI 2026
16:00 G2 vs Gen.G · MSI 2026
19:00 Vitality vs Fnatic · LEC Summer
```

### 3. JSON global

```json
{
  "format": "portrait",
  "game": "esport",
  "watermark": true,
  "gradient": 100,
  "slides": [
    {
      "template": "programme",
      "eyebrow": "PROGRAMME DU JOUR",
      "title": "*League of Legends*",
      "desc": "MSI 2026 · Play-In Day 3",
      "showDesc": true,
      "matches": "14:00 KC vs T1 · MSI\n16:00 G2 vs Gen.G · MSI",
      "showBgImage": false,
      "game": "lol"
    },
    {
      "template": "programme",
      "eyebrow": "PROGRAMME DU JOUR",
      "title": "*Counter-Strike 2*",
      "desc": "BLAST Premier Spring Finals",
      "showDesc": true,
      "matches": "18:00 Vitality vs FaZe · BLAST\n20:30 Navi vs Spirit · BLAST",
      "showBgImage": false,
      "game": "cs2"
    }
  ]
}
```

Le champ `game` par slide permet de changer la couleur d'accent par jeu.

### 4. Envoyer par mail

Créer un **brouillon Gmail** (ne pas envoyer) :
- **Destinataire** : robinpicard@gmail.com
- **Objet** : `📅 Programme esport du JJ/MM/AAAA`
- **Corps** : résumé texte des matchs du jour (liste simple)
- **Pièce jointe** : le fichier `programme-jour.json`

Utiliser l'outil Gmail MCP `create_draft` pour créer le brouillon.

## Règles importantes

- **Horaires en CET/CEST** — jamais le fuseau de l'événement
- **Pas de matchs = pas de slide** pour ce jeu
- **Aucun match du tout = pas de post**, prévenir Robin
- **Ordre des slides** : LoL → CS2 → Valorant → RL → autres
- **Noms d'équipes** : utiliser les tags courts (KC, VIT, G2, T1...) dans le champ matches pour la lisibilité
