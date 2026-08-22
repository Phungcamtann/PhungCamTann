# Damian Portfolio

A static, multi-page developer portfolio for Phung Cam Tan, also known as Damian. It presents profile information, skills, resume content, selected works, product concepts, and contact details through a responsive neon, glassmorphism, and terminal-inspired interface.

The project uses plain HTML, modular CSS, Vanilla JavaScript, and Bootstrap 5.3.8 from a CDN. It requires no package manager or build process.

## Features

- Seven-page static portfolio, including a custom 404 page
- Responsive layouts built on Bootstrap Grid
- Fixed desktop sidebar and Bootstrap Offcanvas mobile navigation
- Custom Damian neon and glassmorphism theme
- Session-aware Home loading screen
- Animated terminal typing sequence
- Canvas particle network background
- Custom cursor for supported fine-pointer devices
- Skip links, visible keyboard focus states, and labelled form controls
- Reduced-motion alternatives for animated features

## Tech Stack

| Technology         | Usage                                                      |
| ------------------ | ---------------------------------------------------------- |
| HTML5              | Multi-page structure and semantic content                  |
| CSS3               | Damian theme, components, animations, and responsive rules |
| Vanilla JavaScript | Loader, typing, navigation, particles, and cursor behavior |
| Bootstrap 5.3.8    | Reboot foundation, responsive Grid, and mobile Offcanvas   |
| Font Awesome 6.4.0 | Interface icons                                            |
| Inter              | Main interface typography                                  |
| JetBrains Mono     | Terminal and heading typography                            |

Bootstrap, Font Awesome, and Google Fonts are loaded from external CDNs.

## Architecture

CSS loads in this order:

1. External fonts and icons
2. Bootstrap 5.3.8
3. Damian custom styles

The custom styles are separated by responsibility:

- `variables.css` — design tokens
- `base.css` — document-level defaults
- `sidebar.css` — desktop navigation and mobile Offcanvas styling
- `layout.css` — shared page layout
- `components.css` — reusable Damian components
- `animations.css` — animation and reduced-motion rules
- `pages.css` — page-specific styles
- `responsive.css` — responsive adjustments

JavaScript uses classic scripts with feature-specific responsibilities:

- `main.js` — Home initialization orchestration
- `loader.js` — loading screen and visit-session handling
- `typing.js` — terminal typing sequence
- `navigation.js` — active navigation state and Offcanvas cleanup
- `particles.js` — canvas particle background
- `cursor.js` — custom pointer behavior
- `reveal.js` — future-ready reveal observer; currently not loaded by a page

## Project Structure

```text
.
├── index.html
├── page/
│   ├── about.html
│   ├── resume.html
│   ├── works.html
│   ├── products.html
│   ├── contact.html
│   └── 404.html
├── assets/
│   ├── css/
│   │   ├── variables.css
│   │   ├── base.css
│   │   ├── sidebar.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   ├── animations.css
│   │   ├── pages.css
│   │   └── responsive.css
│   ├── js/
│   │   ├── main.js
│   │   ├── loader.js
│   │   ├── typing.js
│   │   ├── navigation.js
│   │   ├── particles.js
│   │   ├── cursor.js
│   │   └── reveal.js
│   └── images/
│       └── avatar-placeholder.jpg
└── README.md
```

## Pages

| Page     | Purpose                                                         |
| -------- | --------------------------------------------------------------- |
| Home     | Profile card, personal introduction, social links, and terminal |
| About    | Biography and skills                                            |
| Resume   | Education and experience timeline                               |
| Works    | Selected project cards                                          |
| Products | Product and developer-tool concepts                             |
| Contact  | Contact information and a prepared message-form interface       |
| 404      | Custom not-found page                                           |

## Accessibility and Motion

The source includes skip navigation links, semantic main landmarks, visible keyboard focus styles, accessible form labels, decorative-icon handling, and reduced-motion behavior.

When reduced motion is requested, terminal content is rendered without typing animation, particles become a static scene, the custom cursor falls back to the native pointer, and non-essential motion is reduced. These features provide an accessibility foundation; they are not a claim of full WCAG conformance.

## Running Locally

No installation or build step is required. Clone the repository and enter the project directory:

```bash
git clone https://github.com/Phungcamtann/PhungCamTann.git
cd PhungCamTann
```

You can open `index.html` directly in a browser. For a local HTTP environment, use any static file server. For example, if Python is available:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`. Internet access is required for Bootstrap, Font Awesome, and Google Fonts.

## Deployment

The project can be published on a static host by preserving the directory structure and serving `index.html` as the entry point. Relative page and asset paths support deployment under a repository subpath.

No live deployment URL or provider-specific configuration is currently documented. Before deployment, provide the production domain for canonical metadata and configure the selected host to use `page/404.html` as its custom not-found page if required.

## Known Content TODO

- Production domain and canonical URLs
- Approved favicon or brand icon
- Approved social-sharing preview image
- Real LinkedIn profile URL
- Verified Works detail, source, and demo URLs
- Verified Product repository or download URLs
- Downloadable CV PDF
- Contact form backend, provider, or endpoint
- Final Resume dates, institutions, client or company details, and descriptions
- Final project and product imagery

The Contact form is intentionally disabled until a submission backend is supplied. No live deployment, working form submission, downloadable CV, or external project destination is claimed.
