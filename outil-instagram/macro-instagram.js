"use strict";

// ═══ SECTION: LOGO ═══
const LOGO_SRC = "macro-logo.png";

// ═══ SECTION: CONSTANTES DA ═══
const FORMATS = { portrait:[1080,1350], story:[1080,1920] };
const GAME_COLORS = { lol:"#00c2e0", cs2:"#f0c14b", val:"#ff4d57", rl:"#3b9eff", cod:"#e8820c", macro:"#00c2e0" };
const GAME_LABELS = { lol:"League of Legends", cs2:"Counter-Strike 2", val:"Valorant", rl:"Rocket League", cod:"Call of Duty", macro:"Macro" };
const GAME_LOGO_SRCS = { lol:"LOGOS_JEUX/lol_embleme.png", cs2:"LOGOS_JEUX/counter_strike.png", val:"LOGOS_JEUX/valorant.png", rl:"LOGOS_JEUX/RL.png", cod:"LOGOS_JEUX/callofduty_league.png" };
const GAME_LOGO_IMGS = {};
Object.entries(GAME_LOGO_SRCS).forEach(([k,src])=>{ const img = new Image(); img.onload = ()=>{ GAME_LOGO_IMGS[k] = img; }; img.src = src; });
const INK = "#070a0d";
const TEMPLATES = {
  "post-image":{ label:"Post image", icon:"IMG" },
  "post-video":{ label:"Post vidéo", icon:"▶" },
  "post-texte":{ label:"Texte seul", icon:"Aa" },
  "score":     { label:"Score", icon:"VS" },
  "breaking":  { label:"Breaking", icon:"!!" },
  "classement":{ label:"Classement", icon:"#1" },
  "statistique":{ label:"Statistique", icon:"∑" },
  "programme": { label:"Programme", icon:"📅" },
  "planning":  { label:"Planning", icon:"📆" },
  "sondage":   { label:"Sondage", icon:"📊" },
  "tierlist":  { label:"Tier List", icon:"S" },
  "citation":  { label:"Citation", icon:"❝" },
  "mvp":       { label:"MVP", icon:"🏆" },
  "lineup":    { label:"Lineup", icon:"👥" },
  "groupe":    { label:"Groupes", icon:"▦" },
  "bracket":   { label:"Bracket", icon:"🏅" },
  "glossaire": { label:"Glossaire", icon:"📖" },
  "guide":     { label:"Guide", icon:"📘" },
  "edito":     { label:"Édito", icon:"▐" },
};

// ═══ SECTION: TEAM LOGOS ═══
const FR_TEAMS = new Set([
  "VITALITY","KARMINE CORP","KC","BDS","GENTLE MATES","SOLARY","GAMEWARD",
  "MANDATORY","JOBLIFE","LDLC","BKROG","GALIONS","MISA ESPORT","ZERANCE",
  "3DMAX","FOG ESPORT","LYON","PARIS M8","OG","BOOSTGATE","SIKO",
  "ULF ESPORT","BSK","ICI JAPON","PHANTASMA"
]);
function isFrenchTeam(name){
  if(!name) return false;
  let key = name.toUpperCase().replace(/[_\s]+/g," ").trim();
  if(TEAM_ALIASES[key]) key = TEAM_ALIASES[key];
  if(FR_TEAMS.has(key)) return true;
  for(const fr of FR_TEAMS){ if(fr.includes(key) || key.includes(fr)) return true; }
  return false;
}
const teamLogos = {};
let logosReady = false;
(async function loadLogos(){
  try {
    const resp = await fetch("LOGOS_TEAMS/logos.json");
    const names = await resp.json();
    let pending = names.length;
    if(!pending){ logosReady=true; return; }
    names.forEach(filename => {
      const base = filename.includes("/") ? filename.split("/").pop() : filename;
      const key = base.replace(/\.png$/i,"").toUpperCase().replace(/[_\s]+/g," ").trim();
      const img = new Image();
      img.onload = ()=>{ teamLogos[key] = img; if(--pending===0){ logosReady=true; render(); } };
      img.onerror = ()=>{ if(--pending===0){ logosReady=true; } };
      img.src = "LOGOS_TEAMS/" + filename;
    });
  } catch(e){ logosReady=true; }
})();

const TEAM_ALIASES = {
  "KARMINE CORP":"KC","KARMINE":"KC","KCORP":"KC",
  "TEAM VITALITY":"VITALITY","VIT":"VITALITY",
  "TEAM BDS":"BDS",
  "GENTLE MATES":"GENTLE MATES","GEN":"GENTLE MATES","GMATES":"GENTLE MATES",
  "G2 ESPORTS":"G2","G2 HERETICS":"G2",
  "TEAM LIQUID":"LIQUID","TL":"LIQUID",
  "CLOUD9":"CLOUD 9","C9":"CLOUD 9",
  "NATUS VINCERE":"NAVI","NA'VI":"NAVI",
  "100 THIEVES":"100 THIEVES","100T":"100 THIEVES",
  "TEAM HERETICS":"HERETICS",
  "FNATIC":"FNATIC","FNC":"FNATIC",
  "FAZE CLAN":"FAZE",
  "NINJAS IN PYJAMAS":"NIP",
  "VIRTUS PRO":"VIRTUSPRO","VP":"VIRTUSPRO",
  "TEAM SECRET":"TEAM SECRET","TS":"TEAM SECRET",
  "PAPER REX":"PAPER REX","PRX":"PAPER REX",
  "GEN G":"GENG","GEN.G":"GENG",
  "T1":"T1","SK TELECOM":"T1","SKT":"T1",
  "DRX":"DRX","DRAGON X":"DRX",
  "HANWHA LIFE":"HLE","HANWHA":"HLE",
  "KT ROLSTER":"KTROLSTER","KT":"KTROLSTER",
  "TOP ESPORTS":"TOP ESPORT","TES":"TOP ESPORT",
  "JD GAMING":"JDG","JDG":"JDG",
  "EDWARD GAMING":"EDG",
  "BILIBILI GAMING":"BLG",
  "WEIBO GAMING":"WEIBO","WBG":"WEIBO",
  "LNG ESPORTS":"LNG",
  "LOUD":"LOUD",
  "FURIA":"FURIA","FURIA ESPORTS":"FURIA",
  "MIBR":"MIBR",
  "PAIN GAMING":"PAIN","PAIN":"PAIN",
  "SENTINELS":"SENTINELS","SEN":"SENTINELS",
  "NRG":"NRG","NRG ESPORTS":"NRG",
  "LEVIATAN":"LEVIATAN","LEV":"LEVIATAN",
  "KRÜ ESPORTS":"KRÜ ESPORTS","KRU":"KRÜ ESPORTS","KRÜ":"KRÜ ESPORTS",
  "TEAM FALCONS":"FALCONS",
  "MOUZ":"MOUZ","MOUSESPORTS":"MOUZ",
  "HEROIC":"HEROIC",
  "SPIRIT":"SPIRIT","TEAM SPIRIT":"SPIRIT",
  "ASTRALIS":"ASTRALIS",
  "COMPLEXITY":"COMPLEXITY","COL":"COMPLEXITY",
  "GAMER LEGION":"GAMERLEGION","GL":"GAMERLEGION",
  "BIG":"BIG",
  "FLYQUEST":"FLYQUEST","FLY":"FLYQUEST",
  "DPLUS":"DPLUS","DPLUS KIA":"DPLUS","DK":"DPLUS",
  "FREECS":"FREECS","KWANGDONG FREECS":"FREECS","KDF":"FREECS",
  "PSG TALON":"PSG TALON","PSG":"PSG TALON",
  "GAM ESPORTS":"GAM","GAM":"GAM",
  "SOLARY":"SOLARY",
  "GAMEWARD":"GAMEWARD","GW":"GAMEWARD",
  "MANDATORY":"MANDATORY",
  "JOBLIFE":"JOBLIFE","JBL":"JOBLIFE",
  "BKROG":"BKROG","BK ROG":"BKROG",
  "SK GAMING":"SK","SK":"SK",
};
function findTeamLogo(name){
  if(!name) return null;
  let key = name.toUpperCase().replace(/[_\s]+/g," ").trim();
  if(TEAM_ALIASES[key]) key = TEAM_ALIASES[key];
  if(teamLogos[key]) return teamLogos[key];
  for(const k in teamLogos){
    if(k.includes(key) || key.includes(k)) return teamLogos[k];
  }
  const abbr = key.slice(0,3);
  for(const k in teamLogos){
    if(k.slice(0,3) === abbr) return teamLogos[k];
  }
  return null;
}

// ═══ SECTION: PLAYER IMAGES ═══
const playerImages = {};
let playersReady = false;
(async function loadPlayers(){
  try {
    const resp = await fetch("PLAYER_IMAGES/players.json");
    const names = await resp.json();
    let pending = names.length;
    if(!pending){ playersReady=true; return; }
    names.forEach(filename => {
      const base = filename.includes("\\") ? filename.split("\\").pop() : filename;
      const key = base.replace(/\.(png|jpe?g|webp)$/i,"").toUpperCase().replace(/[_\s]+/g," ").trim();
      const img = new Image();
      img.onload = ()=>{ playerImages[key] = img; if(--pending===0){ playersReady=true; render(); } };
      img.onerror = ()=>{ if(--pending===0){ playersReady=true; } };
      img.src = "PLAYER_IMAGES/" + filename;
    });
  } catch(e){ playersReady=true; }
})();

function findPlayerImage(name){
  if(!name) return null;
  const key = name.toUpperCase().replace(/[_\s]+/g," ").trim();
  if(playerImages[key]) return playerImages[key];
  for(const k in playerImages){
    if(k.includes(key) || key.includes(k)) return playerImages[k];
  }
  return null;
}

// ═══ SECTION: ROLE ICONS ═══
const ROLE_ICON_DATA = {
  TOP: "data:image/webp;base64,UklGRnAFAABXRUJQVlA4TGQFAAAvd8AdEFWHgrZtmIQ/7P0hiIgJYOxf0oqmSlceq6MhGVEZjoZyatuWZaXMkbdvvLPP75WgnsH7t86lb7YnMtRhBwG4I0USEg492R9k3wVOcHEF0IggLS1k1dhABxYYZAhACh4wVXJIX1oefvokIQAR7XFCJ6YkYOk3mcNIklXlp/Bx2ZnFHVIk9O84kiRHWdfxTMvpqkFr+OOF2wAAyCbaXFtbcEanXtN08gexpl5gTLZtj71kAuRk+ydJypocC2OjdRBttl31/1cfnOlK6+wPW93//Cejn6fNTY4JRKABFXvawgIyRkPLQAMCSFFBhK5LAw7IkDIuJsMHZlCx4UjhVHMJmHRErCQs4GKvECtjCBeblgSutFI3kWQL0SLions78+KfYgAT+EG627aNBGmu8796toBPZy3NXnTh9QNHkiRFkjUuvpaZmXnl/QvzfgIOtdOuuyongGdZr/KTjZykpBdaJ19JEN4Jf7k8CV8Na5kX1Q+qPzS7hLBhHfLldXkbuXBh0Ky5oDS4ZMPsrId3GWx8B6qvgoAHosqNapEYfSYwuArw4sXNMSGaNPLqDo0zX90OYiUl9KFCrO7QMFOaJ4QqJaCORXaEMmAah9e7AHUsw4x4luogSesqS3VQZ+wAh4bTB2WpEdSZ/3YCqj2MNiFd6GAYZuXfa0wbqHIJSJPcEirEDPzyQQu5t/t+fzQHMSs+Mz5dK+fu11TXJXqR88D1ExQPWfamAZoXHVAmzk4q60/rdhNSJ7Y4gSZIm27dnBW5/Jum0K2ndYC09x8Q5bjzKCVBztCSeae/c+NSniKSp3WA1CmrnQcoAzfSnkMqqUX/f08Nk0W7CalzS0HRsIEOgAvRalqWwe9L27i4G76/mdLsLPpNSKfEduoUUQEbhQFkBFmmRci/Cf+42XA5ERz95mbPzYMk9gNy5+L65EbQpL0FDgHj1OLkDHSWhfebMufieu2GaEq2JfrA4hn0W9ED329B7JTjxVPbGmQzjH44wwHq7FxZlleiKnVbIj9Oof0AfVIiP84Dxff60rDLzw1ugZgT3TPsIjst1bNNbGtS4qg5cYpHTvQJ6UWecIAGnDTpZ6quzAPR/mlRg5Qa5jXX3Lx0rRlkKS7sKr5A8tCkklSjCxSvJr24PqG2Dc5nKe0C9K/JAXhpFHhS+FWXdrG17A7faOqgqfZmo4AuyGJpXw7rHr3ajEaHk/NGEeUvPhk2KnZfdGXc8H4NdZ+06O/5pNH3Um7bti14fW2zcF1peNt5jNb4bE/bvHnpHp9RoYllDqAsq1K8tBvn2UfQ+axGpw7hhExPHPQupZBF3meA+3cGPfSxSN+Xj1Hn+kSnnpFTLY00ihnxD+1QnKHX5yMDZcaZpjobvKU2oc6nX/9TrCTfLWcB6oynmZCRJr4FqHO63DeliXYT0tZreGSYIFxwxwLOqc0Z+NBID/0mpL1pgOxH5+UHSZ1+spVdQxnA9Aw3IXdW448Ui7t3w/vq0mzlMVa3E/9ABil9irf31nT4GQuRc//j4QCR1Tx+3fUfcPknOoqESoP4NiMwOFzdDmITUue27pEgG4Te8zqKDCIhi++XjvhMYYfxzy5A6tyGCIMStV+3R/cPLcxeU0oFSD/zobQlTTbDMI/gPTGcRWgDpM7q8nbVbXFj2NnH8PUKo01Ip6xeV3vdg/xu2IV1myAoXck/gB5S5/ZcYfs1TFynq3e+rKv8okQWOpkTt5dzPiiRB7kTN5zzQYn8TLl4Xru1JW0MIz/OtwrSh6Iy7My8Bl3MEukp9/bvAc8K87v/7bwL2UNaaSxQLa8YTO6L2OXZY0NnV0WKaajeGwbk5iZz1nA=",
  JGL: "data:image/webp;base64,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",
  MID: "data:image/webp;base64,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",
  BOT: "data:image/webp;base64,UklGRrQFAABXRUJQVlA4TKcFAAAvd8AdEDWHgrZtmIQ/7P0hiIgJYGx3BSQqRU4zUDtlLthQ2kpbGfBZTv9Pkqw8k5wC1sboINrsTVd19yx3utIm26O6m/soATMasLA6SMn784wQXummI4Lszi8lWCAnvFK84AAJfD7lAaI7fjIIEXAjYbVwdThRJ47aSJKkXBD3dkbUe75DoEksn2G+biNJkpQ5z8ET9DUAdbarhh8RHVMgx7atKqqnaBSE6O7uzphc3EkC2mc9e3LPBMiJtv+RmyOn4Bx39vf9nCMNsf9fWsXqpWE2AqHKIyxOMFT+nCME9wawlV3nHErP7AiLa5NxH2koIVgYy+EoCILnStFQ47BtI0faGj7vnaX5nPMX+K27jSTZVX7qxISJqeHtzKK1T5EFHAEASFXZtu2O0dRpMNm2t25g+6H62Zoa/0kmgE+wPtFmqMJttQnVM5N1YFKX9CVN01aBbphtKJnKeLLrjcJrKUbjouQi3Up2xXnT4U/4EKkZFbH2L8Y0Nm66gBKoMC9JAeFRNJftyyWYyJOtWgAXphB0cjLIH9ieeLT+E4rwlFae8joWdIRDMPmUb4Y6vjkEyXVOPAylwykvC/vPTzZBzxaIA/B8qA6HILXOwfhgrgGEMtcp5r26suppmF1vLP6RGosUZ4SNhm9ufVdX9/JqLtt/uASpxVUcs8QC6mrfbCB8+K/y5GjV/H0anjRhSox3S4C5Few2AObtvfKNJLtNMGlqh9NBWEyswhA3IgD8oGQCmC77UWHxRqOFbYLUjn8pHFkCjQ7QX0V8EzKFPLkKnpJH7wvubr4ihW8EqR8Zj59e15EF6NFmRIwMCIkAm3nVmnlSZvua8tJIXmsM5jAfmXxoBOkd1OGGbRxUEmCI0odb8wQuNqTGjmHS+6KBAEkEK5ESPI64NzHRZphwcIXU2LAqLSPQiG9C7dY8gdsJf0swrjSteK1YSnBSsUsW15krrFTGrt5IcGIapyWQqp1YDT5LcDp+qGrREmfEZQkPx5IpGeKNuiwhKrlnV1opixOeLB8fGaLvp44BMxpgFG/EDRlAesg3J10fvWYscSPeIL5JgF7xHvZp/2xkCRFmaQbm+AiLDxIeSzPC6VE+LFjpfOH1rndCHc6xcbA7fGq15B5dnsl89NkK6nCseJvuBceOimxNfz7GyeD8Kr8t/DC7FIIdFcyFd1M7g3yV55arQUcfCZ9OHHOiyi3lqJ2c6mqQg3rS2sk7dgK2Z0+vzNQzpp5xldqK7r7D78LTmW5K/63qa7UJseX4aZ/BNTfOIwz7rZl+P0K8R4ZhYUuW8Mrl6XrYrdrKeb4+Klhq68LMt6SEVwYOY++V07RF1zHpZM6KdHRsQDZJ1R8yT0qWJqF60clF1jV++OJZmXx+CcHn+ab+3b8fiRUmnfrXG6H3fJ+TaJh8Kicn1+DR5YLMCpPPotmzxeA1Vph8SuHZaOQaQXKxW25Sx/uKMuDFhVJ6FkSPvhZkguTI5Df5twPVT4vxI5M9jeDJP6PEdfPUzeE3bV3Outki/hsAIhETQIqgyFma+M9XJo0dY5N9tn8aj6g/74GB0BJuhcBzK5Luisk/UmPDZ1Z9pi/Tzm3D7HbZHaldjwuThtR0jvFDoSK2B4bE+bl5aNySphf4R2p6UaR4WQuVmB6QxHsyE0nZvTAJUmMz3i1xpXLTgM/iu4a7e08vEUFqV98Otuv8qnKsWuNscVm8ByPPP3klSG9Up7Uy6rKEgOBJO+Z1763+k2JIgrDCpHHBilu3799IGJIXDStuAyvolxKcts4SRVqWOrRAq28SnNQO5x9UvY3u334jwYk8nksQYPLlPBYvwfnIw+kgMPMvWm2W8HBSuN54mZde1Qs/IsD6JjE4S6mZzX4buw0qwVm/VkIHplENbwKJce0y1l+sn/ceeFaXF+If4oPT3EK+aL1M4oTiAA==",
  SUPPORT: "data:image/webp;base64,UklGRioOAABXRUJQVlA4TB0OAAAvd8AdEDVZmv5/dSyl3ySvp18BruPayf//O5GWq9gt9vOerM85SbpPr7Avbie4X8Et2Nngts8KaqQZ5FTjK3dnRa9pnD/SOOTiEiy4u3tvcQg20lXjg7u7u9uq0XHLDtc/7noby10Ed2jc7Y7dCW7NoVi5juDuls0owYOlakpyI0mOJKUAx3l3p3tk9S3f/Y0Co8Tqs5qP5EiSHDnqVRLyAGpAhfni+M5OVWZkzxI7zsnz9IAsSJJN27ob17Zt27Zt28azbX3Ztm3bto1r771WTwCWz36Iy3vJUJZeize00hosQjpqDcbIqHdZkipOaoLOpJqaBrcOH7XuWSOjdv5yzyOWvVay7LUi2MtaK13uOsIbd4+Yq6mBjfj3szyX94QJhSGeDAed9GB5BMLrDMsGDx3eGCQIJQFYIrpXAlFSgzGkUevAYKjXsxo33ztJaCikPwLHtyAMqVcVD1LzPQGKhgypR8ODRGo1gN4XzoBKPwYL9yZbRT7HSZPQROJcv6MTI1jGM0o9SkJpTffZ4IYS0NA0OV4Nak/FVMaTB3VZcHjm03BC45yO8NOyQ5bIGw8s+P6dvAh3emKEZsa40ps3LBgxvQ8OCkru6AhFRweDFFwXxmzD09VQmYaCSPCu/ADqboQNw6ZaONLLK6dBQcgFJ3eSB7DJChPGLeD/ViqkjlSkwYMQnPrz3nMGCONCHsMzzZX4UXkELkIwrhB/4fB30xx5GHkK7CgfX/TFb2NwYINPcLUfIAVjnwoukuqPel7ZEkjLK/2jns9gKhj9EPVeEm5o844FD4ajzzn0DfaPFAxfhMGbVVEZYHSLCIuaJ8I1VGhBYH6Ss/4xHD3OL8Yrff0hBQFtEa6hAjW15DYYWwsC3T690vTQr+IciNYRyhU83a+8/95pQUDbzqKmeg5ZerpDvdvJzbUu3jWQzcWHeXbbTEkNxtJCFkqfnDz6ty8GE6L29t4e/IfN5owMtK3MZk62Z9e6eNfAf25j/pFxiT/9d3nnEV2naI/Z0GNtCHWP2egy1wldZyNuWVB6Lb49rwUBZicqYdgTEy6kWnHrJ3KpJAho59vH/P1u9nPP/4W6f2Tcxn2A/sqUN2d9EUgGuQwRHgk118OKFvw2+f0S7/9J5/NaJTWY0npgwaB9RhLiSOnspMBCOw6R1crnX/f77wze7nihvsWa/sjl7MJIgXpXc/dcWZ4e8caEZYoy1EVPLPgiwlsLut29koatAcsyCa+MF6UsPm1rY9oWNG1MNugijynKUP/heLPu4OVIwSypZ2YyJkXe+E+cCw2VLHqC4A1wkYWvQ1YDpuj59608x6crRigWd8H1afpdCsKEZhav+9WfP1CUoU7Hj3SayT5mAhi1Dmw72IEzm9z2j1DgBk5oZPExvV3JQhNZDZgY/mHXJ/Q8Hn/rkPdXA5jQzMLcfe/HFGVonbsWPsD1nYFoXyuq2zYWy39ZJvMJj/pjKJgWQyPTHk2iXC0ALA2EcRvCXdTuPjvC0LSALUWnTMvQFk/UuNMzbAa2DfUMAGXrQDd54BsJjSwRiyGRjiLwjUGtRZZlaUDAvWZy2ewpENAsrcFa1sTPntuRIS0Obpz5CGsAkIFegSHO98psPJPJ7yoL3lhkieCEQsq5/Yqe4bpmXiPAvHndM7xibhlSZ6PTb3rVY98bAoEeYoh6Lwnay4WZrYoe6DIFBYv1XBAKJ+dPE9fMRUu8fyUNoWVZWgKnfemNc04oLl7/vfuc4kKvxfyHQOCi3S6t4pW9Ejg51NlcJC00BU9yoB5MvrP7XlMyEBo6BW65++98bsMy+E1txeZObg6ldmO3CwR1zDyGfvqtSCrebY5M36woQpo0BU1yTR7jjenIM5PRq4oPLIU1bPYxX5VBb4qM2zz9IW+8xPt/SsiPiWB/bIjLe8ksfkQQsEWP7qyI4Am0MDcFSNmkri9S4OEHUQFoD6wdfXnyoxDR16QuZf+5C6u6VcsW+/4I2cTHEEK7HUhU/Fm1OSkmfZykTx66068QVS234Y8xt576riko+MiPYKmIakLFwlJeW4HkyNj1euZuvFNUdaLOQ8u5fjPofQmg3UaIhQ0AI/18reQ6ZzyRyRTtI32b8GvS30i+t7a2MvNz2vHm1tNtCtSajalQvVfd8+GS2zMD/DS8yWqYCodeo565x5v2Qa2tra3Tfv5Jc3EzZeS1JzwYAGyBmpiBbhNlmb7TRiMa6QKXXupORQrIArwZx0wiUink3WY8kAVSuMmXC2mNSHTaI8GE7gxqcFZYpR+DzYfD4VEuj5IY4YyRL7pTNY3BUpNEbCZ54HqMHvKAhRH2q7o/uuyzfwy/di/gMs/0xVeG2N5rwALyeNeUzUkNOfjKfvsObRhhLeFwOJ+3RBa1U4BevkvxYXMzwajU0XUKLOxGAoAJEneO32QVeVO25PWX22aZvCn7f3GHCSCBc2V1yFgzn2weAIFaLUC41qeQbNJyFEGSdItKCq5Jav+dfkDBb6/9gZ123AQpFY5bi3M7Wk3J07HMOpTcBlOrbNDevoruUwItSu2IPwLhb8ouV4RVmGnpOSeQjBCIvoD6Wfd+7g+phEEpF26+RiNasjjoJ+5dfhC1KIOhOKsp6unTCItSJ2HyAJZ5G6XXwQMQOIR7srLbKsRkMilja2TJSgsCwKWxzwe06JBPbBz7xMjUHoD01vIRilJ3gZolSAGw4FpnbR4unrdNSinbzvvVRWEBSIFnLi5I3cVV8GQbaq8Jrpv+KPU3kAwQRCIPIAzGdOD4V6GlWkuB9C92TgeEAeTx9P036JLyj0Q3w6wlo9Ydh7t6cF+nvtxECv6WQHUTpMKq0uBBkKqxK/8IJqr3uhZP8m2inL7O5F0xW60Iw/UreueMRvTJThYOwKqWhaJreswGLqNq3Iz2HxOZaha22Cn1R/xpEHrqMnoI14JR68BYoPbWaFrq76AAapVDAMiAXhYpt3NVZYR6tfpN884qevkuhQwAAR7K+nfok+ko19tgiZqXgis0deYCmfsKVf2kj+oCvmNV5/p676Jasfc1JoZAdepV/wpzB5LrdDfNuHSNuy5G7oR64s5Xzir15xpYcttSsUHKlMtAzlFzmlgyeH3YKhaHWw1N+uSsr/SqzgVx3Rpmwb3L0Ivu3serxQ7SxNGVjrozp0JVoOxMQJdp1EvN+q5TOCOECu4dTetyIh3/uI9H7o2wvzeCVbNKboMB9S7LIYvrc1/2anLeAolYzGm17IJ69VIDmG5snlVr1uYDQpPRng9o0coVk4XzPufL3177ZpCtWQDyIG3H9TKC5x402HU2TDRrvVq6wPHXlyOjQrVw1N7Y2KLVEiW8aTcqGbyc46+FtFr9rBM9Q8FDHF485MDIozbaAH0/KruTckJHqP2zSwqVadoWS0spk3GerE1A/ZYsedLgaDkN7snTzagACW7WxpNSynSs7ecL8/YvUkfcK+WrB2zUTjshML9nL38Fz2bkdlVqtOsUct+JyNgaaZSNkttg1MoeW4O0KHW3DHOPptqodWCgqKzu2fAdGflOrusU+nyB8BzaKmB+iISNWmunLi2wU2byx/5J99ngCTSW5DBA2g6WGlsKmkif34YHB6lZODCH/mJsVVsj3c9gO1vJ3ynEpVM2aneqHajcn+RORjBe0S8qbQyk+HiPL4taSQ0JobbXBn0NPHSoCVC/UePD8YGVNkheusnEk/21pIYE2lMwwLWmBMKLuteMIrlF0AxtZnZ06ut8hBqAZxPcLpsZvWgYIrVWGKQdBkD1XSqlg4c3gcyqI7VDAFQLZ8NIhYBmBsPcf9Ik6W/Q13CzHSGjBggBw7bgGmK+U9BXiCndsbC0jNwEm0yQHfo6JMcTYdYFpdfBg5n9vWWAvT+NS9cFJgienzetL33eVcGsAyyQMiX93R/B0edEW8vub2awjM8ENak89DYE0kDQ556kwTS+BHgzXXbk9OU65GmQML4BoGb/F1tkgC1f/BgGGJ6wF/M+OAq3Fk4GklyY5PZubGF0JkY+d0eC9+URIoFEnkbNB1efnWAaXQosM/1qr0wHkn7l1VzZM5AyugG4dzySCyQXid8bA4wuATbZ1H1tiMmAY29lySYkDM6Cf0qFmwtV02gLrO3KBBe6fH2hCsvYTJSJO+m3URIxsGSU5N0GYBrbHUA6YzyZDiwt38IkE3cwtgRIjdlaTAYxtrWbI2FoQoDLqh6zgZvRYHyn+yooehVKboMRRmbBtVZtlpzfRVsw2nbByYVFYRmZCTY4k/7cUAxGsYHwl5XBNLJLg+KYRgLRCYYza+PmcWkjy4Nwbc+1YTwZ1PF2NCbyBiZAtUgxWDkwFpzYfRhZuScI47Ix1NtZm9ClxmRwklHCl58K27gslM1uw6WTAtLBSUuSzlvCMjKGgrpOISaDHMt+w8gAQnXZKwTrCtm3w8hTzKypUEgGK1lh4zUJ48pg9RweFSLBihQ4PKbzqIyMcQ3x8F5DCf/Oy4zYFJymMc97xV8ZF4CymTmK+nxeCkI6GGmKhVsp8vlbMHIL7nO1YnLGH9PHMCGBvf0x5WnCzBn3iRUsI8Oodcehci8NF/ucilFf7ycG8sTex774GzAbjL390mEFJRP+Ho/oi8Q5/tEvfOl2GH3ehPvAiuD0A/rr6f+AI7uPmxXMPIzfLq0HFpX1JMeSOQUvog5pVLu58+jCn3+HQ9ioEy3gR8z5c6LHFKVseUxvZn6/CrBQZ4bhO1Yr1j7nj+ggjskuBp0pcSWEUZdaoPO9MpcFHj3Su7cXjRx9m7BQt+bnxytIf+TyyQVZmD+PutYyQW7uE8C0UAengBTqZtPE8vMDAA=="
};
const roleIcons = {};
(function loadRoleIcons(){
  let pending = 0;
  for(const r in ROLE_ICON_DATA) pending++;
  for(const r in ROLE_ICON_DATA){
    const img = new Image();
    img.onload = ()=>{ roleIcons[r] = img; if(--pending===0) render(); };
    img.onerror = ()=>{ if(--pending===0) render(); };
    img.src = ROLE_ICON_DATA[r];
  }
})();

function findRoleIcon(role){
  if(!role) return null;
  const key = role.toUpperCase().replace(/[_\s]+/g," ").trim();
  if(roleIcons[key]) return roleIcons[key];
  const aliases = { "JUNGLE":"JGL", "JUNGLER":"JGL", "ADC":"BOT", "BOTTOM":"BOT", "SUPP":"SUPPORT", "SUP":"SUPPORT", "TOPLANER":"TOP", "MIDLANER":"MID", "BOTLANER":"BOT", "ADC (BOTLANER)":"BOT", "ADC (BOT)":"BOT" };
  if(aliases[key] && roleIcons[aliases[key]]) return roleIcons[aliases[key]];
  return null;
}

// ═══ SECTION: STATE ═══
const state = {
  images: [], active: 0,
  format: "portrait", reel: false,
  game: "lol", customColor: "#00c2e0",
  watermark: true, gradient: 1,
  titleScale: 1, descScale: 1, zoom: 1,
  descColor: 0.75, imgBright: 1,
  hiColor: "#00c2e0", // auto-synced from game color
  dur: 2.5, trans: "cut", kenburns: true,
};

function newSlide(img, name, tpl){
  return { img: img||null, video: null, name: name||"Texte", tx:{ox:0,oy:0},
           template: tpl || (img ? "post-image" : "post-texte"),
           eyebrow:"", title:"", desc:"", showDesc:true, score:"", showScore:false, scoreY:0, textY:0, textDrag:0, logoA:null, logoB:null,
           badge:"breaking", signature:"", teamA:"", teamB:"",
           standings:"", relegationLine:0, stats:"",
           matches:"", footerText:"", pollOptions:"", pollWinner:0,
           tiers:"", playerName:"", playerRole:"", transferBadge:"officiel", matchResult:"",
           showBgImage: !!img, framedImage: false, dualImage: false, img2: null, tx2:{ox:0,oy:0}, photoCredit:"", dur: null, game: null,
           titleScale: null, descScale: null, zoom: null, zoom2: null, descColor: null, imgBright: null,
           lineup:"", lineupCount:5, lineupTeamRating:"", lineupPhotos:[],
           bracket:"", bracketFormat:"", bracketWinnerLabel:"champion", bracketDates:"", bracketWide:false, planningEvents:"", groupes:"", groupeElim:3, frameY:0, statHighlight:0, mvpBadge:"mvp",
           phonetic:"", example:"", analogy:"", boxes:"", grid:"",
           watermark: tpl === "edito" ? false : null };
}
function cur(){ return state.images[state.active] || null; }
function curTpl(){ const it = cur(); return (it && it.template) || "post-image"; }
function sVal(key){ const it = cur(); return (it && it[key] != null) ? it[key] : state[key]; }
const EMPTY = { template:"post-image", eyebrow:"", title:"", desc:"", showDesc:false, score:"", showScore:false, badge:"", signature:"", teamA:"", teamB:"", standings:"", relegationLine:0, stats:"", matches:"", footerText:"", pollOptions:"", pollWinner:0, tiers:"", playerName:"", playerRole:"", transferBadge:"officiel", matchResult:"", lineup:"", lineupCount:5, lineupTeamRating:"", bracket:"", bracketFormat:"", bracketWinnerLabel:"champion", bracketDates:"", planningEvents:"", groupes:"", groupeElim:3, statHighlight:0, mvpBadge:"mvp" };

// ═══ SECTION: CANVAS INIT ═══
const cv = document.getElementById("cv");
let ctx = cv.getContext("2d");
const logo = new Image();
let logoReady = false;
logo.onload = () => { logoReady = true; document.getElementById("hdrlogo").src = LOGO_SRC; render(); };
logo.src = LOGO_SRC;

const bgDefault = new Image();
let bgDefaultReady = false;
bgDefault.onload = () => { bgDefaultReady = true; render(); };
bgDefault.src = "bg-default.png";


const noise = document.createElement("canvas");
noise.width = noise.height = 220;
(function(){
  const nc = noise.getContext("2d");
  const id = nc.createImageData(220,220);
  for(let i=0;i<id.data.length;i+=4){
    const v = Math.random()*255;
    id.data[i]=id.data[i+1]=id.data[i+2]=v;
    id.data[i+3]=Math.random()*40;
  }
  nc.putImageData(id,0,0);
})();
const noisePattern = ctx.createPattern(noise,"repeat");

function accentColor(g){ const game = g || state.game; return game === "custom" ? state.customColor : GAME_COLORS[game]; }
function descBaseColor(){ const v = Math.round(sVal("descColor") * 255); return `rgb(${v},${v},${v})`; }

