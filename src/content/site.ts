// Every word and link on the page lives here, so copy changes (or a future
// Bahasa Indonesia / 日本語 version) never need to touch the components.

const repo = "https://github.com/ghufronakbar/Ririku";

export const site = {
  name: "Ririku",
  kana: "リリク",
  version: "0.4.0",
  title: "Ririku — Lyrics, live in your notch",
  description:
    "Ririku is a free, open-source macOS app that shows what's playing, with line-by-line synced lyrics, right under your MacBook's notch. Plus pages of widgets you arrange yourself.",
  links: {
    repo,
    download: `${repo}/releases/latest`,
    releases: `${repo}/releases`,
    guide: `${repo}/blob/main/docs/user-guide.md`,
    changelog: `${repo}/blob/main/CHANGELOG.md`,
    roadmap: `${repo}/blob/main/docs/roadmap.md`,
    contributing: `${repo}/blob/main/CONTRIBUTING.md`,
    security: `${repo}/blob/main/SECURITY.md`,
    issues: `${repo}/issues`,
    license: `${repo}/blob/main/LICENSE`,
    lrclib: "https://lrclib.net",
  },
  author: {
    name: "lanstheprodigy",
    github: "https://github.com/ghufronakbar",
    x: "https://x.com/lansProdigy",
    instagram: "https://instagram.com/lanstheprodigy",
  },
} as const;

export const nav = [
  { label: "Features", href: "#features" },
  { label: "Lyrics", href: "#lyrics" },
  { label: "Widgets", href: "#widgets" },
  { label: "Setup", href: "#setup" },
  { label: "Install", href: "#install" },
] as const;

export const hero = {
  eyebrow: "Free for macOS · Open source",
  title: ["lyrics, live", "in your notch."],
  body: "Ririku shows what's playing, with line-by-line synced lyrics, right under your MacBook's notch. Plus pages of widgets you arrange yourself.",
  meta: ["macOS 14+", "Apple silicon", "MIT"],
};

// An original demo song, so the page never shows someone else's lyrics in motion.
export const demoSong = {
  title: "ノッチの下で",
  artist: "Ririku Demo",
  source: "YouTube Music",
  duration: 212,
  lines: [
    { at: 0, jp: "画面の端で 光る言葉", romaji: "gamen no hashi de hikaru kotoba", en: "Words that glow at the edge of the screen" },
    { at: 3.4, jp: "小さな島に 歌が住んでる", romaji: "chiisana shima ni uta ga sunderu", en: "A song lives on a tiny island" },
    { at: 6.8, jp: "一行ずつ そっと灯して", romaji: "ichigyō zutsu sotto tomoshite", en: "Lighting up softly, line by line" },
    { at: 10.2, jp: "夜をまたいで 続くメロディー", romaji: "yoru wo mataide tsuzuku merodī", en: "A melody that carries on through the night" },
    { at: 13.6, jp: "止まらないで このリズム", romaji: "tomaranaide kono rizumu", en: "Don't stop, keep this rhythm" },
    { at: 17, jp: "君の声が 届くまで", romaji: "kimi no koe ga todoku made", en: "Until your voice comes through" },
    { at: 20.4, jp: "ノッチの下で 夢を見てる", romaji: "nocchi no shita de yume wo miteru", en: "Dreaming under the notch" },
    { at: 23.8, jp: "明日もここで 歌おうよ", romaji: "ashita mo koko de utaō yo", en: "Let's sing here again tomorrow" },
  ],
  loop: 27.2,
};

export const statement =
  "Ririku, from the Japanese リリク for “lyric”, turns the quiet strip around your notch into a tiny stage: the song you're playing, every line as it's sung, and the small tools you reach for all day.";

export const features = {
  kicker: "01 — Features",
  title: "the notch, in motion",
  cards: [
    { image: "island", title: "Compact island", body: "Artwork, a spectrum and up to three lyric lines, right under the notch." },
    { image: "panel-music", title: "Music panel", body: "Hover or click to expand: track, seek bar, play, pause and skip." },
    { image: "panel-system", title: "System", body: "Processor, memory and disk, with battery and the clock beside them." },
    { image: "panel-focus", title: "Focus", body: "Pomodoro, a countdown and a note, one tab away." },
    { image: "panel-today", title: "Calendar & Shortcuts", body: "Your day and your Shortcuts on a page of your own." },
    { image: "panel-tray", title: "Tray & AirDrop", body: "Keep files at hand, and send them with AirDrop." },
  ],
} as const;

