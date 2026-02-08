import React, { useEffect, useRef, useState } from 'react'
import amanGif from './assets/aman-gif.mp4'

const App = () => {

  const [noCount, setNoCount] = useState(0);
  const [yesPressed, setYesPressed] = useState(false);
  const [message, setMessage] = useState("Gaura will you  be my Valentine? 💖");

  const noRef = useRef(null);
  const [noStyle, setNoStyle] = useState({});
  const isEscaping = useRef(false);



  const checkProximity = (mouseX, mouseY) => {
    if (!noRef.current || isEscaping.current) return;

    const rect = noRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distance = Math.hypot(
      mouseX - centerX,
      mouseY - centerY
    );

    if (distance < 120) {
      escapeNoButton();
    }
  };
  const getSafePosition = (currentRect) => {
    const maxMove = 300; // Constrain movement to 300px
    const padding = 20;

    let newX, newY;

    // Try to find a valid position within 10 attempts
    for (let i = 0; i < 10; i++) {
      const dx = (Math.random() - 0.5) * 2 * maxMove;
      const dy = (Math.random() - 0.5) * 2 * maxMove;

      const candidateX = currentRect.left + dx;
      const candidateY = currentRect.top + dy;

      // Check bounds
      if (
        candidateX > padding &&
        candidateX < window.innerWidth - currentRect.width - padding &&
        candidateY > padding &&
        candidateY < window.innerHeight - currentRect.height - padding
      ) {
        newX = candidateX;
        newY = candidateY;
        break;
      }
    }

    // Fallback if no valid position found (stay within safe bounds of center)
    if (newX === undefined) {
      newX = Math.random() * (window.innerWidth - currentRect.width - padding);
      newY = Math.random() * (window.innerHeight - currentRect.height - padding);
    }

    return { x: newX, y: newY };
  };

  const escapeNoButton = () => {
    setNoCount((prev) => prev + 1);
    isEscaping.current = true;

    const rect = noRef.current.getBoundingClientRect();
    const { x, y } = getSafePosition(rect);

    setNoStyle({
      position: "absolute",
      left: x,
      top: y,
    });

    // Cooldown: allow escape again after 300ms
    setTimeout(() => {
      isEscaping.current = false;
    }, 300);
  };


  const moveNoButton = () => {
    // Basic move without incrementing count (for touch/click backup)
    escapeNoButton();
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      checkProximity(e.clientX, e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);



  return (
    <div className="h-screen w-screen bg-pink-100 flex flex-col items-center justify-center overflow-hidden font-sans">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl flex flex-col items-center justify-center gap-8 max-w-xl w-[90%] min-h-[50vh] mx-4 transition-all duration-500 hover:shadow-pink-200/50">
        {yesPressed ? (
          <>
            <img
              src="https://media1.tenor.com/m/BG7091yVWDgAAAAC/tkthao219-bubududu.gif"
              alt="Bear Kiss"
              className="w-full max-w-[300px] h-auto object-contain mb-8"
            />
            <h1 className="text-3xl font-extrabold text-pink-600 text-center leading-tight">
              Yay! 💕 I knew it 😍
            </h1>
            <h1 className="text-xl font-bold text-pink-500 text-center mt-4">
              I love you soo much ❤️
            </h1>
          </>
        ) : (
          <>
            <video
              src={amanGif}
              autoPlay
              loop
              muted
              playsInline
              className="w-full max-w-[200px] h-auto object-contain mb-8"
            />
            <h1 className="text-3xl font-extrabold text-pink-600 text-center leading-tight">
              {message}
            </h1>

            <div className="flex gap-4 md:gap-64 items-center justify-center min-h-[60px]">
              <button
                onClick={() => setYesPressed(true)}
                style={{ transform: `scale(${1 + Math.min(noCount, 6) * 0.1})` }}
                className="px-6 py-3 text-lg font-bold rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg hover:shadow-pink-300 transition-all duration-300 active:scale-95 z-10"
              >
                Yes ❤️
              </button>
              <button
                ref={noRef}
                style={noStyle}
                onTouchStart={moveNoButton}
                className="px-6 py-3 text-lg font-bold rounded-full bg-red-500 text-white shadow-lg transition-all duration-300"
              >
                No 😒
              </button>

              {/* Placeholder to keep layout stable when "No" button moves */}
              {Object.keys(noStyle).length > 0 && (
                <button className="px-6 py-3 text-lg font-bold rounded-full bg-red-500 text-white opacity-0 pointer-events-none">
                  No 😒
                </button>
              )}
            </div>

            <p className="text-pink-600 font-medium mt-4">
              "No" seems a bit shy 😈
            </p>
          </>
        )}
      </div>
    </div >
  )
}

export default App