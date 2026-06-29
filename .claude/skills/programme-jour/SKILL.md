---
name: Programme du jour esport
description: Génère un post Instagram "Programme du jour" avec une slide par jeu (LoL, CS2, Valorant, RL, etc.). Tier 1 uniquement + scène française. Envoie un brouillon Gmail avec le JSON en pièce jointe.
---

# programme-jour

Programme esport du jour → JSON → brouillon Gmail.

## RÈGLES STRICTES

1. **Maximum 2 recherches web.** Pas 3, pas 4. Deux.
2. **Tous les matchs du jour** — y compris ceux déjà joués. Ne pas indiquer le résultat.
3. **TOUS les matchs d'un tournoi.** Si un tournoi est actif (ex: MSI), inclure TOUS ses matchs du jour, pas seulement ceux impliquant une équipe connue.
4. **Pas de commentaires/notes** sur les sites bloqués, le proxy, les sources. Juste les matchs.
5. **Ne jamais** vérifier le proxy, chercher si une équipe est française, chercher les dates d'un tournoi séparément.
6. **Après 2 recherches → STOP.** Construire le JSON avec ce qu'on a. Info manquante = omettre.

## Recherches

**Recherche 1** — tous les matchs esport du jour :
```
esports schedule [DATE anglais] all matches today MSI LEC LCK BLAST VCT RLCS
```

**Recherche 2** — équipes et ligues françaises :
```
"Karmine Corp" OR Vitality OR Mandatory OR Solary OR "Gentle Mates" OR LFL OR "Challengers EMEA" match [DATE]
```

Lire attentivement les résultats. Si un tournoi tier 1 est mentionné (ex: MSI), chercher dans les résultats TOUS les matchs de ce tournoi ce jour-là, pas seulement le premier trouvé.

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
