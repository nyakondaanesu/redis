"use client";
import Image from "next/image";

import { NextResponse } from "next/server";
import redis from "../lib/fetch";
import { useEffect, useState } from "react";

export default function Home() {
  const [trivia, setTrivia] = useState<{ question: string }[]>([]);
  const [triviaNum, setTriviaNum] = useState(0);
  const [triviaQuestion, setTriviaQuestion] = useState("");

  const handleClick = async () => {
    const response = await fetch("/api/trivia?action=retrieve", {
      method: "GET",
    });

    const data = await response.json();
    setTrivia(data);
    setTriviaNum(triviaNum + 1);
    setTriviaQuestion(trivia[triviaNum].question);
    console.log("clicked");
  };

  useEffect(() => {
    console.log(trivia);
    console.log(triviaQuestion);
  }, [trivia]);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 ">
      <h1>Hello World</h1>
      <button
        className="bg-white text-black p-3 rouonded-lg"
        onClick={handleClick}
      >
        get trivia
      </button>

      <div className="rounded-lg bg-white text-black w-3/4 h-80 text-center">
        <h1>{triviaQuestion}</h1>
      </div>
    </div>
  );
}