// ═══ SECTION: DRAW HELPERS ═══
function drawCover(img, x, y, w, h, zoom, ox, oy){
  const iw = img.videoWidth || img.naturalWidth, ih = img.videoHeight || img.naturalHeight;
  const base = Math.max(w/iw, h/ih);
  const scale = base * zoom;
  const dw = iw*scale, dh = ih*scale;
  ctx.drawImage(img, x + (w-dw)/2 + ox, y + (h-dh)/2 + oy, dw, dh);
}

function drawBaseBackground(W,H){
  if(bgDefaultReady){
    drawCover(bgDefault, 0, 0, W, H, 1, 0, 0);
  } else {
    let g = ctx.createLinearGradient(0,0,W*0.35,H);
    g.addColorStop(0, "#0c1218");
    g.addColorStop(0.55, "#090d11");
    g.addColorStop(1, "#070a0d");
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
  }
}
function drawBreakingBackground(W,H){
  let g = ctx.createLinearGradient(W*0.2,0,W*0.8,H);
  g.addColorStop(0,"#161015"); g.addColorStop(0.46,"#0b0a0d"); g.addColorStop(1,"#060608");
  ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
}

function drawSlideMedia(it, W, H, zoom){
  if(it && it.video && it.template === "post-video"){
    drawCover(it.video, 0,0,W,H, zoom, it.tx.ox, it.tx.oy);
  } else if(it && it.img){
    drawCover(it.img, 0,0,W,H, zoom, it.tx.ox, it.tx.oy);
  } else { drawBaseBackground(W,H); }
}

let videoLoopId = null;
function startVideoLoop(){
  if(videoLoopId) return;
  (function loop(){ videoLoopId = requestAnimationFrame(loop); render(); })();
}
function stopVideoLoop(){
  if(videoLoopId){ cancelAnimationFrame(videoLoopId); videoLoopId = null; }
}

function drawFramedImage(it, W, H, zoom){
  const pad = Math.round(W*0.075);
  const scale = W/1080;
  const logoH = Math.round(W*0.135 * (logo.naturalHeight/logo.naturalWidth));
  const barY = Math.round(pad + logoH + 13*scale + Math.max(2, 2.5*scale));
  const frameY = barY + Math.round(20*scale) + (it.frameY||0)*scale;
  const frameX = pad;
  const frameW = W - pad*2;
  const frameH = Math.round((frameW / 2.35 + H * 0.50) / 2);
  const frameR = Math.round(14*scale);
  ctx.save();
  roundRectPath(frameX, frameY, frameW, frameH, frameR);
  ctx.clip();
  drawCover(it.img, frameX, frameY, frameW, frameH, zoom, it.tx.ox, it.tx.oy);
  const fadeH = Math.round(frameH*0.35);
  const fade = ctx.createLinearGradient(0, frameY+frameH-fadeH, 0, frameY+frameH);
  fade.addColorStop(0, "rgba(7,10,13,0)");
  fade.addColorStop(1, "rgba(7,10,13,0.7)");
  ctx.fillStyle = fade; ctx.fillRect(frameX, frameY+frameH-fadeH, frameW, fadeH);
  ctx.restore();
  const frameColor = accentColor();
  ctx.strokeStyle = rgba(frameColor, 0.6); ctx.lineWidth = Math.max(2, Math.round(2.5*scale));
  roundRectPath(frameX, frameY, frameW, frameH, frameR); ctx.stroke();
}

function drawDualImage(it, W, H, zoom){
  const scale = W/1080;
  const gap = Math.round(4*scale);
  const halfW = Math.round((W - gap)/2);
  const zoom2 = it.zoom2 != null ? it.zoom2 : zoom;
  // left image
  ctx.save();
  ctx.beginPath(); ctx.rect(0, 0, halfW, H); ctx.clip();
  drawCover(it.img, 0, 0, halfW, H, zoom, it.tx.ox, it.tx.oy);
  ctx.restore();
  // right image
  if(it.img2){
    ctx.save();
    ctx.beginPath(); ctx.rect(halfW + gap, 0, halfW, H); ctx.clip();
    drawCover(it.img2, halfW + gap, 0, halfW, H, zoom2, it.tx2.ox, it.tx2.oy);
    ctx.restore();
  }
  // center divider line
  ctx.fillStyle = INK;
  ctx.fillRect(halfW, 0, gap, H);
}

// ═══ SECTION: EDGE BLUR ═══
const _blurCv = document.createElement("canvas");
function applyEdgeBlur(W,H){
  edge(true); edge(false);
  function edge(top){
    const bh = Math.round((top?0.17:0.22)*H);
    const sy = top ? 0 : H-bh;
    const dw = Math.max(1, Math.round(W/4)), dh = Math.max(1, Math.round(bh/4));
    _blurCv.width = dw; _blurCv.height = dh;
    const mc = _blurCv.getContext("2d");
    mc.clearRect(0,0,dw,dh);
    mc.filter = "blur(4px)";
    mc.drawImage(cv, 0, sy, W, bh, 0, 0, dw, dh);
    mc.filter = "none";
    mc.globalCompositeOperation = "destination-in";
    const g = mc.createLinearGradient(0,0,0,dh);
    if(top){ g.addColorStop(0,"rgba(0,0,0,1)"); g.addColorStop(1,"rgba(0,0,0,0)"); }
    else   { g.addColorStop(0,"rgba(0,0,0,0)"); g.addColorStop(1,"rgba(0,0,0,1)"); }
    mc.fillStyle = g; mc.fillRect(0,0,dw,dh);
    mc.globalCompositeOperation = "source-over";
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(_blurCv, 0, 0, dw, dh, 0, sy, W, bh);
  }
}

function drawEdgeScrims(W,H){
  let g = ctx.createLinearGradient(0,0,0,H*0.20);
  g.addColorStop(0,"rgba(7,10,13,0.55)"); g.addColorStop(1,"rgba(7,10,13,0)");
  ctx.fillStyle = g; ctx.fillRect(0,0,W,Math.round(H*0.20));
  g = ctx.createLinearGradient(0,H*0.82,0,H);
  g.addColorStop(0,"rgba(7,10,13,0)"); g.addColorStop(1,"rgba(7,10,13,0.45)");
  ctx.fillStyle = g; ctx.fillRect(0,Math.round(H*0.82),W,Math.round(H*0.18));
}

// ═══ SECTION: TEXT WRAP + RICH TEXT ═══
function wrapText(text, font, maxW){
  ctx.font = font;
  const paragraphs = (text||"").split(/\n/);
  const lines = [];
  for(const para of paragraphs){
    if(para.trim() === ""){ lines.push(""); continue; }
    const words = para.split(/\s+/).filter(Boolean);
    let line = "";
    for(const w of words){
      const test = line ? line+" "+w : w;
      if(ctx.measureText(test).width > maxW && line){ lines.push(line); line = w; }
      else line = test;
    }
    if(line) lines.push(line);
  }
  return lines;
}

function richWords(text){
  const parts = String(text||"").split("*");
  const words = [];
  parts.forEach((p,i)=>{ if(p==="") return; const hi = i%2===1;
    const lines = p.split(/\n/);
    lines.forEach((line,li)=>{
      if(li > 0) words.push({text:"\n", hi:false, br:true});
      line.split(/\s+/).forEach(tok=>{ if(tok!=="") words.push({text:tok, hi}); });
    });
  });
  return words;
}
function wrapRich(words, font, maxW){
  ctx.font = font;
  const sp = ctx.measureText(" ").width;
  const lines = []; let line = [], w = 0;
  for(const word of words){
    if(word.br){
      if(line.length) lines.push(line);
      else lines.push([]);
      line = []; w = 0;
      continue;
    }
    const ww = measureTextWithFlags(word.text);
    const add = (line.length ? sp : 0) + ww;
    if(line.length && w + add > maxW){ lines.push(line); line = [word]; w = ww; }
    else { line.push(word); w += add; }
  }
  if(line.length) lines.push(line);
  return lines;
}
function drawRichLine(line, x, y, font, hiColor, baseColor){
  ctx.font = font;
  const sp = ctx.measureText(" ").width;
  let cx = x;
  line.forEach((word,i)=>{
    if(i>0) cx += sp;
    ctx.fillStyle = word.hi ? hiColor : baseColor;
    drawTextWithFlags(word.text, cx, y);
    cx += measureTextWithFlags(word.text);
  });
}
function drawRichLineCentered(line, cx, y, font, hiColor, baseColor){
  ctx.font = font;
  const sp = ctx.measureText(" ").width;
  let totalW = 0;
  line.forEach((word,i)=>{ if(i>0) totalW += sp; totalW += measureTextWithFlags(word.text); });
  let x = cx - totalW/2;
  line.forEach((word,i)=>{
    if(i>0) x += sp;
    ctx.fillStyle = word.hi ? hiColor : baseColor;
    drawTextWithFlags(word.text, x, y);
    x += measureTextWithFlags(word.text);
  });
}

// ═══ FLAG EMOJI RENDERING (Twemoji fallback for Windows) ═══
const flagCache = {};
const FLAG_RE = /[\u{1F1E6}-\u{1F1FF}]{2}/gu;
function measureTextWithFlags(text){
  FLAG_RE.lastIndex = 0;
  if(!FLAG_RE.test(text)) return ctx.measureText(text).width;
  FLAG_RE.lastIndex = 0;
  const fontSize = parseFloat(ctx.font.match(/(\d+(?:\.\d+)?)px/)?.[1] || 16);
  let w = 0, lastIdx = 0, m;
  while((m = FLAG_RE.exec(text)) !== null){
    const before = text.slice(lastIdx, m.index);
    if(before) w += ctx.measureText(before).width;
    w += fontSize;
    lastIdx = m.index + m[0].length;
  }
  const tail = text.slice(lastIdx);
  if(tail) w += ctx.measureText(tail).width;
  return w;
}
function isFlagEmoji(str){ return FLAG_RE.test(str); }
function flagToCodepoints(flag){
  const pts = [];
  for(const c of flag) pts.push(c.codePointAt(0).toString(16));
  return pts.join("-");
}
function loadFlagImage(flag){
  const key = flagToCodepoints(flag);
  if(flagCache[key]) return flagCache[key];
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = `https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/${key}.svg`;
  const entry = { img, loaded:false };
  img.onload = ()=>{ entry.loaded = true; render(); };
  flagCache[key] = entry;
  return entry;
}
function drawTextWithFlags(text, x, y){
  FLAG_RE.lastIndex = 0;
  if(!FLAG_RE.test(text)){ ctx.fillText(text, x, y); return; }
  FLAG_RE.lastIndex = 0;
  let lastIdx = 0, cx = x;
  const fontSize = parseFloat(ctx.font.match(/(\d+(?:\.\d+)?)px/)?.[1] || 16);
  let m;
  while((m = FLAG_RE.exec(text)) !== null){
    const before = text.slice(lastIdx, m.index);
    if(before){ ctx.fillText(before, cx, y); cx += ctx.measureText(before).width; }
    const entry = loadFlagImage(m[0]);
    if(entry.loaded){
      const sz = fontSize * 1.15;
      ctx.drawImage(entry.img, cx, y - sz*0.15, sz, sz);
    }
    cx += fontSize;
    lastIdx = m.index + m[0].length;
  }
  const tail = text.slice(lastIdx);
  if(tail) ctx.fillText(tail, cx, y);
}

let lastTextBox = null;

// ═══ SECTION: COLOR HELPERS ═══
function hexToRgb(hex){ const h=hex.replace("#",""); return {r:parseInt(h.substr(0,2),16), g:parseInt(h.substr(2,2),16), b:parseInt(h.substr(4,2),16)}; }
function rgba(c,a){ const o = typeof c==="string" ? hexToRgb(c) : c; return `rgba(${o.r|0},${o.g|0},${o.b|0},${a})`; }
function mix(h1,h2,t){ const a=hexToRgb(h1), b=hexToRgb(h2); return {r:a.r+(b.r-a.r)*t, g:a.g+(b.g-a.g)*t, b:a.b+(b.b-a.b)*t}; }
function roundRectPath(x,y,w,h,r){
  r = Math.min(r, w/2, h/2);
  ctx.beginPath(); ctx.moveTo(x+r,y);
  ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath();
}

function drawSpaced(text, x, y, spacing){
  let cx = x;
  for(const ch of text){ ctx.fillText(ch, cx, y); cx += ctx.measureText(ch).width + spacing; }
}

// ═══ SECTION: OVERLAY ═══
function drawOverlay(W, H, slideInfo, content, hasImage){
  const tpl = (content && content.template) || "post-image";
  const slideGame = (content && content.game) || null;
  const acc = accentColor(slideGame);
  const hi = acc;
  const c = content || EMPTY;
  const isBracketWide = tpl === "bracket" && c.bracketWide;
  const refW = isBracketWide ? W/2 : W;
  const scale = refW/1080;
  const pad = Math.round(refW*0.075);
  const maxW = refW - pad*2;

  // --- Shared: radial glow ---
  const glowCol = tpl==="breaking" ? "#ff4d57" : acc;
  const glowX = tpl==="breaking" ? 0.50 : 0.85;
  const glowY = tpl==="breaking" ? -0.04 : -0.05;
  const glow = ctx.createRadialGradient(refW*glowX, H*glowY, 0, refW*glowX, H*glowY, refW*0.9);
  glow.addColorStop(0, rgba(glowCol, tpl==="breaking"?0.22:0.16));
  glow.addColorStop(0.6, rgba(glowCol, 0));
  ctx.fillStyle = glow; ctx.fillRect(0,0,W,H);

  // --- Bottom gradient (skip for post-texte, edito) ---
  if(tpl !== "post-texte" && tpl !== "edito"){
    const gStr = state.gradient;
    const gCol = tpl==="breaking" ? "#ff4d57" : acc;
    const dark = (hasImage || tpl==="score" || tpl==="breaking") ? mix(gCol, INK, 0.80) : hexToRgb(INK);
    const gradH = H*(tpl==="breaking"?0.50:0.62);
    const g = ctx.createLinearGradient(0,H-gradH,0,H);
    g.addColorStop(0, rgba(dark,0));
    g.addColorStop(0.42, rgba(dark, 0.58*gStr));
    g.addColorStop(1, rgba(dark, 0.97*gStr));
    ctx.fillStyle = g; ctx.fillRect(0,H-gradH,W,gradH);
  }

  // --- Shared: noise ---
  if(noisePattern){
    ctx.save();
    ctx.globalAlpha = 0.5; ctx.globalCompositeOperation = "overlay";
    ctx.fillStyle = noisePattern; ctx.fillRect(0,0,W,H);
    ctx.restore();
  }

  // --- Shared: logo + cyan bar ---
  const showWatermark = c.watermark != null ? c.watermark : state.watermark;
  if(showWatermark && logoReady){
    const lw = refW*0.135;
    const lh = lw * (logo.naturalHeight/logo.naturalWidth);
    ctx.save();
    ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 16;
    ctx.drawImage(logo, pad, pad, lw, lh);
    ctx.restore();
    ctx.fillStyle = GAME_COLORS.macro;
    ctx.fillRect(pad, Math.round(pad + lh + 13*scale), W - pad*2, Math.max(2, Math.round(2.5*scale)));
  }

  // --- Shared: photo credit (bottom-right) ---
  if(c.photoCredit){
    const credF = Math.round(16*scale);
    ctx.font = `500 ${credF}px 'Manrope', sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.textAlign = "right"; ctx.textBaseline = "bottom";
    ctx.fillText("Photo — " + c.photoCredit, W - pad, H - pad);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }

  // --- Template-specific content ---
  switch(tpl){
    case "post-image": drawLayoutBottom(W,H,c,scale,pad,maxW,acc,hi); break;
    case "post-video": drawLayoutBottom(W,H,c,scale,pad,maxW,acc,hi); break;
    case "post-texte": drawLayoutCentered(W,H,c,scale,pad,maxW,acc,hi); break;
    case "score":      drawLayoutScore(W,H,c,scale,pad,maxW,acc,hi); break;
    case "breaking":   drawLayoutBreaking(W,H,c,scale,pad,maxW,hi); break;
    case "classement": drawLayoutClassement(W,H,c,scale,pad,maxW,acc,hi); break;
    case "statistique": drawLayoutCarousel(W,H,c,scale,pad,maxW,acc,hi); break;
    case "programme":  drawLayoutProgramme(W,H,c,scale,pad,maxW,acc,hi); break;
    case "sondage":    drawLayoutSondage(W,H,c,scale,pad,maxW,acc,hi); break;
    case "tierlist":   drawLayoutTierList(W,H,c,scale,pad,maxW,acc,hi); break;
    case "citation":   drawLayoutCitation(W,H,c,scale,pad,maxW,acc,hi); break;
    case "mvp":        drawLayoutMVP(W,H,c,scale,pad,maxW,acc,hi); break;
    case "lineup":     drawLayoutLineup(W,H,c,scale,pad,maxW,acc,hi); break;
    case "groupe":     drawLayoutGroupes(W,H,c,scale,pad,maxW,acc,hi); break;
    case "bracket":    drawLayoutBracket(W,H,c,scale,pad,maxW,acc,hi); break;
    case "planning":   drawLayoutPlanning(W,H,c,scale,pad,maxW,acc,hi); break;
    case "glossaire":  drawLayoutGlossaire(W,H,c,scale,pad,maxW,acc,hi); break;
    case "guide":      drawLayoutGuide(W,H,c,scale,pad,maxW,acc,hi); break;
    case "edito":      drawLayoutEdito(W,H,c,scale,pad,maxW,acc,hi); break;
    default:           drawLayoutBottom(W,H,c,scale,pad,maxW,acc,hi); break;
  }
}

// --- T1: Post image (text at bottom) ---
function drawLayoutBottom(W,H,c,scale,pad,maxW,acc,hi){
  if(c.showScore && c.score && c.score.trim()) drawScoreCenter(W,H,c,scale,maxW,hi);

  const eyeF = Math.round(22*scale);
  const titleF = Math.round((state.format==="story"||state.reel?86:74) * scale * sVal("titleScale"));
  const descF = Math.round(30*scale*sVal("descScale"));
  const titleLH = Math.round(titleF*1.04);
  const descLH = Math.round(descF*1.4);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);
  const descFont = `500 ${descF}px Manrope, sans-serif`;
  const descLines = (c.showDesc && c.desc.trim()) ? wrapRich(richWords(c.desc), descFont, maxW).slice(0,25) : [];
  if(!eyebrow && !titleLines.length && !descLines.length){ lastTextBox=null; return; }

  const accentLineH = Math.round(4*scale);
  const gapAfterLine = Math.round(16*scale);
  const gapAfterEye = Math.round(16*scale);
  const gapAfterTitle = Math.round(22*scale);
  let blockH = accentLineH + gapAfterLine;
  if(eyebrow) blockH += eyeF + gapAfterEye;
  blockH += titleLines.length*titleLH;
  if(descLines.length) blockH += gapAfterTitle + descLines.length*descLH;

  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  const bottomY = H - pad + dragOffset;
  const yTop = bottomY - blockH;
  lastTextBox = { x:pad, y:yTop, w:maxW, h:blockH };

  let y = yTop;
  ctx.fillStyle = acc;
  ctx.fillRect(pad, y, Math.round(54*scale), accentLineH);
  y += accentLineH + gapAfterLine;
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.18);
    y += eyeF + gapAfterEye;
  }
  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 2;
  for(const ln of titleLines){ drawRichLine(ln, pad, y, titleFont, hi, "#ffffff"); y += titleLH; }
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  if(descLines.length){
    let dy = bottomY - descLines.length*descLH;
    for(const ln of descLines){ drawRichLine(ln, pad, dy, descFont, hi, descBaseColor()); dy += descLH; }
  }
}

// --- T2: Texte seul (centered vertically + quote mark + signature) ---
function drawLayoutCentered(W,H,c,scale,pad,maxW,acc,hi){
  const eyeF = Math.round(22*scale);
  const titleF = Math.round((state.format==="story"||state.reel?96:84) * scale * sVal("titleScale"));
  const descF = Math.round(30*scale*sVal("descScale"));
  const titleLH = Math.round(titleF*1.06);
  const descLH = Math.round(descF*1.5);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);
  const descFont = `500 ${descF}px Manrope, sans-serif`;
  const descLines = (c.showDesc && c.desc.trim()) ? wrapRich(richWords(c.desc), descFont, Math.round(maxW*0.92)).slice(0,25) : [];

  const accentLineH = Math.round(4*scale);
  const gap = Math.round(15*scale);
  let blockH = accentLineH + gap;
  if(eyebrow) blockH += eyeF + gap;
  blockH += titleLines.length * titleLH;
  if(descLines.length) blockH += Math.round(18*scale) + descLines.length*descLH;

  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  const centerY = H * 0.48 + dragOffset;
  let y = centerY - blockH/2;
  lastTextBox = { x:pad, y, w:maxW, h:blockH };

  // accent tick
  ctx.fillStyle = acc;
  ctx.fillRect(pad, y, Math.round(54*scale), accentLineH);
  y += accentLineH + gap;

  // eyebrow
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.18);
    y += eyeF + gap;
  }

  // title
  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 2;
  for(const ln of titleLines){ drawRichLine(ln, pad, y, titleFont, hi, "#ffffff"); y += titleLH; }
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

  // description
  if(descLines.length){
    y += Math.round(18*scale);
    for(const ln of descLines){ drawRichLine(ln, pad, y, descFont, hi, descBaseColor()); y += descLH; }
  }

  // signature at bottom
  if(c.signature && c.signature.trim()){
    const sigF = Math.round(24*scale);
    const avatarR = Math.round(34*scale);
    ctx.font = `500 ${sigF}px 'JetBrains Mono', monospace`;
    const initials = c.signature.split(/\s+/).slice(0,2).map(w=>w[0]||"").join("").toUpperCase();
    const sigY = H - pad - avatarR/2;
    // avatar circle
    ctx.save();
    ctx.fillStyle = "#13202a"; ctx.strokeStyle = "#243039"; ctx.lineWidth = Math.max(1,2*scale);
    ctx.beginPath(); ctx.arc(pad + avatarR/2, sigY, avatarR/2, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = acc; ctx.font = `600 ${Math.round(22*scale)}px 'JetBrains Mono', monospace`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(initials, pad + avatarR/2, sigY);
    ctx.restore();
    // text
    ctx.font = `500 ${sigF}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = "#9aa7b0"; ctx.textBaseline = "middle";
    ctx.fillText(c.signature, pad + avatarR + Math.round(11*scale), sigY);
    ctx.textBaseline = "alphabetic";
  }
}

// --- T3: Score (teams + score centered, title at bottom) ---
function drawLayoutScore(W,H,c,scale,pad,maxW,acc,hi){
  const eyeF = Math.round(22*scale);

  // eyebrow pill (competition)
  const eyebrow = (c.eyebrow||"").toUpperCase();
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.letterSpacing = Math.round(eyeF*0.18) + "px";
    const tw = ctx.measureText(eyebrow).width;
    ctx.letterSpacing = "0px";
    const pillPx = Math.round(18*scale), pillPy = Math.round(10*scale);
    const pillW = tw + pillPx*2, pillH = eyeF + pillPy*2;
    const pillX = W/2 - pillW/2, pillY = Math.round(H*0.12);
    const pillR = Math.round(pillH/2);
    ctx.fillStyle = "rgba(0,194,224,0.08)";
    roundRectPath(pillX, pillY, pillW, pillH, pillR); ctx.fill();
    ctx.strokeStyle = rgba(acc, 0.30); ctx.lineWidth = Math.max(1, 1.5*scale);
    roundRectPath(pillX, pillY, pillW, pillH, pillR); ctx.stroke();
    ctx.fillStyle = acc; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.letterSpacing = Math.round(eyeF*0.18) + "px";
    ctx.fillText(eyebrow, W/2, pillY + pillH/2);
    ctx.letterSpacing = "0px";
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }

  // score row (teams + score) at ~44% height
  const scoreY = H*0.38 + (c.scoreY||0)*scale;
  const boxSize = Math.round(168*scale);
  const boxR = Math.round(36*scale);
  const teamNameF = Math.round(28*scale);
  const teamAbbrF = Math.round(44*scale);
  const scoreF = Math.round(184*scale);
  const teamGap = Math.round(24*scale);

  // measure score width
  const scoreText = (c.score||"").replace(/\*/g,"");
  ctx.font = `800 ${scoreF}px Sora, sans-serif`;
  let sf = scoreF;
  while(ctx.measureText(scoreText).width > maxW*0.45 && sf > 60){ sf = Math.round(sf*0.9); ctx.font = `800 ${sf}px Sora, sans-serif`; }
  const scoreW = ctx.measureText(scoreText).width;
  const totalRowW = boxSize*2 + scoreW + teamGap*4;
  const rowX = (W - totalRowW)/2;

  // auto-detect winner (highest number gets accent color)
  const nums = (c.score||"").replace(/\*/g,"").match(/[0-9]+/g);
  let winnerIdx = -1;
  if(nums && nums.length >= 2){
    const a = parseInt(nums[0]), b = parseInt(nums[1]);
    if(a > b) winnerIdx = 0;
    else if(b > a) winnerIdx = 1;
  }

  // draw team box helper
  function drawTeamBox(bx, by, logoImg, abbr, isLoser){
    ctx.save();
    ctx.shadowColor = rgba(acc, 0.15); ctx.shadowBlur = Math.round(22*scale); ctx.shadowOffsetY = 0;
    ctx.fillStyle = "#13161c";
    roundRectPath(bx, by, boxSize, boxSize, boxR); ctx.fill();
    ctx.restore();
    ctx.strokeStyle = "#2a2f38"; ctx.lineWidth = Math.max(1,2*scale);
    roundRectPath(bx, by, boxSize, boxSize, boxR); ctx.stroke();
    if(isLoser) ctx.save();
    if(isLoser) ctx.globalAlpha = 0.55;
    if(logoImg){
      const logoPad = Math.round(24*scale);
      const logoSize = boxSize - logoPad*2;
      ctx.save();
      if(isLoser) ctx.globalAlpha = 0.55;
      ctx.beginPath(); roundRectPath(bx, by, boxSize, boxSize, boxR); ctx.clip();
      ctx.drawImage(logoImg, bx+logoPad, by+logoPad, logoSize, logoSize);
      ctx.restore();
    } else if(abbr){
      ctx.font = `800 ${teamAbbrF}px Sora, sans-serif`;
      ctx.fillStyle = isLoser ? "#6b7882" : "#dfe6ea"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(abbr, bx+boxSize/2, by+boxSize/2);
    }
    if(isLoser) ctx.restore();
  }

  // team A box
  const teamAName = c.teamA || "";
  const teamAAbbr = teamAName.slice(0,3).toUpperCase();
  const boxAx = rowX, boxAy = scoreY - boxSize/2;
  const logoA = c.logoA || findTeamLogo(teamAName);
  drawTeamBox(boxAx, boxAy, logoA, teamAAbbr, winnerIdx===1);

  // score digits
  if(c.score && c.score.trim()){
    const dashF = Math.round(sf*0.38);
    const raw = (c.score||"").replace(/\*/g,"");
    const tokens = [];
    let numIdx = 0;
    raw.replace(/([0-9]+|[\-–—]+|[^0-9\-–—]+)/g, (m)=>{
      const isNum = /^[0-9]+$/.test(m);
      tokens.push({text:m, numIdx: isNum ? numIdx++ : -1});
    });
    let totalSW = 0;
    let hasDash = false;
    tokens.forEach(t=>{
      const isDash = /^[\-–—]+$/.test(t.text);
      if(isDash) hasDash = true;
      ctx.font = `800 ${isDash?dashF:sf}px Sora, sans-serif`;
      totalSW += ctx.measureText(t.text).width;
    });
    if(hasDash) totalSW += Math.round(16*scale)*2;
    let cx = W/2 - totalSW/2;
    ctx.textAlign = "left"; ctx.textBaseline = "middle";
    tokens.forEach(t=>{
      const isDash = /^[\-–—]+$/.test(t.text);
      const isNum = /^[0-9]+$/.test(t.text);
      if(isDash) cx += Math.round(16*scale);
      ctx.font = `800 ${isDash?dashF:sf}px Sora, sans-serif`;
      const isLoserNum = isNum && winnerIdx >= 0 && t.numIdx !== winnerIdx;
      if(isDash) ctx.fillStyle = "#5a6570";
      else if(isNum && t.numIdx === winnerIdx) ctx.fillStyle = acc;
      else if(isLoserNum) ctx.fillStyle = "#6b7882";
      else ctx.fillStyle = "#dfe6ea";
      ctx.fillText(t.text, cx, scoreY + Math.round(6*scale));
      cx += ctx.measureText(t.text).width;
      if(isDash) cx += Math.round(16*scale);
    });
  }

  // team B box
  const teamBName = c.teamB || "";
  const teamBAbbr = teamBName.slice(0,3).toUpperCase();
  const boxBx = W - rowX - boxSize, boxBy = scoreY - boxSize/2;
  const logoB = c.logoB || findTeamLogo(teamBName);
  drawTeamBox(boxBx, boxBy, logoB, teamBAbbr, winnerIdx===0);

  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

  // separator line
  const sepY = Math.round(scoreY + boxSize/2 + 40*scale);
  const sepW = Math.round(W*0.35);
  const sepGrad = ctx.createLinearGradient(W/2-sepW/2, 0, W/2+sepW/2, 0);
  sepGrad.addColorStop(0, "rgba(0,194,224,0)");
  sepGrad.addColorStop(0.3, rgba(acc, 0.35));
  sepGrad.addColorStop(0.7, rgba(acc, 0.35));
  sepGrad.addColorStop(1, "rgba(0,194,224,0)");
  ctx.fillStyle = sepGrad;
  ctx.fillRect(W/2-sepW/2, sepY, sepW, Math.max(1, Math.round(1.5*scale)));

  // title + desc at bottom
  const titleF = Math.round((state.format==="story"||state.reel?76:68) * scale * sVal("titleScale"));
  const descF = Math.round(30*scale*sVal("descScale"));
  const titleLH = Math.round(titleF*1.05);
  const descLH = Math.round(descF*1.4);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);
  const descFont = `500 ${descF}px Manrope, sans-serif`;
  const descLines = (c.showDesc && c.desc.trim()) ? wrapRich(richWords(c.desc), descFont, maxW).slice(0,25) : [];
  if(!titleLines.length && !descLines.length){ lastTextBox=null; return; }

  const accentLineH = Math.round(4*scale);
  const gap = Math.round(14*scale);
  let blockH = accentLineH + gap + titleLines.length*titleLH;
  if(descLines.length) blockH += Math.round(11*scale) + descLines.length*descLH;
  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  const bottomY = H - pad + dragOffset;
  let y = bottomY - blockH;
  lastTextBox = { x:pad, y, w:maxW, h:blockH };

  ctx.fillStyle = acc;
  ctx.fillRect(pad, y, Math.round(54*scale), accentLineH);
  y += accentLineH + gap;
  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 2;
  for(const ln of titleLines){ drawRichLine(ln, pad, y, titleFont, hi, "#ffffff"); y += titleLH; }
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  if(descLines.length){
    y += Math.round(11*scale);
    for(const ln of descLines){ drawRichLine(ln, pad, y, descFont, hi, descBaseColor()); y += descLH; }
  }
}

