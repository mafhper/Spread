# Spread

A web application for creating elegant link visualizations with complete customization of colors, gradients, and layouts.

[![Deploy](https://github.com/mafhper/spread/actions/workflows/deploy.yml/badge.svg)](https://github.com/mafhper/spread/actions/workflows/deploy.yml)
[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://mafhper.github.io/spread)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Overview

Spread is a client-side web application that generates visual cards from URLs by extracting Open Graph metadata and providing extensive customization options. The application operates entirely in the browser without requiring a backend server, making it fast, private, and deployable as a static site.

**Live Demo:** [https://mafhper.github.io/spread](https://mafhper.github.io/spread)

## Features

### Core Functionality
- **Automatic Metadata Extraction**: Fetches Open Graph metadata from any URL using the Microlink API
- **Intelligent Color Assistant**: Extracts dominant colors from images and generates color harmonies (analogous, triadic, split-complementary, monochromatic)
- **Predefined Themes**: Four curated themes (Sunset, Ocean, Forest, Neon) with unique gradient configurations
- **Complete Customization**: Control over gradients, border radius, padding, opacity, and font sizes
- **Adaptive Templates**: Three template types that automatically adapt based on content type (music, news, default)
- **High-Quality Export**: PNG export at 2x pixel ratio with intelligent filename generation
- **Platform Icons**: Integrated SVG icons for major music platforms (YouTube Music, Spotify, Bandcamp, SoundCloud, Apple Music, Deezer)

### Technical Characteristics
- **100% Client-Side**: No backend required, all processing happens in the browser
- **Privacy-Focused**: No data is stored or transmitted except to the Microlink API for metadata extraction
- **Offline-Capable**: Once loaded, the application can work offline (except for fetching new URLs)
- **Responsive Design**: Fully responsive interface built with Tailwind CSS
- **Modern Web Standards**: Uses native browser APIs (Canvas API, Clipboard API, Fetch API)

## How It Works

### Architecture

The application follows a single-page architecture with the following workflow:

```
User Input (URL) → Metadata Extraction → Image Processing → UI Rendering → Customization → Export
```

### Processing Pipeline

#### 1. URL Input and Validation
```javascript
// User enters URL
Input: https://music.youtube.com/watch?v=example

// Validation
- Checks for http:// or https:// protocol
- Validates URL format
```

#### 2. Metadata Extraction

**Primary Method (Microlink API):**
```javascript
// Fetch metadata via Microlink API
GET https://api.microlink.io/?url={encoded_url}

// Response includes:
- title: Page title
- description: Meta description
- image: Open Graph image
- author: Content author (if available)
- logo: Site favicon
```

**Fallback for YouTube Music:**
```javascript
// If Microlink returns generic data, use YouTube oEmbed API
GET https://www.youtube.com/oembed?url={video_url}&format=json

// Extracts:
- title: Video title (usually "Artist - Song")
- author_name: Channel name
- thumbnail_url: Video thumbnail
```

#### 3. Image Processing

**Base64 Conversion:**
```javascript
// Convert remote images to Base64 for export
fetch(imageUrl) → Blob → FileReader → Base64 Data URI

// Ensures images are embedded in final export
```

**Color Extraction:**
```javascript
// Using Color Thief library
1. Load image into canvas
2. Extract color palette (3 colors)
3. Identify dominant and secondary colors
4. Convert RGB to HEX format
```

#### 4. Template Selection

**Logic:**
```javascript
if (domain.includes('music.youtube.com') || domain.includes('spotify.com')) {
  // Music Template
  - Display platform icon
  - Parse "Artist - Song" format
  - Show artist and title separately
}
else if (author && description) {
  // News Template
  - Display headline
  - Show author attribution
  - Include description
}
else {
  // Default Template
  - Display title
  - Show description
}
```

#### 5. Color Harmonies

**Algorithm:**
```javascript
// Using TinyColor library
Dominant Color (RGB) → HSL Conversion

Harmony Types:
- Analogous: ±30° on color wheel
- Triadic: 120° intervals on color wheel
- Split-Complementary: 180° ± 30°
- Monochromatic: Same hue, different saturation/lightness
```

#### 6. Export Process

**Image Generation:**
```javascript
// Using html-to-image library
1. Select DOM node (gradient background + card)
2. Convert to Canvas using html2canvas algorithm
3. Export Canvas to PNG Data URI
4. Trigger download with generated filename

// Filename generation:
"artist-name_song-title.png"
// Sanitized: lowercase, no special chars, underscores for spaces
```

## Technology Stack

### Frontend Framework
- **Astro 5.15.8**: Static site generator with partial hydration
  - Zero JavaScript by default
  - Component-based architecture
  - Optimized build output

### Styling
- **Tailwind CSS 4.1.17**: Utility-first CSS framework
  - Custom color palette
  - Responsive design utilities
  - Dark theme support

### Core Libraries

**Image Processing:**
- **html-to-image 1.11.11**: DOM to image conversion
  - Canvas-based rendering
  - High-quality PNG export
  - Configurable pixel ratio

**Color Manipulation:**
- **Color Thief 2.3.0**: Dominant color extraction
  - K-means clustering algorithm
  - Palette generation
  - Cross-browser compatible

- **TinyColor 1.6.0**: Color manipulation and conversion
  - Color space conversions (RGB, HSL, HEX)
  - Color harmony generation
  - Brightness/saturation adjustments

**API Integration:**
- **Microlink API**: Metadata extraction service
  - Open Graph protocol support
  - Screenshot generation
  - Timeout handling (15s)

### Build Tools
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type checking and IntelliSense
- **PostCSS**: CSS processing pipeline

## Installation and Development

### Prerequisites
```bash
Node.js >= 20.0.0
npm >= 10.0.0
```

### Setup
```bash
# Clone repository
git clone https://github.com/mafhper/spread.git
cd spread

# Install dependencies
npm install

# Start development server
npm run dev
# Server runs at http://localhost:4321

# Build for production
npm run build
# Output in ./dist directory

# Preview production build
npm run preview
```

### Project Structure
```
spread/
├── src/
│   ├── pages/
│   │   └── index.astro          # Main application page
│   └── styles/
│       └── global.css           # Global styles
├── public/
│   ├── spread.js                # Main application logic
│   ├── favicon.svg              # Site favicon
│   └── favicon.ico              # Fallback favicon
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Actions workflow
├── astro.config.mjs             # Astro configuration
├── tailwind.config.js           # Tailwind configuration
└── package.json                 # Dependencies and scripts
```

## Deployment

### GitHub Pages Configuration

The project is configured for automatic deployment to GitHub Pages via GitHub Actions.

**Configuration in `astro.config.mjs`:**
```javascript
export default defineConfig({
  site: 'https://mafhper.github.io',
  base: '/spread',
  // ...
});
```

**Deployment Workflow:**
1. Push to `main` branch triggers GitHub Actions
2. Workflow installs dependencies and builds project
3. Build artifacts uploaded to GitHub Pages
4. Site deployed automatically

**Manual Deployment:**
```bash
# Build locally
npm run build

# Deploy dist/ directory to hosting service
```

## Browser Compatibility

- **Chrome/Edge**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support (iOS 14+)
- **Opera**: Full support

**Required Browser Features:**
- ES6+ JavaScript
- Canvas API
- Fetch API
- Clipboard API (for copy functionality)
- CSS Grid and Flexbox

## Performance Characteristics

- **Initial Load**: ~200KB (gzipped)
- **Time to Interactive**: <2s on 3G
- **Metadata Fetch**: 1-3s (depends on Microlink API)
- **Image Export**: <1s for typical card
- **Memory Usage**: ~50MB (includes image processing)

## API Rate Limits

**Microlink API (Free Tier):**
- 50 requests per day per IP
- 15-second timeout per request
- No authentication required

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Author

**mafhper**
- GitHub: [@mafhper](https://github.com/mafhper)
- Project: [https://github.com/mafhper/spread](https://github.com/mafhper/spread)

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Build with ❤️ using Astro**
