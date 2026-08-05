---
name: Programme du jour esport
description: Génère un post Instagram "Programme du jour" avec une slide par jeu (LoL, CS2, Valorant, RL, etc.). Tier 1 uniquement + scène française.
---

# programme-jour

Programme esport du jour → JSON.

## RÈGLES

1. **Tous les matchs du jour** — y compris ceux déjà joués. Ne pas indiquer le résultat.
2. **TOUS les matchs d'un tournoi.** Si un tournoi est actif (ex: MSI), inclure TOUS ses matchs du jour, pas seulement ceux impliquant une équipe connue.
3. **Pas de commentaires/notes** sur les sites bloqués, le proxy, les sources, ni d'étapes de réflexion. Juste les recherches puis le JSON.
4. **Être exhaustif.** Faire autant de recherches et de fetches de pages que nécessaire pour couvrir tous les jeux et tous les tournois. Ne pas s'arrêter tant qu'on n'a pas vérifié chaque jeu.

## Horaires — Source et conversion

**Source principale pour les horaires : Liquipedia.** Les horaires affichés sur Liquipedia sont en UTC. Toujours convertir en heure de Paris avant d'écrire le JSON :
- **Été** (dernier dimanche de mars → dernier dimanche d'octobre) : heure FR = UTC + 2 (CEST)
- **Hiver** : heure FR = UTC + 1 (CET)

**Ne jamais utiliser les heures brutes de VLR.gg, HLTV, ou d'autres sites qui adaptent l'affichage au fuseau du navigateur** — le serveur qui fait le fetch n'est pas en heure FR, donc les heures récupérées seront fausses. Si Liquipedia est indisponible (429/403), utiliser des sources françaises (team-aaa.com, actustream.fr) qui affichent directement en heure FR, ou le site officiel de l'événement quand il précise le fuseau.

## Recherches

Pas de limite de recherches. Faire toutes les recherches nécessaires pour être complet et précis. Utiliser WebSearch pour trouver les tournois en cours, puis WebFetch sur Liquipedia pour récupérer les matchs exacts avec horaires UTC, et convertir en heure FR.

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

Une slide par jeu, template `programme`, format `story`, horaires CET/CEST, tags courts.

**Direction artistique** : le champ `game` de chaque slide doit correspondre au jeu pour appliquer la bonne couleur d'accent :
- `lol` → League of Legends (cyan)
- `cs2` → Counter-Strike 2 (or)
- `val` → Valorant (rouge)
- `rl` → Rocket League (bleu)
- `cod` → Call of Duty (orange)

```json
{
  "format": "story",
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
      "matches": "##MSI 2026\n05:00 Karmine Corp vs T1 BO5\n10:00 Disguised vs Team Liquid BO5",
      "showBgImage": false,
      "game": "lol"
    }
  ]
}
```

**IMPORTANT** : le champ `matches` doit toujours commencer par `##Compétition/Tournoi` (ex: `##MSI 2026`, `##LEC Summer 2026`, `##BLAST Premier`) suivi d'un `\n` puis de la liste des matchs. Sans ce `##titre`, rien ne s'affiche sur la slide.

Format matches : `HH:MM Nom complet équipe 1 vs Nom complet équipe 2 BOx` — un par ligne, trié par heure. Toujours utiliser les noms complets des équipes (ex: "Karmine Corp" et non "KC", "Team Liquid" et non "TL"). Ordre slides : LoL → CS2 → Valorant → RL → autres.

## Livraison

- **Pas de mail** sauf si c'est une routine automatique.
- **En discussion** : envoyer le fichier JSON téléchargeable via SendUserFile (pas de bloc de code JSON dans la réponse). Pas d'étapes de réflexion intermédiaires.
- **En routine** : brouillon Gmail à robinpicard@gmail.com avec le JSON en PJ.
