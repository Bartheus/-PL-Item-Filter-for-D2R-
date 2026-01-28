// Practical Item Filter for D2RMM - FULL PL (keys/essences/organs + nice gem styles)
// Copy/paste as whole mod.js

// === Helpers ===
function setAllLocales(item, text) {
  for (const key in item) {
    if (key !== "id" && key !== "Key") item[key] = text;
  }
}

function getAnyName(item) {
  return item.plPL || item.enUS || item.deDE || item.frFR || item.esES || item.itIT || "";
}

// Color codes (D2 in-text colors)
const COLORS = {
  white: "ÿc0",
  red: "ÿcU",
  blue: "ÿcN",
  yellow: "ÿc9",
  orange: "ÿc8",
  violet: "ÿc;",
  gray: "ÿc7",
  green: "ÿcQ",
};

// ======================================================
// Change items in item-names.json (scrolls, potions, charms, jewel, gems, keys, essences, organs)
// ======================================================
const itemNamesFilename = "local\\lng\\strings\\item-names.json";
const itemNames = D2RMM.readJson(itemNamesFilename);

// ---------- Basic items (TP/ID, potions, charms, jewel by Key) ----------
itemNames.forEach((item) => {
  const itemtype = item.Key;
  let newName = null;

  // Zwoje
  if (itemtype === "tsc") newName = `TP`; // Zwój Portalu Miejskiego
  if (itemtype === "isc") newName = `ID`; // Zwój Identyfikacji

  // Mikstury rzucane (polskie skróty)
  if (itemtype === "gpl") newName = `M. Dusz. Gaz`;  // Strangling Gas Potion
  if (itemtype === "opl") newName = `M. Poraż.`;      // Fulminating Potion
  if (itemtype === "gpm") newName = `M. Dław. Gaz`;   // Choking Gas Potion
  if (itemtype === "opm") newName = `M. Wybuch.`;     // Exploding Potion
  if (itemtype === "gps") newName = `M. Jad. Gaz`;    // Rancid Gas Potion
  if (itemtype === "ops") newName = `M. Olej.`;       // Oil Potion

  // Mikstury użytkowe
  if (itemtype === "vps") newName = `M. Wytrz.`;      // Stamina Potion
  if (itemtype === "yps") newName = `Anti`;           // Antidote Potion (Twoje życzenie)
  if (itemtype === "wms") newName = `M. Rozgrz.`;     // Thawing Potion

  // Mikstury odnawiania
  if (itemtype === "rvs") newName = `${COLORS.violet}Odn.${COLORS.white}`;        // Rejuvenation
  if (itemtype === "rvl") newName = `${COLORS.violet}Pełn. Odn.${COLORS.white}`;  // Full Rejuvenation

  // HP potions – czerwone + poziomy
  if (itemtype === "hp1") newName = `${COLORS.red}HP1${COLORS.white}`;
  if (itemtype === "hp2") newName = `${COLORS.red}HP2${COLORS.white}`;
  if (itemtype === "hp3") newName = `${COLORS.red}HP3${COLORS.white}`;
  if (itemtype === "hp4") newName = `${COLORS.red}HP4${COLORS.white}`;
  if (itemtype === "hp5") newName = `${COLORS.red}HP5${COLORS.white}`;

  // MP potions – niebieskie + poziomy
  if (itemtype === "mp1") newName = `${COLORS.blue}MP1${COLORS.white}`;
  if (itemtype === "mp2") newName = `${COLORS.blue}MP2${COLORS.white}`;
  if (itemtype === "mp3") newName = `${COLORS.blue}MP3${COLORS.white}`;
  if (itemtype === "mp4") newName = `${COLORS.blue}MP4${COLORS.white}`;
  if (itemtype === "mp5") newName = `${COLORS.blue}MP5${COLORS.white}`;

  // Talizmany (charms) – po polsku
  if (itemtype === "cm1") newName = `${COLORS.blue}•• Mały talizman ••${COLORS.white}`;     // Small Charm
  if (itemtype === "cm3") newName = `${COLORS.blue}•• Wielki talizman ••${COLORS.white}`;   // Grand Charm

  // Klejnot (jewel)
  if (itemtype === "jew") newName = `${COLORS.yellow}•• Klejnot ••${COLORS.white}`;
  if (newName != null) setAllLocales(item, newName);
});

// ======================================================
// Pretty “special drops” by TEXT detection (PL/EN)
// - Keys / Essences / Organs / Token
// ======================================================
function applyTextOverride(rxList, newLabelBuilder) {
  itemNames.forEach((item) => {
    const name = getAnyName(item);
    if (!name) return;

    for (const rx of rxList) {
      if (rx.test(name)) {
        setAllLocales(item, newLabelBuilder(name));
        return;
      }
    }
  });
}

