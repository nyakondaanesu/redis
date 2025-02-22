import Image from "next/image";

import { NextResponse } from "next/server";
import redis from "../lib/fetch";

export default function Home() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  );
}
