/**
 * Interactive demo functionality for ts-ascii-engine documentation
 */

import { AsciiGenerator, CharsetPreset } from '../dist-esm/index.js';

// Global state
let generator = new AsciiGenerator({
  charset: CharsetPreset.STANDARD,
  width: 100,
  colored: false,
  inverted: false
});

let currentImage = null;

// Sample image generators
function createLandscapeSample() {
  const canvas = document.createElement('canvas');
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  // Sky gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, 400);
  skyGradient.addColorStop(0, '#1e3a5f');
  skyGradient.addColorStop(0.5, '#4a90e2');
  skyGradient.addColorStop(1, '#87CEEB');
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, 800, 400);

  // Sun
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(650, 150, 60, 0, Math.PI * 2);
  ctx.fill();

  // Sun glow
  const sunGlow = ctx.createRadialGradient(650, 150, 60, 650, 150, 100);
  sunGlow.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
  sunGlow.addColorStop(1, 'rgba(255, 215, 0, 0)');
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(650, 150, 100, 0, Math.PI * 2);
  ctx.fill();

  // Mountains
  ctx.fillStyle = '#2C3E50';
  ctx.beginPath();
  ctx.moveTo(0, 400);
  ctx.lineTo(200, 250);
  ctx.lineTo(400, 350);
  ctx.lineTo(600, 200);
  ctx.lineTo(800, 380);
  ctx.lineTo(800, 400);
  ctx.closePath();
  ctx.fill();

  // Mountain highlights
  ctx.fillStyle = '#34495E';
  ctx.beginPath();
  ctx.moveTo(200, 250);
  ctx.lineTo(250, 280);
  ctx.lineTo(300, 330);
  ctx.lineTo(400, 350);
  ctx.closePath();
  ctx.fill();

  // Ground
  const groundGradient = ctx.createLinearGradient(0, 400, 0, 600);
  groundGradient.addColorStop(0, '#27AE60');
  groundGradient.addColorStop(0.5, '#229954');
  groundGradient.addColorStop(1, '#145A32');
  ctx.fillStyle = groundGradient;
  ctx.fillRect(0, 400, 800, 200);

  // Trees
  for (let i = 0; i < 8; i++) {
    const x = 100 + i * 100;
    const y = 500;

    // Tree trunk
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x - 10, y, 20, 60);

    // Tree foliage
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(x, y, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x - 15, y - 10, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 15, y - 10, 25, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas.toDataURL();
}