// --- Keys (Uber Keys) ---
applyTextOverride(
  [
    /klucz terroru/i,
    /klucz nienawiści|klucz nienawisci/i,
    /klucz zniszczenia/i,
    /key of terror/i,
    /key of hate/i,
    /key of destruction/i,
  ],
  (name) => {
    // Rozpoznanie typu klucza (dla ładnego skrótu)
    const isTerror = /terroru|key of terror/i.test(name);
    const isHate = /nienawiści|nienawisci|key of hate/i.test(name);
    const isDestr = /zniszczenia|key of destruction/i.test(name);

    const t = isTerror ? "Terroru" : isHate ? "Nienawiści" : isDestr ? "Zniszczenia" : "";
    // Styl: 🔑 (symbol zastępczy) -> używamy „✦” bo pewne w czcionce D2
    return `${COLORS.violet}✦✦ ${COLORS.yellow}Klucz ${t}${COLORS.violet} ✦✦${COLORS.white}`;
  }
);

// --- Essences (4) + Token ---
applyTextOverride(
  [
    /esencja/i,
    /essence/i,
    /żeton odkupienia|zeton odkupienia/i,
    /token of absolution/i,
  ],
  (name) => {
    const isToken = /żeton odkupienia|zeton odkupienia|token of absolution/i.test(name);
    if (isToken) {
      return `${COLORS.violet}•••• ${COLORS.yellow}Żeton odkupienia${COLORS.violet} ••••${COLORS.white}`;
    }

    // Rodzaje esencji (PL mogą się minimalnie różnić, więc lecimy regexami)
    let short = "Esencja";
    if (/udręk|udrek|suffering/i.test(name)) short = "Esencja Udręki";
    else if (/terror|terroru/i.test(name)) short = "Esencja Terroru";
    else if (/nienawiś|nienawisc|hate/i.test(name)) short = "Esencja Nienawiści";
    else if (/zniszcz|destruction/i.test(name)) short = "Esencja Zniszczenia";

    return `${COLORS.violet}✦ ${COLORS.orange}${short}${COLORS.violet} ✦${COLORS.white}`;
  }
);

// --- Organs (Uber organs) ---
applyTextOverride(
  [
    /oko baala|baal's eye/i,
    /mózg mefista|mozg mefista|mephisto's brain/i,
    /róg diabla|rog diabla|diablo's horn/i,
  ],
  (name) => {
    const isEye = /oko baala|baal's eye/i.test(name);
    const isBrain = /mózg mefista|mozg mefista|mephisto's brain/i.test(name);
    const isHorn = /róg diabla|rog diabla|diablo's horn/i.test(name);

    const t = isEye ? "Oko Baala" : isBrain ? "Mózg Mefista" : isHorn ? "Róg Diablo" : "Organ";
    // Styl: mocno widoczne, ale nie mylić z runami
    return `${COLORS.orange}•• ${COLORS.yellow}${t}${COLORS.orange} ••${COLORS.white}`;
  }
);

// ======================================================
// Gems – FIX v2: normal zawsze kolor + znacznik
// - wykrywanie po enUS + plPL
// - zapis do item-names.json ORAZ wszystkich spotykanych plików gemów
// ======================================================

function gemInfoFromAnyLocale(item) {
  const s = ((item.enUS || "") + " " + (item.plPL || "")).toLowerCase();

  if (s.includes("ruby") || s.includes("rubin")) return { pl: "Rubin", color: COLORS.red };
  if (s.includes("diamond") || s.includes("diament")) return { pl: "Diament", color: "ÿcF" };
  if (s.includes("sapphire") || s.includes("szafir")) return { pl: "Szafir", color: COLORS.blue };
  if (s.includes("emerald") || s.includes("szmaragd")) return { pl: "Szmaragd", color: COLORS.green };
  if (s.includes("topaz")) return { pl: "Topaz", color: COLORS.yellow };
  if (s.includes("amethyst") || s.includes("ametyst")) return { pl: "Ametyst", color: COLORS.violet };
  if (s.includes("skull") || s.includes("czaszka")) return { pl: "Czaszka", color: "ÿcH" };

  return null;
}

function detectTierFromAnyLocale(item) {
  const en = (item.enUS || "").toLowerCase();
  const pl = (item.plPL || "").toLowerCase();

  // EN
  if (en.includes("perfect")) return "P";
  if (en.includes("flawless")) return "L";
  if (en.includes("flawed")) return "F";
  if (en.includes("chipped")) return "C";

  // PL (na wypadek, gdy enUS puste)
  if (pl.includes("idealn")) return "P";
  if (pl.includes("nieskazitel")) return "L";
  if (pl.includes("wadliw")) return "F";
  if (pl.includes("pęknięt") || pl.includes("pekni")) return "C";

  return "N";
}

