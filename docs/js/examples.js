/**
 * Interactive examples for ts-ascii-engine documentation
 */

import { AsciiGenerator, CharsetPreset } from '../dist-esm/index.js';



// Generators for different examples
let imageGenerator, videoGenerator, textGenerator;

try {
  imageGenerator = new AsciiGenerator({
    charset: CharsetPreset.BLOCK,
    width: 100,
    colored: false
  });


  videoGenerator = new AsciiGenerator({
    charset: CharsetPreset.BLOCK,
    width: 80,
    colored: false
  });


  textGenerator = new AsciiGenerator({
    charset: CharsetPreset.STANDARD,
    width: 0
  });

} catch (e) {
  console.error('❌ Failed to initialize generators:', e);
}

// State
let currentImage = null;
let videoStream = null;
let videoAnimationId = null;
let gameAnimationId = null;
let animationId = null;

// ==================== Image Demo ====================
const imageInput = document.getElementById('imageInput');
if (imageInput) {
  imageInput.addEventListener('change', (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {

        currentImage = img;
        updateImageDemo();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
}

window.updateImageDemo = function() {
  if (!currentImage) {
    console.warn('⚠️ No image to convert');
    return;
  }

  const charset = document.getElementById('imageCharset')?.value;
  const colored = document.getElementById('imageColored')?.checked;
  const outputDiv = document.getElementById('imageOutput');

  try {
    imageGenerator.updateConfig({
      charset: CharsetPreset[charset],
      colored: colored || false
    });

    const result = imageGenerator.convertImage(currentImage);
    outputDiv.innerHTML = result.html; // Use innerHTML directly if result.html contains pre/span

  } catch (e) {
    console.error('❌ Image conversion failed:', e);
    outputDiv.innerHTML = `<div style="color:red; padding:20px;">Error: ${e.message}</div>`;
  }
};

window.updateImageWidth = function(value) {
  document.getElementById('imageWidthValue').textContent = value;
  imageGenerator.updateConfig({ width: parseInt(value) });
  if (currentImage) updateImageDemo();
};

// ==================== Video Demo ====================
window.startVideoDemo = async function() {
  const video = document.getElementById('webcam');
  const output = document.getElementById('videoOutput');
  const startBtn = document.getElementById('startVideo');
  const stopBtn = document.getElementById('stopVideo');



  try {
    videoStream = await navigator.mediaDevices.getUserMedia({
      video: { width: 640, height: 480 }
    });


    video.srcObject = videoStream;
    await video.play();

    startBtn.disabled = true;
    stopBtn.disabled = false;

    let frameCount = 0;
    let lastTime = performance.now();

    function renderLoop() {
      try {
        const result = videoGenerator.convertImage(video);
        output.innerHTML = result.html;

        // Calculate FPS
        frameCount++;
        const currentTime = performance.now();
        if (currentTime - lastTime >= 1000) {
          document.getElementById('fpsCounter').textContent = frameCount;
          frameCount = 0;
          lastTime = currentTime;
        }

        videoAnimationId = requestAnimationFrame(renderLoop);
      } catch (e) {
        console.error('❌ Video render error:', e);
        cancelAnimationFrame(videoAnimationId);
      }
    }

    renderLoop();
  } catch (error) {
    console.error('❌ Video start error:', error);
    output.innerHTML = `<p style="color: #f56565; padding: 20px;">Error: ${error.message}<br>Please allow camera access to continue.</p>`;
  }
};

window.stopVideoDemo = function() {
  if (videoAnimationId) {
    cancelAnimationFrame(videoAnimationId);
    videoAnimationId = null;
  }

  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
    videoStream = null;
  }

  const video = document.getElementById('webcam');
  if (video) {
    video.srcObject = null;
  }

  document.getElementById('startVideo').disabled = false;
  document.getElementById('stopVideo').disabled = true;
  document.getElementById('videoOutput').innerHTML = '<p style="color: #666; text-align: center; padding: 40px;">Video stopped</p>';
};

window.updateVideoConfig = function() {
  const charset = document.getElementById('videoCharset')?.value;
  if (charset) {
    videoGenerator.updateConfig({
      charset: CharsetPreset[charset]
    });
  }
};

window.updateVideoWidth = function(value) {
  document.getElementById('videoWidthValue').textContent = value;
  videoGenerator.updateConfig({ width: parseInt(value) });
};

// ==================== Text Demo ====================
window.updateTextDemo = function() {
  const textInput = document.getElementById('textInput');
  const textOutput = document.getElementById('textOutput');

  if (!textInput || !textOutput) {
    console.error('❌ Text inputs/outputs not found');
    return;
  }

  const text = textInput.value || 'HELLO';
  const font = document.getElementById('textFont')?.value || 'Arial';
  const size = parseInt(document.getElementById('textSize')?.value) || 72;
  const weight = document.getElementById('textWeight')?.value || 'bold';



  try {
    const result = textGenerator.convertText(text, {
      font,
      fontSize: size,
      fontWeight: weight
    });

    textOutput.innerHTML = result.html;

  } catch (error) {
    console.error('❌ Text conversion failed:', error);
    textOutput.innerHTML = `<p style="color: #f56565;">Error: ${error.message}</p>`;
  }
};

window.updateTextSize = function(value) {
  document.getElementById('textSizeValue').textContent = value;
  updateTextDemo();
};

// Initialize text demo
if (document.getElementById('textInput')) {
  setTimeout(updateTextDemo, 500); // Small delay to ensure initialization
}

// ==================== Colored Demo ====================
function createColorfulSample() {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');

  // Gradient background
  const gradient = ctx.createLinearGradient(0, 0, 600, 400);
  gradient.addColorStop(0, '#FF6B6B');
  gradient.addColorStop(0.25, '#4ECDC4');
  gradient.addColorStop(0.5, '#45B7D1');
  gradient.addColorStop(0.75, '#FFA07A');
  gradient.addColorStop(1, '#98D8C8');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 600, 400);

  // Colorful shapes
  ctx.fillStyle = '#FFD93D';
  ctx.beginPath();
  ctx.arc(150, 150, 80, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#6BCB77';
  ctx.fillRect(350, 80, 150, 150);

  ctx.fillStyle = '#4D96FF';
  ctx.beginPath();
  ctx.moveTo(300, 300);
  ctx.lineTo(400, 300);
  ctx.lineTo(350, 380);
  ctx.closePath();
  ctx.fill();

  return canvas;
}

window.loadColoredDemo = function() {

  try {
    const canvas = createColorfulSample();
    const coloredGen = new AsciiGenerator({
      charset: CharsetPreset.BLOCK,
      width: 80,
      colored: true
    });

    const result = coloredGen.convertImage(canvas);
    document.getElementById('coloredOutput').innerHTML = result.html;

  } catch (e) {
    console.error('❌ Colored demo failed:', e);
  }
};

// ==================== Charset Comparison ====================
function createTestImage() {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createRadialGradient(200, 150, 20, 200, 150, 150);
  gradient.addColorStop(0, '#FFF');
  gradient.addColorStop(0.5, '#888');
  gradient.addColorStop(1, '#000');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 400, 300);

  return canvas;
}

window.compareCharsets = function() {

  const canvas = createTestImage();
  const container = document.getElementById('charsetComparison');
  container.innerHTML = '';

  const charsets = ['BLOCK', 'STANDARD', 'MINIMAL', 'EXTENDED'];

  charsets.forEach(charset => {
    try {
      const gen = new AsciiGenerator({
        charset: CharsetPreset[charset],
        width: 60,
        colored: false
      });

      const result = gen.convertImage(canvas);

      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h4>${charset}</h4>
        <div class="demo-output" style="max-height: 200px; overflow: hidden; white-space: nowrap; line-height: 1.0;">
          ${result.html}
        </div>
      `;

      container.appendChild(card);
    } catch (e) {
      console.error(`❌ Charset ${charset} failed:`, e);
    }
  });
};

// ==================== Game Demo ====================
window.startGameDemo = function() {

  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');

  const gameGen = new AsciiGenerator({
    charset: CharsetPreset.STANDARD,
    width: 40
  });

  let x = 50;
  let y = 150;
  let dx = 3;
  let dy = 2;

  function animateGame() {
    try {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 300, 300);

      // Draw moving sprite
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.fill();

      // Update position
      x += dx;
      y += dy;

      if (x <= 20 || x >= 280) dx = -dx;
      if (y <= 20 || y >= 280) dy = -dy;

      const result = gameGen.convertImage(canvas);
      document.getElementById('gameDemo').innerHTML = result.html;

      gameAnimationId = requestAnimationFrame(animateGame);
    } catch (e) {
      console.error('❌ Game render error:', e);
      cancelAnimationFrame(gameAnimationId);
    }
  }

  animateGame();
};

window.stopGameDemo = function() {
  if (gameAnimationId) {
    cancelAnimationFrame(gameAnimationId);
    gameAnimationId = null;
  }
};

// ==================== Animation Demo ====================
window.startAnimation = function() {

  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');

  const animGen = new AsciiGenerator({
    charset: CharsetPreset.STANDARD,
    width: 60
  });

  let frame = 0;

  function animate() {
    try {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 400, 400);

      // Rotating gradient
      const gradient = ctx.createLinearGradient(
        200 + Math.cos(frame * 0.02) * 200,
        200 + Math.sin(frame * 0.02) * 200,
        200 - Math.cos(frame * 0.02) * 200,
        200 - Math.sin(frame * 0.02) * 200
      );
      gradient.addColorStop(0, `hsl(${frame % 360}, 70%, 50%)`);
      gradient.addColorStop(1, `hsl(${(frame + 180) % 360}, 70%, 50%)`);
      ctx.fillStyle = gradient;

      // Pulsing circle
      const radius = 80 + Math.sin(frame * 0.05) * 40;
      ctx.beginPath();
      ctx.arc(200, 200, radius, 0, Math.PI * 2);
      ctx.fill();

      const result = animGen.convertImage(canvas);
      document.getElementById('animationOutput').innerHTML = result.html;

      frame++;
      animationId = requestAnimationFrame(animate);
    } catch (e) {
      console.error('❌ Animation render error:', e);
      cancelAnimationFrame(animationId);
    }
  }

  animate();
};

window.stopAnimation = function() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
};

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (videoStream) {
    videoStream.getTracks().forEach(track => track.stop());
  }
  if (videoAnimationId) cancelAnimationFrame(videoAnimationId);
  if (gameAnimationId) cancelAnimationFrame(gameAnimationId);
  if (animationId) cancelAnimationFrame(animationId);
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Sidebar active link
const sections = document.querySelectorAll('section[id]');
const sidebarLinks = document.querySelectorAll('.sidebar-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (window.pageYOffset >= sectionTop - 100) {
      current = section.getAttribute('id');
    }
  });

  sidebarLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});


