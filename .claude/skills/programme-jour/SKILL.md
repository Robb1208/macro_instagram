---
name: Programme du jour esport
description: Génère un post Instagram "Programme du jour" avec une slide par jeu (LoL, CS2, Valorant, RL, etc.). Tier 1 uniquement + scène française. Envoie un brouillon Gmail avec le JSON en pièce jointe.
---

# programme-jour

Programme esport du jour → JSON → brouillon Gmail.

## RÈGLES

1. **Tous les matchs du jour** — y compris ceux déjà joués. Ne pas indiquer le résultat.
2. **TOUS les matchs d'un tournoi.** Si un tournoi est actif (ex: MSI), inclure TOUS ses matchs du jour, pas seulement ceux impliquant une équipe connue.
3. **Pas de commentaires/notes** sur les sites bloqués, le proxy, les sources. Juste les matchs.
4. **Être exhaustif.** Faire autant de recherches et de fetches de pages que nécessaire pour couvrir tous les jeux et tous les tournois. Ne pas s'arrêter tant qu'on n'a pas vérifié chaque jeu.

## Recherches

Pas de limite de recherches. Faire toutes les recherches nécessaires pour être complet et précis. Utiliser WebSearch pour trouver les tournois en cours, puis WebFetch sur les pages de résultats (Liquipedia, VLR.gg, HLTV, lolesports, etc.) pour récupérer les matchs exacts avec horaires.

### Étape 1 — Vue d'ensemble
Rechercher les tournois esport en cours et les matchs du jour :
```
esports schedule [DATE anglais] all matches today MSI LEC LCK BLAST VCT RLCS CS2 Valorant Rocket League
```

### Étape 2 — Équipes françaises
Rechercher spécifiquement les matchs d'équipes françaises :
```
"Karmine Corp" OR Vitality OR Mandatory OR Solary OR "Gentle Mates" OR Joblife OR 3dmax OR Falcons OR BDS OR LDLC OR Apeks OR LFL OR "Challengers EMEA" match [DATE]
```

### Étape 3 — Vérification par jeu
Pour chaque jeu (LoL, CS2, Valorant, RL), aller chercher les matchs du jour sur les sites de référence :
- **LoL** : lolesports.com, Liquipedia LoL, leaguepedia
- **CS2** : HLTV.org, Liquipedia CS
- **Valorant** : VLR.gg, Liquipedia Valorant
- **Rocket League** : Liquipedia RL, start.gg

Utiliser WebFetch sur ces pages pour récupérer les matchs exacts, horaires et équipes. Si un site est bloqué ou rate-limited, essayer un site alternatif.

### Étape 4 — Équipes françaises dans les leagues secondaires
Si des tournois secondaires sont en cours (Challengers EMEA, LFL, EMEA Masters, etc.), vérifier spécifiquement si une équipe française y joue ce jour-là. Utiliser WebFetch sur la page du tournoi pour voir le planning du jour.

## Filtres

**Tier 1** : Worlds, MSI, LEC, LCK, LPL, LCS, Majors CS2, BLAST, ESL Pro League, PGL, VCT Champions/Masters/EMEA/Pacific/Americas, RLCS, CDL Majors

**Français (inclure même si pas tier 1)** : KC, Vitality, Gentle Mates, Solary, GameWard, LDLC, BDS, Mandatory, Falcons,Joblife,3dmax,Galions, Apeks. Ligues : LFL, EU Masters FR, VCT Challengers France, VCT Challengers EMEA (si équipe FR).

Pas de matchs pour un jeu = pas de slide. Aucun match du tout = pas de post, prévenir Robin.

## JSON

Une slide par jeu, template `programme`, horaires CET/CEST, tags courts.

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
      "matches": "05:00 KC vs T1 · MSI\n10:00 DCG vs TL · MSI",
      "showBgImage": false,
      "game": "lol"
    }
  ]
}
```

Format matches : `HH:MM Tag1 vs Tag2 · Tournoi` — un par ligne, trié par heure. Ordre slides : LoL → CS2 → Valorant → RL → autres.

## Livraison

Brouillon Gmail (pas envoyer) :
- **À** : robinpicard@gmail.com
- **Objet** : `📅 Programme esport du JJ/MM/AAAA`
- **Corps** : liste texte de tous les matchs du jour
- **PJ** : programme-jour.json