function tierMark(tier) {
  if (tier === "P") return "••••";
  if (tier === "L") return "•••";
  if (tier === "N") return "••";   // NORMAL ma zawsze znacznik
  return "•"; // C / F
}

function gemLabel(gem, tier) {
  const m = tierMark(tier);
  return `${gem.color}${m} ${gem.pl} ${m}${COLORS.white}`;
}

function applyGemStyleTo(list) {
  list.forEach((item) => {
    const gem = gemInfoFromAnyLocale(item);
    if (!gem) return;

    const tier = detectTierFromAnyLocale(item);
    setAllLocales(item, gemLabel(gem, tier));
  });
}

// 1) zawsze: item-names.json (masz już wczytane jako itemNames)
applyGemStyleTo(itemNames);

// 2) dodatkowe pliki – różne wersje/modpacki mają różne nazwy
const possibleGemFiles = [
  "local\\lng\\strings\\item-gems.json",
  "local\\lng\\strings\\item-gem.json",
  "local\\lng\\strings\\item-gemnames.json",
  "local\\lng\\strings\\items-gems.json",
];

for (const f of possibleGemFiles) {
  try {
    const data = D2RMM.readJson(f);
    applyGemStyleTo(data);
    D2RMM.writeJson(f, data);
  } catch (e) {
    // pliku nie ma -> ignorujemy
  }
}

D2RMM.writeJson(itemNamesFilename, itemNames);
//Change gold item label on the ground
const itemNameAffixesFilename = "local\\lng\\strings\\item-nameaffixes.json";
const itemNameAffixes = D2RMM.readJson(itemNameAffixesFilename);

itemNameAffixes.forEach((item) => {
  const itemtype = item.Key;
  let newName = null;

  // Gold
  if (itemtype === "gld") {
    newName = ``;
  }

  // === NORMALNE GEMY (tu siedzą w affixach) ===
  // Normal Sapphire
  if (itemtype === "gsb") {
    newName = `${COLORS.blue}•• Szafir ••${COLORS.white}`;
  }

  // Normal Ruby
  if (itemtype === "gsr") {
    newName = `${COLORS.red}•• Rubin ••${COLORS.white}`;
  }

  if (newName != null) {
    for (const key in item) {
      if (key !== "id" && key !== "Key") {
        item[key] = newName;
      }
    }
  }
});

D2RMM.writeJson(itemNameAffixesFilename, itemNameAffixes);



// ======================================================
// Runy – Twój styl (z numerami + mocny highlight od Pul/Ist+)
// ======================================================
const itemRunesFilename = "local\\lng\\strings\\item-runes.json";
const itemRunes = D2RMM.readJson(itemRunesFilename);

