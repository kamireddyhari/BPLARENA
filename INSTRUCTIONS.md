# BPL Arena — Project Instructions

> Bangalore Property and Loan Arena — Full-Stack Web Application

---

## Project Structure

```
bp&l/
├── web/          → Next.js frontend (the website)
├── backend/      → FastAPI Python backend (API server)
└── mobile/       → Mobile app (future)
```

---

## How to Run (VSCode Terminal)

### Step 1 — Open the project in VSCode
Open VSCode → File → Open Folder → select `Desktop/bp&l`

You will need **two terminals** open at the same time.
In VSCode: press **Ctrl + backtick** to open terminal, click **+** for a second one.

---

### Terminal 1 — Run the Frontend (Website)

```bash
cd web
node node_modules/next/dist/bin/next dev -H 0.0.0.0
```

The website will be live at: **http://localhost:3000** (on your computer)
To view it on your phone, find your computer's IP address (e.g., `192.168.29.114`) and visit **http://192.168.29.114:3000** on your phone's browser.

> NOTE: Use `node node_modules/next/dist/bin/next dev` instead of `npm run dev`
> because the folder name has a `&` character that breaks npm scripts.

---

### Important: Mobile Next.js Security (allowedDevOrigins)
If your phone is blocked from loading the website properly (blank layout), you need to whitelist your phone's IP address in Next.js:
1. Open `web/next.config.ts`
2. Find the `allowedDevOrigins` array and add your phone's IP address (e.g., `'192.168.29.114'`).
3. Restart the frontend terminal.

---

### Terminal 2 — Run the Backend API (Optional)

The website works WITHOUT the backend (it has built-in fallbacks).
Run the backend if you want Telegram lead alerts and live data.


```bash
cd backend

# If using Command Prompt or PowerShell:
venv\Scripts\activate

# If using Git Bash (which you are currently using):
source venv/Scripts/activate

# Then start the server (use 0.0.0.0 to allow mobile phone connection):
uvicorn main:app --host 0.0.0.0 --port 8000 --reload --reload-exclude "data"
```

API will be live at: **http://localhost:8000** (and available on your local network).

If uvicorn is not installed:
```bash
pip install fastapi uvicorn httpx
```

---

## How to Change Basic Information

### Phone Number

3 places to update. Easiest way: press Ctrl+Shift+F in VSCode, search `74060 88871`, replace all.

| File | Line | What to change |
|------|------|----------------|
| web/src/components/Navbar.tsx | ~32 | href="tel:+917406088871" and Call Us button |
| web/src/components/ServicesShowcase.tsx | ~145 | href="tel:+917406088871" and CTA text |
| web/src/app/page.tsx | ~68 | Footer contact section |

---

### Email Address

| File | Line | What to change |
|------|------|----------------|
| web/src/app/page.tsx | ~69 | Footer: hari.krishna119@gmail.com |

---

### Address / Location

| File | Line | What to change |
|------|------|----------------|
| web/src/app/page.tsx | ~70 | Footer: Bangalore, Karnataka |

---

### Bank Names and Interest Rates

All bank rates and logos are now fully dynamic and controlled via the Admin Dashboard.
You do NOT need to edit the code anymore. 

Go to **http://localhost:3000/admin** to add, edit, or remove banks.
*Note: Make sure the backend server is running for this to work.*

---

### Trivia Questions (Entry Quiz)

| File | What it controls |
|------|-----------------|
| web/src/components/TriviaModal.tsx | Quiz that pops up on load (works offline, no backend needed) |
| backend/data/trivia.json | Trivia served from backend API when it is running |

---

### Logo

Replace the file at:  web/public/logo.png
Just drop your new logo file there with the same name. PNG format recommended.

---

### Page Title and SEO Description

| File | Lines | What to change |
|------|-------|----------------|
| web/src/app/page.tsx | 8-14 | title, description, keywords |
| web/src/app/layout.tsx | 11-15 | Default metadata fallback |

---

## Setting Up Telegram Alerts (Lead Notifications)

When someone submits the contact form, get an instant Telegram message.

1. Open `.env` inside the `backend/` folder
2. Add:
   TELEGRAM_BOT_TOKEN=your_bot_token_here
   TELEGRAM_CHAT_ID=your_chat_id_here
3. Get bot token: message @BotFather on Telegram, type /newbot
4. Get chat ID: message @userinfobot on Telegram

---

## Setting Up Google Sheets (Lead Database)

When someone submits the contact form, the lead is automatically saved to your Google Sheet!

1. Open `.env` inside the `backend/` folder
2. Add:
   GOOGLE_SHEET_ID=your_sheet_id_here
   GOOGLE_SHEETS_CREDENTIALS_FILE=service_account.json
3. Place your `service_account.json` file inside the `backend/` folder.
4. Open your Google Sheet and share it with the email address found inside your `service_account.json` as an **Editor**.


---

## Managing Bank Rates (Admin Dashboard)

You can add, edit, or remove banks and their interest rates directly from your browser without editing code!

1. Open **http://localhost:3000/admin** in your browser.
2. Enter the login credentials:
   - **Username:** `broshark007`
   - **Password:** `wantpappu007`
3. Click "Save Changes" after editing. The Live ROI modal and Partner Banks slider on the homepage will update instantly.

### Adding a Logo for a New Bank
1. Find a logo image for the new bank (preferably a `.png` or `.svg` with a transparent background).
2. Move the image file into the `web/public/banks/` folder.
3. In the Admin Dashboard, under "Logo Path", enter `/banks/your-file-name.png` (or whatever the file extension is).

---

## Quick Reference — File Map

| What to change | File |
|---------------|------|
| Phone number | Navbar.tsx + ServicesShowcase.tsx + page.tsx |
| Email address | web/src/app/page.tsx (footer) |
| Address | web/src/app/page.tsx (footer) |
| Logo | web/public/logo.png (replace the file) |
| Bank rates & Logos | Admin Dashboard (http://localhost:3000/admin) |
| Services list | web/src/components/ServicesShowcase.tsx |
| Home page action cards | web/src/components/HeroSection.tsx |
| EMI Calculator | web/src/components/EMICalculator.tsx |
| Trivia quiz | web/src/components/TriviaModal.tsx |
| Telegram lead alerts | backend/.env |
| Google Sheets DB | backend/.env and backend/service_account.json |
| SEO title and description | web/src/app/page.tsx (top of file) |

---

## Useful VSCode Shortcuts

| Shortcut | What it does |
|----------|-------------|
| Ctrl + Shift + F | Search across ALL files (best for finding phone/email) |
| Ctrl + H | Find and replace in current file |
| Ctrl + P | Quick open any file by name |
| Ctrl + backtick | Open terminal |
| + icon in terminal | Open a second terminal |

---

Last updated: August 2026
