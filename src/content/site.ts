// Facts and links that are the same in every language. Translated words live
// in src/i18n/dictionaries.

import type { MediaSlug } from "@/components/picture";

const repo = "https://github.com/ghufronakbar/Ririku";

export const site = {
  name: "Ririku",
  kana: "リリク",
  version: "0.4.0",
  url: "https://ririku.lans.my.id",
  links: {
    repo,
    download: `${repo}/releases/latest`,
    releases: `${repo}/releases`,
    changelog: `${repo}/blob/main/CHANGELOG.md`,
    roadmap: `${repo}/blob/main/docs/roadmap.md`,
    contributing: `${repo}/blob/main/CONTRIBUTING.md`,
    security: `${repo}/blob/main/SECURITY.md`,
    issues: `${repo}/issues`,
    license: `${repo}/blob/main/LICENSE`,
    lrclib: "https://lrclib.net",
    guide: {
      en: `${repo}/blob/main/docs/user-guide.md`,
      id: `${repo}/blob/main/docs/user-guide.id.md`,
      ja: `${repo}/blob/main/docs/user-guide.ja.md`,
    },
  },
  author: {
    name: "lanstheprodigy",
    github: "https://github.com/ghufronakbar",
    x: "https://x.com/lansProdigy",
    xHandle: "@lansProdigy",
    instagram: "https://instagram.com/lanstheprodigy",
  },
} as const;

/** The site's origin for absolute URLs; NEXT_PUBLIC_SITE_URL overrides it (e.g. on a preview domain). */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;

/** Section anchors, in page order; labels come from the dictionary's `nav`. */
export const sections = ["features", "lyrics", "widgets", "setup", "install"] as const;

// An original demo song, so the page never shows someone else's lyrics in motion.
// Each line carries its own translations; Japanese pages show the English one.
export const demoSong = {
  title: "ノッチの下で",
  artist: "Ririku Demo",
  source: "YouTube Music",
  duration: 212,
  loop: 27.2,
  lines: [
    { at: 0, jp: "画面の端で 光る言葉", romaji: "gamen no hashi de hikaru kotoba", en: "Words that glow at the edge of the screen", id: "Kata-kata yang berpendar di tepi layar" },
    { at: 3.4, jp: "小さな島に 歌が住んでる", romaji: "chiisana shima ni uta ga sunderu", en: "A song lives on a tiny island", id: "Sebuah lagu tinggal di pulau kecil" },
    { at: 6.8, jp: "一行ずつ そっと灯して", romaji: "ichigyō zutsu sotto tomoshite", en: "Lighting up softly, line by line", id: "Menyala pelan, baris demi baris" },
    { at: 10.2, jp: "夜をまたいで 続くメロディー", romaji: "yoru wo mataide tsuzuku merodī", en: "A melody that carries on through the night", id: "Melodi yang terus mengalun sepanjang malam" },
    { at: 13.6, jp: "止まらないで このリズム", romaji: "tomaranaide kono rizumu", en: "Don't stop, keep this rhythm", id: "Jangan berhenti, jaga ritme ini" },
    { at: 17, jp: "君の声が 届くまで", romaji: "kimi no koe ga todoku made", en: "Until your voice comes through", id: "Sampai suaramu terdengar" },
    { at: 20.4, jp: "ノッチの下で 夢を見てる", romaji: "nocchi no shita de yume wo miteru", en: "Dreaming under the notch", id: "Bermimpi di bawah notch" },
    { at: 23.8, jp: "明日もここで 歌おうよ", romaji: "ashita mo koko de utaō yo", en: "Let's sing here again tomorrow", id: "Ayo bernyanyi di sini lagi besok" },
  ],
};

/** Screenshots for the feature cards, in the order of the dictionary's cards. */
export const featureImages: MediaSlug[] = ["island", "panel-music", "panel-system", "panel-focus", "panel-today", "panel-tray"];

/** Screenshots for the Setup gallery, in the order of the dictionary's pages. */
export const setupImages: MediaSlug[] = [
  "setup-layout",
  "setup-general",
  "setup-tutorial",
  "setup-language",
  "setup-keyboard",
  "setup-widgets",
  "setup-appearance",
  "setup-browser",
  "setup-music-source",
  "setup-lyrics",
  "setup-about",
];

/** Brand names are not translated. */
export const worksWithItems = ["YouTube Music", "YouTube", "Spotify", "Apple Music", "LRCLIB", "Chrome", "Brave", "Edge", "Arc", "Vivaldi", "Opera"];