itemRunes.forEach((item) => {
  const itemtype = item.Key;
  let newName = null;

  if (itemtype === "r01") newName = `El ÿc5[ÿc71ÿc5]`;
  if (itemtype === "r02") newName = `Eld ÿc5[ÿc72ÿc5]`;
  if (itemtype === "r03") newName = `Tir ÿc5[ÿc73ÿc5]`;
  if (itemtype === "r04") newName = `Nef ÿc5[ÿc74ÿc5]`;
  if (itemtype === "r05") newName = `Eth ÿc5[ÿc75ÿc5]`;
  if (itemtype === "r06") newName = `Ith ÿc5[ÿc76ÿc5]`;
  if (itemtype === "r07") newName = `Tal ÿc5[ÿc77ÿc5]`;
  if (itemtype === "r08") newName = `Ral ÿc5[ÿc78ÿc5]`;
  if (itemtype === "r09") newName = `Ort ÿc5[ÿc79ÿc5]`;
  if (itemtype === "r10") newName = `Thul ÿc5[ÿc710ÿc5]`;
  if (itemtype === "r11") newName = `Amn ÿc5[ÿc711ÿc5]`;
  if (itemtype === "r12") newName = `Sol ÿc5[ÿc712ÿc5]`;
  if (itemtype === "r13") newName = `Shael ÿc5[ÿc713ÿc5]`;
  if (itemtype === "r14") newName = `Dol ÿc5[ÿc714ÿc5]`;
  if (itemtype === "r15") newName = `Hel ÿc5[ÿc715ÿc5]`;
  if (itemtype === "r16") newName = `Io ÿc5[ÿc716ÿc5]`;
  if (itemtype === "r17") newName = `Lum ÿc5[ÿc717ÿc5]`;
  if (itemtype === "r18") newName = `Ko ÿc5[ÿc718ÿc5]`;
  if (itemtype === "r19") newName = `Fal ÿc5[ÿc719ÿc5]`;
  if (itemtype === "r20") newName = `Lem ÿc5[ÿc720ÿc5]`;

  if (itemtype === "r21") newName = `ÿc1*  ÿc@Pul ÿc0[ÿc121ÿc0]  ÿc1*`;
  if (itemtype === "r22") newName = `ÿc1*  ÿc@Um ÿc0[ÿc122ÿc0]  ÿc1*`;
  if (itemtype === "r23") newName = `ÿc1*  ÿc@Mal ÿc0[ÿc123ÿc0]  ÿc1*`;
  if (itemtype === "r24") newName = `ÿc1*  ÿc@Ist ÿc0[ÿc124ÿc0]  ÿc1*`;

  if (itemtype === "r25") newName = `ÿcA*ÿc1*  ÿc@Gul ÿc0[ÿc125ÿc0]  ÿcA*ÿc1*`;
  if (itemtype === "r26") newName = `ÿcA*ÿc1*  ÿc@Vex ÿc0[ÿc126ÿc0]  ÿcA*ÿc1*`;
  if (itemtype === "r27") newName = `ÿcA*ÿc1*  ÿc@Ohm ÿc0[ÿc127ÿc0]  ÿcA*ÿc1*`;
  if (itemtype === "r28") newName = `ÿcA*ÿc1*  ÿc@Lo ÿc0[ÿc128ÿc0]  ÿcA*ÿc1*`;

  if (itemtype === "r29") newName = `ÿc;*ÿc2*ÿc1*    ÿc@Sur ÿc0[ÿc229ÿc0]    ÿc;*ÿc2*ÿc1*`;
  if (itemtype === "r30") newName = `ÿc;*ÿc2*ÿc1*    ÿc@Ber ÿc0[ÿc230ÿc0]    ÿc;*ÿc2*ÿc1*`;
  if (itemtype === "r31") newName = `ÿc;*ÿc2*ÿc1*    ÿc@Jah ÿc0[ÿc231ÿc0]    ÿc;*ÿc2*ÿc1*`;
  if (itemtype === "r32") newName = `ÿc;*ÿc2*ÿc1*    ÿc@Cham ÿc0[ÿc232ÿc0]   ÿc;*ÿc2*ÿc1*`;
  if (itemtype === "r33") newName = `ÿc;*ÿc2*ÿc1*    ÿc@Zod ÿc0[ÿc233ÿc0]    ÿc;*ÿc2*ÿc1*`;

  if (newName != null) setAllLocales(item, newName);
});
D2RMM.writeJson(itemRunesFilename, itemRunes);

// ======================================================
// Tooltip style – slightly smaller and less see-through
// ======================================================
const profileHDFilename = "global\\ui\\layouts\\_profilehd.json";
const profileHD = D2RMM.readJson(profileHDFilename);

profileHD.TooltipStyle.inGameBackgroundColor = [0, 0, 0, 0.85];
profileHD.TooltipStyle.backgroundColor = [0, 0, 0, 0.9];
profileHD.TooltipFontSize = 32;
profileHD.TooltipStyle.inGameShowItemsSelectedBackgroundColor = [0.1, 0.1, 0.2, 1];

D2RMM.writeJson(profileHDFilename, profileHD);



// // ===== DEBUG: znajdź wpisy zawierające Rubin/Szafir w różnych tabelach =====
// function collectMatchesFromFile(filename, needles) {
//   try {
//     const arr = D2RMM.readJson(filename);
//     const hits = [];

//     arr.forEach((row) => {
//       // sklej wszystkie locale w jeden tekst do przeszukania
//       let all = "";
//       for (const k in row) {
//         if (k !== "id" && k !== "Key" && typeof row[k] === "string") all += " " + row[k];
//       }
//       const hay = all.toLowerCase();

//       for (const n of needles) {
//         if (hay.includes(n)) {
//           hits.push({
//             file: filename,
//             Key: row.Key,
//             plPL: row.plPL || "",
//             enUS: row.enUS || "",
//           });
//           break;
//         }
//       }
//     });

//     return hits;
//   } catch (e) {
//     return [];
//   }
// }

// const needles = ["rubin", "szafir", "ruby", "sapphire"];
// const candidates = [
//   "local\\lng\\strings\\item-names.json",
//   "local\\lng\\strings\\item-gems.json",
//   "local\\lng\\strings\\item-gem.json",
//   "local\\lng\\strings\\item-gemnames.json",
//   "local\\lng\\strings\\items-gems.json",
//   "local\\lng\\strings\\item-nameaffixes.json",
//   "local\\lng\\strings\\item-modifiers.json",
// ];

// let found = [];
// for (const f of candidates) found = found.concat(collectMatchesFromFile(f, needles));

// // zapisze Ci plik w folderze moda po instalacji
// D2RMM.writeJson("debug_found_rubin_szafir.json", found);


// ======================================================
// Copy hd (as in original mod)
// ======================================================
D2RMM.copyFile("hd", "hd", true);