// --- T4: Breaking / Officiel (badge + centered title + signature) ---
function drawLayoutBreaking(W,H,c,scale,pad,maxW,hi){
  const badge = c.badge || "breaking";
  const badgeColor = badge==="officiel" ? "#f0c14b" : badge==="rumeur" ? "#4da6ff" : "#ff4d57";
  const badgeLight = badge==="officiel" ? "#f5d06a" : badge==="rumeur" ? "#6db8ff" : "#ff6b73";
  const badgeLabel = badge==="officiel" ? "OFFICIEL" : badge==="rumeur" ? "RUMEUR" : "BREAKING";

  const titleF = Math.round((state.format==="story"||state.reel?120:104) * scale * sVal("titleScale"));
  const descF = Math.round((state.format==="story"||state.reel?38:34)*scale*sVal("descScale"));
  const titleLH = Math.round(titleF*1.0);
  const descLH = Math.round(descF*1.5);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);
  const descFont = `500 ${descF}px Manrope, sans-serif`;
  const descLines = (c.showDesc && c.desc.trim()) ? wrapRich(richWords(c.desc), descFont, Math.round(maxW*0.88)).slice(0,25) : [];

  // calculate block height
  const badgeH = Math.round(44*scale);
  const badgeGap = Math.round(30*scale);
  const descGap = Math.round(24*scale);
  let blockH = badgeH + badgeGap + titleLines.length*titleLH;
  if(descLines.length) blockH += descGap + descLines.length*descLH;

  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  const centerY = H*0.50 + dragOffset;
  let y = centerY - blockH/2;

  // badge pill
  const pillF = Math.round((state.format==="story"||state.reel?26:24)*scale);
  ctx.font = `700 ${pillF}px Sora, sans-serif`;
  const pillText = badgeLabel;
  const pillSpacing = pillF*0.2;
  const pillTW = ctx.measureText(pillText).width + (pillText.length-1)*pillSpacing;
  const dotR = Math.round(7*scale);
  const pillPadX = Math.round(18*scale), pillPadY = Math.round(10*scale);
  const pillW = dotR*2 + Math.round(8*scale) + pillTW + pillPadX*2;
  const pillH = pillF + pillPadY*2;
  const pillX = W/2 - pillW/2, pillY = y;

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 16*scale;
  ctx.fillStyle = "rgba(7,10,13,0.7)";
  roundRectPath(pillX, pillY, pillW, pillH, 999); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = rgba(badgeColor, 0.18);
  roundRectPath(pillX, pillY, pillW, pillH, 999); ctx.fill();
  ctx.strokeStyle = rgba(badgeColor, 0.6); ctx.lineWidth = Math.max(1, 2*scale);
  roundRectPath(pillX, pillY, pillW, pillH, 999); ctx.stroke();
  // dot
  ctx.fillStyle = badgeColor;
  ctx.shadowColor = badgeColor; ctx.shadowBlur = 8*scale;
  ctx.beginPath(); ctx.arc(pillX + pillPadX + dotR, pillY + pillH/2, dotR, 0, Math.PI*2); ctx.fill();
  ctx.shadowBlur = 0;
  // label
  ctx.fillStyle = badgeLight;
  ctx.textAlign = "left"; ctx.textBaseline = "middle";
  ctx.font = `700 ${pillF}px Sora, sans-serif`;
  const lblX = pillX + pillPadX + dotR*2 + Math.round(8*scale);
  drawSpaced(pillText, lblX, pillY + pillH/2, pillF*0.2);
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  ctx.restore();

  y += badgeH + badgeGap;

  // title centered
  ctx.textBaseline = "top"; ctx.textAlign = "center";
  ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 2;
  for(const ln of titleLines){
    const lineFont = titleFont;
    ctx.font = lineFont;
    const sp = ctx.measureText(" ").width;
    const totalLW = ln.reduce((s,w,i)=>s+ctx.measureText(w.text).width+(i?sp:0), 0);
    let cx = W/2 - totalLW/2;
    ctx.textAlign = "left";
    ln.forEach((word,i)=>{
      if(i>0) cx += sp;
      ctx.fillStyle = word.hi ? hi : "#ffffff";
      ctx.fillText(word.text, cx, y);
      cx += ctx.measureText(word.text).width;
    });
    y += titleLH;
  }
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

  // description centered
  if(descLines.length){
    y += descGap;
    ctx.textBaseline = "top";
    for(const ln of descLines){ drawRichLineCentered(ln, W/2, y, descFont, hi, descBaseColor()); y += descLH; }
  }

  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  lastTextBox = null;

  // signature at bottom
  if(c.signature && c.signature.trim()){
    const sigF = Math.round(24*scale);
    ctx.font = `500 ${sigF}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = "#6b7882"; ctx.textAlign = "center"; ctx.textBaseline = "bottom";
    ctx.fillText(c.signature, W/2, H - pad);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }
}

// --- Shared: big score at center (used by T1 when showScore) ---
function drawScoreCenter(W,H,c,scale,maxW,hi){
  const plain = c.score.replace(/\*/g,"");
  let sf = Math.round(220*scale);
  ctx.font = `800 ${sf}px Sora, sans-serif`;
  while(ctx.measureText(plain).width > maxW && sf > 40){ sf = Math.round(sf*0.92); ctx.font = `800 ${sf}px Sora, sans-serif`; }
  const sy = H*0.43 + (c.scoreY||0)*scale;
  const parts = String(c.score).split("*");
  const segs = []; parts.forEach((p,i)=>{ if(p!=="") segs.push({text:p, hi:i%2===1}); });
  const totalW = segs.reduce((s,seg)=>s+ctx.measureText(seg.text).width, 0);
  ctx.save();
  ctx.textAlign = "left"; ctx.textBaseline = "middle";
  let cx = W/2 - totalW/2;
  segs.forEach(seg=>{ ctx.fillStyle = seg.hi ? hi : "#ffffff"; ctx.fillText(seg.text, cx, sy); cx += ctx.measureText(seg.text).width; });
  ctx.restore();
  ctx.textBaseline = "alphabetic";
}

// --- T5: Classement / Standings (table with rows) ---
function parseStandings(text){
  return (text||"").split("\n").map(l=>l.trim()).filter(Boolean).map(line=>{
    const m = line.match(/^(.+?)\s+(\d+[\-–]\d+)\s*$/);
    if(m) return { name:m[1].trim(), record:m[2].replace("–","-") };
    return { name:line, record:"" };
  });
}
function drawLayoutClassement(W,H,c,scale,pad,maxW,acc,hi){
  const eyeF = Math.round(22*scale);
  const titleF = Math.round((state.format==="story"||state.reel?68:58) * scale * sVal("titleScale"));
  const titleLH = Math.round(titleF*1.06);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);

  // header block: tick + eyebrow + title
  const accentLineH = Math.round(4*scale);
  const gap = Math.round(13*scale);
  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  let y = Math.round(H*0.16 + 80*scale) + dragOffset;
  ctx.fillStyle = acc;
  ctx.fillRect(pad, y, Math.round(54*scale), accentLineH);
  y += accentLineH + gap;
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.18);
    y += eyeF + Math.round(10*scale);
  }
  ctx.textBaseline = "top";
  for(const ln of titleLines){ drawRichLine(ln, pad, y, titleFont, hi, "#ffffff"); y += titleLH; }

  // table
  const teams = parseStandings(c.standings);
  if(!teams.length){ lastTextBox=null; return; }
  const relLine = c.relegationLine || 0;
  const rowH = Math.round(74*scale);
  const headerH = Math.round(32*scale);
  const tableY = y + Math.round(24*scale);
  const rankColW = Math.round(46*scale);
  const logoSize = Math.round(44*scale);
  const logoGap = Math.round(14*scale);
  const recW = Math.round(72*scale);
  const rowR = Math.round(9*scale);
  const nameF = Math.round(28*scale);
  const recF = Math.round(24*scale);
  const headerF = Math.round(20*scale);
  const innerPad = Math.round(14*scale);
  const accentBarW = Math.round(3*scale);

  // column headers
  ctx.font = `600 ${headerF}px 'JetBrains Mono', monospace`;
  ctx.fillStyle = "#6b7882"; ctx.textBaseline = "middle";
  const headerY = tableY + headerH/2;
  ctx.fillText("#", pad + innerPad, headerY);
  ctx.fillText("ÉQUIPE", pad + rankColW + innerPad, headerY);
  ctx.textAlign = "right";
  ctx.fillText("V–D", pad + maxW - innerPad, headerY);
  ctx.textAlign = "left";

  let ry = tableY + headerH;
  teams.forEach((team,i)=>{
    const rank = i+1;
    const isFirst = rank===1;
    const isReleg = relLine>0 && rank>=relLine;
    const isAlt = rank%2===1;

    // row background
    if(isFirst){
      ctx.fillStyle = rgba(acc, 0.08);
      roundRectPath(pad, ry, maxW, rowH, rowR); ctx.fill();
      ctx.strokeStyle = rgba(acc, 0.22); ctx.lineWidth = Math.max(1, 2*scale);
      roundRectPath(pad, ry, maxW, rowH, rowR); ctx.stroke();
      // accent bar left
      ctx.fillStyle = acc;
      roundRectPath(pad, ry, accentBarW, rowH, Math.min(accentBarW, rowR)); ctx.fill();
    } else if(isReleg){
      if(rank===relLine){
        ctx.strokeStyle = "#16212a"; ctx.lineWidth = Math.max(1, scale);
        ctx.beginPath(); ctx.moveTo(pad, ry); ctx.lineTo(pad+maxW, ry); ctx.stroke();
      }
      ctx.globalAlpha = 0.62;
      if(isAlt){ ctx.fillStyle = "rgba(255,255,255,0.03)"; roundRectPath(pad, ry, maxW, rowH, rowR); ctx.fill(); }
    } else if(isAlt){
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      roundRectPath(pad, ry, maxW, rowH, rowR); ctx.fill();
    }

    // subtle separator between rows (except first)
    if(i > 0 && !isFirst && !(isReleg && rank===relLine)){
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.fillRect(pad + innerPad, ry, maxW - innerPad*2, Math.max(1, scale));
    }

    const cy = ry + rowH/2;
    // rank number
    ctx.font = `600 ${recF}px 'JetBrains Mono', monospace`;
    ctx.textBaseline = "middle";
    ctx.fillStyle = isFirst ? acc : (isReleg ? "#ff4d57" : "#9aa7b0");
    ctx.fillText(String(rank), pad + innerPad, cy);

    // team logo
    const logoImg = findTeamLogo(team.name);
    const logoX = pad + rankColW + innerPad;
    if(logoImg){
      ctx.drawImage(logoImg, logoX, cy - logoSize/2, logoSize, logoSize);
    }
    const teamNameX = logoX + (logoImg ? logoSize + logoGap : 0);

    // team name (uppercase, truncated)
    ctx.font = `600 ${nameF}px Manrope, sans-serif`;
    ctx.fillStyle = isFirst ? "#ffffff" : (isReleg ? "#8a6060" : "#dfdfdf");
    const maxNameW = pad + maxW - innerPad - recW - teamNameX;
    const fullName = team.name.toUpperCase();
    let name = fullName;
    while(ctx.measureText(name).width > maxNameW && name.length > 3) name = name.slice(0,-1);
    if(name !== fullName) name += "…";
    ctx.fillText(name, teamNameX, cy);

    // record
    if(team.record){
      ctx.font = `600 ${recF}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = isFirst ? "#dfdfdf" : "#9aa7b0";
      ctx.textAlign = "right";
      ctx.fillText(team.record, pad + maxW - innerPad, cy);
      ctx.textAlign = "left";
    }

    if(isReleg) ctx.globalAlpha = 1;
    ry += rowH;
  });

  ctx.textBaseline = "alphabetic";
  lastTextBox = null;
}

