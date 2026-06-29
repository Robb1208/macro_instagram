---
name: Programme du jour esport
description: Génère un post Instagram "Programme du jour" avec une slide par jeu (LoL, CS2, Valorant, RL, etc.). Tier 1 uniquement + scène française. Envoie un brouillon Gmail avec le JSON en pièce jointe.
---

# programme-jour

Programme esport du jour → JSON → brouillon Gmail.

## RÈGLES STRICTES

1. **Maximum 2 recherches web.** Pas 3, pas 4. Deux.
2. **Tous les matchs du jour** — y compris ceux déjà joués. Ne pas indiquer le résultat.
3. **Pas de commentaires/notes** sur les sites bloqués, le proxy, les sources. Juste les matchs.
4. **Ne jamais** vérifier le proxy, chercher si une équipe est française, chercher les dates d'un tournoi séparément.
5. **Après 2 recherches → STOP.** Construire le JSON avec ce qu'on a. Info manquante = omettre.

## Recherches

**Recherche 1** :
```
esports matches today [DATE anglais] schedule LoL CS2 Valorant Rocket League site:liquipedia.net
```

**Recherche 2** :
```
LFL OR "Karmine Corp" OR Vitality OR Mandatory match [DATE] site:liquipedia.net
```

## Filtres

**Tier 1** : Worlds, MSI, LEC, LCK, LPL, LCS, Majors CS2, BLAST, ESL Pro League, PGL, VCT Champions/Masters/EMEA/Pacific/Americas, RLCS, CDL Majors

**Français (inclure même si pas tier 1)** : KC, Vitality, Gentle Mates, Solary, GameWard, LDLC, BDS, Mandatory, Falcons, Apeks. Ligues : LFL, EU Masters FR, VCT Challengers France.

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
      "matches": "14:00 KC vs T1 · MSI\n16:00 G2 vs Gen.G · MSI",
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
