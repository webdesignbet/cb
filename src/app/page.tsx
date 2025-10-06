/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useRef } from "react";

export default function Home() {
  const [result, setResult] = useState("Clique em girar para tentar a sorte!");
  const [spinning, setSpinning] = useState(false);
  const wheelRef = useRef<HTMLImageElement>(null);

  const clickSoundRef = useRef<HTMLAudioElement>(null);
  const spinSoundRef = useRef<HTMLAudioElement>(null);

  const spinWheel = async () => {
    if (spinning) return;
    setSpinning(true);
    setResult("Girando...");

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

      const res = await fetch("/api/spin", { method: "POST" });
      const data = await res.json();
      const prize = data.prize;

      if (prize === "Tente outra vez") {
        setResult(prize);
      } else if (prize === "Todos os prêmios acabaram!") {
        setResult(prize);
      } else {
        setResult(`Você ganhou: ${prize}`);
        console.log(prize);
      }

      wheelRef.current!.style.transition = "none";
      wheelRef.current!.style.transform = `rotate(${finalDegree}deg)`;

      setSpinning(false);
    }, 4500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
        <img
          src="/images/moldura7.png"
          alt="Moldura"
          className="absolute w-full h-full z-10"
        />
        <img
          ref={wheelRef}
          src="/images/roleta6.png"
          alt="Roleta"
          className="absolute w-full h-full z-20"
        />
        <img
          src="/images/seta2.png"
          alt="Seta"
          className="absolute w-full h-full z-30"
        />
      </div>

      <button
        onClick={spinWheel}
        disabled={spinning}
        className={`mt-8 px-10 py-3 rounded-lg font-bold transition ${
          spinning
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-700 hover:bg-blue-900 cursor-pointer"
        }`}
      >
        Girar
      </button>

      <p className="mt-6 text-xl font-semibold">{result}</p>

      <audio ref={clickSoundRef} src="/sounds/click.mp3" preload="auto" />
      <audio ref={spinSoundRef} src="/sounds/roleta.mp3" preload="auto" />
    </div>
  );
}