// --- T6: Carousel (stats slides — eyebrow section + stat pairs) ---
function parseStats(text){
  return (text||"").split("\n").map(l=>l.trim()).filter(Boolean).map(line=>{
    const sep = line.lastIndexOf(" ");
    if(sep>0) return { label:line.slice(0,sep).trim(), value:line.slice(sep+1).trim() };
    return { label:line, value:"" };
  });
}
function drawLayoutCarousel(W,H,c,scale,pad,maxW,acc,hi){
  const stats = parseStats(c.stats);
  const hasStats = stats.length > 0;

  if(hasStats){
    const eyeF = Math.round(22*scale);
    const titleF = Math.round((state.format==="story"||state.reel?48:42) * scale * sVal("titleScale"));
    const titleLH = Math.round(titleF*1.08);
    const titleFont = `800 ${titleF}px Sora, sans-serif`;
    const eyebrow = (c.eyebrow||"").toUpperCase();
    const titleLines = wrapRich(richWords(c.title), titleFont, maxW);

    const accentLineH = Math.round(4*scale);
    const gapLine = Math.round(13*scale);
    const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
    let y = Math.round(H*0.16 + 80*scale) + dragOffset;
    ctx.fillStyle = acc;
    ctx.fillRect(pad, y, Math.round(54*scale), accentLineH);
    y += accentLineH + gapLine;
    if(eyebrow){
      ctx.font = `700 ${eyeF}px Sora, sans-serif`;
      ctx.fillStyle = acc; ctx.textBaseline = "top";
      drawSpaced(eyebrow, pad, y, eyeF*0.18);
      y += eyeF + Math.round(10*scale);
    }
    ctx.textBaseline = "top";
    for(const ln of titleLines){ drawRichLine(ln, pad, y, titleFont, hi, "#ffffff"); y += titleLH; }

    // stat cards
    y += Math.round(24*scale);
    const hiIdx = (c.statHighlight || 0) - 1;
    const cardH = Math.round(100*scale);
    const cardGap = Math.round(12*scale);
    const cardR = Math.round(14*scale);
    const valueF = Math.round(44*scale);
    const labelF = Math.round(22*scale);

    stats.forEach((stat,i)=>{
      const isHi = i === hiIdx;
      // card background
      ctx.fillStyle = isHi ? rgba(acc, 0.08) : "rgba(255,255,255,0.03)";
      roundRectPath(pad, y, maxW, cardH, cardR); ctx.fill();
      ctx.strokeStyle = isHi ? rgba(acc, 0.25) : "#16212a";
      ctx.lineWidth = Math.max(1, 1.5*scale);
      roundRectPath(pad, y, maxW, cardH, cardR); ctx.stroke();
      // accent bar on left for highlighted
      if(isHi){
        ctx.fillStyle = acc;
        const barW = Math.round(4*scale);
        roundRectPath(pad, y, barW, cardH, barW/2); ctx.fill();
      }
      const innerPad = Math.round(24*scale);
      const cy = y + cardH/2;
      // label (left)
      ctx.font = `500 ${labelF}px Manrope, sans-serif`;
      ctx.fillStyle = isHi ? "#ffffff" : descBaseColor();
      ctx.textBaseline = "middle";
      ctx.fillText(stat.label, pad + innerPad, cy);
      // value (right)
      if(stat.value){
        ctx.font = `700 ${valueF}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = isHi ? acc : "#ffffff";
        ctx.textAlign = "right"; ctx.textBaseline = "middle";
        ctx.fillText(stat.value, pad + maxW - innerPad, cy);
        ctx.textAlign = "left";
      }
      y += cardH + cardGap;
    });

    ctx.textBaseline = "alphabetic";
    lastTextBox = null;
  } else {
    // no stats = accroche slide, same as post-image layout
    drawLayoutBottom(W,H,c,scale,pad,maxW,acc,hi);
  }
}

// --- Shared: diagonal stripe background (for mvp) ---
function drawStripeBackground(W,H){
  ctx.save();
  ctx.globalAlpha = 0.35;
  const stripe = 88*(W/1080);
  for(let x = -H; x < W+H; x += stripe){
    ctx.fillStyle = (Math.round(x/stripe)%2===0) ? "#11181f" : "#0d141a";
    ctx.beginPath();
    ctx.moveTo(x, 0); ctx.lineTo(x+stripe*0.5, 0);
    ctx.lineTo(x+stripe*0.5-H*Math.tan(35*Math.PI/180), H);
    ctx.lineTo(x-H*Math.tan(35*Math.PI/180), H);
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
}

// --- T7: Programme / Calendrier (match schedule) ---
function parseMatches(text){
  const days = []; let current = null;
  (text||"").split("\n").forEach(line=>{
    line = line.trim(); if(!line) return;
    if(line.startsWith("##")){
      current = { date: line.slice(2).trim(), matches:[] };
      days.push(current);
    } else if(current){
      const m = line.match(/^(\d{1,2}[h:]\d{2})\s+(.+?)\s+vs\s+(.+?)(?:\s+(BO\d))?$/i);
      if(m) current.matches.push({ time:m[1], teamA:m[2].trim(), teamB:m[3].trim(), format:m[4]||"" });
      else{
        const simple = line.match(/^(.+?)\s+vs\s+(.+?)(?:\s+(BO\d))?$/i);
        if(simple) current.matches.push({ time:"", teamA:simple[1].trim(), teamB:simple[2].trim(), format:simple[3]||"" });
      }
    }
  });
  return days;
}
function drawLayoutProgramme(W,H,c,scale,pad,maxW,acc,hi){
  const eyeF = Math.round(22*scale);
  const titleF = Math.round((state.format==="story"||state.reel?64:56)*scale*sVal("titleScale"));
  const titleLH = Math.round(titleF*1.06);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);

  const accentLineH = Math.round(4*scale);
  const gap = Math.round(13*scale);
  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  let y = Math.round(H*0.14 + 80*scale) + dragOffset;
  ctx.fillStyle = acc;
  ctx.fillRect(pad, y, Math.round(54*scale), accentLineH);
  y += accentLineH + gap;
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.18);
    y += eyeF + Math.round(10*scale);
  }
  ctx.textBaseline = "top";
  for(const ln of titleLines){ drawRichLine(ln, pad, y, titleFont, hi, "#ffffff"); y += titleLH; }

  const days = parseMatches(c.matches);
  if(!days.length){ lastTextBox=null; return; }

  y += Math.round(20*scale);
  const dateF = Math.round(24*scale);
  const matchF = Math.round(26*scale);
  const timeF = Math.round(24*scale);
  const fmtF = Math.round(18*scale);
  const rowH = Math.round(84*scale);
  const rowR = Math.round(16*scale);
  const rowGap = Math.round(10*scale);

  const accentBarW = Math.round(4*scale);
  const vsDiamondSize = Math.round(13*scale);

  for(const day of days){
    // day header — dot accent + date in accent color
    const dotR = Math.round(5*scale);
    const hdrY = y + Math.round(16*scale);
    ctx.fillStyle = acc;
    ctx.beginPath(); ctx.arc(pad + dotR, hdrY, dotR, 0, Math.PI*2); ctx.fill();
    ctx.font = `700 ${dateF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "middle";
    const dateLabelX = pad + dotR*2 + Math.round(10*scale);
    ctx.fillText(day.date, dateLabelX, hdrY);
    const dateW = ctx.measureText(day.date).width;
    ctx.strokeStyle = rgba(acc, 0.15); ctx.lineWidth = Math.max(1, scale);
    ctx.beginPath(); ctx.moveTo(dateLabelX+dateW+Math.round(14*scale), hdrY); ctx.lineTo(pad+maxW, hdrY); ctx.stroke();
    const countF = Math.round(18*scale);
    ctx.font = `500 ${countF}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = "#6b7882"; ctx.textAlign = "right";
    ctx.fillText(day.matches.length+" match"+(day.matches.length>1?"s":""), pad+maxW, hdrY);
    ctx.textAlign = "left";
    y = hdrY + Math.round(20*scale);

    for(const match of day.matches){
      // match card
      const hasFR = isFrenchTeam(match.teamA) || isFrenchTeam(match.teamB);
      ctx.save();
      if(hasFR){
        const frGrad = ctx.createLinearGradient(pad, y, pad+maxW, y);
        frGrad.addColorStop(0, rgba(acc, 0.12));
        frGrad.addColorStop(0.5, rgba(acc, 0.04));
        frGrad.addColorStop(1, "rgba(255,255,255,0.02)");
        ctx.fillStyle = frGrad;
      } else {
        ctx.fillStyle = "rgba(255,255,255,0.03)";
      }
      roundRectPath(pad, y, maxW, rowH, rowR); ctx.fill();
      ctx.strokeStyle = hasFR ? rgba(acc, 0.2) : "#16212a"; ctx.lineWidth = Math.max(1, Math.round(1.5*scale));
      roundRectPath(pad, y, maxW, rowH, rowR); ctx.stroke();

      // accent bar left with glow
      ctx.beginPath();
      roundRectPath(pad, y, accentBarW, rowH, rowR);
      ctx.clip();
      ctx.shadowColor = acc; ctx.shadowBlur = Math.round(12*scale); ctx.shadowOffsetX = Math.round(4*scale);
      ctx.fillStyle = acc;
      ctx.fillRect(pad, y, accentBarW, rowH);
      ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0;
      ctx.restore();

      const cy = y + rowH/2;
      const innerPad = Math.round(24*scale);

      // time pill
      if(match.time){
        ctx.font = `600 ${timeF}px 'JetBrains Mono', monospace`;
        const timeTxt = match.time;
        const timeTxtW = ctx.measureText(timeTxt).width;
        const tPillPadX = Math.round(10*scale);
        const tPillPadY = Math.round(6*scale);
        const tPillW = timeTxtW + tPillPadX*2;
        const tPillH = timeF + tPillPadY*2;
        const tPillX = pad + innerPad;
        const tPillY = cy - tPillH/2;
        const tPillR = Math.round(6*scale);
        ctx.fillStyle = "rgba(255,255,255,0.04)";
        roundRectPath(tPillX, tPillY, tPillW, tPillH, tPillR); ctx.fill();
        ctx.strokeStyle = rgba(acc, 0.25); ctx.lineWidth = Math.max(1, scale);
        roundRectPath(tPillX, tPillY, tPillW, tPillH, tPillR); ctx.stroke();
        ctx.fillStyle = "#dfdfdf"; ctx.textBaseline = "middle";
        ctx.fillText(timeTxt, tPillX + tPillPadX, cy);
      }

      // teams centered with logos
      const teamFont = `700 ${matchF}px Sora, sans-serif`;
      const vsF = Math.round(20*scale);
      const logoSize = Math.round(rowH * 0.45);
      const logoGap = Math.round(8*scale);
      const nameA = match.teamA.toUpperCase();
      const nameB = match.teamB.toUpperCase();
      const logoA = findTeamLogo(match.teamA);
      const logoB = findTeamLogo(match.teamB);
      const logoAW = logoA ? logoSize + logoGap : 0;
      const logoBW = logoB ? logoSize + logoGap : 0;
      ctx.font = teamFont;
      const aW = ctx.measureText(nameA).width;
      const bW = ctx.measureText(nameB).width;
      const vsGap = Math.round(10*scale);
      const totalTeamW = logoAW + aW + vsGap + vsDiamondSize*2 + vsGap + logoBW + bW;
      const teamStartX = pad + maxW/2 - totalTeamW/2;

      let tx = teamStartX;
      if(logoA){
        ctx.drawImage(logoA, tx, cy - logoSize/2, logoSize, logoSize);
        tx += logoSize + logoGap;
      }
      ctx.font = teamFont;
      ctx.fillStyle = "#ffffff"; ctx.textBaseline = "middle";
      ctx.fillText(nameA, tx, cy);
      tx += aW + vsGap;

      // VS diamond
      const vsCx = tx + vsDiamondSize;
      ctx.save();
      ctx.fillStyle = rgba(acc, 0.12);
      ctx.beginPath();
      ctx.moveTo(vsCx, cy - vsDiamondSize);
      ctx.lineTo(vsCx + vsDiamondSize, cy);
      ctx.lineTo(vsCx, cy + vsDiamondSize);
      ctx.lineTo(vsCx - vsDiamondSize, cy);
      ctx.closePath(); ctx.fill();
      ctx.font = `800 ${Math.round(11*scale)}px Sora, sans-serif`;
      ctx.fillStyle = acc; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("VS", vsCx, cy);
      ctx.textAlign = "left";
      ctx.restore();
      tx += vsDiamondSize*2 + vsGap;

      if(logoB){
        ctx.drawImage(logoB, tx, cy - logoSize/2, logoSize, logoSize);
        tx += logoSize + logoGap;
      }
      ctx.font = teamFont;
      ctx.fillStyle = "#ffffff";
      ctx.fillText(nameB, tx, cy);

      // format pill
      if(match.format){
        const fmtLabel = match.format.toUpperCase();
        ctx.font = `600 ${fmtF}px 'JetBrains Mono', monospace`;
        const fmtW = ctx.measureText(fmtLabel).width;
        const pillPadX = Math.round(10*scale);
        const pillPadY = Math.round(6*scale);
        const pillW = fmtW + pillPadX*2;
        const pillH = fmtF + pillPadY*2;
        const pillX = pad + maxW - innerPad - pillW;
        const pillY = cy - pillH/2;
        const pillR = Math.round(6*scale);
        ctx.fillStyle = rgba(acc, 0.12);
        roundRectPath(pillX, pillY, pillW, pillH, pillR); ctx.fill();
        ctx.fillStyle = acc; ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(fmtLabel, pillX + pillW/2, cy);
        ctx.textAlign = "left";
      }

      y += rowH + rowGap;
    }
    y += Math.round(8*scale);
  }

  // footer
  if(c.footerText){
    const footF = Math.round(20*scale);
    ctx.font = `500 ${footF}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = "#6b7882"; ctx.textBaseline = "bottom"; ctx.textAlign = "left";
    ctx.fillText(c.footerText, pad, H - pad);
    ctx.textBaseline = "alphabetic";
  }
  lastTextBox = null;
}

// --- T8: Sondage (poll with result bars) ---
function parsePollOptions(text){
  return (text||"").split("\n").map(l=>l.trim()).filter(Boolean).map(line=>{
    const m = line.match(/^(.+?)\s+(\d+)%?\s*$/);
    if(m) return { label:m[1].trim(), pct:parseInt(m[2]) };
    return { label:line, pct:0 };
  });
}
function drawLayoutSondage(W,H,c,scale,pad,maxW,acc,hi){
  const eyeF = Math.round(22*scale);
  const questionF = Math.round((state.format==="story"||state.reel?72:64)*scale*sVal("titleScale"));
  const questionLH = Math.round(questionF*1.08);
  const questionFont = `800 ${questionF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const questionLines = wrapRich(richWords(c.title), questionFont, maxW);

  const accentLineH = Math.round(4*scale);
  const gap = Math.round(13*scale);
  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  let y = Math.round(H*0.14 + 80*scale) + dragOffset;
  ctx.fillStyle = acc;
  ctx.fillRect(pad, y, Math.round(54*scale), accentLineH);
  y += accentLineH + gap;
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.18);
    y += eyeF + Math.round(16*scale);
  }
  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 2;
  for(const ln of questionLines){ drawRichLine(ln, pad, y, questionFont, hi, "#ffffff"); y += questionLH; }
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

  const options = parsePollOptions(c.pollOptions);
  if(!options.length){ lastTextBox=null; return; }

  y += Math.round(32*scale);
  const barH = Math.round(84*scale);
  const barR = Math.round(18*scale);
  const barGap = Math.round(20*scale);
  const labelF = Math.round(28*scale);
  const pctF = Math.round(28*scale);
  const winner = c.pollWinner || 0;

  options.forEach((opt,i)=>{
    const isWinner = i === winner;
    // bar background
    ctx.fillStyle = "#0e151b";
    roundRectPath(pad, y, maxW, barH, barR); ctx.fill();
    // fill bar
    const fillW = Math.max(0, Math.round(maxW*(opt.pct/100)));
    if(fillW > 0){
      ctx.save(); ctx.beginPath();
      roundRectPath(pad, y, maxW, barH, barR); ctx.clip();
      const g = ctx.createLinearGradient(pad, 0, pad+fillW, 0);
      if(isWinner){
        g.addColorStop(0, rgba(acc, 0.28));
        g.addColorStop(1, rgba(acc, 0.08));
      } else {
        g.addColorStop(0, "rgba(255,255,255,0.06)");
        g.addColorStop(1, "rgba(255,255,255,0.02)");
      }
      ctx.fillStyle = g;
      ctx.fillRect(pad, y, fillW, barH);
      ctx.restore();
    }
    // border
    ctx.strokeStyle = isWinner ? rgba(acc, 0.4) : "#1f2c35";
    ctx.lineWidth = Math.max(1, Math.round(1.5*scale));
    roundRectPath(pad, y, maxW, barH, barR); ctx.stroke();
    // label
    const innerPad = Math.round(28*scale);
    ctx.font = `600 ${labelF}px Manrope, sans-serif`;
    ctx.fillStyle = isWinner ? "#ffffff" : "#dfdfdf";
    ctx.textBaseline = "middle";
    ctx.fillText(opt.label, pad+innerPad, y+barH/2);
    // percentage
    ctx.font = `600 ${pctF}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = isWinner ? acc : "#9aa7b0";
    ctx.textAlign = "right";
    ctx.fillText(opt.pct+"%", pad+maxW-innerPad, y+barH/2);
    ctx.textAlign = "left";

    y += barH + barGap;
  });

  // footer (votes + CTA)
  if(c.footerText){
    const footF = Math.round(21*scale);
    ctx.font = `500 ${footF}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = "#6b7882"; ctx.textBaseline = "bottom"; ctx.textAlign = "center";
    ctx.fillText(c.footerText, W/2, H - pad);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }
  lastTextBox = null;
}

// --- T9: Transfert Market (player signing with badge) ---
function drawLayoutTransfert(W,H,c,scale,pad,maxW,acc,hi){
  // bottom scrim (heavier for text readability over photo)
  const scrimH = Math.round(H*0.68);
  const scrim = ctx.createLinearGradient(0, H-scrimH, 0, H);
  const tint = mix(acc, INK, 0.85);
  scrim.addColorStop(0, rgba(tint, 0));
  scrim.addColorStop(0.36, rgba(tint, 0.94));
  scrim.addColorStop(1, rgba(INK, 0.98));
  ctx.fillStyle = scrim; ctx.fillRect(0, H-scrimH, W, scrimH);
  // top fade
  const topH = Math.round(130*scale);
  const topG = ctx.createLinearGradient(0, 0, 0, topH);
  topG.addColorStop(0, "rgba(7,10,13,0.72)"); topG.addColorStop(1, "rgba(7,10,13,0)");
  ctx.fillStyle = topG; ctx.fillRect(0, 0, W, topH);

  // status badge
  const badgeType = c.transferBadge || "officiel";
  const badgeColors = { officiel:"#1cc079", rumeur:"#f0c14b", negociation:"#3b9eff" };
  const badgeLabels = { officiel:"OFFICIEL", rumeur:"RUMEUR", negociation:"EN NÉGOCIATION" };
  const bCol = badgeColors[badgeType] || "#1cc079";
  const bLabel = badgeLabels[badgeType] || "OFFICIEL";

  const pillF = Math.round(20*scale);
  ctx.font = `700 ${pillF}px Sora, sans-serif`;
  const pillTW = ctx.measureText(bLabel).width + bLabel.length*pillF*0.18;
  const dotR = Math.round(6*scale);
  const pillPadX = Math.round(16*scale), pillPadY = Math.round(12*scale);
  const pillW = dotR*2 + Math.round(8*scale) + pillTW + pillPadX*2;
  const pillH = pillF + pillPadY*2;
  const pillX = W/2 - pillW/2;
  const pillY = Math.round(232*scale);

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 16*scale;
  ctx.fillStyle = "rgba(7,10,13,0.7)";
  roundRectPath(pillX, pillY, pillW, pillH, 999); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = rgba(bCol, 0.18);
  roundRectPath(pillX, pillY, pillW, pillH, 999); ctx.fill();
  ctx.strokeStyle = rgba(bCol, 0.6); ctx.lineWidth = Math.max(1, 1.5*scale);
  roundRectPath(pillX, pillY, pillW, pillH, 999); ctx.stroke();
  ctx.fillStyle = bCol;
  ctx.shadowColor = bCol; ctx.shadowBlur = 8*scale;
  ctx.beginPath(); ctx.arc(pillX+pillPadX+dotR, pillY+pillH/2, dotR, 0, Math.PI*2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = bCol;
  ctx.font = `700 ${pillF}px Sora, sans-serif`;
  ctx.textAlign = "left"; ctx.textBaseline = "middle";
  drawSpaced(bLabel, pillX+pillPadX+dotR*2+Math.round(8*scale), pillY+pillH/2, pillF*0.18);
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  ctx.restore();

  // bottom text
  const eyeF = Math.round(22*scale);
  const titleF = Math.round((state.format==="story"||state.reel?80:72)*scale*sVal("titleScale"));
  const descF = Math.round(28*scale*sVal("descScale"));
  const titleLH = Math.round(titleF*1.04);
  const descLH = Math.round(descF*1.4);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);
  const descFont = `500 ${descF}px Manrope, sans-serif`;
  const descLines = (c.showDesc && c.desc.trim()) ? wrapRich(richWords(c.desc), descFont, maxW).slice(0,25) : [];

  const accentLineH = Math.round(4*scale);
  const gapLine = Math.round(14*scale);
  const gapEye = Math.round(14*scale);
  const gapTitle = Math.round(20*scale);
  let blockH = accentLineH + gapLine;
  if(eyebrow) blockH += eyeF + gapEye;
  blockH += titleLines.length*titleLH;
  if(descLines.length) blockH += gapTitle + descLines.length*descLH;

  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  let y = H - pad - blockH + dragOffset;
  ctx.fillStyle = acc;
  ctx.fillRect(pad, y, Math.round(54*scale), accentLineH);
  y += accentLineH + gapLine;
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.18);
    y += eyeF + gapEye;
  }
  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 2;
  for(const ln of titleLines){ drawRichLine(ln, pad, y, titleFont, hi, "#ffffff"); y += titleLH; }
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
  if(descLines.length){
    y += gapTitle;
    for(const ln of descLines){ drawRichLine(ln, pad, y, descFont, hi, descBaseColor()); y += descLH; }
  }
  lastTextBox = null;
}

// --- T10: Tier List (S/A/B/C ranking) ---
function parseTiers(text){
  return (text||"").split("\n").map(l=>l.trim()).filter(Boolean).map(line=>{
    const m = line.match(/^([A-Z]):?\s*(.+)$/i);
    if(m) return { tier:m[1].toUpperCase(), teams:m[2].split(",").map(t=>t.trim()).filter(Boolean) };
    return null;
  }).filter(Boolean);
}
function drawLayoutTierList(W,H,c,scale,pad,maxW,acc,hi){
  const eyeF = Math.round(22*scale);
  const titleF = Math.round((state.format==="story"||state.reel?64:56)*scale*sVal("titleScale"));
  const titleLH = Math.round(titleF*1.06);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);

  const accentLineH = Math.round(4*scale);
  const gap = Math.round(13*scale);
  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  let y = Math.round(H*0.14 + 80*scale) + dragOffset;
  ctx.fillStyle = acc;
  ctx.fillRect(pad, y, Math.round(54*scale), accentLineH);
  y += accentLineH + gap;
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.18);
    y += eyeF + Math.round(10*scale);
  }
  ctx.textBaseline = "top";
  for(const ln of titleLines){ drawRichLine(ln, pad, y, titleFont, hi, "#ffffff"); y += titleLH; }

  if(c.showDesc && c.desc && c.desc.trim()){
    const descF = Math.round(28*scale*sVal("descScale"));
    const descLH = Math.round(descF*1.55);
    const descFont = `500 ${descF}px Manrope, sans-serif`;
    const divH = Math.round(3*scale);
    y += Math.round(12*scale);
    const gradDiv = ctx.createLinearGradient(pad, y, pad+maxW, y);
    gradDiv.addColorStop(0, acc); gradDiv.addColorStop(1, "transparent");
    ctx.fillStyle = gradDiv;
    ctx.fillRect(pad, y, maxW, divH);
    y += divH + Math.round(16*scale);
    const descWords = richWords(c.desc);
    const descLines = wrapRich(descWords, descFont, maxW);
    ctx.textBaseline = "top";
    for(const ln of descLines){ drawRichLine(ln, pad, y, descFont, acc, "#dfdfdf"); y += descLH; }
  }

  const tiers = parseTiers(c.tiers);
  if(!tiers.length){ lastTextBox=null; return; }

  y += Math.round(24*scale);

  const tierColors = {
    S:{ grad:["#ffe08a","#f0c14b"], text:"#241b04", border:0.34, bgA:0.10 },
    A:{ grad:["#e6bd54","#c79a37"], text:"#241b04", border:0.26, bgA:0.08 },
    B:{ grad:["#9c8a52","#7c6d3f"], text:"#f3eede", border:0.22, bgA:0.07 },
    C:{ grad:["#6b7882","#4d5860"], text:"#eef1f3", border:0.18, bgA:0.05 },
    D:{ grad:["#4d5860","#3a4248"], text:"#eef1f3", border:0.14, bgA:0.04 },
  };
  const rowH = Math.round(120*scale);
  const rowGap = Math.round(16*scale);
  const letterBoxW = Math.round(104*scale);
  const letterR = Math.round(18*scale);
  const chipPadX = Math.round(16*scale);
  const chipPadY = Math.round(9*scale);
  const chipR = Math.round(12*scale);
  const chipGap = Math.round(12*scale);
  const chipF = Math.round(24*scale);
  const letterF = Math.round(48*scale);
  const containerGap = Math.round(18*scale);

  for(const tier of tiers){
    const tc = tierColors[tier.tier] || tierColors.C;
    // letter box
    const g = ctx.createLinearGradient(pad, y, pad+letterBoxW, y+rowH);
    g.addColorStop(0, tc.grad[0]); g.addColorStop(1, tc.grad[1]);
    ctx.fillStyle = g;
    roundRectPath(pad, y, letterBoxW, rowH, letterR); ctx.fill();
    ctx.font = `800 ${letterF}px Sora, sans-serif`;
    ctx.fillStyle = tc.text; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(tier.tier, pad+letterBoxW/2, y+rowH/2);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    // chips container
    const cX = pad + letterBoxW + containerGap;
    const cW = maxW - letterBoxW - containerGap;
    ctx.fillStyle = rgba(tc.grad[1], tc.bgA);
    roundRectPath(cX, y, cW, rowH, letterR); ctx.fill();
    ctx.strokeStyle = rgba(tc.grad[1], tc.border); ctx.lineWidth = Math.max(1, 1.5*scale);
    roundRectPath(cX, y, cW, rowH, letterR); ctx.stroke();

    // draw chips (logo if available, text fallback)
    ctx.font = `700 ${chipF}px Sora, sans-serif`;
    let cx = cX + Math.round(20*scale);
    const chipY = y + rowH/2;
    const logoChipSize = Math.round(rowH * 0.65);
    for(const team of tier.teams){
      const logoImg = findTeamLogo(team);
      if(logoImg){
        const cw = logoChipSize + chipPadX*2;
        const ch = logoChipSize + chipPadY*2;
        ctx.fillStyle = "#13202a";
        roundRectPath(cx, chipY-ch/2, cw, ch, chipR); ctx.fill();
        ctx.strokeStyle = "#243039"; ctx.lineWidth = Math.max(1, scale);
        roundRectPath(cx, chipY-ch/2, cw, ch, chipR); ctx.stroke();
        ctx.drawImage(logoImg, cx+chipPadX, chipY-logoChipSize/2, logoChipSize, logoChipSize);
        cx += cw + chipGap;
      } else {
        const tw = ctx.measureText(team).width;
        const cw = tw + chipPadX*2;
        const ch = chipF + chipPadY*2;
        ctx.fillStyle = "#13202a";
        roundRectPath(cx, chipY-ch/2, cw, ch, chipR); ctx.fill();
        ctx.strokeStyle = "#243039"; ctx.lineWidth = Math.max(1, scale);
        roundRectPath(cx, chipY-ch/2, cw, ch, chipR); ctx.stroke();
        ctx.fillStyle = tier.tier==="C" || tier.tier==="D" ? "#dfdfdf" : "#ffffff";
        ctx.textBaseline = "middle";
        ctx.fillText(team, cx+chipPadX, chipY);
        cx += cw + chipGap;
      }
    }

    y += rowH + rowGap;
  }

  // footer
  if(c.footerText){
    const footF = Math.round(20*scale);
    ctx.font = `500 ${footF}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = "#6b7882"; ctx.textBaseline = "bottom"; ctx.textAlign = "center";
    ctx.fillText(c.footerText, W/2, H - pad);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }
  lastTextBox = null;
}

// --- T11: Citation (quote with attribution) ---
function drawLayoutCitation(W,H,c,scale,pad,maxW,acc,hi){
  const eyeF = Math.round(22*scale);
  const quoteF = Math.round((state.format==="story"||state.reel?76:68)*scale*sVal("titleScale"));
  const quoteLH = Math.round(quoteF*1.12);
  const quoteFont = `800 ${quoteF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const quoteLines = wrapRich(richWords(c.title), quoteFont, maxW);

  // eyebrow at top
  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  let y = Math.round(H*0.18) + dragOffset;
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.18);
    y += eyeF + Math.round(20*scale);
  }

  // giant decorative quote mark
  const decoF = Math.round(260*scale);
  ctx.font = `800 ${decoF}px Sora, sans-serif`;
  ctx.fillStyle = rgba(acc, 0.18);
  ctx.textBaseline = "top";
  ctx.fillText("“", pad - Math.round(8*scale), y - decoF*0.25);

  // quote text
  y += Math.round(160*scale);
  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 2;
  for(const ln of quoteLines){ drawRichLine(ln, pad, y, quoteFont, hi, "#ffffff"); y += quoteLH; }
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

  // attribution at bottom
  const nameF = Math.round(38*scale);
  const roleF = Math.round(26*scale);
  const avatarR = Math.round(48*scale);
  const attrY = H - pad - Math.round(20*scale);

  // avatar circle
  const avX = pad + avatarR;
  const avY = attrY - avatarR/2;
  ctx.save();
  ctx.fillStyle = "#13202a"; ctx.strokeStyle = "#243039"; ctx.lineWidth = Math.max(1, 2*scale);
  ctx.beginPath(); ctx.arc(avX, avY, avatarR, 0, Math.PI*2); ctx.fill(); ctx.stroke();
  // initials in avatar
  const pName = c.playerName || "";
  const initials = pName.split(/\s+/).slice(0,2).map(w=>w[0]||"").join("").toUpperCase();
  ctx.fillStyle = acc; ctx.font = `700 ${Math.round(28*scale)}px Sora, sans-serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText(initials, avX, avY);
  ctx.restore();

  // name + role
  const textX = pad + avatarR*2 + Math.round(22*scale);
  ctx.font = `800 ${nameF}px Sora, sans-serif`;
  ctx.fillStyle = "#ffffff"; ctx.textBaseline = "bottom";
  ctx.fillText(pName, textX, avY + Math.round(4*scale));
  if(c.playerRole){
    ctx.font = `500 ${roleF}px Manrope, sans-serif`;
    ctx.fillStyle = "#9aa7b0"; ctx.textBaseline = "top";
    ctx.fillText(c.playerRole, textX, avY + Math.round(8*scale));
  }
  ctx.textBaseline = "alphabetic";
  lastTextBox = null;
}

// --- T12: Player Spotlight (player card with stats) ---

// --- T13: MVP du Match (gold badge + player photo + stats) ---
function drawLayoutMVP(W,H,c,scale,pad,maxW,acc,hi){
  // bottom scrim — subtle warm tint, mostly dark
  const scrimH = Math.round(H*0.58);
  const scrim = ctx.createLinearGradient(0, H-scrimH, 0, H);
  scrim.addColorStop(0, "rgba(7,10,13,0)");
  scrim.addColorStop(0.30, "rgba(12,11,8,0.65)");
  scrim.addColorStop(0.60, "rgba(9,9,10,0.92)");
  scrim.addColorStop(1, "rgba(7,10,13,0.98)");
  ctx.fillStyle = scrim; ctx.fillRect(0, H-scrimH, W, scrimH);
  // top fade
  const topH = Math.round(130*scale);
  const topG = ctx.createLinearGradient(0, 0, 0, topH);
  topG.addColorStop(0, "rgba(7,10,13,0.72)"); topG.addColorStop(1, "rgba(7,10,13,0)");
  ctx.fillStyle = topG; ctx.fillRect(0, 0, W, topH);

  // badge mode: "mvp" (gold) or "macro" (accent)
  const isMvpBadge = (c.mvpBadge||"mvp") === "mvp";
  const gold = isMvpBadge ? "#f0c14b" : acc;

  const gc = hexToRgb(gold);
  const goldGlow = ctx.createRadialGradient(W*0.5, Math.round(240*scale), 0, W*0.5, Math.round(240*scale), W*0.22);
  goldGlow.addColorStop(0, `rgba(${gc.r},${gc.g},${gc.b},0.06)`);
  goldGlow.addColorStop(0.7, `rgba(${gc.r},${gc.g},${gc.b},0.015)`);
  goldGlow.addColorStop(1, `rgba(${gc.r},${gc.g},${gc.b},0)`);
  ctx.fillStyle = goldGlow; ctx.fillRect(0,0,W,H);

  // badge pill — drawn later, just above stats
  const pillF = Math.round(20*scale);
  ctx.font = `800 ${pillF}px Sora, sans-serif`;
  const mvpLabel = isMvpBadge ? "MVP DU MATCH" : "MACRO";
  const pillTW = ctx.measureText(mvpLabel).width + mvpLabel.length*pillF*0.2;
  const pillPadX = Math.round(24*scale), pillPadY = Math.round(10*scale);
  const pillW = pillTW + pillPadX*2;
  const pillH = pillF + pillPadY*2;

  // bottom text — massive title for player name
  const eyeF = Math.round(22*scale);
  const titleF = Math.round((state.format==="story"||state.reel?180:165)*scale*sVal("titleScale"));
  const descF = Math.round(28*scale*sVal("descScale"));
  const titleLH = Math.round(titleF*1.04);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);
  const result = c.matchResult || "";

  // stats
  const stats = parseStats(c.stats);
  const statBoxH = Math.round(110*scale);
  const statBoxGap = Math.round(16*scale);
  const statBoxR = Math.round(18*scale);
  const statValueF = Math.round(48*scale);
  const statLabelF = Math.round(21*scale);
  const showStats = stats.length >= 1;

  // layout from bottom
  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  let bottomEdge = H - pad + dragOffset;
  let statsY = bottomEdge;
  if(showStats){
    statsY = bottomEdge - statBoxH;
    bottomEdge = statsY - Math.round(16*scale);
  }

  // badge pill — just above stats
  const pillGap = Math.round(20*scale);
  const pillX = pad;
  const pillY = bottomEdge - pillH;
  bottomEdge = pillY - pillGap;

  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.5)"; ctx.shadowBlur = 16*scale;
  ctx.fillStyle = "rgba(7,10,13,0.55)";
  roundRectPath(pillX, pillY, pillW, pillH, 999); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();
  if(isMvpBadge){
    const goldG = ctx.createLinearGradient(pillX, pillY, pillX+pillW, pillY+pillH);
    goldG.addColorStop(0, "#ffe08a"); goldG.addColorStop(1, "#f0c14b");
    ctx.fillStyle = goldG;
  } else {
    ctx.fillStyle = acc;
  }
  roundRectPath(pillX, pillY, pillW, pillH, 999); ctx.fill();
  ctx.save();
  ctx.shadowColor = rgba(gold, 0.25); ctx.shadowBlur = 10*scale;
  roundRectPath(pillX, pillY, pillW, pillH, 999); ctx.fill();
  ctx.restore();
  ctx.font = `800 ${pillF}px Sora, sans-serif`;
  ctx.fillStyle = isMvpBadge ? "#231c08" : "#ffffff"; ctx.textAlign = "left"; ctx.textBaseline = "middle";
  const spacedW = pillTW;
  drawSpaced(mvpLabel, pillX + (pillW - spacedW)/2, pillY+pillH/2, pillF*0.2);
  ctx.textBaseline = "alphabetic";

  // result line
  if(result){
    ctx.font = `500 ${descF}px Manrope, sans-serif`;
    ctx.fillStyle = descBaseColor(); ctx.textBaseline = "bottom";
    ctx.fillText(result, pad, bottomEdge);
    bottomEdge -= descF + Math.round(18*scale);
  }

  // title (player name — big)
  const accentLineH = Math.round(4*scale);
  const gapLine = Math.round(14*scale);
  const gapEye = Math.round(14*scale);
  let blockH = accentLineH + gapLine + titleLines.length*titleLH;
  if(eyebrow) blockH += eyeF + gapEye;
  let y = bottomEdge - titleLines.length*titleLH;

  ctx.textBaseline = "top";

  // measure title block width for curve positioning
  ctx.font = titleFont;
  let titleBlockW = 0;
  for(const ln of titleLines){
    const sp = ctx.measureText(" ").width;
    let lw = 0;
    ln.forEach((word,i)=>{ if(i>0) lw += sp; lw += measureTextWithFlags(word.text); });
    if(lw > titleBlockW) titleBlockW = lw;
  }
  const titleBlockH = titleLines.length * titleLH;

  // decorative MVP curves — simple smooth arcs
  ctx.save();
  const cy0 = y + titleBlockH * 0.45;
  // curve 1: single smooth arc, bottom-left to top-right
  ctx.beginPath();
  ctx.moveTo(-Math.round(30*scale), cy0 + Math.round(180*scale));
  ctx.quadraticCurveTo(
    W * 0.5, cy0 - Math.round(140*scale),
    W + Math.round(50*scale), cy0 - Math.round(100*scale)
  );
  ctx.strokeStyle = rgba(gold, 0.7); ctx.lineWidth = Math.max(3.5, 5*scale); ctx.lineCap = "round";
  ctx.shadowColor = rgba(gold, 0.85); ctx.shadowBlur = 40*scale;
  ctx.stroke();
  // curve 2: single smooth arc, top-right to bottom-left
  ctx.beginPath();
  ctx.moveTo(W + Math.round(40*scale), cy0 - Math.round(160*scale));
  ctx.quadraticCurveTo(
    W * 0.45, cy0 + Math.round(120*scale),
    -Math.round(40*scale), cy0 + Math.round(60*scale)
  );
  ctx.strokeStyle = rgba(gold, 0.45); ctx.lineWidth = Math.max(2.5, 3.5*scale);
  ctx.shadowColor = rgba(gold, 0.65); ctx.shadowBlur = 30*scale;
  ctx.stroke();
  ctx.restore();

  // radial glow behind title — gold halo
  const glowCx = pad + titleBlockW * 0.5;
  const glowCy = y + titleBlockH * 0.5;
  const glowR = Math.max(titleBlockW, titleBlockH) * 0.8;
  const titleGlow = ctx.createRadialGradient(glowCx, glowCy, 0, glowCx, glowCy, glowR);
  const gc2 = hexToRgb(gold);
  titleGlow.addColorStop(0, `rgba(${gc2.r},${gc2.g},${gc2.b},0.18)`);
  titleGlow.addColorStop(0.4, `rgba(${gc2.r},${gc2.g},${gc2.b},0.08)`);
  titleGlow.addColorStop(1, `rgba(${gc2.r},${gc2.g},${gc2.b},0)`);
  ctx.fillStyle = titleGlow;
  ctx.fillRect(glowCx - glowR, glowCy - glowR, glowR*2, glowR*2);

  // team logo watermark behind title
  const eyebrowText = (c.eyebrow||"").trim();
  const teamLogo = findTeamLogo(eyebrowText);
  if(teamLogo){
    ctx.save();
    ctx.globalAlpha = 0.1;
    const logoSize = Math.round(titleBlockH * 2.2);
    const lx = pad + titleBlockW - logoSize * 0.5;
    const ly = y + titleBlockH * 0.5 - logoSize * 0.5;
    ctx.drawImage(teamLogo, lx, ly, logoSize, logoSize);
    ctx.restore();
  }

  // actual title text
  ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 2;
  for(const ln of titleLines){ drawRichLine(ln, pad, y, titleFont, gold, "#ffffff"); y += titleLH; }
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

  y = bottomEdge - titleLines.length*titleLH;
  if(eyebrow){
    y -= eyeF + gapEye;
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = gold; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.18);
    y -= accentLineH + gapLine;
  } else {
    y -= accentLineH + gapLine;
  }
  ctx.fillStyle = gold;
  ctx.fillRect(pad, y, Math.round(54*scale), accentLineH);

  // stat boxes
  if(showStats){
    const mvpHiIdx = (c.statHighlight || 0) - 1;
    const count = Math.min(stats.length, 3);
    const boxW = (maxW - (count-1)*statBoxGap) / count;
    let bx = pad;
    for(let i=0; i<count; i++){
      const isHi = i===mvpHiIdx;
      ctx.fillStyle = isHi ? rgba(gold, 0.06) : "rgba(255,255,255,0.03)";
      roundRectPath(bx, statsY, boxW, statBoxH, statBoxR); ctx.fill();
      ctx.strokeStyle = isHi ? rgba(gold, 0.2) : "#16212a"; ctx.lineWidth = Math.max(1, 1.5*scale);
      roundRectPath(bx, statsY, boxW, statBoxH, statBoxR); ctx.stroke();
      // gold accent line at bottom of stat box
      const lineH = Math.round(3*scale);
      const lineInset = Math.round(12*scale);
      ctx.fillStyle = isHi ? gold : rgba(gold, 0.4);
      roundRectPath(bx + lineInset, statsY + statBoxH - lineH - Math.round(2*scale), boxW - lineInset*2, lineH, lineH/2); ctx.fill();
      ctx.font = `600 ${statValueF}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = isHi ? gold : "#ffffff";
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText(stats[i].value, bx+boxW/2, statsY + Math.round(16*scale));
      ctx.font = `500 ${statLabelF}px Manrope, sans-serif`;
      ctx.fillStyle = "#9aa7b0";
      ctx.fillText(stats[i].label, bx+boxW/2, statsY + statBoxH - Math.round(28*scale));
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      bx += boxW + statBoxGap;
    }
  }
  // thin border around entire canvas
  const borderInset = Math.round(8*scale);
  const borderR = Math.round(12*scale);
  ctx.strokeStyle = rgba(gold, 0.2);
  ctx.lineWidth = Math.max(1, 1.5*scale);
  ctx.shadowColor = rgba(gold, 0.15); ctx.shadowBlur = 6*scale;
  roundRectPath(borderInset, borderInset, W - borderInset*2, H - borderInset*2, borderR);
  ctx.stroke();
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0;

  lastTextBox = null;
}

// --- T15: Lineup ---
function parseLineup(text){
  return (text||"").split("\n").map(l=>l.trim()).filter(Boolean).map(line=>{
    const parts = line.split("/").map(s=>s.trim());
    return { name: parts[0]||"", role: parts[1]||"", rating: parts[2]||"" };
  });
}
function drawLayoutLineup(W,H,c,scale,pad,maxW,acc,hi){
  const players = parseLineup(c.lineup);
  const count = c.lineupCount || 5;
  const teamRating = (c.lineupTeamRating||"").trim();
  const showRatings = players.some(p => p.rating !== "");

  const eyeF = Math.round(22*scale);
  const titleF = Math.round((state.format==="story"||state.reel?80:72)*scale*sVal("titleScale"));
  const titleLH = Math.round(titleF*1.04);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);

  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);

  // header block
  const accentLineH = Math.round(4*scale);
  const gapLine = Math.round(14*scale);
  const gapEye = Math.round(14*scale);
  let headerY = Math.round(210*scale) + dragOffset;

  ctx.fillStyle = hi;
  ctx.fillRect(pad, headerY, Math.round(54*scale), accentLineH);
  headerY += accentLineH + gapLine;

  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = hi; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, headerY, eyeF*0.18);
    headerY += eyeF + gapEye;
  }

  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 2;
  for(const ln of titleLines){ drawRichLine(ln, pad, headerY, titleFont, hi, "#ffffff"); headerY += titleLH; }
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

  // player cards — fill available space
  const cardGap = Math.round(14*scale);
  const cardR = Math.round(16*scale);
  const teamRatingH = teamRating ? Math.round(120*scale) : 0;
  const bottomPad = Math.round(100*scale);
  const cardsTop = headerY + Math.round(36*scale);
  const cardsBottom = H - bottomPad - teamRatingH;
  const availableH = cardsBottom - cardsTop;
  const cardH = Math.floor((availableH - (count-1)*cardGap) / count);
  const photoInset = Math.round(10*scale);
  const photoSize = cardH - photoInset*2;
  const photoR = Math.round(12*scale);
  const nameF = Math.round(32*scale);
  const roleF = Math.round(20*scale);
  const ratingF = Math.round(52*scale);
  // find top rating index
  let topRatingIdx = -1, topRatingVal = -1;
  if(showRatings){
    for(let i=0; i<count; i++){
      const p = players[i];
      if(p && p.rating){ const v = parseFloat(p.rating); if(v > topRatingVal){ topRatingVal = v; topRatingIdx = i; } }
    }
  }

  for(let i=0; i<count; i++){
    const p = players[i] || { name:"", role:"", rating:"" };
    const cy = cardsTop + i*(cardH + cardGap);
    const isTop = i === topRatingIdx;

    // card bg
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    roundRectPath(pad, cy, maxW, cardH, cardR); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = Math.max(1, 1.5*scale);
    roundRectPath(pad, cy, maxW, cardH, cardR); ctx.stroke();

    // accent separator line between cards
    if(i > 0){
      ctx.fillStyle = rgba(acc, 0.15);
      ctx.fillRect(pad + Math.round(16*scale), cy - Math.round(cardGap/2), maxW - Math.round(32*scale), Math.max(1, scale));
    }

    // photo — auto-match by player name, fallback to manual lineupPhotos, else empty
    const photoX = pad + photoInset;
    const photoY = cy + photoInset;
    const autoImg = findPlayerImage(p.name);
    const manualImg = c.lineupPhotos && c.lineupPhotos[i];
    const pImg = autoImg || manualImg;
    if(pImg){
      ctx.save();
      roundRectPath(photoX, photoY, photoSize, photoSize, photoR); ctx.clip();
      const iw = pImg.naturalWidth || pImg.width, ih = pImg.naturalHeight || pImg.height;
      const coverScale = Math.max(photoSize/iw, photoSize/ih);
      const dw = iw*coverScale, dh = ih*coverScale;
      // accent gradient behind player (bottom to top)
      const pgrd = ctx.createLinearGradient(photoX, photoY + photoSize, photoX, photoY);
      pgrd.addColorStop(0, rgba(acc, 0.45));
      pgrd.addColorStop(0.6, rgba(acc, 0.08));
      pgrd.addColorStop(1, "transparent");
      ctx.fillStyle = pgrd;
      ctx.fillRect(photoX, photoY, photoSize, photoSize);
      ctx.drawImage(pImg, photoX+(photoSize-dw)/2, photoY+(photoSize-dh)/2, dw, dh);
      ctx.restore();
    } else {
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      roundRectPath(photoX, photoY, photoSize, photoSize, photoR); ctx.fill();
    }

    // accent border on top rating photo
    if(isTop){
      ctx.strokeStyle = acc; ctx.lineWidth = Math.round(3*scale);
      roundRectPath(photoX, photoY, photoSize, photoSize, photoR); ctx.stroke();
    }

    // name (uppercase) + role
    const textX = photoX + photoSize + Math.round(20*scale);
    if(p.name){
      ctx.font = `700 ${nameF}px Sora, sans-serif`;
      ctx.fillStyle = "#ffffff"; ctx.textBaseline = "middle";
      const nameY = p.role ? cy + cardH*0.38 : cy + cardH/2;
      ctx.fillText(p.name.toUpperCase(), textX, nameY);
    }
    if(p.role){
      const roleIcon = findRoleIcon(p.role);
      const roleY = cy + cardH*0.65;
      if(roleIcon){
        const iconS = Math.round(roleF*1.3);
        ctx.drawImage(roleIcon, textX, roleY - iconS/2, iconS, iconS);
        ctx.font = `500 ${roleF}px Manrope, sans-serif`;
        ctx.fillStyle = "#9aa7b0"; ctx.textBaseline = "middle";
        ctx.fillText(p.role, textX + iconS + Math.round(8*scale), roleY);
      } else {
        ctx.font = `500 ${roleF}px Manrope, sans-serif`;
        ctx.fillStyle = "#9aa7b0"; ctx.textBaseline = "middle";
        ctx.fillText(p.role, textX, roleY);
      }
    }

    // rating
    if(p.rating){
      ctx.font = `800 ${ratingF}px Sora, sans-serif`;
      const ratingNum = parseFloat(p.rating);
      if(ratingNum >= 7) ctx.fillStyle = hi;
      else if(ratingNum >= 5) ctx.fillStyle = "#ffffff";
      else ctx.fillStyle = "#ff4d57";
      ctx.textAlign = "right"; ctx.textBaseline = "middle";
      ctx.fillText(p.rating, pad + maxW - Math.round(24*scale), cy + cardH/2);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    }
  }

  // team rating
  if(teamRating){
    const trY = cardsBottom + Math.round(10*scale);
    const trF = Math.round(72*scale);
    const trLabelF = Math.round(18*scale);
    ctx.font = `800 ${trF}px Sora, sans-serif`;
    ctx.fillStyle = hi; ctx.textAlign = "center"; ctx.textBaseline = "top";
    ctx.fillText(teamRating, W/2, trY);
    ctx.font = `700 ${trLabelF}px Sora, sans-serif`;
    ctx.fillStyle = "#9aa7b0";
    drawSpaced("NOTE ÉQUIPE", W/2 - ctx.measureText("NOTE ÉQUIPE").width/2, trY + trF + Math.round(6*scale), trLabelF*0.25);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }

  lastTextBox = null;
}

// --- T16: Bracket ---
function parseBracketRounds(text){
  if(!text || !text.trim()) return [];
  const rounds = [];
  let current = [];
  const lines = text.split("\n");
  for(const raw of lines){
    const line = raw.trim();
    if(!line){
      if(current.length) rounds.push(current);
      current = [];
      continue;
    }
    const m = line.match(/^(.+?)\s+(\d+)\s*$/);
    if(m) current.push({ name: m[1].trim(), score: parseInt(m[2]) });
    else current.push({ name: line, score: 0 });
  }
  if(current.length) rounds.push(current);
  const result = [];
  for(const round of rounds){
    const matches = [];
    for(let i=0; i<round.length; i+=2){
      const a = round[i];
      const b = round[i+1] || { name:"TBD", score:0 };
      matches.push({ teamA: a, teamB: b, winner: a.score > b.score ? "A" : (b.score > a.score ? "B" : null) });
    }
    result.push(matches);
  }
  return result;
}
function parseBracket(text){
  if(!text || !text.trim()) return [];
  if(text.includes("---")){
    const sections = text.split(/^---$/m);
    const upper = parseBracketRounds(sections[0]||"");
    const lower = parseBracketRounds(sections[1]||"");
    const gf = parseBracketRounds(sections[2]||"");
    return { doubleElim: true, upper, lower, grandFinal: gf.length ? gf[0] : [] };
  }
  return parseBracketRounds(text);
}

// --- Groupes ---
function parseGroupes(text){
  const groups = [];
  let current = null;
  (text||"").split("\n").forEach(line=>{
    line = line.trim();
    if(!line) return;
    const normLine = line.replace(/[‒–—―]/g, "-");
    if(normLine.startsWith("---")){
      current = { name: normLine.replace(/^-+\s*/, ""), teams: [] };
      groups.push(current);
    } else {
      if(!current){ current = { name: "Groupe A", teams: [] }; groups.push(current); }
      const scoreMatch = line.match(/^(.+?)\s+(\d+-\d+)\s*$/);
      if(scoreMatch){
        current.teams.push({ name: scoreMatch[1].trim(), score: scoreMatch[2] });
      } else {
        current.teams.push({ name: line });
      }
    }
  });
  return groups;
}

function drawLayoutGroupes(W,H,c,scale,pad,maxW,acc,hi){
  const eyeF = Math.round(22*scale);
  const titleF = Math.round((state.format==="story"||state.reel?68:58) * scale * sVal("titleScale"));
  const titleLH = Math.round(titleF*1.06);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);

  const accentLineH = Math.round(4*scale);
  const gap = Math.round(13*scale);
  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  let y = Math.round(H*0.10 + 50*scale) + dragOffset;
  ctx.fillStyle = acc;
  ctx.fillRect(pad, y, Math.round(54*scale), accentLineH);
  y += accentLineH + gap;
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.18);
    y += eyeF + Math.round(10*scale);
  }
  ctx.textBaseline = "top";
  for(const ln of titleLines){ drawRichLine(ln, pad, y, titleFont, hi, "#ffffff"); y += titleLH; }

  const groups = parseGroupes(c.groupes);
  if(!groups.length){ lastTextBox=null; return; }
  const elimFrom = c.groupeElim || 0;

  const gridGap = Math.round(24*scale);
  const cols = groups.length <= 2 ? groups.length : 2;
  const nRows = Math.ceil(groups.length / cols);
  const sidePad = Math.round(16*scale);
  const gridW = maxW - sidePad*2;
  const cellW = Math.floor((gridW - gridGap*(cols-1)) / cols);
  const gridTop = y + Math.round(22*scale);
  const gridLeft = pad + sidePad;

  const groupNameF = Math.round(34*scale);
  const teamNameF = Math.round(28*scale);
  const rowH = Math.round(56*scale);
  const groupNameH = Math.round(62*scale);
  const colHeaderH = Math.round(32*scale);
  const logoBase = groups.length <= 4 ? 46 : 38;
  const logoSize = Math.round(logoBase*scale);
  const rankF = Math.round(22*scale);
  const scoreF = Math.round(24*scale);
  const colHeaderF = Math.round(14*scale);
  const cardR = Math.round(10*scale);
  const innerPad = Math.round(14*scale);

  const hasScores = groups.some(g => g.teams.some(t => t.score));

  const maxTeams = Math.max(...groups.map(g => g.teams.length));
  const availH = H - gridTop - Math.round(100*scale);
  const cellH = nRows > 1 ? Math.floor((availH - gridGap*(nRows-1)) / nRows) : availH;
  const dynamicRowH = Math.max(rowH, Math.floor((cellH - groupNameH - colHeaderH - innerPad) / maxTeams));

  const rankColW = Math.round(36*scale);
  const scoreColW = hasScores ? Math.round(64*scale) : 0;

  for(let gi = 0; gi < groups.length; gi++){
    const g = groups[gi];
    const col = gi % cols;
    const row = Math.floor(gi / cols);
    const cx = gridLeft + col*(cellW + gridGap);
    const cy = gridTop + row*(cellH + gridGap);

    // card background
    const cardTop = cy + groupNameH;
    const cardH = cellH - groupNameH;

    // group name — folder tab
    ctx.font = `800 ${groupNameF}px Sora, sans-serif`;
    const gnText = g.name.toUpperCase();
    const tabTextW = ctx.measureText(gnText).width;
    const tabPadX = Math.round(18*scale);
    const tabW = tabTextW + tabPadX*2;
    const tabH = groupNameH;
    const tabR = Math.round(8*scale);
    // tab shape: rounded top corners, flat bottom merging into card
    ctx.beginPath();
    ctx.moveTo(cx, cardTop);
    ctx.lineTo(cx, cy + tabR);
    ctx.arcTo(cx, cy, cx + tabR, cy, tabR);
    ctx.lineTo(cx + tabW - tabR, cy);
    ctx.arcTo(cx + tabW, cy, cx + tabW, cy + tabR, tabR);
    ctx.lineTo(cx + tabW, cardTop);
    ctx.closePath();
    ctx.fillStyle = "rgba(255,255,255,0.05)";
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.lineWidth = Math.max(1, scale);
    ctx.stroke();
    // accent bar at top of tab
    ctx.fillStyle = acc;
    ctx.fillRect(cx + tabR, cy, tabW - tabR*2, Math.round(3*scale));
    // tab text
    ctx.fillStyle = "#ffffff"; ctx.textBaseline = "middle"; ctx.textAlign = "left";
    ctx.fillText(gnText, cx + tabPadX, cy + tabH/2 + Math.round(4*scale));
    ctx.fillStyle = "rgba(255,255,255,0.03)";
    roundRectPath(cx, cardTop, cellW, cardH, cardR); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.08)"; ctx.lineWidth = Math.max(1, scale);
    roundRectPath(cx, cardTop, cellW, cardH, cardR); ctx.stroke();

    // column header bar
    const chY = cardTop;
    ctx.fillStyle = rgba(acc, 0.18);
    ctx.fillRect(cx, chY, cellW, colHeaderH);
    ctx.fillStyle = rgba(acc, 0.4);
    ctx.fillRect(cx, chY + colHeaderH - Math.max(1, scale), cellW, Math.max(1, scale));

    ctx.font = `700 ${colHeaderF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillText("#", cx + innerPad, chY + colHeaderH/2);
    ctx.fillText("ÉQUIPE", cx + innerPad + rankColW, chY + colHeaderH/2);
    if(hasScores){
      ctx.textAlign = "center";
      ctx.fillText("W-L", cx + cellW - scoreColW/2 - innerPad/2, chY + colHeaderH/2);
    }

    const teamsTop = chY + colHeaderH;
    g.teams.forEach((team, ti)=>{
      const rank = ti + 1;
      const ry = teamsTop + ti*dynamicRowH;
      const elim = elimFrom > 0 && rank >= elimFrom;

      // alternating row background
      if(ti % 2 === 1){
        ctx.fillStyle = "rgba(255,255,255,0.025)";
        ctx.fillRect(cx, ry, cellW, dynamicRowH);
      }

      // eliminated highlight
      if(elim){
        ctx.fillStyle = "rgba(255,60,60,0.06)";
        ctx.fillRect(cx, ry, cellW, dynamicRowH);
        ctx.fillStyle = "rgba(255,60,60,0.3)";
        ctx.fillRect(cx, ry, Math.round(3*scale), dynamicRowH);
      }

      // bottom border
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.fillRect(cx + innerPad/2, ry + dynamicRowH - Math.max(1, scale), cellW - innerPad, Math.max(1, scale));

      const rcy = ry + dynamicRowH/2;

      // rank
      ctx.font = `700 ${rankF}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = elim ? "#ff5050" : "#7a8a94";
      ctx.textBaseline = "middle"; ctx.textAlign = "left";
      ctx.fillText(String(rank), cx + innerPad, rcy);

      // logo
      const logoImg = findTeamLogo(team.name);
      const logoX = cx + innerPad + rankColW;
      if(logoImg){
        ctx.drawImage(logoImg, logoX, rcy - logoSize/2, logoSize, logoSize);
      }
      const nameX = logoX + (logoImg ? logoSize + Math.round(24*scale) : 0);

      // team name
      ctx.font = `600 ${teamNameF}px Manrope, sans-serif`;
      ctx.fillStyle = elim ? "#8a6060" : "#dfdfdf";
      ctx.textAlign = "left";
      const maxNameW = cx + cellW - innerPad - scoreColW - nameX;
      const fullName = team.name.toUpperCase();
      let name = fullName;
      while(ctx.measureText(name).width > maxNameW && name.length > 3) name = name.slice(0,-1);
      if(name !== fullName) name += "…";
      ctx.fillText(name, nameX, rcy);

      // score
      if(hasScores && team.score){
        ctx.font = `700 ${scoreF}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = "#b0bec5";
        ctx.textAlign = "center";
        ctx.fillText(team.score, cx + cellW - scoreColW/2 - innerPad/2, rcy);
      }
    });
  }

  ctx.textAlign = "left";

  // legend at bottom
  const legendY = H - Math.round(60*scale);
  const legendF = Math.round(18*scale);
  const dotR = Math.round(6*scale);
  ctx.font = `500 ${legendF}px Manrope, sans-serif`;
  ctx.textBaseline = "middle"; ctx.textAlign = "center";

  const legW = Math.round(240*scale);
  const legX = W/2 - legW/2;

  ctx.fillStyle = rgba(acc, 0.5);
  ctx.beginPath(); ctx.arc(legX, legendY, dotR, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = "#9aa7b0";
  ctx.fillText("Qualifié", legX + Math.round(50*scale), legendY);

  ctx.fillStyle = "rgba(255,80,80,0.5)";
  ctx.beginPath(); ctx.arc(legX + Math.round(140*scale), legendY, dotR, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = "#9aa7b0";
  ctx.fillText("Éliminé", legX + Math.round(190*scale), legendY);

  ctx.textAlign = "left";

  ctx.textAlign = "left";
  lastTextBox = null;
}

function drawLayoutBracket(W,H,c,scale,pad,maxW,acc,hi){
  const eyeF = Math.round(22*scale);
  const titleF = Math.round((state.format==="story"||state.reel?72:60)*scale*sVal("titleScale"));
  const titleLH = Math.round(titleF*1.06);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);
  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);

  const accentLineH = Math.round(4*scale);
  const gapLine = Math.round(13*scale);
  let y = Math.round(H*0.085 + 80*scale) + dragOffset;
  ctx.fillStyle = acc;
  ctx.fillRect(pad, y, Math.round(54*scale), accentLineH);
  y += accentLineH + gapLine;
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.18);
    y += eyeF + Math.round(10*scale);
  }
  ctx.textBaseline = "top";
  for(const ln of titleLines){ drawRichLine(ln, pad, y, titleFont, hi, "#ffffff"); y += titleLH; }

  const parsed = parseBracket(c.bracket);
  const isDE = parsed && parsed.doubleElim;
  const rounds = isDE ? null : (Array.isArray(parsed) ? parsed : []);
  if(!isDE && (!rounds || !rounds.length)){ lastTextBox=null; return; }

  const bracketPad = Math.round(W*0.04);
  const bracketMaxW = W - bracketPad*2;
  const RG = Math.round(22*scale);
  const cardR = Math.round(8*scale);
  const rowPad = Math.round(10*scale);
  const fmtBlockH = (c.bracketFormat||"").trim() ? Math.round(36*scale) : 0;

  // shared card drawing helper
  const drawMatchCard = (rx, my, MW, MH, match, isFinal, teamF, scoreF, logoSize) => {
    const halfH = MH/2;

    // finale: radial glow behind card
    if(isFinal){
      ctx.save();
      const glowR = Math.max(MW, MH) * 0.8;
      const glow = ctx.createRadialGradient(rx+MW/2, my+MH/2, 0, rx+MW/2, my+MH/2, glowR);
      glow.addColorStop(0, rgba(acc, 0.10));
      glow.addColorStop(1, "transparent");
      ctx.fillStyle = glow;
      ctx.fillRect(rx-glowR, my-glowR, MW+glowR*2, MH+glowR*2);
      ctx.restore();
    }

    const cardBg = isFinal ? rgba(acc, 0.08) : "rgba(255,255,255,0.04)";
    const cardStroke = isFinal ? rgba(acc, 0.35) : "rgba(255,255,255,0.08)";
    ctx.fillStyle = cardBg;
    roundRectPath(rx, my, MW, MH, cardR); ctx.fill();
    ctx.strokeStyle = cardStroke; ctx.lineWidth = Math.max(1, (isFinal?2.5:1.5)*scale);
    roundRectPath(rx, my, MW, MH, cardR); ctx.stroke();
    if(match.winner){
      const winY = match.winner==="A" ? my : my+halfH;
      ctx.fillStyle = rgba(acc, 0.15);
      ctx.save(); ctx.beginPath(); roundRectPath(rx, my, MW, MH, cardR); ctx.clip();
      ctx.fillRect(rx, winY, MW, halfH); ctx.restore();
      // accent bar with glow on winner side
      ctx.save(); ctx.beginPath(); roundRectPath(rx, my, MW, MH, cardR); ctx.clip();
      const barW = Math.round(4*scale);
      ctx.shadowColor = acc; ctx.shadowBlur = Math.round(10*scale); ctx.shadowOffsetX = Math.round(3*scale);
      ctx.fillStyle = acc;
      ctx.fillRect(rx, winY, barW, halfH);
      ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetX = 0;
      ctx.restore();
    }

    // finale: trophy icon above card
    if(isFinal){
      const trophyF = Math.round(18*scale);
      ctx.font = `${trophyF}px sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "bottom";
      ctx.fillText("🏆", rx+MW/2, my - Math.round(4*scale));
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    }

    ctx.strokeStyle = "rgba(255,255,255,0.06)"; ctx.lineWidth = Math.max(1, scale);
    ctx.beginPath(); ctx.moveTo(rx, my+halfH); ctx.lineTo(rx+MW, my+halfH); ctx.stroke();
    const drawTeamRow = (team, isWinner, rowY) => {
      const alpha = isWinner || match.winner===null ? 1 : 0.4;
      ctx.globalAlpha = alpha;
      const logoImg = findTeamLogo(team.name);
      const textX = rx + rowPad + (logoImg ? logoSize + Math.round(8*scale) : 0);
      if(logoImg){ ctx.drawImage(logoImg, rx+rowPad, rowY+(halfH-logoSize)/2, logoSize, logoSize); }
      const maxNameW = MW - rowPad*2 - (logoImg ? logoSize+Math.round(8*scale) : 0) - Math.round(36*scale);
      const fullName = team.name.toUpperCase();
      let usedF = teamF;
      const minF = Math.max(Math.round(10*scale), Math.round(teamF*0.6));
      ctx.font = `600 ${usedF}px Manrope, sans-serif`;
      if(ctx.measureText(fullName).width > maxNameW){
        usedF = Math.max(minF, Math.round(usedF * maxNameW / ctx.measureText(fullName).width));
        ctx.font = `600 ${usedF}px Manrope, sans-serif`;
      }
      ctx.fillStyle = isWinner ? "#ffffff" : "#dfdfdf";
      ctx.textBaseline = "middle"; ctx.textAlign = "left";
      let name = fullName;
      while(ctx.measureText(name).width > maxNameW && name.length > 3) name = name.slice(0,-1);
      if(name !== fullName) name += "…";
      ctx.fillText(name, textX, rowY + halfH/2);
      ctx.font = `800 ${scoreF}px Sora, sans-serif`;
      ctx.fillStyle = isWinner ? acc : "#6b7882";
      ctx.textAlign = "right";
      ctx.fillText(String(team.score), rx+MW-rowPad, rowY+halfH/2);
      ctx.textAlign = "left"; ctx.globalAlpha = 1;
    };
    drawTeamRow(match.teamA, match.winner==="A", my);
    drawTeamRow(match.teamB, match.winner==="B", my+halfH);
  };

  // shared sub-bracket drawing: returns { yPositions, MW, MH } for connector use
  const drawSubBracket = (subRounds, regionTop, regionBottom, bracketLeft, MW, isFinalBracket, deMode, isLower) => {
    const availH = regionBottom - regionTop;
    const matchTop = regionTop;
    const numR = subRounds.length;
    const baseIdx = subRounds.reduce((best,r,i) => r.length >= subRounds[best].length ? i : best, 0);
    const baseCount = subRounds[baseIdx].length;
    const maxMH = Math.round((deMode ? 76 : 82)*scale);
    const minMH = Math.round((deMode ? 48 : 48)*scale);
    const idealMH = Math.floor(availH * 0.85 / Math.max(1, baseCount));
    const MH = Math.min(maxMH, Math.max(minMH, idealMH));
    const remainH = availH - baseCount * MH;
    const MG = Math.max(Math.round(6*scale), Math.floor(remainH / Math.max(1, baseCount-1)));
    const teamF = Math.min(Math.round(24*scale), Math.max(Math.round(14*scale), Math.round(MH*0.30)));
    const scoreF = Math.round(teamF * 1.1);
    const logoSize = Math.min(Math.round(28*scale), Math.max(Math.round(16*scale), Math.round(MH*0.34)));

    const yPos = subRounds.map(()=>[]);
    const baseBlockH = baseCount * MH + (baseCount-1) * MG;
    const baseOff = (availH - baseBlockH) / 2;
    yPos[baseIdx] = subRounds[baseIdx].map((_,i) => matchTop + baseOff + i*(MH+MG));
    for(let r=baseIdx+1; r<numR; r++){
      const prev = subRounds[r-1]; const curr = subRounds[r];
      if(curr.length === prev.length){
        for(let m=0;m<curr.length;m++) yPos[r][m] = yPos[r-1][m];
      } else if(curr.length===1 && prev.length>=1){
        yPos[r][0] = (yPos[r-1][0] + yPos[r-1][prev.length-1]) / 2;
      } else {
        for(let m=0;m<curr.length;m++){
          const f1=m*2, f2=m*2+1;
          if(f2<prev.length) yPos[r][m] = (yPos[r-1][f1]+yPos[r-1][f2])/2;
          else if(f1<prev.length) yPos[r][m] = yPos[r-1][f1];
          else yPos[r][m] = matchTop + m*(MH+MG);
        }
      }
    }
    for(let r=baseIdx-1; r>=0; r--){
      const next = subRounds[r+1]; const curr = subRounds[r];
      if(curr.length === next.length){
        for(let m=0;m<curr.length;m++) yPos[r][m] = yPos[r+1][m];
      } else {
        for(let m=0;m<curr.length;m++){
          const target = Math.floor(m/2);
          if(target<next.length){
            const ny = yPos[r+1][target];
            yPos[r][m] = m%2===0 ? ny-(MH+MG)/2 : ny+(MH+MG)/2;
          } else yPos[r][m] = matchTop + m*(MH+MG);
        }
      }
    }

    // connectors (rounded corners + glow on winner path)
    const connR = Math.round(8*scale);
    for(let r=0; r<numR-1; r++){
      const fromX = bracketLeft + r*(MW+RG)+MW;
      const toX = bracketLeft + (r+1)*(MW+RG);
      const midX = fromX + RG/2;
      const curr = subRounds[r]; const next = subRounds[r+1];
      const sameSize = curr.length === next.length;
      for(let m=0;m<curr.length;m++){
        const fromY = yPos[r][m]+MH/2;
        const targetM = sameSize ? m : Math.floor(m/2);
        if(targetM>=next.length) continue;
        const isTop = m%2===0;
        const toY = yPos[r+1][targetM] + (sameSize ? (isLower ? MH*0.75 : MH/2) : (isTop ? MH*0.25 : MH*0.75));
        const hasWinner = !!curr[m].winner;
        ctx.save();
        if(hasWinner){
          ctx.shadowColor = acc; ctx.shadowBlur = Math.round(6*scale);
        }
        ctx.strokeStyle = rgba(acc, hasWinner ? 0.55 : 0.20);
        ctx.lineWidth = Math.max(1, (hasWinner ? 2.5 : 1.5)*scale);
        ctx.beginPath(); ctx.moveTo(fromX, fromY);
        if(Math.abs(fromY - toY) < 2){
          ctx.lineTo(toX, toY);
        } else {
          ctx.lineTo(midX - connR, fromY);
          ctx.arcTo(midX, fromY, midX, fromY + (toY > fromY ? connR : -connR), connR);
          ctx.lineTo(midX, toY + (toY > fromY ? -connR : connR));
          ctx.arcTo(midX, toY, midX + connR, toY, connR);
          ctx.lineTo(toX, toY);
        }
        ctx.stroke();
        ctx.restore();
      }
    }
    // cards
    for(let r=0; r<numR; r++){
      const rx = bracketLeft + r*(MW+RG);
      const isF = isFinalBracket && r===numR-1;
      for(let m=0; m<subRounds[r].length; m++){
        drawMatchCard(rx, yPos[r][m], MW, MH, subRounds[r][m], isF, teamF, scoreF, logoSize);
      }
    }
    return { yPos, MH, teamF, scoreF, logoSize };
  };

  if(isDE){
    // ── DOUBLE ELIMINATION ──
    const upper = parsed.upper;
    const lower = parsed.lower;
    const gf = parsed.grandFinal;
    const uRounds = upper.length;
    const lRounds = lower.length;
    const maxCols = Math.max(uRounds, lRounds) + (gf.length ? 1 : 0);
    const totalGapW = (maxCols-1)*RG;
    const mwCap = c.bracketWide ? Math.round(400*scale) : Math.round(260*scale);
    const MW = Math.min(mwCap, Math.floor((bracketMaxW - totalGapW) / maxCols));
    const totalBracketW = maxCols * MW + (maxCols-1) * RG;
    const bracketLeft = (W - totalBracketW) / 2;

    const sectionLabelF = Math.round(13*scale);
    const sectionLabelH = Math.round(22*scale);
    const bracketTop = y + Math.round(30*scale);
    const bracketBottom = H - pad - fmtBlockH - Math.round(20*scale);
    const totalH = bracketBottom - bracketTop;

    const uMaxCol = Math.max(...upper.map(r => r.length));
    const lMaxCol = Math.max(...lower.map(r => r.length));
    const uRatio = uMaxCol / Math.max(1, uMaxCol + lMaxCol);
    const dividerGap = Math.round(72*scale);
    const dividerY = bracketTop + (totalH - dividerGap) * Math.max(0.30, Math.min(0.72, uRatio)) + dividerGap/2;

    // upper region
    const upperTop = bracketTop;
    const upperBottom = dividerY - Math.round(36*scale);
    const uResult = drawSubBracket(upper, upperTop, upperBottom, bracketLeft, MW, false, true);

    // divider
    ctx.strokeStyle = rgba(acc, 0.12); ctx.lineWidth = Math.max(1, scale);
    ctx.beginPath(); ctx.moveTo(pad, dividerY); ctx.lineTo(W-pad, dividerY); ctx.stroke();

    // lower region
    const lowerTop = dividerY + Math.round(36*scale);
    const lowerBottom = gf.length ? bracketBottom - Math.round(10*scale) : bracketBottom;
    const lResult = drawSubBracket(lower, lowerTop, lowerBottom, bracketLeft, MW, false, true, true);

    // UB drop indicators: right-angle line from Team A going up
    const dropRounds = new Set();
    for(let r=0; r<uRounds; r++){
      const lbTarget = r === 0 ? 0 : Math.min(r * 2 - 1, lRounds - 1);
      if(lbTarget < lRounds) dropRounds.add(lbTarget);
    }
    const dropArmLen = Math.round(12*scale);
    const dropUpLen = Math.round(18*scale);
    ctx.lineWidth = Math.max(1, 1.5*scale);
    for(const lbR of dropRounds){
      if(!lResult.yPos[lbR]) continue;
      for(let m=0; m<(lower[lbR]||[]).length; m++){
        if(lResult.yPos[lbR][m] === undefined) continue;
        const cx = bracketLeft + lbR*(MW+RG);
        const topY = lResult.yPos[lbR][m];
        const teamAMidY = topY + lResult.MH/4;
        ctx.strokeStyle = rgba(acc, 0.45);
        ctx.beginPath();
        ctx.moveTo(cx, teamAMidY);
        ctx.lineTo(cx - dropArmLen, teamAMidY);
        ctx.lineTo(cx - dropArmLen, teamAMidY - dropUpLen);
        ctx.stroke();
      }
    }

    // match dates
    let matchDates = {};
    try { if(c.bracketDates) matchDates = JSON.parse(c.bracketDates); } catch(e){}
    const dateF = Math.round(14*scale);
    const drawMatchDate = (key, rx, my, mw) => {
      const d = matchDates[key];
      if(!d) return;
      ctx.font = `500 ${dateF}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.textBaseline = "bottom"; ctx.textAlign = "center";
      ctx.fillText(d, rx + mw/2, my - Math.round(3*scale));
      ctx.textAlign = "left"; ctx.textBaseline = "top";
    };
    for(let r=0; r<uRounds; r++){
      for(let m=0; m<upper[r].length; m++){
        if(!uResult.yPos[r] || uResult.yPos[r][m]===undefined) continue;
        drawMatchDate(`ub-${r}-${m}`, bracketLeft + r*(MW+RG), uResult.yPos[r][m], MW);
      }
    }
    for(let r=0; r<lRounds; r++){
      for(let m=0; m<lower[r].length; m++){
        if(!lResult.yPos[r] || lResult.yPos[r][m]===undefined) continue;
        drawMatchDate(`lb-${r}-${m}`, bracketLeft + r*(MW+RG), lResult.yPos[r][m], MW);
      }
    }

    // grand final
    if(gf.length){
      const gfCol = maxCols - 1;
      const gfX = bracketLeft + gfCol * (MW + RG);
      const gfMH = Math.round(78*scale);
      const gfY = bracketTop + totalH/2 - gfMH/2;
      const gfTeamF = Math.min(Math.round(22*scale), Math.round(gfMH*0.30));
      const gfScoreF = Math.round(gfTeamF*1.1);
      const gfLogoSize = Math.min(Math.round(24*scale), Math.round(gfMH*0.32));

      // connectors from UB final and LB final to GF
      ctx.lineWidth = Math.max(1, 1.5*scale);
      if(uResult.yPos.length && uResult.yPos[uRounds-1] && uResult.yPos[uRounds-1].length){
        const ubLastX = bracketLeft + (uRounds-1)*(MW+RG) + MW;
        const ubLastY = uResult.yPos[uRounds-1][0] + uResult.MH/2;
        const midX = ubLastX + RG/2;
        ctx.strokeStyle = rgba(acc, 0.35);
        ctx.beginPath(); ctx.moveTo(ubLastX, ubLastY); ctx.lineTo(midX, ubLastY);
        ctx.lineTo(midX, gfY + gfMH*0.25); ctx.lineTo(gfX, gfY + gfMH*0.25); ctx.stroke();
      }
      if(lResult.yPos.length && lResult.yPos[lRounds-1] && lResult.yPos[lRounds-1].length){
        const lbLastX = bracketLeft + (lRounds-1)*(MW+RG) + MW;
        const lbLastY = lResult.yPos[lRounds-1][0] + lResult.MH/2;
        const midX = lbLastX + RG/2;
        ctx.strokeStyle = rgba(acc, 0.35);
        ctx.beginPath(); ctx.moveTo(lbLastX, lbLastY); ctx.lineTo(midX, lbLastY);
        ctx.lineTo(midX, gfY + gfMH*0.75); ctx.lineTo(gfX, gfY + gfMH*0.75); ctx.stroke();
      }

      drawMatchDate("gf", gfX, gfY, MW);
      drawMatchCard(gfX, gfY, MW, gfMH, gf[0], true, gfTeamF, gfScoreF, gfLogoSize);

      // winner label
      if(gf[0].winner){
        const winnerName = gf[0].winner==="A" ? gf[0].teamA.name : gf[0].teamB.name;
        const winLabel = (c.bracketWinnerLabel||"champion")==="qualifie" ? "QUALIFIÉ" : "CHAMPION";
        const champLabelF = Math.round(13*scale);
        const champY = gfY + gfMH + Math.round(12*scale);
        ctx.font = `600 ${champLabelF}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = "#6b7882"; ctx.textBaseline = "top"; ctx.textAlign = "center";
        drawSpaced(winLabel, gfX+MW/2 - ctx.measureText(winLabel).width/2, champY, champLabelF*0.2);
        const winLogo = findTeamLogo(winnerName);
        const logoY = champY + champLabelF + Math.round(6*scale);
        if(winLogo){
          const ls = Math.round(40*scale);
          ctx.drawImage(winLogo, gfX+MW/2 - ls/2, logoY, ls, ls);
        } else {
          const champNameF = Math.round(28*scale);
          ctx.font = `800 ${champNameF}px Sora, sans-serif`;
          ctx.fillStyle = acc; ctx.textAlign = "center";
          ctx.fillText(winnerName, gfX+MW/2, logoY);
        }
        ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      }
    }
  } else {
    // ── SINGLE ELIMINATION (original) ──
    const numRounds = rounds.length;
    const bracketTop = y + Math.round(44*scale);
    const championBlockH = Math.round(70*scale);
    const bracketBottom = H - pad - fmtBlockH - championBlockH;
    const totalGapW = (numRounds-1)*RG;
    const MW = Math.min(Math.round(260*scale), Math.floor((bracketMaxW - totalGapW) / numRounds));
    const totalBracketW = numRounds * MW + (numRounds-1) * RG;
    const bracketLeft = (W - totalBracketW) / 2;
    const seResult = drawSubBracket(rounds, bracketTop, bracketBottom, bracketLeft, MW, true, false);

    // match dates for single elim
    let matchDates = {};
    try { if(c.bracketDates) matchDates = JSON.parse(c.bracketDates); } catch(e){}
    const dateF = Math.round(14*scale);
    for(let r=0; r<numRounds; r++){
      for(let m=0; m<rounds[r].length; m++){
        if(!seResult.yPos[r] || seResult.yPos[r][m]===undefined) continue;
        const d = matchDates[`ub-${r}-${m}`];
        if(!d) continue;
        ctx.font = `500 ${dateF}px 'JetBrains Mono', monospace`;
        ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.textBaseline = "bottom"; ctx.textAlign = "center";
        ctx.fillText(d, bracketLeft + r*(MW+RG) + MW/2, seResult.yPos[r][m] - Math.round(3*scale));
        ctx.textAlign = "left"; ctx.textBaseline = "top";
      }
    }

    // champion label for single elim
    const lastR = rounds[rounds.length-1];
    if(lastR && lastR.length===1 && lastR[0].winner){
      const finalMatch = lastR[0];
      const winnerName = finalMatch.winner==="A" ? finalMatch.teamA.name : finalMatch.teamB.name;
      const winLabel = (c.bracketWinnerLabel||"champion")==="qualifie" ? "QUALIFIÉ" : "CHAMPION";
      const finalRx = bracketLeft + (numRounds-1)*(MW+RG);
      const finalCx = finalRx + MW/2;
      const champLabelF = Math.round(14*scale);
      const champY = bracketBottom + Math.round(16*scale);
      ctx.font = `600 ${champLabelF}px 'JetBrains Mono', monospace`;
      ctx.fillStyle = "#6b7882"; ctx.textBaseline = "top"; ctx.textAlign = "center";
      drawSpaced(winLabel, finalCx - ctx.measureText(winLabel).width/2, champY, champLabelF*0.2);
      const winLogo = findTeamLogo(winnerName);
      const logoY = champY + champLabelF + Math.round(8*scale);
      if(winLogo){
        const ls = Math.round(44*scale);
        ctx.drawImage(winLogo, finalCx - ls/2, logoY, ls, ls);
      } else {
        const champNameF = Math.round(32*scale);
        ctx.font = `800 ${champNameF}px Sora, sans-serif`;
        ctx.fillStyle = acc; ctx.textAlign = "center";
        ctx.fillText(winnerName, finalCx, logoY);
      }
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    }
  }

  // footer format
  const fmt = (c.bracketFormat||"").trim();
  if(fmt){
    const fmtF = Math.round(18*scale);
    ctx.font = `500 ${fmtF}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = "#6b7882"; ctx.textAlign = "center"; ctx.textBaseline = "top";
    ctx.fillText(fmt, W/2, H - Math.round(80*scale));
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }
  lastTextBox = null;
}

// --- T17: Planning hebdomadaire (weekly calendar grid) ---
function parsePlanningEvents(text){
  const days = []; let current = null;
  (text||"").split("\n").forEach(line=>{
    line = line.trim(); if(!line) return;
    if(line.startsWith("##")){
      const parts = line.slice(2).trim().split(/\s+/);
      current = { abbr: parts[0]||"", date: parts[1]||"", events:[] };
      days.push(current);
    } else if(current){
      const m = line.match(/^(\d{1,2})[h:]?-(\d{1,2})[h:]?\s+(.+?)\s+(lol|cs2|val|rl|cod)$/i);
      if(m) current.events.push({ start:parseInt(m[1]), end:parseInt(m[2]), name:m[3].trim(), game:m[4].toLowerCase() });
    }
  });
  return days;
}
function drawLayoutPlanning(W,H,c,scale,pad,maxW,acc,hi){
  const eyeF = Math.round(20*scale);
  const titleF = Math.round((state.format==="story"||state.reel?52:44)*scale*sVal("titleScale"));
  const titleLH = Math.round(titleF*1.08);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const eyebrow = (c.eyebrow||"").toUpperCase();
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);

  const accentLineH = Math.round(3*scale);
  const gap = Math.round(10*scale);
  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  let y = Math.round(H*0.08 + 60*scale) + dragOffset;

  ctx.fillStyle = acc;
  ctx.fillRect(pad, y, Math.round(42*scale), accentLineH);
  y += accentLineH + gap;
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.16);
    y += eyeF + Math.round(6*scale);
  }
  ctx.textBaseline = "top";
  for(const ln of titleLines){ drawRichLine(ln, pad, y, titleFont, hi, "#ffffff"); y += titleLH; }

  // Description under title
  const desc = (c.desc||"").trim();
  if(desc && c.showDesc){
    const descF = Math.round(22*scale);
    ctx.font = `500 ${descF}px Manrope, sans-serif`;
    ctx.fillStyle = "rgba(255,255,255,0.45)";
    ctx.textBaseline = "top"; ctx.textAlign = "left";
    y += Math.round(6*scale);
    ctx.fillText(desc, pad, y);
    y += descF + Math.round(4*scale);
  }

  const days = parsePlanningEvents(c.planningEvents);
  if(!days.length){ lastTextBox=null; return; }

  // Agenda list layout — capsules with game logos, auto-fill height
  const labelW = Math.round(90*scale);
  const contentLeft = pad + labelW;
  const contentW = W - pad - contentLeft;

  const topGap = Math.round(20*scale);
  const bottomPad = pad + Math.round(10*scale);
  const availH = H - (y + topGap) - bottomPad;

  let totalEvts = 0;
  for(const day of days) totalEvts += Math.max(day.events.length, 1);
  const numSeps = days.length - 1;

  const minEvGap = Math.round(6*scale);
  const minRowGap = Math.round(24*scale);
  const fixedSpace = numSeps * minRowGap + (totalEvts - days.length) * minEvGap;
  const pillH = Math.min(Math.round(72*scale), Math.floor((availH - fixedSpace) / totalEvts));
  const usedH = totalEvts * pillH + fixedSpace;
  const extraSpace = Math.max(0, availH - usedH);
  const rowGap = minRowGap + (numSeps > 0 ? Math.floor(extraSpace * 0.6 / numSeps) : 0);
  const evGap = minEvGap + (totalEvts > days.length ? Math.floor(extraSpace * 0.4 / (totalEvts - days.length)) : 0);

  const dayAbbrF = Math.min(Math.round(24*scale), Math.round(pillH * 0.42));
  const dayDateF = Math.min(Math.round(28*scale), Math.round(pillH * 0.50));
  const evNameF = Math.min(Math.round(24*scale), Math.round(pillH * 0.42));
  const evTimeF = Math.min(Math.round(20*scale), Math.round(pillH * 0.34));

  y += topGap;

  for(let i = 0; i < days.length; i++){
    const day = days[i];
    const numEv = Math.max(day.events.length, 1);
    const rowH = numEv * pillH + (numEv - 1) * evGap;

    // Day label — pill with accent bar
    const labelCx = pad + labelW / 2;
    const labelCy = y + rowH / 2;
    const labelPillW = Math.round(70*scale);
    const labelPillH = Math.min(Math.round(64*scale), rowH);
    const labelPillR = Math.round(12*scale);
    const accentBarW = Math.max(2, Math.round(3*scale));
    const labelPillX = labelCx - labelPillW/2;
    const labelPillY2 = labelCy - labelPillH/2;
    ctx.save();
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    roundRectPath(labelPillX, labelPillY2, labelPillW, labelPillH, labelPillR);
    ctx.fill();
    ctx.restore();
    // Accent bar left side
    ctx.save();
    roundRectPath(labelPillX, labelPillY2, labelPillW, labelPillH, labelPillR);
    ctx.clip();
    ctx.fillStyle = acc;
    ctx.fillRect(labelPillX, labelPillY2, accentBarW, labelPillH);
    ctx.restore();

    ctx.font = `700 ${dayAbbrF}px Sora, sans-serif`;
    ctx.fillStyle = acc;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(day.abbr, labelCx + Math.round(2*scale), labelCy - Math.round(pillH*0.18));
    ctx.font = `600 ${dayDateF}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = "#ffffff";
    ctx.fillText(day.date, labelCx + Math.round(2*scale), labelCy + Math.round(pillH*0.22));

    for(let j = 0; j < day.events.length; j++){
      const ev = day.events[j];
      const gc = GAME_COLORS[ev.game] || acc;
      const pillY = y + j * (pillH + evGap);
      const pillW = contentW;
      const capsuleR = pillH / 2;

      // Capsule background
      ctx.save();
      const bg = ctx.createLinearGradient(contentLeft, 0, contentLeft + pillW, 0);
      bg.addColorStop(0, rgba(gc, 0.20));
      bg.addColorStop(0.5, rgba(gc, 0.08));
      bg.addColorStop(1, rgba(gc, 0.03));
      ctx.fillStyle = bg;
      roundRectPath(contentLeft, pillY, pillW, pillH, capsuleR);
      ctx.fill();
      ctx.strokeStyle = rgba(gc, 0.18);
      ctx.lineWidth = Math.max(1, 1.5*scale);
      roundRectPath(contentLeft, pillY, pillW, pillH, capsuleR);
      ctx.stroke();
      ctx.restore();

      // Game logo circle with glow
      const circleR = Math.round(pillH * 0.38);
      const circleCx = contentLeft + capsuleR;
      const circleCy = pillY + pillH / 2;

      // Glow behind circle
      ctx.save();
      const glowR = circleR + Math.round(6*scale);
      const glow = ctx.createRadialGradient(circleCx, circleCy, circleR*0.5, circleCx, circleCy, glowR);
      glow.addColorStop(0, rgba(gc, 0.25));
      glow.addColorStop(1, rgba(gc, 0));
      ctx.fillStyle = glow;
      ctx.fillRect(circleCx - glowR, circleCy - glowR, glowR*2, glowR*2);
      ctx.restore();

      // Circle fill
      ctx.save();
      ctx.fillStyle = rgba(gc, 0.22);
      ctx.beginPath();
      ctx.arc(circleCx, circleCy, circleR, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      const gameLogo = GAME_LOGO_IMGS[ev.game];
      if(gameLogo){
        const logoS = Math.round(circleR * 1.3);
        ctx.save();
        ctx.globalAlpha = 0.9;
        ctx.drawImage(gameLogo, circleCx - logoS/2, circleCy - logoS/2, logoS, logoS);
        ctx.restore();
      }

      // Event name
      const textLeft = circleCx + circleR + Math.round(12*scale);
      ctx.font = `700 ${evNameF}px Sora, sans-serif`;
      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "left"; ctx.textBaseline = "middle";
      ctx.fillText(ev.name, textLeft, circleCy);

      // Time badge — colored pill
      const tp = Math.round(16*scale);
      const timeStr = ev.start + "h — " + (ev.end%24) + "h";
      ctx.font = `600 ${evTimeF}px 'JetBrains Mono', monospace`;
      const timeW = ctx.measureText(timeStr).width;
      const badgePadX = Math.round(10*scale);
      const badgePadY = Math.round(4*scale);
      const badgeH = evTimeF + badgePadY*2;
      const badgeW = timeW + badgePadX*2;
      const badgeX = contentLeft + pillW - tp - badgeW;
      const badgeY = circleCy - badgeH/2;
      const badgeR = badgeH/2;
      ctx.save();
      ctx.fillStyle = rgba(gc, 0.15);
      roundRectPath(badgeX, badgeY, badgeW, badgeH, badgeR);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = rgba(gc, 0.8);
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(timeStr, badgeX + badgeW/2, circleCy);
    }

    y += rowH;

    if(i < days.length - 1){
      const sepY = Math.round(y + rowGap/2);
      const diamondS = Math.round(3.5*scale);
      const midX = W / 2;
      // Left line
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.lineWidth = Math.max(1, scale);
      ctx.beginPath();
      ctx.moveTo(pad + Math.round(10*scale), sepY);
      ctx.lineTo(midX - diamondS - Math.round(8*scale), sepY);
      ctx.stroke();
      // Right line
      ctx.beginPath();
      ctx.moveTo(midX + diamondS + Math.round(8*scale), sepY);
      ctx.lineTo(W - pad - Math.round(10*scale), sepY);
      ctx.stroke();
      // Diamond
      ctx.save();
      ctx.fillStyle = rgba(acc, 0.35);
      ctx.beginPath();
      ctx.moveTo(midX, sepY - diamondS);
      ctx.lineTo(midX + diamondS, sepY);
      ctx.lineTo(midX, sepY + diamondS);
      ctx.lineTo(midX - diamondS, sepY);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      y += rowGap;
    }
  }

  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  lastTextBox = null;
}

// --- T17: Glossaire (term per slide) ---
function drawLayoutGlossaire(W,H,c,scale,pad,maxW,acc,hi){
  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  const eyeF = Math.round(22*scale);
  const wordF = Math.round(68*scale*sVal("titleScale"));
  const phoneF = Math.round(22*scale);
  const defF = Math.round(28*scale*sVal("descScale"));
  const defLH = Math.round(defF*1.55);
  const boxLabelF = Math.round(18*scale);
  const boxTextF = Math.round(24*scale);
  const boxTextLH = Math.round(boxTextF*1.45);
  const divH = Math.round(3*scale);
  const boxPadX = Math.round(20*scale);
  const boxPadY = Math.round(16*scale);
  const boxR = Math.round(10*scale);
  const borderW = Math.round(3.5*scale);

  // slide number (big watermark)
  const numF = Math.round(220*scale);
  ctx.font = `800 ${numF}px Sora, sans-serif`;
  ctx.fillStyle = rgba(acc, 0.06);
  ctx.textAlign = "right"; ctx.textBaseline = "top";
  const slideIdx = state.images.indexOf(cur());
  const numStr = String(slideIdx >= 0 ? slideIdx : 0).padStart(2,"0");
  ctx.fillText(numStr, W - pad, pad + Math.round(30*scale) + dragOffset);
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

  let y = Math.round(H*0.14) + dragOffset;

  // category eyebrow
  const eyebrow = (c.eyebrow||"").toUpperCase();
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.18);
    y += eyeF + Math.round(16*scale);
  }

  // term word
  const wordFont = `800 ${wordF}px Sora, sans-serif`;
  const wordLines = wrapRich(richWords(c.title), wordFont, maxW);
  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 2;
  for(const ln of wordLines){ drawRichLine(ln, pad, y, wordFont, hi, "#ffffff"); y += Math.round(wordF*1.08); }
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

  // phonetic
  if(c.phonetic){
    y += Math.round(4*scale);
    ctx.font = `400 italic ${phoneF}px Manrope, sans-serif`;
    ctx.fillStyle = "#6b7882"; ctx.textBaseline = "top";
    ctx.fillText(c.phonetic, pad, y);
    y += phoneF + Math.round(8*scale);
  }

  // divider
  y += Math.round(12*scale);
  const gradDiv = ctx.createLinearGradient(pad, y, pad+maxW, y);
  gradDiv.addColorStop(0, acc); gradDiv.addColorStop(1, "transparent");
  ctx.fillStyle = gradDiv;
  ctx.fillRect(pad, y, maxW, divH);
  y += divH + Math.round(20*scale);

  // definition
  if(c.desc && c.desc.trim()){
    const defFont = `500 ${defF}px Manrope, sans-serif`;
    const defWords = richWords(c.desc);
    const defLines = wrapRich(defWords, defFont, maxW);
    ctx.textBaseline = "top";
    for(const ln of defLines){ drawRichLine(ln, pad, y, defFont, acc, "#dfdfdf"); y += defLH; }
    y += Math.round(16*scale);
  }

  // example box
  if(c.example && c.example.trim()){
    const exLines = wrapRich(richWords(c.example), `500 ${boxTextF}px Manrope, sans-serif`, maxW - boxPadX*2 - borderW);
    const exH = boxPadY + boxLabelF + Math.round(8*scale) + exLines.length*boxTextLH + boxPadY;
    // box bg + border
    ctx.fillStyle = rgba(acc, 0.06);
    roundRectPath(pad + borderW, y, maxW - borderW, exH, boxR);
    ctx.fill();
    ctx.fillStyle = acc;
    ctx.fillRect(pad, y, borderW, exH);
    // label
    ctx.font = `700 ${boxLabelF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "top";
    drawSpaced("EN VRAI", pad + borderW + boxPadX, y + boxPadY, boxLabelF*0.12);
    // text
    let ey = y + boxPadY + boxLabelF + Math.round(8*scale);
    const exFont = `500 ${boxTextF}px Manrope, sans-serif`;
    ctx.textBaseline = "top";
    for(const ln of exLines){ drawRichLine(ln, pad + borderW + boxPadX, ey, exFont, acc, "#9aa7b0"); ey += boxTextLH; }
    y += exH + Math.round(14*scale);
  }

  // analogy box
  if(c.analogy && c.analogy.trim()){
    const anLines = wrapRich(richWords(c.analogy), `500 ${boxTextF}px Manrope, sans-serif`, maxW - boxPadX*2 - Math.round(34*scale));
    const anH = boxPadY + anLines.length*boxTextLH + boxPadY;
    ctx.fillStyle = "rgba(240,193,75,0.06)";
    roundRectPath(pad, y, maxW, anH, boxR);
    ctx.fill();
    // bulb icon
    ctx.font = `400 ${Math.round(28*scale)}px sans-serif`;
    ctx.textBaseline = "top";
    ctx.fillText("💡", pad + boxPadX, y + boxPadY);
    // text
    let ay = y + boxPadY;
    const anFont = `500 ${boxTextF}px Manrope, sans-serif`;
    const anX = pad + boxPadX + Math.round(34*scale);
    ctx.textBaseline = "top";
    for(const ln of anLines){ drawRichLine(ln, anX, ay, anFont, "#f0c14b", "#f0c14b"); ay += boxTextLH; }
    y += anH;
  }

  lastTextBox = null;
}