function createPortraitSample() {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const bgGradient = ctx.createRadialGradient(300, 300, 50, 300, 400, 500);
  bgGradient.addColorStop(0, '#FFFFFF');
  bgGradient.addColorStop(0.5, '#E8E8E8');
  bgGradient.addColorStop(1, '#CCCCCC');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, 600, 800);

  // Face
  ctx.fillStyle = '#FFE4C4';
  ctx.beginPath();
  ctx.ellipse(300, 350, 150, 180, 0, 0, Math.PI * 2);
  ctx.fill();

  // Hair
  ctx.fillStyle = '#4A3728';
  ctx.beginPath();
  ctx.ellipse(300, 280, 160, 120, 0, 0, Math.PI);
  ctx.fill();

  // Eyes
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.ellipse(250, 320, 25, 30, 0, 0, Math.PI * 2);
  ctx.ellipse(350, 320, 25, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupils
  ctx.fillStyle = '#2C3E50';
  ctx.beginPath();
  ctx.arc(250, 325, 12, 0, Math.PI * 2);
  ctx.arc(350, 325, 12, 0, Math.PI * 2);
  ctx.fill();

  // Eye highlights
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(245, 320, 5, 0, Math.PI * 2);
  ctx.arc(345, 320, 5, 0, Math.PI * 2);
  ctx.fill();

  // Nose
  ctx.strokeStyle = '#D4A574';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(300, 340);
  ctx.lineTo(290, 380);
  ctx.arc(295, 385, 5, Math.PI, 0);
  ctx.stroke();

  // Mouth (smile)
  ctx.strokeStyle = '#C97064';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(300, 380, 60, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.stroke();

  // Eyebrows
  ctx.strokeStyle = '#4A3728';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(220, 290);
  ctx.quadraticCurveTo(250, 280, 280, 285);
  ctx.moveTo(320, 285);
  ctx.quadraticCurveTo(350, 280, 380, 290);
  ctx.stroke();

  // Shoulders
  ctx.fillStyle = '#3498DB';
  ctx.beginPath();
  ctx.moveTo(150, 530);
  ctx.quadraticCurveTo(300, 550, 450, 530);
  ctx.lineTo(450, 800);
  ctx.lineTo(150, 800);
  ctx.closePath();
  ctx.fill();

  // Neck
  ctx.fillStyle = '#FFE4C4';
  ctx.fillRect(250, 500, 100, 50);

  return canvas.toDataURL();
}

function createPatternSample() {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 600;
  const ctx = canvas.getContext('2d');

  const size = 30;
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];

  for (let y = 0; y < 600; y += size) {
    for (let x = 0; x < 600; x += size) {
      const colorIndex = ((x / size) + (y / size)) % colors.length;
      ctx.fillStyle = colors[colorIndex];
      ctx.fillRect(x, y, size, size);

      // Add some variation
      const brightness = Math.sin((x + y) / 50) * 30;
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness > 0 ? brightness / 150 : 0})`;
      ctx.fillRect(x, y, size, size);

      // Circles
      if ((x / size + y / size) % 2 === 0) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.beginPath();
        ctx.arc(x + size / 2, y + size / 2, size / 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // Add some gradients
  const gradient = ctx.createRadialGradient(300, 300, 50, 300, 300, 400);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 600, 600);

  return canvas.toDataURL();
}

const samples = {
  landscape: createLandscapeSample(),
  portrait: createPortraitSample(),
  pattern: createPatternSample()
};

// Load sample image
window.loadSample = function(type) {
  const img = new Image();
  img.onload = () => {
    currentImage = img;
    convertAndDisplay();
  };
  img.src = samples[type];
};

// Handle file upload
const uploadInput = document.getElementById('imageUpload');
if (uploadInput) {
  uploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        currentImage = img;
        convertAndDisplay();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// Update generator configuration
window.updateDemo = function() {
  const charset = document.getElementById('charset')?.value;
  const colored = document.getElementById('colored')?.checked;
  const inverted = document.getElementById('inverted')?.checked;

  if (charset) {
    generator.updateConfig({
      charset: CharsetPreset[charset],
      colored: colored || false,
      inverted: inverted || false
    });
  }

  if (currentImage) {
    convertAndDisplay();
  }
};

window.updateWidth = function(value) {
  const widthValueSpan = document.getElementById('widthValue');
  if (widthValueSpan) {
    widthValueSpan.textContent = value;
  }

  generator.updateConfig({ width: parseInt(value) });

  if (currentImage) {
    convertAndDisplay();
  }
};

// Convert and display result
function convertAndDisplay() {
  if (!currentImage) return;

  const outputDiv = document.getElementById('output');
  if (!outputDiv) return;

  try {
    const startTime = performance.now();
    const result = generator.convertImage(currentImage);
    const endTime = performance.now();
    const processingTime = (endTime - startTime).toFixed(2);

    // Display result
    outputDiv.innerHTML = result.html;

    // Update metrics
    const timeSpan = document.getElementById('processingTime');
    const dimsSpan = document.getElementById('dimensions');
    const charSpan = document.getElementById('charCount');

    if (timeSpan) timeSpan.textContent = processingTime;
    if (dimsSpan) dimsSpan.textContent = `${result.metadata.width}×${result.metadata.height}`;
    if (charSpan) charSpan.textContent = result.metadata.characterCount.toLocaleString();

  } catch (error) {
    outputDiv.innerHTML = `<p style="color: #f56565; padding: 20px;">Error: ${error.message}</p>`;
    console.error('Conversion error:', error);
  }
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Add fade-in animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

console.log('🎨 ts-ascii-engine documentation loaded!');
