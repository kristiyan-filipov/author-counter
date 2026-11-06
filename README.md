# Author Counter

A desktop app (Electron + React) that looks up a researcher's Google Scholar profile and counts how many of their published articles they appear as the **first or second author** on.

## How It Works

1. Enter the author's **Google Scholar profile URL** (e.g. `https://scholar.google.com/citations?user=XXXXXXX`)
2. Enter the **author's name exactly as it appears in their papers** (e.g. `J Smith`)
3. Click **"Count first and second appearances"**
4. The app returns:
   - **Total articles** found on the profile
   - **First or second author count** - articles where the name appears in position 1 or 2

<img width="1769" height="941" alt="image" src="https://github.com/user-attachments/assets/abc0a305-40e5-40e6-85b8-c0d41810f493" />

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A [SerpApi](https://serpapi.com/) account and API key (free tier available)

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/kristiyan-filipov/author-counter.git
cd authors-counter
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure the frontend environment

Create a `.env` file in the project root by copying the example:

```bash
cp .env.example .env
```

Open `.env` and set the URL pointing to your running backend:

```env
VITE_API_URL=https://your-api-url-here
```

### 4. Set up the backend

The backend lives in the `analyze-author/` folder. Install its dependencies:

```bash
cd analyze-author
npm install
```

Then create its `.env` file:

```bash
cp .env.example .env
```

Open `analyze-author/.env` and add your SerpApi key:

```env
SERPAPI_API_KEY=your_serpapi_key_here
```

---

## Running the Desktop App

### Development (browser)

```bash
npm run dev
```

### Desktop app (Electron)

Build the frontend first, then launch Electron:

```bash
npm run build
npm start
```

### Package into an installer

Produces a native installer (`.exe` on Windows, `.dmg` on macOS):

```bash
npm run package
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19, Tailwind CSS v4 |
| Animations | GSAP |
| Desktop shell | Electron |
| Build tool | Vite |
| Scholar data | SerpApi - Google Scholar Author engine |
