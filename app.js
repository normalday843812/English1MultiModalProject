const canvas = document.querySelector(".canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const context = canvas.getContext("2d");
const frameCount = 200;

const currentFrame = (index) => `./best-ball/${(index + 1).toString()}.png`;

const images = [];
let ball = { frame: 0 };

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  console.log(currentFrame(i));
  images.push(img);
}

gsap.to(ball, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  scrollTrigger: {
    scrub: 0.5,
    pin: "canvas",
    end: "500%",
  },
  onUpdate: render,
});

gsap.fromTo(
    ".ball-text",
    {
      opacity: 0,
    },
    {
      opacity: 1,
      scrollTrigger: {
        scrub: 0.2,
        start: "25%",
        end: "55%",
      },
      onComplete: () => {
        gsap.to(".ball-text", { opacity: 0, duration: 0.2 });
      },
    }
  );

images[0].onload = render;

function render() {
  context.canvas.width = images[0].width;
  context.canvas.height = images[0].height;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(images[ball.frame], 0, 0);
}

const circle = document.createElement('div');
circle.className = 'circle-follow';
document.body.appendChild(circle);

let targetX = 0;
let targetY = 0;
let currentX = window.innerWidth / 2;
let currentY = window.innerHeight / 2;
const easeFactor = 0.25;
let isInitialMove = true;

document.addEventListener('mousemove', (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
  if (isInitialMove) {
    updateCirclePosition();
    isInitialMove = false;
  }
});

function updateCirclePosition() {
  const dx = targetX - currentX;
  const dy = targetY - currentY;

  currentX += dx * easeFactor;
  currentY += dy * easeFactor;

  circle.style.left = `${currentX}px`;
  circle.style.top = `${currentY}px`;

  requestAnimationFrame(updateCirclePosition);
}

circle.style.position = 'fixed';
circle.style.left = '50%';
circle.style.top = '50%';
circle.style.transform = 'translate(-50%, -50%)';
circle.style.pointerEvents = 'none';
circle.style.transition = 'background-color 0.3s, transform 0.3s';

document.querySelectorAll('a, button, input').forEach(elem => {
  elem.addEventListener('mouseenter', () => {
    circle.style.transform = 'translate(-50%, -50%) scale(0.35)';
    circle.style.backgroundColor = 'rgba(0, 0, 0, 1)';
  });
  elem.addEventListener('mouseleave', () => {
    circle.style.transform = 'translate(-50%, -50%) scale(1)';
    circle.style.backgroundColor = 'transparent';
  });
});

const folderContent = document.getElementById('folder-content');
const folderButtons = document.querySelectorAll('.folder-button');
let poems = {};

function formatPoem(poem) {
  return poem.replace(/\n/g, '<br>').replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
}

fetch('./poems.json')
  .then(response => response.json())
  .then(data => {
    poems = data;
    folderContent.innerHTML = formatPoem(poems.poem1);
  })
  .catch(error => console.error('Error loading poems:', error));

folderButtons.forEach(button => {
  button.addEventListener('click', () => {
    const folder = button.getAttribute('data-folder');
    const poemKey = `poem${folder}`;
    if (poems[poemKey]) {
      folderContent.innerHTML = formatPoem(poems[poemKey]);
    }
  });
});