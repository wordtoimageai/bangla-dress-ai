import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { measurements, style, color, prompt } = await req.json();

  // Build a descriptive prompt for Replicate/HuggingFace
  const measurementText = measurements
    ? Object.entries(measurements)
        .map(([k, v]) => `${k}: ${v}"`)
        .join(", ")
    : "";

  const fullPrompt = [
    `Bangladeshi three-piece dress design,`,
    `style: ${style},`,
    `color: ${color},`,
    measurementText ? `measurements: ${measurementText},` : "",
    prompt || "",
    `high quality fashion photography, vibrant colors, traditional Bengali embroidery`,
  ]
    .filter(Boolean)
    .join(" ");

  // Call Replicate API (SDXL or similar)
  const replicateKey = process.env.REPLICATE_API_KEY;
  if (!replicateKey) {
    return NextResponse.json(
      { error: "REPLICATE_API_KEY নাই" },
      { status: 500 }
    );
  }

  const initRes = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${replicateKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: "ac732df83cea7fff18b8472768c88ad041fa750ff7682a21affe81863cbe77e4",
      input: { prompt: fullPrompt, negative_prompt: "blurry, low quality" },
    }),
  });

  if (!initRes.ok) {
    const err = await initRes.json();
    return NextResponse.json({ error: err.detail || "AI সমস্যা" }, { status: 500 });
  }

  let prediction = await initRes.json();

  // Poll for result
  while (prediction.status !== "succeeded" && prediction.status !== "failed") {
    await new Promise((r) => setTimeout(r, 2000));
    const poll = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: { Authorization: `Token ${replicateKey}` },
    });
    prediction = await poll.json();
  }

  if (prediction.status === "failed") {
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 });
  }

  const image_url = prediction.output?.[0];
  return NextResponse.json({ image_url, prompt: fullPrompt });
}
