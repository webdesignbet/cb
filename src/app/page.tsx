"use client";
import { useState, useRef } from "react";
import Image from "next/image";

export default function Home() {
  const [result, setResult] = useState("Clique em girar para tentar a sorte!");
  const [spinning, setSpinning] = useState(false);
  const [animateResult, setAnimateResult] = useState(false);
  const wheelRef = useRef<HTMLImageElement>(null);

  const clickSoundRef = useRef<HTMLAudioElement>(null);
  const spinSoundRef = useRef<HTMLAudioElement>(null);

  const spinWheel = async () => {
    if (spinning) return;
    setSpinning(true);
    setResult("Girando...");
    setAnimateResult(false);

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

      setAnimateResult(true);

      wheelRef.current!.style.transition = "none";
      wheelRef.current!.style.transform = `rotate(${finalDegree}deg)`;

      setSpinning(false);
    }, 4500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      {/* Container da roleta */}
      <div className="relative w-[80vw] max-w-[450px] h-[80vw] max-h-[450px] rounded-tl-2xl rounded-tr-2xl bg-card flex items-center justify-center">
        <Image
          src="/images/moldura7.png"
          alt="Moldura"
          width={100}
          height={100}
          className="absolute w-full h-full z-10"
          unoptimized={true}
        />
        <Image
          ref={wheelRef}
          src="/images/roleta6.png"
          alt="Roleta"
          width={100}
          height={100}
          className="absolute w-full h-full z-20"
          unoptimized={true}
        />
        <Image
          src="/images/seta2.png"
          alt="Seta"
          width={100}
          height={100}
          className="absolute w-full h-full z-30"
          unoptimized={true}
        />
      </div>

      {/* Base com botão e texto */}
      <div className="flex flex-col relative w-[80vw] max-w-[450px] h-[200px] items-center justify-center text-center rounded-bl-2xl rounded-br-2xl shadow-lg bg-card pb-8">
        <button
          onClick={spinWheel}
          disabled={spinning}
          className={`mt-8 mb-8 px-24 py-3 rounded-lg font-bold transition-colors duration-300 ${
            spinning
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-btn-nopress hover:bg-btn-press cursor-pointer text-white"
          }`}
        >
          Girar
        </button>

        <p
          className={`mt-6 pb-6 text-xl sm:text-2xl md:text-2xl font-semibold result-text ${
            animateResult ? "animate-prizeReveal" : ""
          }`}
        >
          {result}
        </p>
      </div>

      {/* Sons */}
      <audio ref={clickSoundRef} src="/sounds/click.mp3" preload="auto" />
      <audio ref={spinSoundRef} src="/sounds/roleta.mp3" preload="auto" />
    </div>
  );
}
