---
name: Programme du jour esport
description: Génère un post Instagram "Programme du jour" avec une slide par jeu (LoL, CS2, Valorant, RL, etc.). Tier 1 uniquement + scène française. Envoie un brouillon Gmail avec le JSON en pièce jointe.
---

# programme-jour

Routine quotidienne : programme esport du jour → JSON → brouillon Gmail.

## IMPORTANT : budget token

Maximum **2 recherches web**. Pas plus. Ne jamais vérifier le proxy, ne jamais chercher si une équipe est française, ne jamais chercher les dates d'un tournoi séparément.

### Stratégie de recherche (stricte)

**Recherche 1** (obligatoire) :
```
site:liquipedia.net matches [DATE en anglais, ex: "June 29 2026"] esports schedule
```

**Recherche 2** (obligatoire) : scène française
```
site:liquipedia.net LFL OR "Karmine Corp" OR "Vitality" [DATE] match
```

**STOP.** Utiliser ce qu'on a. Info manquante = omettre, pas chercher plus.

## Filtres

### Tier 1
- **LoL** : Worlds, MSI, LEC, LCK, LPL, LCS
- **CS2** : Majors, BLAST Premier, IEM, ESL Pro League, PGL
- **Valorant** : Champions, Masters, VCT EMEA/Pacific/Americas
- **RL** : RLCS Worlds, RLCS Régionaux
- **CoD** : CDL Majors, CDL Championship

### Équipes/ligues françaises (toujours inclure même si pas tier 1)
KC, Vitality, Gentle Mates, Solary, GameWard, LDLC, BDS, Mandatory, Falcons, Apeks
Ligues : LFL, EU Masters (si équipe FR), VCT Challengers France

### Pas de matchs = pas de slide. Aucun match = pas de post, prévenir Robin.

## Format JSON

Une slide par jeu, template `programme`. Horaires en CET/CEST.

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
    }
  ]
}
```

Format matches : `HH:MM Tag1 vs Tag2 · Tournoi` (un par ligne, trié par heure). Tags courts (KC, VIT, G2, T1...).

Ordre des slides : LoL → CS2 → Valorant → RL → autres.

## Livraison

Écrire le JSON dans un fichier temporaire, puis créer un **brouillon Gmail** (pas envoyer) :
- **À** : robinpicard@gmail.com
- **Objet** : `📅 Programme esport du JJ/MM/AAAA`
- **Corps** : liste texte des matchs
- **PJ** : programme-jour.json
