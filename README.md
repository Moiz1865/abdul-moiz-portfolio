# Portfolio Website

A complete, professional full-stack developer portfolio.

## Quick Start

Open `index.html` directly in any modern browser — no build step needed.

## Customisation

| What to change | Where |
|---|---|
| Name & role | `index.html` — search `Your Name` |
| Colors | `style.css` — `:root` CSS variables at the top |
| Typed words | `script.js` — `words` array in `initTyped()` |
| Projects | `index.html` — `.project-card` blocks |
| Timeline entries | `index.html` — `.timeline-item` blocks |
| Resume PDF | Replace `assets/resume.pdf` |
| Profile photo | Replace `assets/images/profile.jpg` and update `src` on `.hero-photo` and `.about-photo` |

## Contact Form

By default the form runs in demo/simulation mode.  
To wire it to a real backend, edit the `try` block inside `initContactForm()` in `script.js`:

```js
const res = await fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, subject, message }),
});
if (!res.ok) throw new Error('Server error');
```

## Structure

```
portfolio/
├── index.html      — all 7 sections
├── style.css       — all styles + responsive
├── script.js       — all interactions
├── assets/
│   ├── images/     — add your photos here
│   └── icons/
└── README.md
```