// --- T18: Guide (step-by-step explainer) ---
function drawLayoutGuide(W,H,c,scale,pad,maxW,acc,hi){
  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  const eyeF = Math.round(22*scale);
  const titleF = Math.round(60*scale*sVal("titleScale"));
  const titleLH = Math.round(titleF*1.12);
  const textF = Math.round(28*scale*sVal("descScale"));
  const textLH = Math.round(textF*1.55);
  const boxLabelF = Math.round(18*scale);
  const boxTextF = Math.round(24*scale);
  const boxTextLH = Math.round(boxTextF*1.45);
  const divH = Math.round(3*scale);
  const boxPadX = Math.round(20*scale);
  const boxPadY = Math.round(16*scale);
  const boxR = Math.round(10*scale);
  const borderW = Math.round(3.5*scale);

  // slide number (big watermark)
  const numF = Math.round(220*scale);
  ctx.font = `800 ${numF}px Sora, sans-serif`;
  ctx.fillStyle = rgba(acc, 0.06);
  ctx.textAlign = "right"; ctx.textBaseline = "top";
  const slideIdx = state.images.indexOf(cur());
  const numStr = String(slideIdx >= 0 ? slideIdx : 0).padStart(2,"0");
  ctx.fillText(numStr, W - pad, pad + Math.round(30*scale) + dragOffset);
  ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

  let y = Math.round(H*0.14) + dragOffset;

  // eyebrow
  const eyebrow = (c.eyebrow||"").toUpperCase();
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc; ctx.textBaseline = "top";
    drawSpaced(eyebrow, pad, y, eyeF*0.18);
    y += eyeF + Math.round(16*scale);
  }

  // title
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const titleLines = wrapRich(richWords(c.title), titleFont, maxW);
  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 2;
  for(const ln of titleLines){ drawRichLine(ln, pad, y, titleFont, hi, "#ffffff"); y += titleLH; }
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

  // divider
  y += Math.round(12*scale);
  const gradDiv = ctx.createLinearGradient(pad, y, pad+maxW, y);
  gradDiv.addColorStop(0, acc); gradDiv.addColorStop(1, "transparent");
  ctx.fillStyle = gradDiv;
  ctx.fillRect(pad, y, maxW, divH);
  y += divH + Math.round(20*scale);

  // description text
  if(c.desc && c.desc.trim()){
    const descFont = `500 ${textF}px Manrope, sans-serif`;
    const descWords = richWords(c.desc);
    const descLines = wrapRich(descWords, descFont, maxW);
    ctx.textBaseline = "top";
    for(const ln of descLines){ drawRichLine(ln, pad, y, descFont, acc, "#dfdfdf"); y += textLH; }
    y += Math.round(16*scale);
  }

  // boxes (colored info boxes)
  // format: "color#label#text" per line, color = cyan/gold/red/purple/green (optional, defaults cyan)
  if(c.boxes && c.boxes.trim()){
    const BOX_COLORS = { cyan:acc, gold:"#f0c14b", red:"#ff4d57", purple:"#b06ce0", green:"#1cc079" };
    const boxLines = c.boxes.trim().split("\n");
    for(const raw of boxLines){
      if(!raw.trim()) continue;
      const parts = raw.split("#").map(s=>s.trim());
      let bColor = acc, bLabel = "", bText = "";
      if(parts.length >= 3){
        bColor = BOX_COLORS[parts[0].toLowerCase()] || acc;
        bLabel = parts[1];
        bText = parts[2];
      } else if(parts.length === 2){
        bLabel = parts[0]; bText = parts[1];
      } else { bText = parts[0]; }

      const bTextLines = wrapRich(richWords(bText), `500 ${boxTextF}px Manrope, sans-serif`, maxW - boxPadX*2 - borderW);
      const hasLabel = !!bLabel;
      const bH = boxPadY + (hasLabel ? boxLabelF + Math.round(6*scale) : 0) + bTextLines.length*boxTextLH + boxPadY;
      // bg + border
      ctx.fillStyle = rgba(bColor, 0.06);
      roundRectPath(pad + borderW, y, maxW - borderW, bH, boxR);
      ctx.fill();
      ctx.fillStyle = bColor;
      ctx.fillRect(pad, y, borderW, bH);
      let by = y + boxPadY;
      if(hasLabel){
        ctx.font = `700 ${boxLabelF}px Sora, sans-serif`;
        ctx.fillStyle = bColor; ctx.textBaseline = "top";
        drawSpaced(bLabel.toUpperCase(), pad + borderW + boxPadX, by, boxLabelF*0.12);
        by += boxLabelF + Math.round(6*scale);
      }
      const bFont = `500 ${boxTextF}px Manrope, sans-serif`;
      ctx.textBaseline = "top";
      for(const ln of bTextLines){ drawRichLine(ln, pad + borderW + boxPadX, by, bFont, bColor, "#9aa7b0"); by += boxTextLH; }
      y += bH + Math.round(10*scale);
    }
  }

  // analogy box (same as glossaire)
  if(c.analogy && c.analogy.trim()){
    const anLines = wrapRich(richWords(c.analogy), `500 ${boxTextF}px Manrope, sans-serif`, maxW - boxPadX*2 - Math.round(34*scale));
    const anH = boxPadY + anLines.length*boxTextLH + boxPadY;
    ctx.fillStyle = "rgba(240,193,75,0.06)";
    roundRectPath(pad, y, maxW, anH, boxR);
    ctx.fill();
    ctx.font = `400 ${Math.round(28*scale)}px sans-serif`;
    ctx.textBaseline = "top";
    ctx.fillText("💡", pad + boxPadX, y + boxPadY);
    let ay = y + boxPadY;
    const anFont = `500 ${boxTextF}px Manrope, sans-serif`;
    const anX = pad + boxPadX + Math.round(34*scale);
    ctx.textBaseline = "top";
    for(const ln of anLines){ drawRichLine(ln, anX, ay, anFont, "#f0c14b", "#f0c14b"); ay += boxTextLH; }
    y += anH + Math.round(10*scale);
  }

  // grid cards (icon|name|desc per line)
  if(c.grid && c.grid.trim()){
    const gridItems = c.grid.trim().split("\n").filter(l=>l.trim());
    const cols = gridItems.length <= 3 ? gridItems.length : 2;
    const nRows = Math.ceil(gridItems.length / cols);
    const bottomMargin = Math.round(80*scale);
    const availH = H - y - bottomMargin;
    const gap = Math.round(14*scale);
    const cardH = Math.round((availH - (nRows-1)*gap) / nRows);
    const cardW = (maxW - (cols-1)*gap) / cols;
    const cardR = Math.round(12*scale);
    const cardPad = Math.round(20*scale);
    const iconF = Math.round(36*scale);
    const nameF = Math.round(30*scale);
    const gdescF = Math.round(22*scale);
    const gdescLH = Math.round(gdescF*1.45);

    gridItems.forEach((raw, i) => {
      const parts = raw.split("#").map(s=>s.trim());
      const icon = parts[0] || "";
      const name = parts[1] || "";
      const gdesc = parts[2] || "";
      const col = i % cols;
      const row = Math.floor(i / cols);
      const cx = pad + col*(cardW+gap);
      const cy = y + row*(cardH+gap);

      // card bg
      ctx.fillStyle = "rgba(255,255,255,0.03)";
      ctx.strokeStyle = "#1f2c35"; ctx.lineWidth = Math.max(1, 1.5*scale);
      roundRectPath(cx, cy, cardW, cardH, cardR);
      ctx.fill(); ctx.stroke();

      let ty = cy + cardPad;
      // icon — use role icon if available, else emoji
      const rIcon = findRoleIcon(icon) || findRoleIcon(name);
      if(rIcon){
        const iconS = Math.round(iconF*1.1);
        ctx.drawImage(rIcon, cx + cardPad, ty, iconS, iconS);
      } else {
        ctx.font = `400 ${iconF}px sans-serif`;
        ctx.fillStyle = "#fff"; ctx.textBaseline = "top";
        ctx.fillText(icon, cx + cardPad, ty);
      }
      ty += iconF + Math.round(14*scale);
      // name
      ctx.font = `700 ${nameF}px Sora, sans-serif`;
      ctx.fillStyle = "#fff"; ctx.textBaseline = "top";
      ctx.fillText(name, cx + cardPad, ty);
      ty += nameF + Math.round(8*scale);
      // desc
      const maxDescLines = Math.max(2, Math.floor((cy + cardH - cardPad - ty) / gdescLH));
      const gdLines = wrapRich(richWords(gdesc), `400 ${gdescF}px Manrope, sans-serif`, cardW - cardPad*2);
      ctx.textBaseline = "top";
      const gdFont = `400 ${gdescF}px Manrope, sans-serif`;
      for(const ln of gdLines.slice(0, maxDescLines)){ drawRichLine(ln, cx + cardPad, ty, gdFont, acc, "#8a959d"); ty += gdescLH; }
    });
    const rows = Math.ceil(gridItems.length / cols);
    y += rows*(cardH+gap);
  }

  lastTextBox = null;
}

