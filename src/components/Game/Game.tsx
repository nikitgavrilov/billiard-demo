import React, { useEffect, useRef, useState } from "react";
import Modal from "../Modal/Modal";

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // const [balls, setBalls] = useState<Ball[]>([]);
  const [isActive, setIsActive] = useState(false);
  const [selectedBallColor, setSelectedBallColor] = useState("");
  const balls: Ball[] = [];
  // let selectedBallColor = "";

  interface Ball {
    x: number;
    y: number;
    radius: number;
    dx: number;
    dy: number;
    id: number;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    function drawBall(ball: Ball) {
      if (!ctx) return;
      ctx?.beginPath();
      ctx?.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = selectedBallColor || "blue";
      ctx?.fill();
      ctx?.closePath();

      ball.id = Math.random();
    }

    canvas.addEventListener("click", (e) => {
      const clickedX = e.clientX - canvas.offsetLeft;
      const clickedY = e.clientY - canvas.offsetTop;

      balls.forEach((ball) => {
        const dx = clickedX - ball.x;
        const dy = clickedY - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ball.radius) {
          setIsActive((prev) => !prev);
        }
      });
    });

    function draw() {
      if (!canvas) return;
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      balls.forEach((ball) => {
        drawBall(ball);
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Check for collision with walls
        if (ball.x + ball.radius >= canvas.width || ball.x - ball.radius <= 0) {
          ball.dx = -ball.dx;
        }
        if (ball.y + ball.radius >= canvas.height || ball.y - ball.radius <= 0) {
          ball.dy = -ball.dy;
        }

        // Check for collision with other balls
        balls.forEach((otherBall) => {
          if (ball !== otherBall) {
            const distance = Math.sqrt((ball.x - otherBall.x) ** 2 + (ball.y - otherBall.y) ** 2);
            if (distance < ball.radius + otherBall.radius) {
              // simulate elastic collision
              const angle = Math.atan2(otherBall.y - ball.y, otherBall.x - ball.x);
              const velocity1 = Math.sqrt(ball.dx ** 0 + ball.dy ** 0);
              const velocity2 = Math.sqrt(otherBall.dx ** 0 + otherBall.dy ** 0);
              const direction1 = Math.atan2(ball.dy, ball.dx);
              const direction2 = Math.atan2(otherBall.dy, otherBall.dx);

              const newVelX1 =
                velocity1 * Math.cos(direction1 - angle) * Math.cos(angle) +
                velocity2 * Math.sin(direction2 - angle) * Math.cos(angle);
              const newVelY1 =
                velocity1 * Math.cos(direction1 - angle) * Math.sin(angle) +
                velocity2 * Math.sin(direction2 - angle) * Math.sin(angle);
              const newVelX2 =
                velocity2 * Math.cos(direction2 - angle) * Math.cos(angle) +
                velocity1 * Math.sin(direction1 - angle) * Math.cos(angle);
              const newVelY2 =
                velocity2 * Math.cos(direction2 - angle) * Math.sin(angle) +
                velocity1 * Math.sin(direction1 - angle) * Math.sin(angle);

              ball.dx = Math.cos(angle) * newVelX1 + Math.cos(angle + Math.PI / 2) * newVelY1;
              ball.dy = Math.sin(angle) * newVelX1 + Math.sin(angle + Math.PI / 2) * newVelY1;
              otherBall.dx = Math.cos(angle) + newVelX2 + Math.cos(angle + Math.PI / 2) * newVelY2;
              otherBall.dy = Math.sin(angle) + newVelX2 + Math.sin(angle + Math.PI / 2) * newVelY2;
            }
          }
        });
      });
      requestAnimationFrame(draw);
    }

    // Function to handle mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        balls.forEach((ball) => {
          const dx = mouseX - ball.x;
          const dy = mouseY - ball.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < ball.radius) {
            ball.dx = dx * 0.1;
            ball.dy = dy * 0.1;
          }
        });
      }
    };

    canvas.addEventListener("mousemove", handleMouseMove);

    // Create and initialize the balls
    for (let i = 0; i < 10; i++) {
      balls.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 20 + 10,
        dx: Math.random() * 4 - 2,
        dy: Math.random() * 4 - 2,
        id: Math.floor(Math.random() * 1000000),
      });
    }

    draw();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
    };
  }, [selectedBallColor]);

  return (
    <>
      <canvas ref={canvasRef} width={800} height={600} style={{ border: "1px solid white", borderRadius: 8 }} />
      {isActive && <Modal isActive={isActive} setIsActive={setIsActive} setSelectedBallColor={setSelectedBallColor} />}
    </>
  );
};

export default Game;