export const worksWith = {
  label: "Plays along with",
  items: ["YouTube Music", "YouTube", "Spotify", "Apple Music", "LRCLIB", "Chrome", "Brave", "Edge", "Arc", "Vivaldi", "Opera"],
};

export const lyrics = {
  kicker: "02 — Lyrics",
  title: ["every line,", "right on time."],
  body: "Lyrics are found on LRCLIB by title, artist and duration, then cached on your Mac. Prefer the video's captions, pick another version, nudge the timing per song, or import your own .lrc file.",
  japanese:
    "Japanese-friendly by design: when a file pairs Japanese with romaji, Ririku can show only the Japanese. On macOS 15, each line can be translated on your Mac, right under the active one.",
  cta: "Read the user guide",
  toggles: { romaji: "Romaji", translation: "Translation" },
};

export const pages = {
  kicker: "03 — Widgets",
  title: "your notch, your pages.",
  body: "Arrange pages of widgets in Setup → Layout, with a live preview. Each widget is small or wide, and a page can hold a whole tool. This is the layout Ririku starts with.",
  strips: [
    { name: "Home", items: ["Music, with lyrics"] },
    { name: "System", items: ["System", "Battery", "Clock"] },
    { name: "Focus", items: ["Pomodoro", "Countdown", "Notes"] },
    { name: "Tools", items: ["Apps", "Shortcuts", "Bookmarks"] },
    { name: "Tray", items: ["Files at hand", "AirDrop"] },
  ],
};

export const widgets = {
  title: "20 widgets and tools",
  note: "Everything runs on your Mac. Widgets that need a permission ask only when you add them.",
  items: [
    { name: "Music", detail: "Lyrics, seek, controls" },
    { name: "System", detail: "CPU, memory, disk" },
    { name: "Network", detail: "Upload and download speed" },
    { name: "Battery", detail: "Charge and power source" },
    { name: "Clock", detail: "Time and date" },
    { name: "Pomodoro", detail: "Focus and break cycles" },
    { name: "Countdown", detail: "Timers that keep time" },
    { name: "Stopwatch", detail: "Laps included" },
    { name: "Notes", detail: "A quick scratchpad" },
    { name: "Counter", detail: "Tap to count" },
    { name: "Days left", detail: "Until the day that matters" },
    { name: "Water", detail: "Glasses today" },
    { name: "Apps", detail: "Launch your favourites" },
    { name: "Shortcuts", detail: "Run any Shortcut" },
    { name: "Bookmarks", detail: "Open in your browser" },
    { name: "Calendar", detail: "Read-only, asks first", tag: "Permission" },
    { name: "Camera mirror", detail: "Only while visible", tag: "Permission" },
    { name: "Tray", detail: "Files and AirDrop" },
    { name: "Clipboard", detail: "History, off until you turn it on", tag: "Opt-in" },
    { name: "Translate", detail: "On device", tag: "macOS 15" },
  ],
};

export const setup = {
  kicker: "04 — Setup",
  title: "set up, page by page.",
  body: "Settings stay out of the panel. Everything lives in Setup, one page per area.",
  pages: [
    { image: "setup-layout", name: "Layout", body: "Arrange pages and widgets with a live preview of the panel." },
    { image: "setup-general", name: "General", body: "Display, hover delays, Dock and menu bar icons, haptics, open at login." },
    { image: "setup-tutorial", name: "Tutorial", body: "A short tour, with a button to every page it mentions." },
    { image: "setup-language", name: "Language", body: "English, Bahasa Indonesia or 日本語, or follow macOS." },
    { image: "setup-keyboard", name: "Keyboard", body: "Record a shortcut that opens the panel." },
    { image: "setup-widgets", name: "Widgets", body: "Settings for every widget in one place." },
    { image: "setup-appearance", name: "Appearance", body: "Island size, lyric lines, accent colour and animations." },
    { image: "setup-browser", name: "Browser connection", body: "Four steps to connect your Chromium browser." },
    { image: "setup-music-source", name: "Music source", body: "Opt-in connections for Spotify desktop and Apple Music." },
    { image: "setup-lyrics", name: "Lyrics", body: "Source, timing and on-device translation." },
    { image: "setup-about", name: "About", body: "Version, privacy note and links." },
  ],
} as const;

