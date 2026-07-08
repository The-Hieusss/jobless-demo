<div align="center">

# 💼 Jobless

### Swipe right on your next career move

*A Tinder-style matching platform that connects students and recruiters — because job hunting shouldn't feel like shouting into the void.*

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

![Status](https://img.shields.io/badge/status-demo-blue?style=flat-square)
![Platform](https://img.shields.io/badge/platform-web-lightgrey?style=flat-square)

</div>

---

## 💡 The idea

Job boards are broken in both directions: students blast out hundreds of applications that nobody reads, and recruiters drown in résumés from candidates who never wanted the role in the first place.

**Jobless flips the model.** Both sides build a profile, both sides swipe, and a conversation only starts when there's **mutual interest** — the same mechanic that made modern dating apps work, applied to early-career hiring.

## ✨ Features

### 🎴 The swipe experience

| | |
|---|---|
| ▪ | **SwipeDeck** — card-based discovery of candidates/roles with smooth gesture interactions |
| ▪ | **Match banner** — instant celebration moment when interest is mutual |
| ▪ | **Discover** — browse and filter beyond the deck |

### 👥 Two-sided onboarding

| | |
|---|---|
| ▪ | **Role selection** — join as a **Student** or a **Recruiter**, each with a tailored flow |
| ▪ | **Student form** — skills, interests, and goals, not just a résumé dump |
| ▪ | **Recruiter form** — what the role actually needs |
| ▪ | **Post-signup screen** — guided next steps so nobody lands on an empty feed |

### 💬 After the match

| | |
|---|---|
| ▪ | **Chat rooms** — real conversations, scoped to each match |
| ▪ | **Chat station** — one inbox for every active conversation |
| ▪ | **Network** — your growing web of professional connections |
| ▪ | **RSVP** — event pages for recruiting sessions and meetups |

## 🏗️ Project structure

```
src/
├── pages/
│   ├── SplashScreen.tsx      # Branded entry
│   ├── LandingPage.tsx       # Value prop + CTA
│   ├── RoleSelection.tsx     # Student ⇄ Recruiter fork
│   ├── StudentForm.tsx       # Student onboarding
│   ├── RecruiterForm.tsx     # Recruiter onboarding
│   ├── SwipeDeck.tsx         # ❤️ The core loop
│   ├── MatchBanner.tsx       # Mutual-match moment
│   ├── Discover.tsx          # Browse & filter
│   ├── ChatRoom.tsx          # Per-match messaging
│   ├── ChatStation.tsx       # Unified inbox
│   ├── Network.tsx           # Connections graph
│   ├── RSVPPage.tsx          # Recruiting events
│   └── Profile.tsx           # Editable profiles
├── components/               # Layout & shared UI
├── utils/                    # Helpers
└── assets/                   # Brand assets
```

**Stack:** React + TypeScript on Vite for instant HMR and fast builds — the right weight for a product demo that needs to feel native-smooth in the browser.

## 🚀 Getting started

```bash
git clone https://github.com/The-Hieusss/jobless-demo.git
cd jobless-demo
npm install
npm run dev   # http://localhost:5173
```

## 🧭 Roadmap

| | |
|---|---|
| ⬜ | Backend + persistence (auth, matches, messages) |
| ⬜ | Recommendation engine for smarter deck ordering |
| ⬜ | In-app scheduling for interviews |
| ⬜ | Mobile app wrapper |

---

<div align="center">

**Built by a student team that's lived the problem** 🎓

[Hieu](https://github.com/The-Hieusss) · [Keshava Olagappaa Subramanian](https://www.linkedin.com/in/keshava-olagappaa/)

</div>
