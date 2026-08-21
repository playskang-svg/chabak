const fs = require('fs');
let css = fs.readFileSync('src/custom.css', 'utf8');
css = css.replace('transform: translateY(100%);', 'transform: translateY(100vh); opacity: 0; pointer-events: none;');
css = css.replace('.map-container.mobile-visible {', '.map-container.mobile-visible {\n    transform: translateY(0);\n    opacity: 1;\n    pointer-events: auto;');
fs.writeFileSync('src/custom.css', css);
