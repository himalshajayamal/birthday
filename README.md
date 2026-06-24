# 🐻 Happy Birthday Boo — File & Folder Guide

Everything you need to know about where to put your photos, video, and music.

---

## 📁 Full Folder Structure

```
boo-birthday/
│
├── index.html                  ← Main page (open this in browser)
│
├── css/
│   └── style.css               ← All styles (photorealistic sky, layout, etc.)
│
├── js/
│   └── script.js               ← All logic (canvas sky, puzzle, quiz, games)
│
└── assets/
    │
    ├── images/
    │   │
    │   ├── hero/               ← Profile photo + video thumbnail
    │   │   ├── boo-main.jpg    ★ Her main portrait photo (hero circle)
    │   │   └── video-thumbnail.jpg  ★ Thumbnail shown before video plays
    │   │
    │   ├── gallery/            ← Gallery + Puzzle game photos
    │   │   ├── gallery-01.jpg  ★ Gallery photo 1 (also Puzzle image 1)
    │   │   ├── gallery-02.jpg  ★ Gallery photo 2 (also Puzzle image 2)
    │   │   ├── gallery-03.jpg  ★ Gallery photo 3 (also Puzzle image 3)
    │   │   ├── gallery-04.jpg  ★ Gallery photo 4 (also Puzzle image 4)
    │   │   ├── gallery-05.jpg  ★ Gallery photo 5 (also Puzzle image 5)
    │   │   └── gallery-06.jpg  ★ Gallery photo 6 (also Puzzle image 6)
    │   │
    │   └── memories/           ← (Optional) extra photos for memory cards
    │       └── (any name).jpg
    │
    ├── videos/
    │   └── happy-birthday.mp4  ★ Your birthday video
    │
    └── audio/
        └── our-song.mp3        ★ Background music
```

---

## ★ HOW TO ADD YOUR FILES

### 1. Her Main Photo (Hero Circle)
**File:** `assets/images/hero/boo-main.jpg`
- Square crop works best (face centred)
- Minimum 600×600 px
- JPG or PNG both work
- Rename your file to exactly: `boo-main.jpg`

---

### 2. Gallery Photos (6 photos)
**Folder:** `assets/images/gallery/`

These appear in the photo gallery section AND as puzzle images in the "Unlock Boo's Photo" game.

| Save as...       | Shows in Gallery as...           | Puzzle dropdown label |
|------------------|----------------------------------|-----------------------|
| `gallery-01.jpg` | "The night sky you loved so much" | Memory 1             |
| `gallery-02.jpg` | "That smile that changed everything" | Memory 2          |
| `gallery-03.jpg` | "Carnival lights and cotton candy dreams" | Memory 3    |
| `gallery-04.jpg` | "Under the same stars, always"   | Memory 4             |
| `gallery-05.jpg` | "Two souls, one journey"          | Memory 5            |
| `gallery-06.jpg` | "Across galaxies, our connection remains" | Memory 6    |

Tips:
- Square photos look best in the gallery grid
- Minimum 400×400 px, ideally 800×800 px
- If a photo is missing, the site auto-shows a placeholder sky photo

**To change gallery captions:** open `index.html`, find the `gallery-caption` divs and edit the text.
**To change puzzle dropdown labels:** find the `<option>` tags inside `<select id="puzzleImageSelect">` and edit the text.

---

### 3. Birthday Video
**File:** `assets/videos/happy-birthday.mp4`

- Format: **MP4 (H.264)** — plays in every browser
- Resolution: 1280×720 or 1920×1080
- File size: keep under **50 MB** for smooth loading
- Also accepted: `.webm` (add as `happy-birthday.webm` for extra compatibility)

Optional thumbnail (shown before play):
**File:** `assets/images/hero/video-thumbnail.jpg`
- This is the preview image shown before the user presses play
- Recommended: 1280×720 px

---

### 4. Background Music
**File:** `assets/audio/our-song.mp3`

- Format: MP3
- Any length (it loops)
- The music player button in the bottom-right corner plays/pauses it
- If missing, a fallback online track plays instead

---

## QUICK CHECKLIST

Before sharing the site, make sure these files exist:

- [ ] `assets/images/hero/boo-main.jpg`
- [ ] `assets/images/hero/video-thumbnail.jpg`
- [ ] `assets/images/gallery/gallery-01.jpg`
- [ ] `assets/images/gallery/gallery-02.jpg`
- [ ] `assets/images/gallery/gallery-03.jpg`
- [ ] `assets/images/gallery/gallery-04.jpg`
- [ ] `assets/images/gallery/gallery-05.jpg`
- [ ] `assets/images/gallery/gallery-06.jpg`
- [ ] `assets/videos/happy-birthday.mp4`
- [ ] `assets/audio/our-song.mp3`

---

## HOW TO OPEN THE SITE

**Option A — Double-click:**
Open `index.html` directly in Chrome, Edge, or Firefox.

**Option B — Local server (recommended for video):**
Some browsers block local video files when opened directly.
If the video doesn't play, run a quick local server:
```bash
# Python 3
cd boo-birthday
python -m http.server 8080
# Then open: http://localhost:8080
```

**Option C — Upload to web hosting:**
Upload the entire `boo-birthday/` folder to any web host (Netlify, GitHub Pages, cPanel).
The site works as-is — no backend needed.

---

Made with stardust, memories, and a little bit of code. 🌌