export const privacy = {
  kicker: "05 — Privacy",
  words: ["no account.", "no telemetry.", "no paywall."],
  facts: [
    { title: "Lyrics lookups", body: "Only the title, artist and duration go to LRCLIB, and lyrics are cached on your Mac." },
    { title: "The extension", body: "Runs only on YouTube and YouTube Music, and reads the player, never cookies or history." },
    { title: "Translation", body: "Happens on your Mac with the system Translation framework." },
    { title: "Permissions", body: "Calendar and camera ask only when you add those widgets. Clipboard history starts off." },
    { title: "Open source", body: "MIT licensed. Every line is on GitHub to read, fork and improve." },
    { title: "No audio, no video", body: "Ririku never downloads what you play. It just sings along." },
  ],
};

export const install = {
  kicker: "06 — Install",
  title: ["up and running", "in three steps."],
  steps: [
    {
      title: "Get the app",
      body: "Download Ririku-0.4.0.zip from Releases, unzip it, and move Ririku.app to your Applications folder.",
    },
    {
      title: "Allow it to open",
      body: "Ririku is free and not notarized by Apple, so macOS asks first. Go to System Settings → Privacy & Security and click Open Anyway.",
    },
    {
      title: "Connect your browser",
      body: "In Setup → Browser connection: Register, Show in Finder, then Load unpacked from your browser's extensions page with Developer mode on. Refresh your YouTube tab.",
    },
  ],
  done: "Play a song and hover over the notch.",
  requirements: [
    { label: "macOS", value: "14 Sonoma or later. Translate needs 15 Sequoia." },
    { label: "Mac", value: "Apple silicon. A MacBook with a notch is recommended." },
    { label: "Browser", value: "Chrome, Brave, Edge, Vivaldi, Opera, Chromium or Arc." },
    { label: "Sites", value: "YouTube and YouTube Music." },
  ],
  faq: [
    {
      q: "Is Ririku really free?",
      a: "Yes. It is free and open source under the MIT license, with no account, no premium tier and no paywall.",
    },
    {
      q: "Why does macOS block the first launch?",
      a: "Notarization needs a paid Apple developer account, so Ririku is signed ad hoc. Click Open Anyway in Privacy & Security once and macOS remembers it.",
    },
    {
      q: "Does it work with Spotify or Apple Music?",
      a: "Yes, as opt-in connections in Setup → Music source. They use macOS Automation and need no extension. Real-device validation is still in progress.",
    },
    {
      q: "What if my lyrics are out of sync?",
      a: "In Setup → Lyrics, adjust the offset for that song, or search for another lyrics version whose duration matches the player.",
    },
    {
      q: "My Mac has no notch. Can I still use it?",
      a: "Ririku uses the main screen on displays without a notch. It works, but that setup is not fully tested yet.",
    },
    {
      q: "Safari or Firefox?",
      a: "Not yet. The companion extension is for Chromium browsers; only Chrome is tested.",
    },
  ],
};

export const cta = {
  title: ["ready to", "sing along?"],
  body: "Free, open source, and about a minute to set up.",
  primary: "Download for macOS",
  secondary: "Star on GitHub",
};

export const footer = {
  columns: [
    {
      title: "Product",
      links: [
        { label: "Download", href: site.links.download },
        { label: "Releases", href: site.links.releases },
        { label: "Changelog", href: site.links.changelog },
        { label: "Roadmap", href: site.links.roadmap },
      ],
    },
    {
      title: "Docs",
      links: [
        { label: "User guide", href: site.links.guide },
        { label: "Contributing", href: site.links.contributing },
        { label: "Security", href: site.links.security },
        { label: "Issues", href: site.links.issues },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: "GitHub", href: site.author.github },
        { label: "X", href: site.author.x },
        { label: "Instagram", href: site.author.instagram },
      ],
    },
  ],
  legal:
    "Ririku is not affiliated with or endorsed by Apple, Google, YouTube, or LRCLIB. Product names are trademarks of their respective owners.",
};
