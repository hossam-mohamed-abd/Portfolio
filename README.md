# Portfolio Website

A modern, responsive personal portfolio website for Hossam Mohamed, an Angular Frontend Developer passionate about building scalable web applications.

## Features

- **Interactive Hero Section**
  - Animated 3D globe background using Vanta.js + Three.js
  - Typing animation with Typed.js
  - Smooth scroll navigation
  - Gradient text effects

- **Skills Section**
  - Comprehensive tech stack showcase
  - Color-coded skill badges
  - Organized by category (Languages, Frontend, Backend, Cloud, Security, Data)

- **About Section**
  - Professional profile overview
  - Education and experience highlights
  - Interactive hover cards

- **Projects Section**
  - Responsive project cards
  - Image sliders for select projects
  - GitHub integration
  - Technology tags

- **Contact Section**
  - Functional contact form (powered by Formspree)
  - Social media links
  - Contact information display

- **Additional Features**
  - Responsive design (mobile, tablet, desktop)
  - Back-to-top button
  - Navbar with animated highlight effect
  - Scroll spy navigation
  - SEO optimized with meta tags
  - Social media sharing (Open Graph, Twitter Cards)

## Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Styling and animations
- **JavaScript (ES6+)** - Interactive functionality
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **Three.js** - 3D graphics library
- **Vanta.js** - Animated backgrounds
- **Typed.js** - Typing animation
- **GSAP** - Professional animation library
- **Font Awesome** - Icon library

## Project Structure

```
protofolio/
│
├── index.html          # Main portfolio page
├── thank-you.html      # Form submission confirmation page
├── README.md           # Project documentation
│
├── css/
│   └── style.css       # Custom styles
│
├── js/
│   └── script.js       # Interactive functionality
│
└── assets/
    ├── images/         # Project screenshots and profile images
    └── cv/             # Resume/CV file
```

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, but recommended)

### Installation

1. **Clone or download** the repository:
   ```bash
   git clone <repository-url>
   cd protofolio
   ```

2. **Open the website**:
   - Simply open `index.html` in your web browser, OR
   - Use a local server for better development experience:
     ```bash
     # Using Python 3
     python -m http.server 8000

     # Using Node.js (if you have http-server installed)
     npx http-server
     ```

3. **Access the site**:
   - Navigate to `http://localhost:8000` in your browser

## Customization

### Personal Information

To customize this portfolio for your own use:

1. **Update Personal Details** in `index.html`:
   - Name: Search for "Hossam Mohamed"
   - Description: Update meta description and hero section
   - Contact info: Email, phone, location in the contact section

2. **Update Links**:
   - Social media URLs in the hero and footer sections
   - GitHub repository links in the projects section
   - CV file path in the hero section

3. **Update Projects**:
   - Replace project images in `assets/images/`
   - Update project descriptions and tech stack tags
   - Change GitHub links to your own repositories

4. **Contact Form**:
   - Replace the Formspree form ID (`mzdavrrz`) with your own:
     ```html
     <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
     ```
   - Create a free account at [formspree.io](https://formspree.io) to get your form ID

5. **Images**:
   - Profile image: `assets/images/image3.png`
   - Project images: Organized in folders under `assets/images/`
   - Favicon: `assets/images/favicon.ico`

### Styling

- **Tailwind CSS**: Configured via CDN - no build step required
- **Custom styles**: Edit `css/style.css` for additional customizations
- **Color scheme**: Purple/blue gradient theme - modify Tailwind classes in HTML

### Scripts

All interactive features are in `js/script.js`:
- Navbar behavior and highlight effect
- Vanta.js globe configuration
- Typed.js configuration
- Image sliders for projects

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Lightweight CDN libraries
- Lazy loading for images
- Optimized CSS with Tailwind
- Minimal JavaScript for fast loading

## Social Links

- [GitHub](https://github.com/hossam-mohamed-abd)
- [LinkedIn](https://www.linkedin.com/in/hossam-mohamed-abd/)
- [Facebook](https://www.facebook.com/Hossam2512es)
- [X (Twitter)](https://x.com/Hosam545Mohamed)
- [Reddit](https://www.reddit.com/user/AlarmingTomato968)
- [Instagram](https://www.instagram.com/hossam_mohamed_abd)
- [Threads](https://www.threads.net/@hossam_mohamed_abd)

## License

This project is open source and available for personal use.

## Credits

- **Design & Development**: Hossam Mohamed
- **Libraries**: Three.js, Vanta.js, Typed.js, GSAP, Tailwind CSS, Font Awesome
- **Fonts**: Poppins (Google Fonts)
- **Form Handling**: Formspree

---

**Note**: This portfolio is actively maintained and showcases the latest projects and skills. For collaboration or inquiries, use the contact form or reach out via the provided social links.
