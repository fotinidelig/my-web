# 🧭 Personal Portfolio Website — Project Requirements

**Role:** You are an expert front-end and back-end developer helping to build a personal portfolio website using Astro, React, and Tailwind CSS.  
**Goal:** Create the initial project structure and all main sections of the site with clear, maintainable code.

---

## 🧠 Project Overview
The website is a **personal portfolio** showcasing my professional and creative identity.  
It should feel **artistic, elegant, modern, and minimal**, with smooth scrolling and intuitive navigation.  
Visitors should quickly understand who I am, what I do, and what I’ve built.  

The site will later include dynamic or data-driven projects (e.g., Quarto visualizations), but the current version should remain simple, clean, and extensible.

---

## 🏗️ Type of Project
- **Type:** Personal portfolio website  
- **Nature:** Static site with dynamic front-end components  
- **Purpose:** To present my profile, projects, skills, and gallery  
- **Audience:** Recruiters, collaborators, and creative tech professionals  

---

## ⚙️ Tech Stack and Skills

| Category | Tool / Framework | Purpose |
|-----------|------------------|----------|
| **Site Framework** | Astro | Main static site generator for fast performance |
| **Frontend Library** | React | Used for dynamic, interactive components |
| **Styling** | Tailwind CSS | Utility-first, responsive design |
| **Content Format** | Markdown / JSON | To store project and gallery data |
| **Version Control** | Git | For commits, versioning, and collaboration |
| **Future Backend (optional)** | Python (FastAPI) or Node.js | For future dynamic features |

> Cursor should **use Git for versioning**, commit regularly (after confirmation), and **ask before creating or pushing** major changes or milestones.

---

## 🌐 Key Features

1. **Single-Page Scroll Layout**
   - Fixed top navigation bar  
   - Smooth transitions between sections  
   - Clean and minimal section separation
   - Switch light/dark mode

2. **Sections**
   - **Intro / Hero** — Name, tagline, photo or logo  
   - **About Me** — Short career summary or horizontal timeline, interactive and visual
   - **Projects** — Responsive grid of expandable cards (React)
   - **Skills** — Bubble or bar-style visualization of proficiency  
   - **Gallery** — Small preview grid on homepage linking to `/gallery`  
   - **Contact** — Only email address and social media links (no form)  
   - **Footer** — Simple and playful  

3. **Interactions**
   - Smooth scrolling between anchors  
   - Hover and fade effects  
   - Expandable project cards  
   - Subtle animation on skill bubbles  

---

## 🎨 Styling (Initial)
- **Aesthetic:** Artistic, elegant, modern, minimal  
- **Tone:** Professional yet playful  
- **Font and Color Palette:** Primary Accent Colors (#C55D81, #46B49A, #EAA57D), Font Cabin from Google Fonts
- **Gradient for background elements (for later use):**
    background-image: linear-gradient(to right top, #c55d81, #ca6a5f, #bc7f49, #a09449, #7da562, #7caa6b, #7ab074, #79b57e, #9ab36f, #b9af6a, #d4aa6e, #eaa57d);
- **Responsive:** Mobile, tablet, desktop  

---

## 🧱 Functional Goals
- Fully responsive layout  
- Easily updatable content (Markdown/JSON)  
- Clear, modular file structure  
- Semantic HTML and accessibility compliance  
- Scalability for future pages and backend integration  

---

## 🚀 Deliverables
1. Create a working Astro + React + Tailwind setup.  
2. Scaffold all sections and routes (`index.astro`, `/gallery`).  
3. Add placeholder content and basic layout.  
4. Include comments explaining structure and files.  
5. Configure for **local development** (`npm run dev`).  
6. Enable **Git version control**, commit after milestones, and push to a GitHub repository.  

---

## 🏁 Optional Enhancements
- Add smooth-scroll JS behavior between sections.  
- Add fade-in effects on scroll.  
- Use dummy JSON data for projects and skills.  
- Prepare structure for later Quarto integration.

---

**Once complete**, Cursor should show me:
- The generated folder structure  
- How to run the website locally  
- Where to edit content (projects, skills, gallery)

