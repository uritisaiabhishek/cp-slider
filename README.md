# CP Slider v2

A lightweight, highly flexible JavaScript carousel component designed for seamless integration into any HTML site.

## ✨ Key Features

- **Zero Dependencies** - Pure JavaScript, no jQuery or external libraries required
- **Multiple Integration Methods** - Auto-initialization, manual setup, or programmatic control
- **Highly Configurable** - Extensive options for behavior, styling, and responsiveness
- **Responsive Design** - Automatic adaptation to different screen sizes
- **Touch & Keyboard Support** - Full accessibility and mobile interaction support
- **Event System** - Custom events for easy integration with other components
- **Theme System** - Built-in themes and easy customization
- **Modular CSS** - Non-intrusive styles that work with any design system
- **Navigation Options** - Multiple navigation layouts and pagination styles

## 🚀 Quick Start

### Method 1: Auto-Initialization (Easiest)

Just add data attributes and the slider initializes automatically:

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="cpslider-v2.css">
</head>
<body>
    <div class="cp-slider" data-cp-slider data-cp-config='{"loop": true, "autoplay": true}'>
        <div class="cp-slider-track">
            <div class="cp-slide">Slide 1</div>
            <div class="cp-slide">Slide 2</div>
            <div class="cp-slide">Slide 3</div>
        </div>
    </div>
    <script src="cpslider-v2.js"></script>
</body>
</html>
```

### Method 2: Manual Initialization (More Control)

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="cpslider-v2.css">
</head>
<body>
    <div class="my-slider">
        <div class="cp-slider-track">
            <div class="cp-slide">Slide 1</div>
            <div class="cp-slide">Slide 2</div>
            <div class="cp-slide">Slide 3</div>
        </div>
    </div>
    <script src="cpslider-v2.js"></script>
    <script>
        const slider = new CPSlider('.my-slider', {
            loop: true,
            autoplay: false,
            slidesPerView: {
                desktop: 2,
                tablet: 1,
                mobile: 1
            }
        });
    </script>
</body>
</html>
```

## ⚙️ Configuration Options

### Basic Options

```javascript
{
    loop: true,                    // Enable infinite looping
    autoplay: false,               // Enable automatic slideshow
    autoplayInterval: 3000,        // Autoplay interval in milliseconds
    slidesPerView: {
        desktop: 1,                // Slides visible on desktop (≥992px)
        tablet: 1,                 // Slides visible on tablet (≤992px)
        mobile: 1                  // Slides visible on mobile (≤576px)
    }
}
```

### Advanced Options

```javascript
{
    breakpoints: {
        mobile: 576,               // Mobile breakpoint
        tablet: 992                // Tablet breakpoint
    },
    transition: {
        duration: '1s',            // Transition duration
        easing: 'ease-in-out'      // Transition easing function
    },
    navigation: {
        show: true,                // Show navigation buttons
        prevText: '←',             // Previous button text
        nextText: '→',             // Next button text
        containerClass: 'cp-slider-nav'
    },
    pagination: {
        show: false,               // Show pagination dots
        containerClass: 'cp-slider-pagination'
    }
}
```

## 🎨 Theming & Styling

### Built-in Themes

Use data attributes for quick theming:

```html
<!-- Dark theme -->
<div class="cp-slider" data-theme="dark">...</div>

<!-- Minimal theme -->
<div class="cp-slider" data-theme="minimal">...</div>

<!-- Navigation position variants -->
<div class="cp-slider" data-nav-position="overlay">...</div>
<div class="cp-slider" data-nav-position="outside">...</div>

<!-- Size variants -->
<div class="cp-slider" data-size="sm">...</div>
<div class="cp-slider" data-size="lg">...</div>
```

### Custom CSS Integration

The CSS is designed to be non-intrusive and easily customizable:

```css
/* Override slide styles */
.cp-slider .cp-slide {
    height: 500px;
    background: linear-gradient(45deg, #667eea, #764ba2);
    border-radius: 8px;
}

/* Custom navigation styling */
.cp-slider-nav button {
    background: #3b82f6;
    border: none;
    color: white;
    border-radius: 50%;
}

/* Custom pagination */
.cp-slider-pagination-dot {
    width: 12px;
    height: 12px;
    background: #e5e7eb;
    border: none;
}
```

## 📱 Responsive Behavior

The slider automatically adapts to different screen sizes:

- **Mobile** (≤576px): Shows `slidesPerView.mobile` slides
- **Tablet** (≤992px): Shows `slidesPerView.tablet` slides  
- **Desktop** (>992px): Shows `slidesPerView.desktop` slides

## 🎯 Event System

Listen to slider events for integration:

