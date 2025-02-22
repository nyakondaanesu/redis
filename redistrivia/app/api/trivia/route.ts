import { NextResponse } from "next/server";
import redis from "@/lib/fetch";

export async function GET(req: Request) {
  try {
    const response = await fetch(
      "https://opentdb.com/api.php?amount=3&category=23&type=multiple"
    );

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    if (action === "store") {
      const data = await response.json();
      for (let i = 0; i < data.results.length; i++) {
        const questionKey = `trivia:${i + 1}`;

        await redis.hset(questionKey, {
          type: data.results[i].type,
          difficulty: data.results[i].difficulty,
          category: data.results[i].category,
          question: data.results[i].question,
          correct_answer: data.results[i].correct_answer,
          incorrect_answers: JSON.stringify(data.results[i].incorrect_answers),
        });

        console.log(`Stored in Redis: ${questionKey}`); // Debug log

        await redis.expire(questionKey, 3600);
      }
      return NextResponse.json({
        message: "Trivia questions stored successfully",
      });
    }

    if (action === "retrieve") {
      // Retrieve trivia questions from Redis
      const triviaData = [];

      for (let i = 1; i <= 3; i++) {
        const triviaKey = `trivia:${i}`;
        const trivia = await redis.hgetall(triviaKey); // Get hash data
        if (trivia) {
          triviaData.push(trivia);
        }
      }

      return NextResponse.json(triviaData);
    }

    return NextResponse.json({ message: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch trivia questions" },
      { status: 500 }
    );
  }
}
