"use client";
import { useState, useRef } from "react";
import Image from "next/image";

export default function Home() {
  const [spinning, setSpinning] = useState(false);
  const wheelRef = useRef<HTMLImageElement>(null);

  const clickSoundRef = useRef<HTMLAudioElement>(null);
  const spinSoundRef = useRef<HTMLAudioElement>(null);

  const spinWheel = async () => {
    if (spinning) return;
    setSpinning(true);

    clickSoundRef.current!.currentTime = 0;
    clickSoundRef.current!.play();

    spinSoundRef.current!.currentTime = 0;
    spinSoundRef.current!.play();

    const spins = Math.floor(Math.random() * 3) + 4;
    const randomDegree = Math.floor(Math.random() * 360);
    const rotation = spins * 360 + randomDegree;

    wheelRef.current!.style.transition = "transform 4.5s ease-out";
    wheelRef.current!.style.transform = `rotate(${rotation}deg)`;

    setTimeout(async () => {
      let finalDegree = rotation % 360;
      if (finalDegree === 360) finalDegree = 0;

      try {
        const res = await fetch("/api/spin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ finalDegree }),
        });
        const data = await res.json();
        console.log("Resultado:", data.prize);
      } catch (err) {
        console.error("Erro ao girar:", err);
      }

      wheelRef.current!.style.transition = "none";
      wheelRef.current!.style.transform = `rotate(${finalDegree}deg)`;

      setSpinning(false);
    }, 4500);
  };

  return (
    <div className="flex flex-col items-center h-[100vh] text-white p-0 justify-end">
      {/* Container da roleta */}
      <div className="relative w-[100vw] h-[100vw] lg:w-[25vw] lg:h-[28vw] flex items-center justify-center bottom-[2vh] lg:bottom-0 lg:top-[21vh]">
        <Image
          src="/images/moldura9.png"
          alt="Moldura"
          width={100}
          height={100}
          className="absolute w-[98%] h-[98%] z-3 pointer-events-none"
          unoptimized={true}
        />

        <div 
          className={`absolute w-[80%] lg:w-[85%] h-[80%] lg:h-[85%] z-2 top-[14%] lg:top-[11.5%] flex items-center justify-center ${
            spinning ? "cursor-not-allowed opacity-80" : "cursor-pointer"
          }`}
          onClick={spinWheel}
        >
          <Image
            ref={wheelRef}
            src="/images/roleta9.png"
            alt="Roleta"
            width={100}
            height={100}
            className="w-full h-full"
            unoptimized={true}
          />
        </div>
        <Image
          src="/images/fundo2.png"
          alt="Fundo"
          width={90}
          height={90}
          className="absolute w-[75%] h-[75%] z-1"
          unoptimized={true}
        />
      </div>

      <div className="relative w-[100vw] lg:w-[25vw] h-[20vw] lg:h-[5vw] flex items-center justify-end mt-[27vh] lg:mt-[40vh]">
        <Image
          src="/images/personagens2.png"
          alt="Personagens"
          width={100}
          height={100}
          className="absolute w-full h-[40vh] lg:h-[35vh] z-4 bottom-0"
          unoptimized={true}
        />
        <Image
          src="/images/logo1.png"
          alt="Logo"
          width={100}
          height={100}
          className="absolute w-full h-full lg:h-[8vh] z-5 px-18 lg:px-24 lg:mb-[-1vh]"
          unoptimized={true}
        />
      </div>

      {/* Sons */}
      <audio ref={clickSoundRef} src="/sounds/click.mp3" preload="auto" />
      <audio ref={spinSoundRef} src="/sounds/roleta.mp3" preload="auto" />
    </div>
  );
}