```javascript
const slider = new CPSlider('.my-slider', options);

// Listen to slide changes
slider.container.addEventListener('cpslider:slideChange', (e) => {
    console.log('Slide changed:', e.detail);
    // e.detail.direction: 'prev', 'next', or 'goto'
    // e.detail.index: current slide index (0-based)
    // e.detail.slider: slider instance
});

// Listen to initialization
slider.container.addEventListener('cpslider:initialized', (e) => {
    console.log('Slider ready:', e.detail.slider);
});

// Listen to destruction
slider.container.addEventListener('cpslider:destroyed', (e) => {
    console.log('Slider destroyed');
});
```

## 🎮 API Methods

```javascript
const slider = new CPSlider('.my-slider', options);

// Navigation
slider.next();                    // Go to next slide
slider.prev();                    // Go to previous slide
slider.goToSlide(2);             // Go to specific slide (0-based)

// Control
slider.startAutoplay();           // Start automatic slideshow
slider.stopAutoplay();            // Stop automatic slideshow

// Configuration
slider.updateConfig({            // Update configuration
    autoplay: true,
    autoplayInterval: 2000
});

// Lifecycle
slider.destroy();                 // Destroy slider and cleanup
```

## 📁 Required HTML Structure

### Basic Structure

```html
<div class="cp-slider">
    <div class="cp-slider-track">
        <div class="cp-slide">Your content here</div>
        <div class="cp-slide">Your content here</div>
        <div class="cp-slide">Your content here</div>
    </div>
</div>
```

### Required Classes

- `.cp-slider` - Main container
- `.cp-slider-track` - Slide container (flex wrapper)
- `.cp-slide` - Individual slide items

### Custom Selectors

You can customize the selectors in the configuration:

```javascript
new CPSlider('.my-custom-slider', {
    containerSelector: '.my-custom-slider',
    slideSelector: '.my-custom-slide',
    classes: {
        container: 'my-custom-slider',
        track: 'my-custom-track',
        slide: 'my-custom-slide'
    }
});
```

## 🌟 Integration Examples

### Integration with Bootstrap

```html
<div class="carousel slide" data-ride="carousel">
    <div class="carousel-inner cp-slider" data-cp-slider>
        <div class="carousel-item cp-slide">
            <img src="slide1.jpg" class="d-block w-100" alt="Slide 1">
        </div>
        <div class="carousel-item cp-slide">
            <img src="slide2.jpg" class="d-block w-100" alt="Slide 2">
        </div>
    </div>
</div>
```

### Integration with Tailwind CSS

```html
<div class="relative overflow-hidden rounded-lg shadow-lg cp-slider" data-cp-slider>
    <div class="flex cp-slider-track">
        <div class="w-full flex-shrink-0 cp-slide bg-gradient-to-r from-blue-500 to-purple-600 h-96 flex items-center justify-center text-white text-2xl font-bold">
            Slide 1
        </div>
        <div class="w-full flex-shrink-0 cp-slide bg-gradient-to-r from-green-500 to-teal-600 h-96 flex items-center justify-center text-white text-2xl font-bold">
            Slide 2
        </div>
    </div>
</div>
```

### Integration with React/Vue

```javascript
// React example
import { useEffect, useRef } from 'react';

function MySlider() {
    const sliderRef = useRef();
    
    useEffect(() => {
        const slider = new CPSlider(sliderRef.current, {
            loop: true,
            autoplay: true
        });
        
        return () => slider.destroy();
    }, []);
    
    return (
        <div ref={sliderRef} className="cp-slider">
            <div className="cp-slider-track">
                <div className="cp-slide">Slide 1</div>
                <div className="cp-slide">Slide 2</div>
            </div>
        </div>
    );
}
```

## 📦 File Structure

```
cp-slider/
├── cpslider-v2.js           # Main slider JavaScript (v2)
├── cpslider-v2.css          # Modular CSS styles (v2)
├── example-v2.html          # Integration examples
├── cpslider.js              # Original version (legacy)
├── cpslider.css             # Original CSS (legacy)
├── cpslider.scss            # SCSS source
├── index.html               # Original example
└── README.md                # This documentation
```

## 🔄 Migration from v1

If you're upgrading from the original version:

1. **Update HTML structure**: Change `.simple-carosal` to `.cp-slider`, `.carosal` to `.cp-slider-track`, and `.item` to `.cp-slide`
2. **Update CSS**: Include `cpslider-v2.css` instead of `cpslider.css`
3. **Update JavaScript**: Use `cpslider-v2.js` and the new API
4. **Update initialization**: Replace `cpcarosel()` with `new CPSlider()`

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- iOS Safari 12+
- Android Chrome 60+

## ♿ Accessibility

- Full keyboard navigation (Arrow keys)
- Screen reader support with ARIA labels
- Touch/swipe support on mobile devices
- Focus management for navigation controls
- Respects `prefers-reduced-motion`

## 🐛 Known Issues

- None in v2 - all v1 issues have been resolved
- Non-looping mode now works correctly
- Autoplay works in both loop and non-loop modes

## 📄 License

MIT License - feel free to use in personal and commercial projects.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue for bugs and feature requests.