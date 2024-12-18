const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = {
    x: null,
    y: null,
};
let touch = {
    x: null,
    y: null,
};
const images = [
    'img/particle1.png',
    'img/particle2.png',
    'img/particle3.png',
    'img/particle4.png',
    'img/particle5.png',
    'img/particle6.png',
    'img/particle7.png',
];

// 배경 이미지 관련 변수 추가
const bgImage = new Image();
bgImage.src = 'img/bg_ch.jpg'; // 이미지 경로 설정
let bgImageLoaded = false;
bgImage.onload = () => {
    bgImageLoaded = true;
};

class Particle {
      constructor() {
        this.size = Math.random() * 30 + 10;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        // 초기 속도 설정 (일정 속도)
        const initialSpeed = 2; // 초기 속도 값
        this.speedX = (Math.random() - 0.5) * 2 * initialSpeed; // -initialSpeed ~ initialSpeed 사이의 값
        this.speedY = (Math.random() - 0.5) * 2 * initialSpeed;

        this.image = new Image();
        this.image.src = images[Math.floor(Math.random() * images.length)];
        this.loaded = false;
        this.image.onload = () => {
            this.loaded = true;
        };
    }

    update() {
      // 캔버스 경계 충돌 처리 (이전과 동일)
      if (this.x + this.size > canvas.width || this.x - this.size < 0) {
          this.speedX = -this.speedX;
      }
      if (this.y + this.size > canvas.height || this.y - this.size < 0) {
          this.speedY = -this.speedY;
      }

      // 입력 방식에 따라 좌표 선택
      let currentX = null;
      let currentY = null;

      if (touch.x !== null && touch.y !== null) {
          currentX = touch.x;
          currentY = touch.y;
      } else if (mouse.x !== null && mouse.y !== null) {
          currentX = mouse.x;
          currentY = mouse.y;
      }

      // 반발력 계산 (특정 반경 내에서만 작용)
      const interactionRadius = 100; // 상호작용 반경

      if (currentX !== null && currentY !== null) {
          const dx = currentX - this.x;
          const dy = currentY - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < interactionRadius) { // 반경 내에 있을 때만 반발
              if (distance < 1) distance = 1; // 0으로 나누는 오류 방지

              const forceDirectionX = dx / distance;
              const forceDirectionY = dy / distance;
              let force = (interactionRadius - distance) / interactionRadius;
              const forceMultiplier = 0.1;
              force *= forceMultiplier;

              this.speedX -= forceDirectionX * force * this.size;
              this.speedY -= forceDirectionY * force * this.size;
          }
      }

      // 위치 업데이트 (기본 속도 유지)
      this.x += this.speedX;
      this.y += this.speedY;

      // 속도 감소 제거 (일정 속도 유지)
      this.speedX *= 0.95;
      this.speedY *= 0.95;

      // 캔버스 밖으로 나가지 않도록 처리 (이전과 동일)
      if (this.x < 0) this.x = this.size;
      if (this.x > canvas.width) this.x = canvas.width - this.size;
      if (this.y < 0) this.y = this.size;
      if (this.y > canvas.height) this.y = canvas.height - this.size;
  }

  draw() {
    if (this.loaded) {
        let width = this.size;
        let height = this.size;

        if (this.image.src.includes('particle7.png')) { // particle7 이미지인 경우
            // 세로 비율 조정 (예: 세로를 2배로)
            height = this.size * 2; // 세로를 가로의 2배로 설정
            // 또는 특정 값으로 설정
            // height = 60;
            // width = 30;
        }

        ctx.drawImage(this.image, this.x - width / 2, this.y - height / 2, width, height);
    }
}
}

function init() {
    particles = [];

    for (let i = 0; i < 300; i++) {
        particles.push(new Particle()); // 나머지 파티클 생성
    }
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
}

// 터치 이벤트 리스너 추가
canvas.addEventListener('touchstart', (event) => {
  touch.x = event.touches[0].clientX;
  touch.y = event.touches[0].clientY;
});

canvas.addEventListener('touchmove', (event) => {
  touch.x = event.touches[0].clientX;
  touch.y = event.touches[0].clientY;
});

canvas.addEventListener('touchend', () => {
  touch.x = null; // 터치가 끝났을 때 null로 설정
  touch.y = null;
});

// 마우스 이벤트
window.addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
});

function drawBackground() {
  if (bgImageLoaded) {
      const bgWidth = bgImage.width;
      const bgHeight = bgImage.height;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      // 위아래 여백 설정
      const verticalPadding = 100;

      // 그릴 이미지의 높이 계산 (위아래 여백을 뺀 값)
      const drawHeight = canvasHeight - 2 * verticalPadding;

      // 이미지 비율 유지하면서 높이에 맞추기
      const drawWidth = (drawHeight / bgHeight) * bgWidth;

      // 이미지를 중앙에 배치하기 위한 x 좌표 계산
      const x = (canvasWidth - drawWidth) / 2;

      // 이미지를 그립니다. y 좌표는 위쪽 여백 값으로 설정
      ctx.drawImage(bgImage, x, verticalPadding, drawWidth, drawHeight);

      // // 이미지를 캔버스 중앙에 그리기 위한 좌표 계산
      // const x = (canvasWidth - bgWidth) / 2;
      // const y = (canvasHeight - bgHeight) / 2;

      // ctx.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight);
  }
}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBackground(); // 배경 이미지 먼저 그리기

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
}

resizeCanvas();
init();
animate();

window.addEventListener('resize', resizeCanvas);