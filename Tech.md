# Damian Portfolio

A static, multi-page developer portfolio for Phung Cam Tan, also known as Damian. It presents profile information, skills, resume content, a portfolio project, future work and product updates, and contact details through a responsive neon, glassmorphism, and terminal-inspired interface.

The project uses plain HTML, modular CSS, Vanilla JavaScript, and Bootstrap 5.3.8 from a CDN. It requires no package manager or build process.

## Features

- Seven-page static portfolio, including a custom 404 page
- Responsive layouts built on Bootstrap Grid
- Floating desktop sidebar and Bootstrap Offcanvas mobile navigation
- Custom Damian neon and glassmorphism theme
- Reusable animated card accent with progressive CSS-mask enhancement
- Featured Work and Product sections with an infinite three-group marquee
- Position-aware CSS 3D depth and Pointer Events drag-to-explore interaction
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
| Vanilla JavaScript | Loader, typing, navigation, carousel depth/drag, particles, and cursor behavior |
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
- `carousel-depth.js` — Featured marquee depth, drag state, and lifecycle coordination
- `loader.js` — loading screen and visit-session handling
- `typing.js` — terminal typing sequence
- `navigation.js` — active navigation state and Offcanvas cleanup
- `particles.js` — canvas particle background
- `cursor.js` — custom pointer behavior
- `reveal.js` — future-ready reveal observer; currently not loaded by a page

### Interactive Home Architecture

The desktop shell uses shared sidebar width, viewport-gap, content-gap, and content-width tokens. The sidebar is a rounded floating panel with viewport-relative height and internal scrolling; below Bootstrap's `lg` breakpoint it is replaced by the existing Offcanvas navigation.

The reusable `card-hover-accent` component owns card lift, glow, and the progressively enhanced animated border. Unsupported mask composition retains the normal glass border and card content.

Home Featured sections use four source cards and three visual groups:

```text
Previous Clone | Accessible Original | Next Clone
```

Carousel transforms have separate ownership:

- `.featured-track` — linear automatic marquee translation
- `.featured-drag-offset` — normalized manual horizontal offset
- `.featured-item` — positional `rotateY`, `translateZ`, and scale
- `.work-card.card-hover-accent` — card hover and focus treatment

`carousel-depth.js` coordinates depth and drag through one `requestAnimationFrame` loop. Geometry references are cached, reads precede style writes, `IntersectionObserver` limits offscreen work, and `animationiteration` forces seam synchronization. Pointer Events support mouse, touch, and pen; horizontal drag uses pointer capture while `touch-action: pan-y` preserves vertical page scrolling.

Only the middle group is exposed to assistive technology. Both visual clones are `aria-hidden`, contain no focusable controls, and remain pointer surfaces for hover and drag. Keyboard focus pauses the marquee. Reduced-motion mode keeps the original cards in a static grid and does not initialize marquee depth or drag listeners.

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
│   │   ├── carousel-depth.js
│   │   ├── loader.js
│   │   ├── typing.js
│   │   ├── navigation.js
│   │   ├── particles.js
│   │   ├── cursor.js
│   │   └── reveal.js
│   └── images/
│       └── avatar-placeholder.jpg
├── README.md
└── Tech.md
```

## Pages

| Page     | Purpose                                                         |
| -------- | --------------------------------------------------------------- |
| Home     | Profile/About overview, terminal, Featured Work, and Featured Products |
| About    | Biography and skills                                            |
| Resume   | Education and experience timeline                               |
| Works    | Portfolio Website and future project updates                    |
| Products | Future product updates                                          |
| Contact  | Contact information and a prepared message-form interface       |
| 404      | Custom not-found page                                           |

## Accessibility and Motion

The source includes skip navigation links, semantic main landmarks, visible keyboard focus styles, accessible form labels, decorative-icon handling, and reduced-motion behavior.

When reduced motion is requested, terminal content is rendered without typing animation, particles become a static scene, the custom cursor falls back to the native pointer, Featured cards use a static grid without clones, 3D, or drag, and non-essential card motion is removed. These features provide an accessibility foundation; they are not a claim of full WCAG conformance.

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

The supplied public Portfolio Website URL is `https://phungcamtann.github.io/PhungCamTann/`. Provider-specific configuration is not included. Confirm the final production domain before adding canonical metadata, and configure the selected host to use `page/404.html` as its custom not-found page if required.

## Known Content TODO

- Production domain and canonical URLs
- Approved favicon or brand icon
- Approved social-sharing preview image
- Real LinkedIn profile URL
- Downloadable CV PDF
- Contact form backend, provider, or endpoint
- Future project and product content or imagery

The Contact form is intentionally disabled until a submission backend is supplied. No working form submission or downloadable CV is claimed.