// --- T19: Édito (image left + text right) ---
function drawLayoutEdito(W,H,c,scale,pad,maxW,acc,hi){
  const imgW = Math.round(W * 0.45);
  const imgGap = Math.round(16 * scale);
  const rightX = imgW + imgGap;
  const rightW = W - rightX - pad;
  const imgR = Math.round(14 * scale);

  // --- left: image panel ---
  if(c.img){
    ctx.save();
    roundRectPath(0, 0, imgW, H, 0);
    ctx.clip();
    drawCover(c.img, 0, 0, imgW, H, sVal("zoom"), c.tx.ox, c.tx.oy);
    if(sVal("imgBright") < 1){
      ctx.fillStyle = `rgba(0,0,0,${1 - sVal("imgBright")})`;
      ctx.fillRect(0, 0, imgW, H);
    }
    // subtle right-edge fade into dark
    const edgeFade = ctx.createLinearGradient(imgW - Math.round(60*scale), 0, imgW, 0);
    edgeFade.addColorStop(0, "rgba(7,10,13,0)");
    edgeFade.addColorStop(1, "rgba(7,10,13,0.55)");
    ctx.fillStyle = edgeFade;
    ctx.fillRect(imgW - Math.round(60*scale), 0, Math.round(60*scale), H);
    ctx.restore();

    // accent border on right edge of image
    ctx.fillStyle = acc;
    ctx.fillRect(imgW - Math.round(3*scale), 0, Math.round(3*scale), H);
  } else {
    // no image: dark placeholder panel
    ctx.save();
    roundRectPath(pad, pad, imgW - pad*2, H - pad*2, imgR);
    ctx.fillStyle = "#0e161d";
    ctx.fill();
    ctx.strokeStyle = "#1a2a36";
    ctx.lineWidth = Math.max(1, 2*scale);
    ctx.stroke();
    ctx.restore();
    ctx.fillStyle = "#3a4c57";
    ctx.font = `500 ${Math.round(18*scale)}px Manrope, sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("Image", imgW/2, H/2);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }

  // --- right: text content ---
  const eyeF = Math.round(20 * scale);
  const titleF = Math.round(72 * scale * sVal("titleScale"));
  const descF = Math.round(26 * scale * sVal("descScale"));
  const titleLH = Math.round(titleF * 1.08);
  const descLH = Math.round(descF * 1.55);
  const titleFont = `800 ${titleF}px Sora, sans-serif`;
  const descFont = `500 ${descF}px Manrope, sans-serif`;
  const eyebrow = (c.eyebrow || "").toUpperCase();
  const titleLines = wrapRich(richWords(c.title), titleFont, rightW);
  const descLines = (c.showDesc && c.desc && c.desc.trim()) ? wrapRich(richWords(c.desc), descFont, Math.round(rightW * 0.95)).slice(0, 20) : [];

  // compute total block height for vertical centering
  const accentLineH = Math.round(4 * scale);
  const gap = Math.round(14 * scale);
  let blockH = accentLineH + gap;
  if(eyebrow) blockH += eyeF + gap;
  blockH += titleLines.length * titleLH;
  if(descLines.length) blockH += Math.round(20*scale) + descLines.length * descLH;

  const dragOffset = ((c.textY||0)*scale) + (c.textDrag||0);
  const centerY = H * 0.46 + dragOffset;
  let y = centerY - blockH / 2;
  lastTextBox = { x: rightX, y, w: rightW, h: blockH };

  // accent tick
  ctx.fillStyle = acc;
  ctx.fillRect(rightX, y, Math.round(44 * scale), accentLineH);
  y += accentLineH + gap;

  // eyebrow
  if(eyebrow){
    ctx.font = `700 ${eyeF}px Sora, sans-serif`;
    ctx.fillStyle = acc;
    ctx.textBaseline = "top";
    drawSpaced(eyebrow, rightX, y, eyeF * 0.18);
    y += eyeF + gap;
  }

  // title (rich text with *accent*)
  ctx.textBaseline = "top";
  ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 2;
  for(const ln of titleLines){
    drawRichLine(ln, rightX, y, titleFont, hi, "#ffffff");
    y += titleLH;
  }
  ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;

  // description
  if(descLines.length){
    y += Math.round(20 * scale);
    for(const ln of descLines){
      drawRichLine(ln, rightX, y, descFont, hi, descBaseColor());
      y += descLH;
    }
  }

  // signature at bottom-right
  if(c.signature && c.signature.trim()){
    const sigF = Math.round(22 * scale);
    const avatarR = Math.round(30 * scale);
    ctx.font = `500 ${sigF}px 'JetBrains Mono', monospace`;
    const initials = c.signature.split(/\s+/).slice(0, 2).map(w => w[0] || "").join("").toUpperCase();
    const sigY = H - pad - avatarR / 2;
    ctx.save();
    ctx.fillStyle = "#13202a"; ctx.strokeStyle = "#243039"; ctx.lineWidth = Math.max(1, 2*scale);
    ctx.beginPath(); ctx.arc(rightX + avatarR/2, sigY, avatarR/2, 0, Math.PI*2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = acc; ctx.font = `600 ${Math.round(20*scale)}px 'JetBrains Mono', monospace`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(initials, rightX + avatarR/2, sigY);
    ctx.restore();
    ctx.font = `500 ${sigF}px 'JetBrains Mono', monospace`;
    ctx.fillStyle = "#9aa7b0"; ctx.textBaseline = "middle";
    ctx.fillText(c.signature, rightX + avatarR + Math.round(10*scale), sigY);
    ctx.textBaseline = "alphabetic";
  }
}

// ═══ SECTION: RENDER ═══
function render(){
  let [W,H] = state.reel ? FORMATS.story : FORMATS[state.format];
  const item = cur();
  const tpl = curTpl();
  if(item && item.bracketWide && tpl === "bracket") W *= 2;
  if(cv.width!==W || cv.height!==H){ cv.width=W; cv.height=H; }
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = INK; ctx.fillRect(0,0,W,H);

  const showVideo = item && item.video && tpl === "post-video" && item.showBgImage !== false;
  const editoImg = tpl === "edito" && item && item.img;
  const showImg = ((item && item.img && item.showBgImage !== false) || showVideo) && !editoImg;
  const framed = showImg && item.framedImage && !showVideo;
  const dual = showImg && item.dualImage && !showVideo;
  if(editoImg){
    drawBaseBackground(W,H);
  } else if(dual){
    drawDualImage(item, W, H, sVal("zoom"));
    if(sVal("imgBright") < 1){
      ctx.fillStyle = `rgba(0,0,0,${1 - sVal("imgBright")})`;
      ctx.fillRect(0,0,W,H);
    }
    applyEdgeBlur(W,H);
  } else if(showImg && !framed){
    drawSlideMedia(item, W, H, sVal("zoom"));
    if(sVal("imgBright") < 1){
      ctx.fillStyle = `rgba(0,0,0,${1 - sVal("imgBright")})`;
      ctx.fillRect(0,0,W,H);
    }
    applyEdgeBlur(W,H);
  } else if(framed){
    drawBaseBackground(W,H);
    drawFramedImage(item, W, H, sVal("zoom"));
    if(sVal("imgBright") < 1){
      ctx.fillStyle = `rgba(0,0,0,${1 - sVal("imgBright")})`;
      ctx.fillRect(0,0,W,H);
    }
  } else if(item){
    if(tpl==="breaking") drawBreakingBackground(W,H);
    else drawBaseBackground(W,H);
  } else {
    drawBaseBackground(W,H);
    ctx.fillStyle = "#3a4c57";
    ctx.font = `600 ${Math.round(W*0.028)}px Manrope`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("Ajoute une image ou une slide texte", W/2, H/2);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }
  drawOverlay(W, H, { index: state.active, total: state.images.length }, item, showImg);
}

// ═══ SECTION: UPLOAD + SLIDES ═══
const fileInput = document.getElementById("file");
const drop = document.getElementById("drop");
drop.onclick = ()=> $("bgImageFile").click();
fileInput.onchange = e => addFiles(e.target.files);
drop.ondragover = e => { e.preventDefault(); drop.style.borderColor="var(--cyan)"; };
drop.ondragleave = ()=> drop.style.borderColor="";
drop.ondrop = e => { e.preventDefault(); drop.style.borderColor=""; addFiles(e.dataTransfer.files); };

function setActive(i){ state.active = i; refreshThumbs(); syncInputs(); render(); }

function updateSlideNav(){
  const total = state.images.length;
  const cur = state.active;
  if($("slideNavLabel")) $("slideNavLabel").textContent = total ? (cur+1)+" / "+total : "–";
  if($("prevSlide")) $("prevSlide").disabled = cur <= 0;
  if($("nextSlide")) $("nextSlide").disabled = cur >= total - 1;
}

function addFiles(files){
  const arr = [...files].filter(f=>f.type.startsWith("image/"));
  let pending = arr.length;
  if(!pending) return;
  arr.forEach(f=>{
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = ()=>{
      state.images.push(newSlide(img, f.name));
      if(--pending===0){ state.active = state.images.length-1; refreshThumbs(); syncInputs(); updateReelAvailability(); render(); }
    };
    img.src = URL.createObjectURL(f);
  });
}

function addTextSlide(tpl){
  state.images.push(newSlide(null, "Texte", tpl));
  state.active = state.images.length-1;
  refreshThumbs(); syncInputs(); updateReelAvailability(); render();
}

let dragSrc = null;
function refreshThumbs(){
  const box = document.getElementById("thumbs");
  box.innerHTML = "";
  state.images.forEach((it,i)=>{
    const t = document.createElement("div");
    t.className = "thumb"+(i===state.active?" active":"");
    const media = it.img ? `<img src="${it.img.src}">` : `<div class="thumb-text">Aa</div>`;
    t.innerHTML = media + `<span class="num">${i+1}</span><span class="x">×</span>`;
    t.onclick = ()=> setActive(i);
    t.querySelector(".x").onclick = (e)=>{ e.stopPropagation(); removeImage(i); };
    t.draggable = true;
    t.ondragstart = e=>{ dragSrc = i; t.classList.add("dragging"); e.dataTransfer.effectAllowed = "move"; };
    t.ondragend = ()=>{ t.classList.remove("dragging"); document.querySelectorAll(".thumb").forEach(x=>x.classList.remove("drop-target")); };
    t.ondragover = e=>{ e.preventDefault(); e.dataTransfer.dropEffect = "move"; if(dragSrc!==i) t.classList.add("drop-target"); };
    t.ondragleave = ()=> t.classList.remove("drop-target");
    t.ondrop = e=>{ e.preventDefault(); t.classList.remove("drop-target"); reorderSlides(dragSrc, i); };
    box.appendChild(t);
  });
  document.getElementById("slideHint").style.display = state.images.length>1 ? "block" : "none";
  updateSlideNav();
}
function reorderSlides(from, to){
  if(from==null || from===to) return;
  const moved = state.images.splice(from,1)[0];
  state.images.splice(to,0,moved);
  state.active = to;
  dragSrc = null;
  refreshThumbs(); syncInputs(); render();
}
function removeImage(i){
  state.images.splice(i,1);
  if(state.active>=state.images.length) state.active=Math.max(0,state.images.length-1);
  refreshThumbs(); syncInputs(); updateReelAvailability(); render();
}
function updateReelAvailability(){
  const t = document.getElementById("reelToggle");
  const hasVideo = state.images.some(s => s.video && s.template === "post-video");
  const ok = state.images.length>=2 || hasVideo;
  t.disabled = !ok;
  if(!ok && t.checked){ t.checked=false; setReel(false); }
}

// ═══ SECTION: SYNC INPUTS ═══
function syncInputs(){
  const it = cur();
  const has = !!it;
  const tpl = curTpl();
  ["eyebrow","title","desc","score"].forEach(id=>{ $(id).disabled = !has; });
  $("showDesc").disabled = !has; $("showScore").disabled = !has;
  $("eyebrow").value = has ? it.eyebrow : "";
  $("title").value   = has ? it.title : "";
  $("desc").value    = has ? it.desc : "";
  $("score").value   = has ? it.score : "";
  $("showDesc").checked  = has ? it.showDesc : true;
  $("showScore").checked = has ? it.showScore : false;
  $("scoreY").disabled = !has;
  $("scoreY").value = has ? (it.scoreY||0) : 0;
  $("scoreYV").textContent = has ? (it.scoreY||0) : 0;
  $("textY").disabled = !has;
  $("textY").value = has ? (it.textY||0) : 0;
  $("textYV").textContent = has ? (it.textY||0) : 0;
  $("contentSlideTag").textContent = has && state.images.length>1 ? `· slide ${state.active+1}` : "";

  const ts = sVal("titleScale"); $("titleSize").value = Math.round(ts*100); $("titleSizeV").textContent = Math.round(ts*100)+"%";
  const ds = sVal("descScale");  $("descSize").value = Math.round(ds*100);  $("descSizeV").textContent = Math.round(ds*100)+"%";
  const zm = sVal("zoom");       $("zoom").value = Math.round(zm*100);      $("zoomV").textContent = Math.round(zm*100)+"%";
  const ib = sVal("imgBright");  $("imgBright").value = Math.round(ib*100);  $("imgBrightV").textContent = Math.round(ib*100)+"%";
  const dc = sVal("descColor");  $("descColor").value = Math.round(dc*100);  $("descColorV").textContent = Math.round(dc*100)+"%";

  if($("dur") && $("durAll")){
    const allMode = $("durAll").checked;
    const d = allMode ? state.dur : (has && it.dur ? it.dur : state.dur);
    $("dur").value = d;
    $("durV").textContent = d+"s";
    if($("durSlideTag")) $("durSlideTag").textContent = (!allMode && state.images.length>1) ? `· slide ${state.active+1}` : "";
  }

  if($("game") && $("gameAll")){
    const allMode = $("gameAll").checked;
    const g = allMode ? state.game : (has && it.game ? it.game : state.game);
    $("game").value = g;
    $("customRow").style.display = g==="custom" ? "flex" : "none";
    if($("gameSlideTag")) $("gameSlideTag").textContent = (!allMode && state.images.length>1) ? `· slide ${state.active+1}` : "";
  }

  // new fields
  if($("badge")) { $("badge").value = has ? (it.badge||"breaking") : "breaking"; $("badge").disabled = !has; }
  if($("signature")) { $("signature").value = has ? (it.signature||"") : ""; $("signature").disabled = !has; }
  if($("teamA")) { $("teamA").value = has ? (it.teamA||"") : ""; $("teamA").disabled = !has; }
  if($("teamB")) { $("teamB").value = has ? (it.teamB||"") : ""; $("teamB").disabled = !has; }
  if($("standings")) { $("standings").value = has ? (it.standings||"") : ""; $("standings").disabled = !has; }
  if($("relegationLine")) { $("relegationLine").value = has ? (it.relegationLine||0) : 0; $("relegationLineV").textContent = has ? (it.relegationLine||0) : 0; $("relegationLine").disabled = !has; }
  if($("stats")) { $("stats").value = has ? (it.stats||"") : ""; $("stats").disabled = !has; }
  if($("matches")) { $("matches").value = has ? (it.matches||"") : ""; $("matches").disabled = !has; }
  if($("footerText")) { $("footerText").value = has ? (it.footerText||"") : ""; $("footerText").disabled = !has; }
  if($("pollOptions")) { $("pollOptions").value = has ? (it.pollOptions||"") : ""; $("pollOptions").disabled = !has; }
  if($("pollWinner")) { $("pollWinner").value = has ? (it.pollWinner||0) : 0; $("pollWinnerV").textContent = has ? (it.pollWinner||0) : 0; $("pollWinner").disabled = !has; }
  if($("statHighlight")) { const sv = has ? (it.statHighlight||0) : 0; $("statHighlight").value = sv; $("statHighlightV").textContent = sv; $("statHighlight").disabled = !has; }
  if($("tiers")) { $("tiers").value = has ? (it.tiers||"") : ""; $("tiers").disabled = !has; }
  if($("playerName")) { $("playerName").value = has ? (it.playerName||"") : ""; $("playerName").disabled = !has; }
  if($("playerRole")) { $("playerRole").value = has ? (it.playerRole||"") : ""; $("playerRole").disabled = !has; }
  if($("transferBadge")) { $("transferBadge").value = has ? (it.transferBadge||"officiel") : "officiel"; $("transferBadge").disabled = !has; }
  if($("matchResult")) { $("matchResult").value = has ? (it.matchResult||"") : ""; $("matchResult").disabled = !has; }
  if($("mvpBadge")) { $("mvpBadge").value = has ? (it.mvpBadge||"mvp") : "mvp"; $("mvpBadge").disabled = !has; }
  if($("lineup")) { $("lineup").value = has ? (it.lineup||"") : ""; $("lineup").disabled = !has; }
  if($("lineupTeamRating")) { $("lineupTeamRating").value = has ? (it.lineupTeamRating||"") : ""; $("lineupTeamRating").disabled = !has; }
  if($("groupes")) { $("groupes").value = has ? (it.groupes||"") : ""; $("groupes").disabled = !has; }
  if($("groupeElim")) { $("groupeElim").value = has ? (it.groupeElim!=null ? it.groupeElim : 3) : 3; $("groupeElimV").textContent = $("groupeElim").value; }
  if($("bracket")) { $("bracket").value = has ? (it.bracket||"") : ""; $("bracket").disabled = !has; }
  if($("bracketFormat")) { $("bracketFormat").value = has ? (it.bracketFormat||"") : ""; $("bracketFormat").disabled = !has; }
  if($("bracketWinnerLabel")) { $("bracketWinnerLabel").value = has ? (it.bracketWinnerLabel||"champion") : "champion"; }
  if($("bracketDates")) { $("bracketDates").value = has ? (it.bracketDates||"") : ""; }
  if($("bracketWide")) { $("bracketWide").checked = has ? !!it.bracketWide : false; }
  if($("planningEvents")) { $("planningEvents").value = has ? (it.planningEvents||"") : ""; $("planningEvents").disabled = !has; }
  if($("phonetic")) { $("phonetic").value = has ? (it.phonetic||"") : ""; $("phonetic").disabled = !has; }
  if($("example")) { $("example").value = has ? (it.example||"") : ""; $("example").disabled = !has; }
  if($("analogy")) { $("analogy").value = has ? (it.analogy||"") : ""; $("analogy").disabled = !has; }
  if($("boxes")) { $("boxes").value = has ? (it.boxes||"") : ""; $("boxes").disabled = !has; }
  if($("grid")) { $("grid").value = has ? (it.grid||"") : ""; $("grid").disabled = !has; }
  if($("lineupCountSeg")) { document.querySelectorAll("#lineupCountSeg button").forEach(b=>{ b.classList.toggle("on", parseInt(b.dataset.lc)===(has ? (it.lineupCount||5) : 5)); }); }
  if($("lineupPhotoCount")) { const n = has && it.lineupPhotos ? it.lineupPhotos.filter(Boolean).length : 0; $("lineupPhotoCount").textContent = n ? n+" photo"+(n>1?"s":"") : ""; }
  if($("showBgImage")) { $("showBgImage").checked = has ? (it.showBgImage !== false) : true; $("showBgImage").disabled = !has; }
  if($("framedImage")) { $("framedImage").checked = has ? !!it.framedImage : false; $("framedImage").disabled = !has; }
  if($("dualImage")) { $("dualImage").checked = has ? !!it.dualImage : false; $("dualImage").disabled = !has; }
  if($("photoCredit")) { $("photoCredit").value = has ? (it.photoCredit||"") : ""; $("photoCredit").disabled = !has; }
  if($("bgImageClear")) { $("bgImageClear").style.display = (has && it.img) ? "" : "none"; }
  if($("frameY")) { $("frameY").value = has ? (it.frameY||0) : 0; $("frameYV").textContent = has ? (it.frameY||0) : 0; $("frameY").disabled = !has; }
  const showFrameY = has && !!it.framedImage;
  const frameYEl = document.getElementById("frameYRow");
  if(frameYEl) frameYEl.style.display = showFrameY ? "" : "none";
  const dualRow = document.getElementById("dualImageRow");
  if(dualRow) dualRow.style.display = (has && !!it.dualImage) ? "" : "none";
  if($("bgImageBtn")) { $("bgImageBtn").disabled = !has; }
  if($("watermark")) { const wm = has && it.watermark != null ? it.watermark : state.watermark; $("watermark").checked = wm; }

  // template-specific field visibility
  const show = (id, vis) => { const el = document.getElementById(id); if(el) el.style.display = vis ? "" : "none"; };
  const hasImage = tpl!=="post-texte" && tpl!=="planning" && tpl!=="edito";
  show("scoreRow", tpl==="score");
  show("scoreYRow", tpl==="score");
  show("scoreCheckRow", false);
  show("badgeRow", tpl==="breaking");
  show("signatureRow", tpl==="post-texte" || tpl==="breaking" || tpl==="edito");
  show("teamRow", tpl==="score");
  show("gradientRow", tpl==="post-image" || tpl==="post-video" || tpl==="score" || tpl==="statistique");
  show("videoRow", tpl==="post-video");
  show("zoomRow", hasImage);
  show("imgBrightRow", hasImage);
  show("textYRow", true);
  show("resetView", hasImage);
  show("standingsRow", tpl==="classement");
  show("relegationRow", tpl==="classement");
  show("statsRow", tpl==="statistique" || tpl==="mvp");
  show("matchesRow", tpl==="programme");
  show("planningRow", tpl==="planning");
  show("footerRow", tpl==="programme" || tpl==="sondage" || tpl==="tierlist");
  show("pollRow", tpl==="sondage");
  show("tiersRow", tpl==="tierlist");
  show("playerNameRow", tpl==="citation");
  show("playerRoleRow", tpl==="citation");
  show("matchResultRow", tpl==="mvp");
  show("mvpBadgeRow", tpl==="mvp");
  show("lineupRow", tpl==="lineup");
  show("groupesRow", tpl==="groupe");
  show("bracketRow", tpl==="bracket");
  show("bracketFormatRow", tpl==="bracket");
  show("phoneticRow", tpl==="glossaire");
  show("exampleRow", tpl==="glossaire");
  show("analogyRow", tpl==="glossaire" || tpl==="guide");
  show("boxesRow", tpl==="guide");
  show("gridRow", tpl==="guide");

  // for score template, force showScore on
  if(tpl==="score" && has){
    it.showScore = true;
    $("showScore").checked = true;
  }

  // video loop management
  if(tpl === "post-video" && has && it.video && !it.video.paused){
    startVideoLoop();
  } else {
    stopVideoLoop();
  }
  if($("videoAudio")) $("videoAudio").checked = has && it.video ? !it.video.muted : false;

  // template buttons active state
  document.querySelectorAll("#tplGrid .tpl-btn").forEach(b=>{
    b.classList.toggle("on", b.dataset.tpl === tpl);
  });
}

// ═══ SECTION: BINDINGS ═══
const $ = id => document.getElementById(id);
function setField(k, v){ const it = cur(); if(it){ it[k] = v; render(); } }
$("eyebrow").oninput = e => setField("eyebrow", e.target.value);
$("title").oninput = e => setField("title", e.target.value);
$("desc").oninput = e => setField("desc", e.target.value);
$("showDesc").onchange = e => setField("showDesc", e.target.checked);
$("score").oninput = e => setField("score", e.target.value);
$("showScore").onchange = e => setField("showScore", e.target.checked);
$("scoreY").oninput = e => { const v=parseFloat(e.target.value); $("scoreYV").textContent=v; setField("scoreY", v); };
$("watermark").onchange = e => { const it = cur(); if(it){ it.watermark = e.target.checked; } else { state.watermark = e.target.checked; } render(); };
$("addText").onclick = ()=> addTextSlide();

// template-specific fields
if($("badge")) $("badge").onchange = e => setField("badge", e.target.value);
if($("signature")) $("signature").oninput = e => setField("signature", e.target.value);
if($("teamA")) $("teamA").oninput = e => setField("teamA", e.target.value);
if($("teamB")) $("teamB").oninput = e => setField("teamB", e.target.value);
if($("logoAFile")) $("logoAFile").onchange = e => { const f=e.target.files[0]; if(!f) return; const img=new Image(); img.onload=()=>{ setField("logoA", img); }; img.src=URL.createObjectURL(f); };
if($("logoBFile")) $("logoBFile").onchange = e => { const f=e.target.files[0]; if(!f) return; const img=new Image(); img.onload=()=>{ setField("logoB", img); }; img.src=URL.createObjectURL(f); };
if($("videoFile")) $("videoFile").onchange = e => {
  const f = e.target.files[0]; if(!f) return;
  const it = cur(); if(!it) return;
  const vid = document.createElement("video");
  vid.crossOrigin = "anonymous"; vid.muted = true; vid.loop = true; vid.playsInline = true;
  vid.onloadeddata = ()=>{
    it.video = vid; it.videoFile = f; it.showBgImage = true;
    const p = vid.play();
    if(p && p.catch) p.catch(()=>{});
    startVideoLoop(); updateReelAvailability(); render();
  };
  vid.src = URL.createObjectURL(f);
};
if($("videoPlayPause")) $("videoPlayPause").onclick = ()=>{
  const it = cur(); if(!it || !it.video) return;
  if(it.video.paused){ it.video.play(); startVideoLoop(); $("videoPlayPause").textContent = "⏸ Pause"; }
  else { it.video.pause(); stopVideoLoop(); render(); $("videoPlayPause").textContent = "▶ Play"; }
};
if($("videoAudio")) $("videoAudio").onchange = e => {
  const it = cur(); if(!it || !it.video) return;
  it.video.muted = !e.target.checked;
};
if($("standings")) $("standings").oninput = e => setField("standings", e.target.value);
if($("relegationLine")) $("relegationLine").oninput = e => { const v=parseInt(e.target.value)||0; $("relegationLineV").textContent=v; setField("relegationLine", v); };
if($("groupes")) $("groupes").oninput = e => setField("groupes", e.target.value);
if($("groupeElim")) $("groupeElim").oninput = e => { const v=parseInt(e.target.value)||0; $("groupeElimV").textContent=v; setField("groupeElim", v); };
if($("stats")) $("stats").oninput = e => setField("stats", e.target.value);
if($("matches")) $("matches").oninput = e => setField("matches", e.target.value);
if($("footerText")) $("footerText").oninput = e => setField("footerText", e.target.value);
if($("pollOptions")) $("pollOptions").oninput = e => setField("pollOptions", e.target.value);
if($("pollWinner")) $("pollWinner").oninput = e => { const v=parseInt(e.target.value)||0; $("pollWinnerV").textContent=v; setField("pollWinner", v); };
if($("statHighlight")) $("statHighlight").oninput = e => { const v=parseInt(e.target.value)||0; $("statHighlightV").textContent=v; setField("statHighlight", v); };
if($("tiers")) $("tiers").oninput = e => setField("tiers", e.target.value);
if($("playerName")) $("playerName").oninput = e => setField("playerName", e.target.value);
if($("playerRole")) $("playerRole").oninput = e => setField("playerRole", e.target.value);
if($("transferBadge")) $("transferBadge").onchange = e => setField("transferBadge", e.target.value);
if($("matchResult")) $("matchResult").oninput = e => setField("matchResult", e.target.value);
if($("mvpBadge")) $("mvpBadge").onchange = e => setField("mvpBadge", e.target.value);
if($("photoCredit")) $("photoCredit").oninput = e => setField("photoCredit", e.target.value);
if($("lineup")) $("lineup").oninput = e => setField("lineup", e.target.value);
if($("lineupTeamRating")) $("lineupTeamRating").oninput = e => setField("lineupTeamRating", e.target.value);
if($("bracket")) $("bracket").oninput = e => setField("bracket", e.target.value);
if($("bracketFormat")) $("bracketFormat").oninput = e => setField("bracketFormat", e.target.value);
if($("bracketWinnerLabel")) $("bracketWinnerLabel").onchange = e => setField("bracketWinnerLabel", e.target.value);
if($("bracketDates")) $("bracketDates").oninput = e => setField("bracketDates", e.target.value);
if($("bracketWide")) $("bracketWide").onchange = e => { setField("bracketWide", e.target.checked); render(); };

function rebuildBracketBuilder(slide){
  const txt = slide.bracket;
  if(!txt) return;
  const isDE = txt.includes("---");
  slide._isDE = isDE;
  if(isDE){
    const sections = txt.split(/^---$/m);
    const upper = parseBracketRounds(sections[0]||"");
    const lower = parseBracketRounds(sections[1]||"");
    slide._ubRounds = upper.map(round => round.map(m => ({
      a: m.teamA.name, b: m.teamB.name, sa: m.teamA.score, sb: m.teamB.score
    })));
    slide._lbRounds = lower.map(round => round.map(m => ({
      a: m.teamA.name, b: m.teamB.name, sa: m.teamA.score, sb: m.teamB.score
    })));
    if(sections[2]){
      const gf = parseBracketRounds(sections[2]);
      if(gf.length && gf[0].length){
        slide._gfSa = gf[0][0].teamA.score;
        slide._gfSb = gf[0][0].teamB.score;
      }
    }
    const ubR1Names = slide._ubRounds[0] ? slide._ubRounds[0].flatMap(m => [m.a, m.b]) : [];
    slide._bracketTeams = ubR1Names.join("\n");
  } else {
    const rounds = parseBracketRounds(txt);
    slide._ubRounds = rounds.map(round => round.map(m => ({
      a: m.teamA.name, b: m.teamB.name, sa: m.teamA.score, sb: m.teamB.score
    })));
    slide._lbRounds = [];
    const r1Names = slide._ubRounds[0] ? slide._ubRounds[0].flatMap(m => [m.a, m.b]) : [];
    slide._bracketTeams = r1Names.join("\n");
  }
  // restore dates from JSON
  if(slide.bracketDates){
    try {
      const dates = JSON.parse(slide.bracketDates);
      slide._ubRounds.forEach((round, ri) => {
        round.forEach((m, mi) => { if(dates[`ub-${ri}-${mi}`]) m.date = dates[`ub-${ri}-${mi}`]; });
      });
      (slide._lbRounds||[]).forEach((round, ri) => {
        round.forEach((m, mi) => { if(dates[`lb-${ri}-${mi}`]) m.date = dates[`lb-${ri}-${mi}`]; });
      });
      if(dates["gf"]) slide._gfDate = dates["gf"];
    } catch(e){}
  }
}

// ── Bracket Builder ──
(function(){
  const teamsEl = $("bracketTeams");
  const deEl = $("bracketDoubleElim");
  const genBtn = $("bracketGenerate");
  const matchesEl = $("bracketMatches");
  if(!teamsEl || !genBtn || !matchesEl) return;

  function getTeamLogoURL(name){
    const img = findTeamLogo(name);
    return img ? img.src : null;
  }

  function buildRounds(names){
    const rounds = [];
    let curr = [];
    for(let i=0; i<names.length; i+=2){
      const a = names[i];
      const b = (i+1 < names.length) ? names[i+1] : "BYE";
      curr.push({ a, b, sa: 0, sb: 0, bye: b === "BYE" });
    }
    rounds.push(curr);
    let prevCount = curr.length;
    while(prevCount > 1){
      const next = [];
      for(let i=0; i<prevCount; i+=2){
        next.push({ a: "TBD", b: "TBD", sa: 0, sb: 0 });
      }
      rounds.push(next);
      prevCount = next.length;
    }
    return rounds;
  }

  function generateBracket(){
    const raw = teamsEl.value;
    const hasSeparator = raw.includes("---");
    if(hasSeparator && deEl) deEl.checked = true;
    const isDE = deEl && deEl.checked;

    let ubNames, lbNames = [];
    if(isDE && hasSeparator){
      const parts = raw.split(/^---$/m);
      ubNames = (parts[0]||"").split("\n").map(s=>s.trim()).filter(Boolean);
      lbNames = (parts[1]||"").split("\n").map(s=>s.trim()).filter(Boolean);
    } else {
      ubNames = raw.split("\n").map(s=>s.trim()).filter(Boolean);
    }
    if(ubNames.length < 2) return;

    const ubRounds = buildRounds(ubNames);

    let lbRounds = [];
    let lbPreseeded = false;
    if(isDE){
      const ubR = ubRounds.length;
      const autoR0 = Math.max(1, Math.ceil(ubRounds[0].length / 2));
      const userR0 = lbNames.length ? Math.ceil(lbNames.length / 2) : 0;
      const r0Count = Math.max(autoR0, userR0);
      lbPreseeded = userR0 > 0;

      let count = r0Count;
      const minFromUB = (ubR - 1) * 2;
      let generated = 0;
      while(generated < minFromUB || count > 1){
        const round = [];
        for(let m = 0; m < count; m++) round.push({ a: "TBD", b: "TBD", sa: 0, sb: 0 });
        lbRounds.push(round);
        generated++;
        if(generated % 2 === 0) count = Math.max(1, Math.ceil(count / 2));
        if(generated > 20) break;
      }

      if(lbNames.length){
        for(let i = 0; i < lbNames.length; i += 2){
          const mi = Math.floor(i / 2);
          if(lbRounds[0] && lbRounds[0][mi]){
            lbRounds[0][mi].a = lbNames[i];
            lbRounds[0][mi].b = (i+1 < lbNames.length) ? lbNames[i+1] : "TBD";
          }
        }
      }
    }

    // store in slide
    const it = cur();
    if(it){
      it._ubRounds = ubRounds;
      it._lbRounds = lbRounds;
      it._isDE = isDE;
    }

    renderMatchInputs();
    syncBracketText();
  }

  function syncBracketText(){
    const it = cur();
    if(!it || !it._ubRounds) return;
    const ub = it._ubRounds;
    const lb = it._lbRounds || [];
    const isDE = it._isDE;

    let lines = [];
    ub.forEach((round, ri) => {
      if(ri > 0) lines.push("");
      round.forEach(m => {
        if(m.bye) return;
        lines.push(m.a + " " + m.sa);
        lines.push(m.b + " " + m.sb);
      });
    });

    if(isDE && lb.length){
      lines.push("---");
      lb.forEach((round, ri) => {
        if(ri > 0) lines.push("");
        round.forEach(m => {
          lines.push(m.a + " " + m.sa);
          lines.push(m.b + " " + m.sb);
        });
      });
      // grand final
      lines.push("---");
      const ubFinal = ub[ub.length-1];
      const lbFinal = lb[lb.length-1];
      const gfA = (ubFinal && ubFinal[0]) ? (getWinner(ubFinal[0]) || "TBD") : "TBD";
      const gfB = (lbFinal && lbFinal[0]) ? (getWinner(lbFinal[0]) || "TBD") : "TBD";
      const gfSa = it._gfSa || 0;
      const gfSb = it._gfSb || 0;
      lines.push(gfA + " " + gfSa);
      lines.push(gfB + " " + gfSb);
    }

    const text = lines.join("\n");
    $("bracket").value = text;
    setField("bracket", text);
  }

  function getWinner(m){
    if(m.bye) return m.a === "BYE" ? m.b : m.a;
    if(m.sa > m.sb) return m.a;
    if(m.sb > m.sa) return m.b;
    return null;
  }

  function advanceRounds(rounds){
    for(let r = 0; r < rounds.length - 1; r++){
      const curr = rounds[r];
      const next = rounds[r+1];
      for(let m = 0; m < curr.length; m++){
        const w = getWinner(curr[m]);
        const nextMi = Math.floor(m / 2);
        if(nextMi >= next.length) continue;
        const slot = m % 2 === 0 ? "a" : "b";
        next[nextMi][slot] = w || "TBD";
      }
    }
  }

  function getLoser(m){
    if(m.bye) return null;
    const w = getWinner(m);
    if(!w) return null;
    return w === m.a ? m.b : m.a;
  }

  function advanceLB(lb){
    for(let r = 0; r < lb.length - 1; r++){
      const curr = lb[r];
      const next = lb[r+1];
      const sameSize = curr.length === next.length;
      for(let m = 0; m < curr.length; m++){
        const w = getWinner(curr[m]);
        if(sameSize){
          if(next[m]) next[m].b = w || "TBD";
        } else {
          const ni = Math.floor(m / 2);
          const slot = m % 2 === 0 ? "a" : "b";
          if(ni < next.length) next[ni][slot] = w || "TBD";
        }
      }
    }
  }

  function advanceWinners(it){
    if(!it._ubRounds) return;
    const ub = it._ubRounds;
    const lb = it._lbRounds || [];

    advanceRounds(ub);

    if(lb.length){
      for(let r = 0; r < ub.length; r++){
        for(let m = 0; m < ub[r].length; m++){
          const loser = getLoser(ub[r][m]);
          if(!loser || loser === "TBD" || loser === "BYE") continue;
          if(r === 0){
            const li = Math.floor(m / 2);
            const slot = m % 2 === 0 ? "a" : "b";
            if(lb[0] && lb[0][li]) lb[0][li][slot] = loser;
          } else {
            const lbR = 2 * r - 1;
            if(lb[lbR] && lb[lbR][m]) lb[lbR][m].a = loser;
          }
        }
      }
      advanceLB(lb);
    }
  }

  function renderMatchInputs(){
    const it = cur();
    if(!it || !it._ubRounds){ matchesEl.innerHTML = ""; return; }
    const ub = it._ubRounds;
    const lb = it._lbRounds || [];
    const isDE = it._isDE;
    let html = "";

    function matchHTML(section, ri, mi, m){
      if(m.bye) return "";
      const logoA = getTeamLogoURL(m.a);
      const logoB = getTeamLogoURL(m.b);
      const wA = m.sa > m.sb ? " winner" : (m.sb > m.sa ? " loser" : "");
      const wB = m.sb > m.sa ? " winner" : (m.sa > m.sb ? " loser" : "");
      return `<div class="bk-match">
        <input class="bk-date" type="text" placeholder="Ex. 3 juil · 18h" value="${m.date||""}" data-sec="${section}" data-ri="${ri}" data-mi="${mi}">
        <div class="bk-team${wA}">${logoA ? `<img src="${logoA}">` : ""}<span class="bk-name">${m.a}</span></div>
        <input class="bk-score" type="number" min="0" value="${m.sa}" data-sec="${section}" data-ri="${ri}" data-mi="${mi}" data-side="a">
        <div class="bk-vs"></div>
        <input class="bk-score" type="number" min="0" value="${m.sb}" data-sec="${section}" data-ri="${ri}" data-mi="${mi}" data-side="b">
        <div class="bk-team${wB}" style="justify-content:flex-end">${logoB ? `<img src="${logoB}">` : ""}<span class="bk-name">${m.b}</span></div>
      </div>`;
    }

    // upper bracket
    if(isDE) html += `<div class="bk-section"><div class="bk-section-label">Upper Bracket</div>`;
    ub.forEach((round, ri) => {
      const label = isDE ? `UB Round ${ri+1}` : (ub.length === 1 ? "Finale" : (ri === ub.length-1 ? "Finale" : (ri === ub.length-2 ? "Demis" : `Round ${ri+1}`)));
      html += `<div class="bk-round"><div class="bk-round-label">${label}</div>`;
      round.forEach((m, mi) => { html += matchHTML("ub", ri, mi, m); });
      html += `</div>`;
    });
    if(isDE) html += `</div>`;

    // lower bracket
    if(isDE && lb.length){
      html += `<hr class="bk-divider"><div class="bk-section"><div class="bk-section-label">Lower Bracket</div>`;
      lb.forEach((round, ri) => {
        html += `<div class="bk-round"><div class="bk-round-label">LB Round ${ri+1}</div>`;
        round.forEach((m, mi) => { html += matchHTML("lb", ri, mi, m); });
        html += `</div>`;
      });
      html += `</div>`;
      html += `<hr class="bk-divider"><div class="bk-section"><div class="bk-section-label">Grand Final</div>`;
      const ubFinalM = ub[ub.length-1] ? ub[ub.length-1][0] : null;
      const lbFinalM = lb[lb.length-1] ? lb[lb.length-1][0] : null;
      const gfA = ubFinalM ? (getWinner(ubFinalM) || "TBD") : "TBD";
      const gfB = lbFinalM ? (getWinner(lbFinalM) || "TBD") : "TBD";
      const gfSa = it._gfSa || 0;
      const gfSb = it._gfSb || 0;
      const logoGfA = getTeamLogoURL(gfA);
      const logoGfB = getTeamLogoURL(gfB);
      const wGfA = gfSa > gfSb ? " winner" : (gfSb > gfSa ? " loser" : "");
      const wGfB = gfSb > gfSa ? " winner" : (gfSa > gfSb ? " loser" : "");
      html += `<div class="bk-match">
        <input class="bk-date" type="text" placeholder="Ex. 12 juil · 18h" value="${it._gfDate||""}" data-sec="gf" data-ri="0" data-mi="0">
        <div class="bk-team${wGfA}">${logoGfA ? `<img src="${logoGfA}">` : ""}<span class="bk-name">${gfA}</span></div>
        <input class="bk-score" type="number" min="0" value="${gfSa}" data-sec="gf" data-ri="0" data-mi="0" data-side="a">
        <div class="bk-vs"></div>
        <input class="bk-score" type="number" min="0" value="${gfSb}" data-sec="gf" data-ri="0" data-mi="0" data-side="b">
        <div class="bk-team${wGfB}" style="justify-content:flex-end">${logoGfB ? `<img src="${logoGfB}">` : ""}<span class="bk-name">${gfB}</span></div>
      </div></div>`;
    }

    matchesEl.innerHTML = html;

    // bind score inputs
    matchesEl.querySelectorAll(".bk-score").forEach(inp => {
      inp.oninput = () => {
        const sec = inp.dataset.sec;
        const ri = parseInt(inp.dataset.ri);
        const mi = parseInt(inp.dataset.mi);
        const side = inp.dataset.side;
        const val = parseInt(inp.value) || 0;
        if(sec === "ub" && it._ubRounds[ri] && it._ubRounds[ri][mi]){
          it._ubRounds[ri][mi][side === "a" ? "sa" : "sb"] = val;
        } else if(sec === "lb" && it._lbRounds[ri] && it._lbRounds[ri][mi]){
          it._lbRounds[ri][mi][side === "a" ? "sa" : "sb"] = val;
        } else if(sec === "gf"){
          it[side === "a" ? "_gfSa" : "_gfSb"] = val;
        }
        advanceWinners(it);
        syncBracketText();
        renderMatchInputs();
      };
    });

    // bind date inputs
    matchesEl.querySelectorAll(".bk-date").forEach(inp => {
      inp.oninput = () => {
        const sec = inp.dataset.sec;
        const ri = parseInt(inp.dataset.ri);
        const mi = parseInt(inp.dataset.mi);
        if(sec === "ub" && it._ubRounds[ri] && it._ubRounds[ri][mi]){
          it._ubRounds[ri][mi].date = inp.value;
        } else if(sec === "lb" && it._lbRounds[ri] && it._lbRounds[ri][mi]){
          it._lbRounds[ri][mi].date = inp.value;
        } else if(sec === "gf"){
          it._gfDate = inp.value;
        }
        syncBracketDates(it);
        render();
      };
    });
  }

  function syncBracketDates(it){
    if(!it || !it._ubRounds) return;
    const dates = {};
    it._ubRounds.forEach((round, ri) => {
      round.forEach((m, mi) => { if(m.date) dates[`ub-${ri}-${mi}`] = m.date; });
    });
    (it._lbRounds||[]).forEach((round, ri) => {
      round.forEach((m, mi) => { if(m.date) dates[`lb-${ri}-${mi}`] = m.date; });
    });
    if(it._gfDate) dates["gf"] = it._gfDate;
    it.bracketDates = Object.keys(dates).length ? JSON.stringify(dates) : "";
    setField("bracketDates", it.bracketDates);
  }

  genBtn.onclick = generateBracket;

  // Rebuild match UI when switching to bracket slide
  const origSync = window.syncInputs;
  window.syncInputs = function(){
    origSync.apply(this, arguments);
    const it = cur();
    if(it && curTpl() === "bracket" && it._ubRounds){
      renderMatchInputs();
      // restore teams textarea
      if(it._bracketTeams) teamsEl.value = it._bracketTeams;
      if(deEl) deEl.checked = !!it._isDE;
    } else if(curTpl() === "bracket"){
      matchesEl.innerHTML = "";
    }
  };

  // Save teams text
  teamsEl.oninput = () => {
    const it = cur();
    if(it) it._bracketTeams = teamsEl.value;
  };
})();
if($("planningEvents")) $("planningEvents").oninput = e => setField("planningEvents", e.target.value);
if($("phonetic")) $("phonetic").oninput = e => setField("phonetic", e.target.value);
if($("example")) $("example").oninput = e => setField("example", e.target.value);
if($("analogy")) $("analogy").oninput = e => setField("analogy", e.target.value);
if($("boxes")) $("boxes").oninput = e => setField("boxes", e.target.value);
if($("grid")) $("grid").oninput = e => setField("grid", e.target.value);
if($("frameY")) $("frameY").oninput = e => { const v=parseFloat(e.target.value); $("frameYV").textContent=v; setField("frameY", v); };
document.querySelectorAll("#lineupCountSeg button").forEach(b=>{
  b.onclick = ()=>{
    document.querySelectorAll("#lineupCountSeg button").forEach(x=>x.classList.remove("on"));
    b.classList.add("on");
    setField("lineupCount", parseInt(b.dataset.lc));
  };
});
if($("lineupPhotoBtn")) $("lineupPhotoBtn").onclick = ()=> $("lineupPhotoInput").click();
if($("lineupPhotoInput")) $("lineupPhotoInput").onchange = e => {
  const it = cur(); if(!it) return;
  const files = Array.from(e.target.files);
  if(!files.length) return;
  it.lineupPhotos = [];
  let loaded = 0;
  files.forEach((f,i) => {
    const img = new Image();
    img.onload = ()=>{ it.lineupPhotos[i] = img; loaded++; if(loaded===files.length){ render(); if($("lineupPhotoCount")) $("lineupPhotoCount").textContent = loaded+" photo"+(loaded>1?"s":""); } };
    img.src = URL.createObjectURL(f);
  });
  e.target.value = "";
};

// background image per slide
if($("bgImageFile")) $("bgImageFile").onchange = e => {
  const f = e.target.files[0]; if(!f) return;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = ()=>{
    let it = cur();
    if(!it){ state.images.push(newSlide(img, f.name)); state.active = state.images.length-1; refreshThumbs(); updateReelAvailability(); }
    else { it.img = img; it.showBgImage = true; }
    syncInputs(); render();
  };
  img.src = URL.createObjectURL(f);
  e.target.value = "";
};
if($("bgImageClear")) $("bgImageClear").onclick = ()=> {
  const it = cur(); if(!it) return;
  it.img = null; it.showBgImage = false;
  syncInputs(); render();
};
if($("showBgImage")) $("showBgImage").onchange = e => { setField("showBgImage", e.target.checked); };
if($("framedImage")) $("framedImage").onchange = e => { setField("framedImage", e.target.checked); };
if($("dualImage")) $("dualImage").onchange = e => { setField("dualImage", e.target.checked); syncInputs(); };

// dual image upload
(function(){
  const drop2 = $("dropDual"), file2 = $("dualImageFile");
  if(!drop2 || !file2) return;
  drop2.onclick = () => file2.click();
  drop2.ondragover = e => { e.preventDefault(); drop2.classList.add("dragover"); };
  drop2.ondragleave = () => drop2.classList.remove("dragover");
  drop2.ondrop = e => { e.preventDefault(); drop2.classList.remove("dragover"); if(e.dataTransfer.files[0]) loadDualImage(e.dataTransfer.files[0]); };
  file2.onchange = () => { if(file2.files[0]) loadDualImage(file2.files[0]); file2.value = ""; };
})();
function loadDualImage(file){
  const it = cur(); if(!it) return;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => { it.img2 = img; render(); };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// template switching (per-slide)
document.querySelectorAll("#tplGrid .tpl-btn").forEach(b=>{
  b.onclick = ()=>{
    const tpl = b.dataset.tpl;
    const it = cur();
    if(it){
      it.template = tpl;
      if(tpl === "edito" && it.watermark == null) it.watermark = false;
      syncInputs(); render();
    } else {
      // no slide yet — create one with this template
      addTextSlide(tpl);
    }
  };
});

// Folder import (JSON + images)
if($("folderImport")) $("folderImport").onclick = ()=> $("folderInput").click();
if($("folderInput")) $("folderInput").onchange = e => {
  const files = Array.from(e.target.files); if(!files.length) return;
  const jsonFile = files.find(f => f.name.endsWith(".json"));
  if(!jsonFile){ alert("Aucun fichier JSON trouvé dans le dossier."); return; }
  const imageFiles = files.filter(f => /\.(jpe?g|png|webp|gif|bmp|avif)$/i.test(f.name));
  const reader = new FileReader();
  reader.onload = ev => {
    try{
      const data = JSON.parse(ev.target.result);
      applyJsonPreset(data, imageFiles);
    }catch(err){ alert("Erreur de lecture JSON : " + err.message); }
  };
  reader.readAsText(jsonFile);
  e.target.value = "";
};

// ZIP import (JSON + images)
if($("zipImport")) $("zipImport").onclick = ()=> $("zipInput").click();
if($("zipInput")) $("zipInput").onchange = async e => {
  const file = e.target.files[0]; if(!file) return;
  if(typeof JSZip === "undefined"){ alert("JSZip non chargé."); return; }
  try{
    const zip = await JSZip.loadAsync(file);
    const entries = Object.values(zip.files).filter(f => !f.dir);
    const jsonEntry = entries.find(f => f.name.replace(/.*\//, "").endsWith(".json"));
    if(!jsonEntry){ alert("Aucun fichier JSON trouvé dans le ZIP."); return; }
    const jsonText = await jsonEntry.async("string");
    const data = JSON.parse(jsonText);
    const imgEntries = entries.filter(f => /\.(jpe?g|png|webp|gif|bmp|avif)$/i.test(f.name));
    const imageFiles = await Promise.all(imgEntries.map(async entry => {
      const blob = await entry.async("blob");
      const name = entry.name.replace(/.*\//, "");
      return new File([blob], name, {type: blob.type || "image/jpeg"});
    }));
    applyJsonPreset(data, imageFiles);
  }catch(err){ alert("Erreur de lecture ZIP : " + err.message); }
  e.target.value = "";
};

// JSON-only import (no images)
if($("jsonImport")) $("jsonImport").onclick = ()=> $("jsonInput").click();
if($("jsonInput")) $("jsonInput").onchange = e => {
  const file = e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try{
      const data = JSON.parse(ev.target.result);
      applyJsonPreset(data, []);
    }catch(err){ alert("Erreur de lecture JSON : " + err.message); }
  };
  reader.readAsText(file);
  e.target.value = "";
};

// Slide navigation buttons
if($("prevSlide")) $("prevSlide").onclick = ()=>{ if(state.active > 0) setActive(state.active - 1); };
if($("nextSlide")) $("nextSlide").onclick = ()=>{ if(state.active < state.images.length - 1) setActive(state.active + 1); };
updateSlideNav();

function applyJsonPreset(data, imageFiles){
  if(data.format && FORMATS[data.format]) {
    state.format = data.format;
    document.querySelectorAll("#formatSeg button").forEach(x=>{
      x.classList.toggle("on", x.dataset.fmt===data.format);
    });
  }
  if(data.game) {
    state.game = data.game;
    $("game").value = data.game;
    $("customRow").style.display = data.game==="custom"?"flex":"none";
    if(data.customColor){ state.customColor = data.customColor; $("customColor").value = data.customColor; }
    state.hiColor = accentColor();
  }
  if(data.watermark!=null){ state.watermark = data.watermark; $("watermark").checked = data.watermark; }
  if(data.gradient!=null){ state.gradient = data.gradient/100; $("gradient").value = data.gradient; $("gradientV").textContent = data.gradient+"%"; }
  if(data.titleSize!=null){ state.titleScale = data.titleSize/100; $("titleSize").value = data.titleSize; $("titleSizeV").textContent = data.titleSize+"%"; }
  if(data.descSize!=null){ state.descScale = data.descSize/100; $("descSize").value = data.descSize; $("descSizeV").textContent = data.descSize+"%"; }
  if(data.descColor!=null){ state.descColor = data.descColor/100; $("descColor").value = data.descColor; $("descColorV").textContent = data.descColor+"%"; }
  if(data.imgBright!=null){ state.imgBright = data.imgBright/100; $("imgBright").value = data.imgBright; $("imgBrightV").textContent = data.imgBright+"%"; }

  const imgMap = {};
  if(imageFiles && imageFiles.length){
    for(const f of imageFiles) imgMap[f.name.toLowerCase()] = f;
  }

  state.images = [];
  let pending = 0;
  const finalize = ()=>{
    state.active = 0;
    refreshThumbs(); syncInputs(); updateDimLabel(); updateReelAvailability(); render();
  };

  if(!data.slides || !data.slides.length){ finalize(); return; }

  for(let i = 0; i < data.slides.length; i++){
    const s = data.slides[i];
    const slide = newSlide(null, s.title ? s.title.slice(0,20) : "Slide", s.template);
    slide.eyebrow = s.eyebrow || "";
    slide.title = s.title || "";
    slide.desc = s.desc || "";
    slide.showDesc = s.showDesc !== false;
    slide.score = s.score || "";
    slide.showScore = s.showScore || false;
    slide.scoreY = s.scoreY || 0;
    slide.textY = s.textY || 0;
    slide.badge = s.badge || "breaking";
    slide.signature = s.signature || "";
    slide.teamA = s.teamA || "";
    slide.teamB = s.teamB || "";
    slide.standings = s.standings || "";
    slide.relegationLine = s.relegationLine || 0;
    slide.stats = s.stats || "";
    slide.matches = s.matches || "";
    slide.footerText = s.footerText || "";
    slide.pollOptions = s.pollOptions || "";
    slide.pollWinner = s.pollWinner || 0;
    slide.statHighlight = s.statHighlight || 0;
    slide.tiers = s.tiers || "";
    slide.playerName = s.playerName || "";
    slide.playerRole = s.playerRole || "";
    slide.transferBadge = s.transferBadge || "officiel";
    slide.matchResult = s.matchResult || "";
    slide.mvpBadge = s.mvpBadge || "mvp";
    slide.photoCredit = s.photoCredit || "";
    slide.showBgImage = s.showBgImage !== false;
    slide.framedImage = !!s.framedImage;
    slide.dualImage = !!s.dualImage;
    slide.dur = s.dur || null;
    slide.game = s.game || null;
    slide.lineup = s.lineup || "";
    slide.lineupCount = s.lineupCount || 5;
    slide.lineupTeamRating = s.lineupTeamRating || "";
    slide.bracket = s.bracket || "";
    slide.bracketFormat = s.bracketFormat || "";
    slide.bracketWinnerLabel = s.bracketWinnerLabel || "champion";
    slide.bracketDates = s.bracketDates || "";
    slide.bracketWide = !!s.bracketWide;
    if(slide.bracket) rebuildBracketBuilder(slide);
    slide.planningEvents = s.planningEvents || "";
    slide.phonetic = s.phonetic || "";
    slide.example = s.example || "";
    slide.analogy = s.analogy || "";
    slide.boxes = s.boxes || "";
    slide.grid = s.grid || "";
    slide.groupes = s.groupes || "";
    slide.groupeElim = s.groupeElim != null ? s.groupeElim : 3;
    slide.frameY = s.frameY || 0;
    if(s.watermark != null) slide.watermark = s.watermark;
    if(s.titleSize!=null) slide.titleScale = s.titleSize/100;
    if(s.descSize!=null) slide.descScale = s.descSize/100;
    if(s.zoom!=null) slide.zoom = s.zoom/100;
    if(s.zoom2!=null) slide.zoom2 = s.zoom2/100;
    if(s.descColor!=null) slide.descColor = s.descColor/100;
    if(s.imgBright!=null) slide.imgBright = s.imgBright/100;
    state.images.push(slide);

    const imgName = s.image;
    if(imgName){
      const file = imgMap[imgName.toLowerCase()];
      if(file){
        pending++;
        const idx = i;
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = ()=>{
          state.images[idx].img = img;
          state.images[idx].name = file.name;
          pending--;
          if(pending === 0) finalize();
        };
        img.onerror = ()=>{ pending--; if(pending === 0) finalize(); };
        img.src = URL.createObjectURL(file);
      }
    }
    const img2Name = s.image2;
    if(img2Name){
      const file2 = imgMap[img2Name.toLowerCase()];
      if(file2){
        pending++;
        const idx2 = i;
        const img2 = new Image();
        img2.crossOrigin = "anonymous";
        img2.onload = ()=>{
          state.images[idx2].img2 = img2;
          state.images[idx2].name2 = file2.name;
          pending--;
          if(pending === 0) finalize();
        };
        img2.onerror = ()=>{ pending--; if(pending === 0) finalize(); };
        img2.src = URL.createObjectURL(file2);
      }
    }
  }
  if(pending === 0) finalize();
}


$("game").onchange = e => {
  const v = e.target.value;
  if($("gameAll").checked){
    state.game = v;
    state.images.forEach(s => s.game = null);
  } else {
    const it = cur(); if(it) it.game = v;
  }
  $("customRow").style.display = v==="custom" ? "flex" : "none";
  state.hiColor = accentColor();
  const it = cur();
  if(it && !it.eyebrow && v!=="custom"){ it.eyebrow = GAME_LABELS[v]; $("eyebrow").value = it.eyebrow; }
  render();
};
$("gameAll").onchange = ()=>{
  if($("gameAll").checked){
    const v = $("game").value;
    state.game = v;
    state.images.forEach(s => s.game = null);
    render();
  }
};
$("customColor").oninput = e => { state.customColor=e.target.value; state.hiColor=accentColor(); render(); };

document.querySelectorAll("#formatSeg button").forEach(b=>{
  b.onclick = ()=>{
    document.querySelectorAll("#formatSeg button").forEach(x=>x.classList.remove("on"));
    b.classList.add("on");
    state.format = b.dataset.fmt;
    updateDimLabel(); render();
  };
});

$("reelToggle").onchange = e => setReel(e.target.checked);
function setReel(on){
  state.reel = on;
  $("reelGroup").classList.toggle("hide", !on);
  $("exportImage").classList.toggle("hide", on);
  $("exportReel").classList.toggle("hide", !on);
  document.querySelectorAll("#formatSeg button").forEach(x=>x.disabled = on);
  updateDimLabel(); render();
}

function bindSlider(id, key, fmt, scale){
  const el = $(id), out = $(id+"V");
  el.oninput = ()=>{ state[key] = parseFloat(el.value)*scale; out.textContent = fmt(parseFloat(el.value)); render(); };
}
function bindSlideSlider(id, key, fmt, scale){
  const el = $(id), out = $(id+"V");
  el.oninput = ()=>{ const it = cur(); if(it) it[key] = parseFloat(el.value)*scale; out.textContent = fmt(parseFloat(el.value)); render(); };
}
bindSlider("gradient","gradient", v=>v+"%", 0.01);
bindSlideSlider("titleSize","titleScale", v=>v+"%", 0.01);
bindSlideSlider("descSize","descScale", v=>v+"%", 0.01);
bindSlideSlider("zoom","zoom", v=>v+"%", 0.01);
bindSlideSlider("imgBright","imgBright", v=>v+"%", 0.01);
bindSlideSlider("descColor","descColor", v=>v+"%", 0.01);
$("textY").oninput = ()=>{ const v=parseFloat($("textY").value); $("textYV").textContent=v; setField("textY", v); };
$("dur").oninput = ()=>{
  const v = parseFloat($("dur").value);
  $("durV").textContent = v+"s";
  if($("durAll").checked){
    state.dur = v;
    state.images.forEach(s => s.dur = null);
  } else {
    const it = cur(); if(it) it.dur = v;
  }
};
$("durAll").onchange = ()=>{
  if($("durAll").checked){
    const v = parseFloat($("dur").value);
    state.dur = v;
    state.images.forEach(s => s.dur = null);
  }
};
$("trans").onchange = ()=> state.trans=$("trans").value;
$("kenburns").onchange = e => state.kenburns=e.target.checked;

$("resetView").onclick = ()=>{
  const it = state.images[state.active];
  if(it){ it.tx.ox=0; it.tx.oy=0; it.zoom=1; }
  $("zoom").value=100; $("zoomV").textContent="100%";
  const c=cur(); if(c) c.textDrag=0; render();
};

function updateDimLabel(){
  let [W,H] = state.reel ? FORMATS.story : FORMATS[state.format];
  const it = cur();
  if(it && it.bracketWide && curTpl() === "bracket") W *= 2;
  $("dimLabel").textContent = `${W} × ${H}`;
}

// ═══ SECTION: CANVAS DRAG ═══
let dragMode = null, dragStart=null, startTx=null, startTextDrag=0;
function canvasCoords(e){
  const r = cv.getBoundingClientRect();
  const sx = cv.width/r.width, sy = cv.height/r.height;
  const cx = (e.touches?e.touches[0].clientX:e.clientX) - r.left;
  const cy = (e.touches?e.touches[0].clientY:e.clientY) - r.top;
  return { x: cx*sx, y: cy*sy };
}
let dragDualSide = null;
function startDrag(e){
  const p = canvasCoords(e);
  const b = lastTextBox;
  if(b && p.x>=b.x-20 && p.x<=b.x+b.w+20 && p.y>=b.y-20 && p.y<=b.y+b.h+30){
    dragMode = "text"; startTextDrag = (cur()||{}).textDrag||0;
  } else {
    dragMode = "image";
    const it = state.images[state.active];
    if(!it){ dragMode=null; return; }
    if(it.dualImage && it.img2 && p.x > cv.width/2){
      dragDualSide = "right";
      startTx = {...it.tx2};
    } else {
      dragDualSide = "left";
      startTx = {...it.tx};
    }
  }
  dragStart = p; cv.classList.add("grabbing");
}
function moveDrag(e){
  if(!dragMode) return;
  e.preventDefault();
  const p = canvasCoords(e);
  if(dragMode==="image"){
    const it = state.images[state.active];
    if(dragDualSide === "right"){
      it.tx2.ox = startTx.ox + (p.x-dragStart.x);
      it.tx2.oy = startTx.oy + (p.y-dragStart.y);
    } else {
      it.tx.ox = startTx.ox + (p.x-dragStart.x);
      it.tx.oy = startTx.oy + (p.y-dragStart.y);
    }
  } else {
    const it = cur(); if(it) it.textDrag = startTextDrag + (p.y-dragStart.y);
  }
  render();
}
function endDrag(){ dragMode=null; cv.classList.remove("grabbing"); }
cv.addEventListener("mousedown", startDrag);
window.addEventListener("mousemove", moveDrag);
window.addEventListener("mouseup", endDrag);
cv.addEventListener("touchstart", startDrag, {passive:false});
window.addEventListener("touchmove", moveDrag, {passive:false});
window.addEventListener("touchend", endDrag);
cv.addEventListener("wheel", e=>{
  e.preventDefault();
  const it = cur(); if(!it) return;
  const p = canvasCoords(e);
  const isDualRight = it.dualImage && it.img2 && p.x > cv.width/2;
  if(isDualRight){
    let z = (it.zoom2 != null ? it.zoom2 : sVal("zoom")) + (e.deltaY<0?0.04:-0.04);
    z = Math.max(0.5, Math.min(2.6, z));
    it.zoom2 = z;
  } else {
    let z = sVal("zoom") + (e.deltaY<0?0.04:-0.04);
    z = Math.max(0.5, Math.min(2.6, z));
    it.zoom = z;
    $("zoom").value = Math.round(z*100); $("zoomV").textContent = Math.round(z*100)+"%";
  }
  render();
}, {passive:false});

// ═══ SECTION: EXPORT IMAGE ═══
function download(blob, filename){
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 2000);
}
function slug(){
  const first = (state.images.find(s=>s.title && s.title.trim()) || {}).title || "post";
  const s = first.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,40);
  return "macro-"+(s||"post");
}
$("dlPng").onclick = ()=>{ render(); cv.toBlob(b=>download(b, slug()+".png"), "image/png"); };
$("dlJpg").onclick = ()=>{ render(); cv.toBlob(b=>download(b, slug()+".jpg"), "image/jpeg", 0.92); };
$("dlJson").onclick = ()=>{
  const data = {
    format: state.format, game: state.game,
    watermark: state.watermark, gradient: Math.round(state.gradient*100),
    titleSize: Math.round(state.titleScale*100), descSize: Math.round(state.descScale*100),
    descColor: Math.round(state.descColor*100), imgBright: Math.round(state.imgBright*100),
  };
  if(state.game==="custom") data.customColor = state.customColor;
  data.slides = state.images.map(s=>{
    const sl = {
      template: s.template, eyebrow: s.eyebrow, title: s.title, desc: s.desc,
      showDesc: s.showDesc, score: s.score, showScore: s.showScore, scoreY: s.scoreY, textY: s.textY,
      badge: s.badge, signature: s.signature, teamA: s.teamA, teamB: s.teamB,
      standings: s.standings, relegationLine: s.relegationLine, stats: s.stats,
      matches: s.matches, footerText: s.footerText, pollOptions: s.pollOptions, pollWinner: s.pollWinner,
      statHighlight: s.statHighlight, tiers: s.tiers, playerName: s.playerName, playerRole: s.playerRole,
      transferBadge: s.transferBadge, matchResult: s.matchResult, mvpBadge: s.mvpBadge,
      photoCredit: s.photoCredit, showBgImage: s.showBgImage, framedImage: s.framedImage, dualImage: s.dualImage,
      dur: s.dur, game: s.game, lineup: s.lineup, lineupCount: s.lineupCount,
      lineupTeamRating: s.lineupTeamRating, bracket: s.bracket, bracketFormat: s.bracketFormat, bracketWinnerLabel: s.bracketWinnerLabel, bracketDates: s.bracketDates, bracketWide: s.bracketWide,
      planningEvents: s.planningEvents, groupes: s.groupes, groupeElim: s.groupeElim, frameY: s.frameY,
    };
    if(s.watermark != null) sl.watermark = s.watermark;
    if(s.titleScale!=null) sl.titleSize = Math.round(s.titleScale*100);
    if(s.descScale!=null) sl.descSize = Math.round(s.descScale*100);
    if(s.zoom!=null) sl.zoom = Math.round(s.zoom*100);
    if(s.zoom2!=null) sl.zoom2 = Math.round(s.zoom2*100);
    if(s.descColor!=null) sl.descColor = Math.round(s.descColor*100);
    if(s.imgBright!=null) sl.imgBright = Math.round(s.imgBright*100);
    if(s.name && s.img) sl.image = s.name;
    if(s.dualImage && s.img2) sl.image2 = s.name2 || "";
    return sl;
  });
  const blob = new Blob([JSON.stringify(data, null, 2)], {type:"application/json"});
  download(blob, slug()+".json");
};

// ═══ SECTION: REEL ═══
let _offCv1 = null, _offCtx1 = null, _offCv2 = null, _offCtx2 = null;
function getOffscreen(W, H, n){
  if(n===2){
    if(!_offCv2){ _offCv2 = document.createElement("canvas"); _offCtx2 = _offCv2.getContext("2d"); }
    if(_offCv2.width!==W||_offCv2.height!==H){ _offCv2.width=W; _offCv2.height=H; }
    return [_offCv2, _offCtx2];
  }
  if(!_offCv1){ _offCv1 = document.createElement("canvas"); _offCtx1 = _offCv1.getContext("2d"); }
  if(_offCv1.width!==W||_offCv1.height!==H){ _offCv1.width=W; _offCv1.height=H; }
  return [_offCv1, _offCtx1];
}

function drawFullSlide(targetCtx, W, H, slide, idx, total, zoomMul){
  const origCtx = ctx, origActive = state.active;
  ctx = targetCtx;
  state.active = idx;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = INK; ctx.fillRect(0,0,W,H);
  const slideZoom = slide.zoom != null ? slide.zoom : state.zoom;
  const showVideo = slide.video && slide.template === "post-video" && slide.showBgImage !== false;
  const tpl = slide.template;
  const editoImg = tpl === "edito" && slide.img;
  const showImg = ((slide.img && slide.showBgImage !== false) || showVideo) && !editoImg;
  const framed = showImg && slide.framedImage && !showVideo;
  const dual = showImg && slide.dualImage && !showVideo;
  if(editoImg){
    drawBaseBackground(W,H);
  } else if(dual){
    drawDualImage(slide, W, H, slideZoom * (zoomMul||1));
  } else if(showImg && !framed){
    drawSlideMedia(slide, W, H, slideZoom * (zoomMul||1));
  } else if(framed){
    drawBaseBackground(W,H); drawFramedImage(slide, W, H, slideZoom);
  } else {
    if(tpl==="breaking") drawBreakingBackground(W,H);
    else drawBaseBackground(W,H);
  }
  drawEdgeScrims(W,H);
  drawOverlay(W, H, { index: idx, total: total }, slide, showImg);
  ctx = origCtx;
  state.active = origActive;
}

function slideDur(s){ return (s.video && s.template==="post-video" && s.video.duration && isFinite(s.video.duration)) ? Math.min(s.video.duration,60)*1000 : (s.dur || state.dur)*1000; }

function drawReelFrame(W, H, tMs){
  const imgs = state.images;
  if(!imgs.length){ ctx.clearRect(0,0,W,H); ctx.fillStyle=INK; ctx.fillRect(0,0,W,H); drawBaseBackground(W,H); drawOverlay(W,H,null,EMPTY); return; }
  const transMs = 600;
  let acc = 0, idx = 0;
  for(let i=0; i<imgs.length; i++){ const d=slideDur(imgs[i]); if(acc+d>tMs||i===imgs.length-1){idx=i;break;} acc+=d; }
  const per = slideDur(imgs[idx]);
  const local = tMs - acc;
  const prog = Math.min(1, local/per);
  const showImg = imgs[idx].img && imgs[idx].showBgImage !== false;
  const framedCur = showImg && imgs[idx].framedImage;
  const kb = (state.kenburns && showImg && !framedCur) ? (1 + 0.07*prog) : 1;

  const next = imgs[idx+1];
  const inTrans = next && local > per - transMs && state.trans !== "cut";

  if(!inTrans){
    drawFullSlide(ctx, W, H, imgs[idx], idx, imgs.length, kb);
  } else {
    const a = (local-(per-transMs))/transMs;
    if(state.trans==="fade"){
      drawFullSlide(ctx, W, H, imgs[idx], idx, imgs.length, kb);
      const [offCv, offCtx] = getOffscreen(W, H, 1);
      drawFullSlide(offCtx, W, H, next, idx+1, imgs.length, 1);
      ctx.save(); ctx.globalAlpha = a;
      ctx.drawImage(offCv, 0, 0);
      ctx.restore();
    } else {
      const [curCv, curCtx] = getOffscreen(W, H, 1);
      const [nxtCv, nxtCtx] = getOffscreen(W, H, 2);
      drawFullSlide(curCtx, W, H, imgs[idx], idx, imgs.length, kb);
      drawFullSlide(nxtCtx, W, H, next, idx+1, imgs.length, 1);
      ctx.clearRect(0,0,W,H);
      ctx.drawImage(curCv, Math.round(-W*a), 0);
      ctx.drawImage(nxtCv, Math.round(W*(1-a)), 0);
    }
  }
}

let playing = false, rafId = null;
function stopTicker(){ if(rafId){ cancelAnimationFrame(rafId); rafId = null; } }
function resetReelUI(){
  $("recbar").classList.remove("on"); $("recprog").style.width = "0%";
  $("dlReel").disabled = false; $("previewReel").disabled = false;
}

function deliverVideo(blob, ext){
  ext = ext || "mp4";
  const url = URL.createObjectURL(blob);
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(!isMobile){
    const a = document.createElement("a");
    a.href = url; a.download = slug()+"-reel."+ext; a.click();
    setTimeout(()=>URL.revokeObjectURL(url), 5000);
    $("status").textContent = "✓ Vidéo exportée.";
    return;
  }

  const filename = slug()+"-reel."+ext;
  const file = new File([blob], filename, { type: blob.type || "video/"+ext });
  const canShare = navigator.canShare && navigator.canShare({ files: [file] });

  let overlay = document.getElementById("videoOverlay");
  if(overlay) overlay.remove();
  overlay = document.createElement("div");
  overlay.id = "videoOverlay";
  overlay.style.cssText = "position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.95);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;gap:14px;overflow-y:auto;";

  const vid = document.createElement("video");
  vid.src = url; vid.controls = true; vid.playsInline = true; vid.autoplay = true;
  vid.style.cssText = "max-width:90%;max-height:55vh;border-radius:12px;";
  overlay.appendChild(vid);

  if(canShare){
    const shareBtn = document.createElement("button");
    shareBtn.textContent = "📤 Partager / Enregistrer";
    shareBtn.style.cssText = "background:var(--cyan,#00e5ff);color:#000;border:none;padding:14px 32px;border-radius:8px;font:700 16px Manrope,sans-serif;cursor:pointer;width:80%;max-width:320px;";
    shareBtn.onclick = ()=>{
      navigator.share({ files: [file], title: filename }).then(()=>{
        $("status").textContent = "✓ Vidéo enregistrée.";
      }).catch(()=>{});
    };
    overlay.appendChild(shareBtn);
  }

  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  if(!isIOS){
    const dlBtn = document.createElement("a");
    dlBtn.href = url; dlBtn.download = filename;
    dlBtn.textContent = "⬇ Télécharger";
    dlBtn.style.cssText = "background:" + (canShare ? "#333" : "var(--cyan,#00e5ff)") + ";color:" + (canShare ? "#fff" : "#000") + ";border:none;padding:12px 28px;border-radius:8px;font:700 15px Manrope,sans-serif;cursor:pointer;text-decoration:none;text-align:center;width:80%;max-width:320px;display:block;box-sizing:border-box;";
    overlay.appendChild(dlBtn);
  }

  const msg = document.createElement("p");
  msg.textContent = isIOS
    ? "Appui long sur la vidéo → Enregistrer la vidéo"
    : "Appui long sur la vidéo → Télécharger si besoin";
  msg.style.cssText = "color:#aaa;font:400 13px Manrope,sans-serif;text-align:center;margin:0;";
  overlay.appendChild(msg);

  const close = document.createElement("button");
  close.textContent = "✕ Fermer";
  close.style.cssText = "background:#333;color:#fff;border:none;padding:10px 24px;border-radius:8px;font:500 14px Manrope,sans-serif;cursor:pointer;margin-top:4px;";
  close.onclick = ()=>{ overlay.remove(); URL.revokeObjectURL(url); };
  overlay.appendChild(close);

  document.body.appendChild(overlay);
  $("status").textContent = "✓ Vidéo prête.";
}

function buildMjpegMovParts(frameSizes, w, h, fps, pcmData, audioRate, audioCh){
  const n = frameSizes.length;
  const timeScale = 600;
  const frameDur = Math.round(timeScale / fps);
  const movieDur = n * frameDur;
  let mdatPayload = 0;
  for(const sz of frameSizes) mdatPayload += sz;
  const hasAudio = pcmData && pcmData.byteLength > 0;
  const audioBytes = hasAudio ? pcmData.byteLength : 0;
  const totalMdat = mdatPayload + audioBytes;
  const ftypLen = 20, mdatHdr = 8;
  const frameOffsets = [];
  let fOff = ftypLen + mdatHdr;
  for(const sz of frameSizes){ frameOffsets.push(fOff); fOff += sz; }
  const audioFileOffset = ftypLen + mdatHdr + mdatPayload;

  const cat = (...a) => { let l=0; for(const x of a) l+=x.byteLength; const o=new Uint8Array(l); let p=0; for(const x of a){o.set(x,p);p+=x.byteLength;} return o; };
  const u32 = v => new Uint8Array([(v>>>24)&0xff,(v>>>16)&0xff,(v>>>8)&0xff,v&0xff]);
  const u16 = v => new Uint8Array([(v>>>8)&0xff,v&0xff]);
  const cc = s => { const a=new Uint8Array(s.length); for(let i=0;i<s.length;i++) a[i]=s.charCodeAt(i); return a; };
  const zr = c => new Uint8Array(c);
  const bx = (t,d) => cat(u32(8+d.byteLength),cc(t),d);
  const fb = (t,v,fl,d) => bx(t, cat(new Uint8Array([v,(fl>>>16)&0xff,(fl>>>8)&0xff,fl&0xff]), d));

  const mtx = cat(u32(0x00010000),u32(0),u32(0),u32(0),u32(0x00010000),u32(0),u32(0),u32(0),u32(0x40000000));
  const ftyp = bx("ftyp", cat(cc("qt  "),u32(0),cc("qt  ")));
  const mvhd = fb("mvhd",0,0, cat(u32(0),u32(0),u32(timeScale),u32(movieDur),u32(0x00010000),u16(0x0100),zr(10),mtx,zr(24),u32(hasAudio?3:2)));
  const tkhd = fb("tkhd",0,3, cat(u32(0),u32(0),u32(1),u32(0),u32(movieDur),zr(8),u16(0),u16(0),u16(0),u16(0),mtx,u32(w*65536),u32(h*65536)));
  const mdhd = fb("mdhd",0,0, cat(u32(0),u32(0),u32(timeScale),u32(movieDur),u16(0x55C4),u16(0)));
  const hdlr = fb("hdlr",0,0, cat(u32(0),cc("vide"),zr(12),cc("VideoHandler\0")));
  const vmhd = fb("vmhd",0,1, cat(u16(0),zr(6)));
  const urlE = fb("url ",0,1,zr(0));
  const dref = fb("dref",0,0, cat(u32(1),urlE));
  const dinf = bx("dinf", dref);
  const jpegE = bx("jpeg", cat(zr(6),u16(1),u16(0),u16(0),u32(0),u32(0),u32(0),u16(w),u16(h),u32(0x00480000),u32(0x00480000),u32(0),u16(1),zr(32),u16(24),u16(0xFFFF)));
  const stsd = fb("stsd",0,0, cat(u32(1),jpegE));
  const stts = fb("stts",0,0, cat(u32(1),u32(n),u32(frameDur)));
  const stsc = fb("stsc",0,0, cat(u32(1),u32(1),u32(1),u32(1)));
  const stsz = fb("stsz",0,0, cat(u32(0),u32(n),...frameSizes.map(s=>u32(s))));
  const stco = fb("stco",0,0, cat(u32(n),...frameOffsets.map(o=>u32(o))));
  const stbl = bx("stbl", cat(stsd,stts,stsc,stsz,stco));
  const minf = bx("minf", cat(vmhd,dinf,stbl));
  const mdia = bx("mdia", cat(mdhd,hdlr,minf));
  const trak = bx("trak", cat(tkhd,mdia));

  let audioTrak = new Uint8Array(0);
  if(hasAudio){
    const totalSamples = audioBytes / (audioCh * 2);
    const aTkhd = fb("tkhd",0,3, cat(u32(0),u32(0),u32(2),u32(0),u32(movieDur),zr(8),u16(0),u16(0),u16(0x0100),u16(0),mtx,u32(0),u32(0)));
    const aMdhd = fb("mdhd",0,0, cat(u32(0),u32(0),u32(audioRate),u32(totalSamples),u16(0x55C4),u16(0)));
    const aHdlr = fb("hdlr",0,0, cat(u32(0),cc("soun"),zr(12),cc("SoundHandler\0")));
    const aSmhd = fb("smhd",0,0, cat(u16(0),u16(0)));
    const aUrlE = fb("url ",0,1,zr(0));
    const aDref = fb("dref",0,0, cat(u32(1),aUrlE));
    const aDinf = bx("dinf", aDref);
    const sowtE = bx("sowt", cat(zr(6),u16(1),u16(0),u16(0),u32(0),u16(audioCh),u16(16),u16(0),u16(0),u16(audioRate),u16(0)));
    const aStsd = fb("stsd",0,0, cat(u32(1),sowtE));
    const aStts = fb("stts",0,0, cat(u32(1),u32(totalSamples),u32(1)));
    const aStsc = fb("stsc",0,0, cat(u32(1),u32(1),u32(totalSamples),u32(1)));
    const aStsz = fb("stsz",0,0, cat(u32(audioCh*2),u32(totalSamples)));
    const aStco = fb("stco",0,0, cat(u32(1),u32(audioFileOffset)));
    const aStbl = bx("stbl", cat(aStsd,aStts,aStsc,aStsz,aStco));
    const aMinf = bx("minf", cat(aSmhd,aDinf,aStbl));
    const aMdia = bx("mdia", cat(aMdhd,aHdlr,aMinf));
    audioTrak = bx("trak", cat(aTkhd,aMdia));
  }

  const moov = bx("moov", cat(mvhd,trak,audioTrak));
  const mdH = cat(u32(mdatHdr+totalMdat),cc("mdat"));
  return { ftyp, mdatHeader: mdH, moov, pcmData: hasAudio ? pcmData : null };
}

async function playReelMjpeg(W, H, total){
  $("recbar").classList.add("on");
  $("dlReel").disabled = true; $("previewReel").disabled = true;
  const FPS = 60, frameDurMs = 1000/FPS;
  const totalFrames = Math.ceil(total/frameDurMs);
  const frameBlobs = [];
  const frameSizes = [];
  $("status").textContent = "● Capture des images… 0%";

  for(let i = 0; i <= totalFrames; i++){
    if(!playing){ resetReelUI(); render(); return; }
    const tMs = Math.min(i*frameDurMs, total);

    const imgs = state.images, transMs = 600;
    let acc=0, idx=0;
    for(let j=0;j<imgs.length;j++){const d=slideDur(imgs[j]); if(acc+d>tMs||j===imgs.length-1){idx=j;break;} acc+=d;}
    const per=slideDur(imgs[idx]), local=tMs-acc, seekP=[];
    const s=imgs[idx];
    if(s.video&&s.template==="post-video"){ const vt=local/1000; if(Math.abs(s.video.currentTime-vt)>=0.01) seekP.push(new Promise(r=>{s.video.onseeked=()=>{s.video.onseeked=null;r();};s.video.currentTime=vt;})); }
    const next=imgs[idx+1];
    if(next&&next.video&&next.template==="post-video"&&local>per-transMs&&state.trans!=="cut"&&Math.abs(next.video.currentTime)>=0.01) seekP.push(new Promise(r=>{next.video.onseeked=()=>{next.video.onseeked=null;r();};next.video.currentTime=0;}));
    if(seekP.length) await Promise.all(seekP);

    drawReelFrame(W, H, tMs);
    const blob = await new Promise(r => cv.toBlob(r, "image/jpeg", 0.82));
    if(!blob) continue;
    frameBlobs.push(blob);
    frameSizes.push(blob.size);

    const pct = Math.round((i+1)/(totalFrames+1)*100);
    $("recprog").style.width = pct+"%";
    $("status").textContent = "● Capture des images… "+pct+"%";
    await new Promise(r => setTimeout(r, 0));
  }

  $("status").textContent = "● Préparation audio…";
  const SAMPLE_RATE = 48000, CHANNELS = 2;
  let pcmAudio = null;
  try {
    const audioCtx = new OfflineAudioContext(CHANNELS, Math.ceil(total/1000*SAMPLE_RATE), SAMPLE_RATE);
    const timings = []; let acc=0;
    for(const s of state.images){ const dur=slideDur(s); timings.push({slide:s,startMs:acc,durMs:dur}); acc+=dur; }
    let hasSource = false;
    for(const {slide,startMs,durMs} of timings){
      if(!slide.videoFile||slide.template!=="post-video") continue;
      try {
        const ab = await slide.videoFile.arrayBuffer();
        const buf = await audioCtx.decodeAudioData(ab);
        const src = audioCtx.createBufferSource();
        src.buffer = buf; src.connect(audioCtx.destination);
        src.start(startMs/1000, 0, Math.min(buf.duration, durMs/1000));
        hasSource = true;
      } catch(e){}
    }
    if(hasSource){
      const mixed = await audioCtx.startRendering();
      if(mixed && mixed.length > 0){
        const ns = mixed.length;
        const pcm = new Int16Array(ns * CHANNELS);
        for(let i=0;i<ns;i++) for(let ch=0;ch<CHANNELS;ch++){
          const v = mixed.getChannelData(ch)[i];
          pcm[i*CHANNELS+ch] = Math.max(-32768, Math.min(32767, Math.round(v*32767)));
        }
        pcmAudio = new Uint8Array(pcm.buffer);
      }
    }
  } catch(e){}

  $("status").textContent = "● Construction de la vidéo…";
  await new Promise(r => setTimeout(r, 50));
  const parts = buildMjpegMovParts(frameSizes, W, H, FPS, pcmAudio, SAMPLE_RATE, CHANNELS);
  const blobParts = [parts.ftyp, parts.mdatHeader, ...frameBlobs];
  frameBlobs.length = 0;
  if(parts.pcmData) blobParts.push(parts.pcmData);
  blobParts.push(parts.moov);
  const blob = new Blob(blobParts, {type:"video/quicktime"});
  resetReelUI(); playing = false;
  deliverVideo(blob, "mov");
  render();
}

$("previewReel").onclick = ()=> playReel(false);
$("dlReel").onclick = ()=> playReel(true);

async function playReel(record){
  if(playing) return;
  const hasVideo = state.images.some(s => s.video && s.template === "post-video");
  if(state.images.length < 2 && !hasVideo){ $("status").textContent = "⚠ Ajoute au moins 2 images ou une vidéo pour le Reel."; return; }

  const [W,H] = FORMATS.story;
  if(cv.width!==W || cv.height!==H){ cv.width=W; cv.height=H; }
  let total = 0;
  for(const s of state.images){
    total += slideDur(s);
    if(s.video){ s.video.currentTime = 0; }
  }
  stopVideoLoop();
  playing = true;

  if(!record){
    $("status").textContent = "▶ Lecture de l'aperçu…";
    state.images.forEach(s => { if(s.video){ s.video.currentTime = 0; s.video.muted = true; } });
    const t0 = performance.now();
    function prevTick(){
      const t = performance.now() - t0;
      if(t >= total){ playing = false; state.images.forEach(s => { if(s.video){ s.video.pause(); s.video.muted = true; } }); $("status").textContent = ""; render(); return; }
      // unmute only the active slide's video
      const transMs = 600;
      let acc2 = 0, activeIdx = 0;
      for(let i=0; i<state.images.length; i++){ const d=slideDur(state.images[i]); if(acc2+d>t||i===state.images.length-1){activeIdx=i;break;} acc2+=d; }
      state.images.forEach((s, i) => {
        if(!s.video) return;
        if(i === activeIdx){ s.video.muted = false; if(s.video.paused) s.video.play(); }
        else { s.video.muted = true; }
      });
      drawReelFrame(W, H, t);
      rafId = requestAnimationFrame(prevTick);
    }
    rafId = requestAnimationFrame(prevTick);
    return;
  }

  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(!window.VideoEncoder || !window.Mp4Muxer || isMobile){
    return playReelMjpeg(W, H, total);
  }

  $("recbar").classList.add("on");
  $("dlReel").disabled = true; $("previewReel").disabled = true;
  $("status").textContent = "● Préparation audio…";

  const FPS = 60;
  const frameDur = 1000 / FPS;
  const totalFrames = Math.ceil(total / frameDur);
  const SAMPLE_RATE = 48000;
  const CHANNELS = 2;

  // Build audio timeline: decode audio from each video slide
  async function buildAudioBuffer(){
    const audioCtx = new OfflineAudioContext(CHANNELS, Math.ceil(total/1000 * SAMPLE_RATE), SAMPLE_RATE);
    const slideTimings = [];
    let acc = 0;
    for(const s of state.images){
      const dur = slideDur(s);
      slideTimings.push({ slide: s, startMs: acc, durMs: dur });
      acc += dur;
    }

    for(const { slide, startMs, durMs } of slideTimings){
      if(!slide.videoFile || slide.template !== "post-video") continue;
      try {
        const arrayBuf = await slide.videoFile.arrayBuffer();
        const audioBuf = await audioCtx.decodeAudioData(arrayBuf);
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuf;
        source.connect(audioCtx.destination);
        const maxDur = durMs / 1000;
        source.start(startMs / 1000, 0, Math.min(audioBuf.duration, maxDur));
      } catch(e) { /* video has no audio track — skip */ }
    }

    return audioCtx.startRendering();
  }

  let mixedAudio = null;
  try { mixedAudio = await buildAudioBuffer(); } catch(e) { /* no audio — continue without */ }

  const hasAudio = mixedAudio && mixedAudio.length > 0;

  const muxer = new Mp4Muxer.Muxer({
    target: new Mp4Muxer.ArrayBufferTarget(),
    video: { codec: "avc", width: W, height: H },
    ...(hasAudio ? { audio: { codec: "aac", numberOfChannels: CHANNELS, sampleRate: SAMPLE_RATE } } : {}),
    fastStart: "in-memory"
  });

  const videoEncoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: e => { $("status").textContent = "⚠ Erreur encodage vidéo : " + e.message; playing=false; resetReelUI(); render(); }
  });
  try {
    videoEncoder.configure({
      codec: "avc1.640028",
      width: W, height: H,
      bitrate: 6_000_000,
      framerate: FPS
    });
  } catch(e){
    videoEncoder.close();
    return playReelMjpeg(W, H, total);
  }

  let audioEncoder = null;
  if(hasAudio){
    audioEncoder = new AudioEncoder({
      output: (chunk, meta) => muxer.addAudioChunk(chunk, meta),
      error: e => { $("status").textContent = "⚠ Erreur encodage audio : " + e.message; }
    });
    audioEncoder.configure({
      codec: "mp4a.40.2",
      numberOfChannels: CHANNELS,
      sampleRate: SAMPLE_RATE,
      bitrate: 128_000
    });

    // Encode all audio in chunks of 1024 samples
    const chunkSize = 1024;
    const totalSamples = mixedAudio.length;
    for(let offset = 0; offset < totalSamples; offset += chunkSize){
      const remaining = Math.min(chunkSize, totalSamples - offset);
      const frameData = new Float32Array(remaining * CHANNELS);
      for(let ch = 0; ch < CHANNELS; ch++){
        const chanData = mixedAudio.getChannelData(ch);
        for(let i = 0; i < remaining; i++){
          frameData[i * CHANNELS + ch] = chanData[offset + i];
        }
      }
      const audioData = new AudioData({
        format: "f32-planar",
        sampleRate: SAMPLE_RATE,
        numberOfFrames: remaining,
        numberOfChannels: CHANNELS,
        timestamp: Math.round(offset / SAMPLE_RATE * 1_000_000),
        data: new Float32Array(remaining * CHANNELS)
      });
      // Fill planar data correctly
      const planarData = new Float32Array(remaining * CHANNELS);
      for(let ch = 0; ch < CHANNELS; ch++){
        const chanData = mixedAudio.getChannelData(ch);
        planarData.set(chanData.subarray(offset, offset + remaining), ch * remaining);
      }
      const ad = new AudioData({
        format: "f32-planar",
        sampleRate: SAMPLE_RATE,
        numberOfFrames: remaining,
        numberOfChannels: CHANNELS,
        timestamp: Math.round(offset / SAMPLE_RATE * 1_000_000),
        data: planarData
      });
      audioEncoder.encode(ad);
      ad.close();
    }
  }

  let frame = 0;

  function getActiveVideosAtTime(tMs){
    const imgs = state.images;
    const transMs = 600;
    let acc = 0, idx = 0;
    for(let i=0; i<imgs.length; i++){ const d=slideDur(imgs[i]); if(acc+d>tMs||i===imgs.length-1){idx=i;break;} acc+=d; }
    const per = slideDur(imgs[idx]);
    const local = tMs - acc;
    const results = [];
    const s = imgs[idx];
    if(s.video && s.template === "post-video") results.push({ video: s.video, time: local / 1000 });
    const next = imgs[idx+1];
    if(next && next.video && next.template === "post-video" && local > per - transMs && state.trans !== "cut"){
      results.push({ video: next.video, time: 0 });
    }
    return results;
  }

  function seekVideos(tMs){
    const entries = getActiveVideosAtTime(tMs);
    if(!entries.length) return Promise.resolve();
    return Promise.all(entries.map(({video, time}) => {
      if(Math.abs(video.currentTime - time) < 0.01) return Promise.resolve();
      return new Promise(resolve => {
        video.onseeked = () => { video.onseeked = null; resolve(); };
        video.currentTime = time;
      });
    }));
  }

  function renderNextFrame(){
    const tMs = frame * frameDur;
    const clampedT = Math.min(tMs, total);

    seekVideos(clampedT).then(() => {
      drawReelFrame(W, H, clampedT);

      const vf = new VideoFrame(cv, { timestamp: frame * (1_000_000 / FPS) });
      const isKey = frame % (FPS * 2) === 0;
      videoEncoder.encode(vf, { keyFrame: isKey });
      vf.close();

      $("recprog").style.width = (frame / totalFrames * 100) + "%";
      $("status").textContent = "● Encodage MP4… " + Math.round(frame/totalFrames*100) + "%";
      frame++;

      if(frame <= totalFrames){
        setTimeout(renderNextFrame, 0);
      } else {
        const flushPromises = [videoEncoder.flush()];
        if(audioEncoder) flushPromises.push(audioEncoder.flush());
        Promise.all(flushPromises).then(()=>{
          muxer.finalize();
          const blob = new Blob([muxer.target.buffer], { type: "video/mp4" });
          resetReelUI();
          playing = false;
          deliverVideo(blob);
          render();
        });
      }
    });
  }
  setTimeout(renderNextFrame, 50);
}

// ═══ SECTION: INIT ═══
(async function init(){
  try{
    await Promise.all([
      document.fonts.load("800 80px Sora"),
      document.fonts.load("700 22px Sora"),
      document.fonts.load("500 30px Manrope"),
    ]);
  }catch(e){}
  syncInputs(); updateDimLabel(); render();
  document.fonts.ready.then(render);

  // Mobile: collapse canvas when virtual keyboard opens, scroll field into view
  if(window.matchMedia("(max-width:820px)").matches){
    const stage = document.querySelector(".stage");
    const isMobile = "ontouchstart" in window;
    if(isMobile && stage){
      document.addEventListener("focusin", e => {
        const tag = e.target.tagName;
        if(tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT"){
          stage.classList.add("kb-open");
          setTimeout(() => e.target.scrollIntoView({behavior:"smooth",block:"center"}), 120);
        }
      });
      document.addEventListener("focusout", () => {
        stage.classList.remove("kb-open");
      });
    }
  }
})();
