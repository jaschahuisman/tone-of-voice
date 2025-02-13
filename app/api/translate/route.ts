import OpenAI from "openai"
import { NextResponse } from "next/server"

// Force the API route to run on the Node.js runtime
export const runtime = "nodejs";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  console.log("API route called")

  try {
    if (!process.env.OPENAI_API_KEY) {
      console.log("OpenAI API key is missing")
      return NextResponse.json({ error: "OpenAI API key is not configured" }, { status: 500 })
    }

    console.log("Parsing request body")
    const { currentText, toneOfVoice } = await request.json()

    if (!currentText?.trim()) {
      console.log("No text provided to translate")
      return NextResponse.json({ error: "No text provided to translate" }, { status: 400 })
    }

    if (!toneOfVoice?.trim()) {
      console.log("No tone of voice guidelines provided")
      return NextResponse.json({ error: "No tone of voice guidelines provided" }, { status: 400 })
    }

    console.log("Preparing OpenAI request")
    const prompt = `
Je bent een expert in het herschrijven van teksten volgens specifieke tone of voice richtlijnen.

Tone of Voice richtlijnen:
${toneOfVoice}

Herschrijf de volgende tekst volgens bovenstaande tone of voice richtlijnen. 
Behoud de originele betekenis maar pas de stijl en toon aan:

${currentText}

Belangrijk:
- Behoud dezelfde informatie en kernboodschap
- Pas alleen de schrijfstijl en toon aan
- Gebruik geen opsommingstekens tenzij die in de originele tekst staan
`

    console.log("Sending request to OpenAI")
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4",
      temperature: 0.7,
      max_tokens: 1000,
    })

    const translatedText = completion.choices[0]?.message?.content

    if (!translatedText) {
      console.log("No translation generated")
      return NextResponse.json({ error: "No translation generated" }, { status: 500 })
    }

    console.log("Translation successful")
    return NextResponse.json({ translatedText })
  } catch (error) {
    console.error("Translation error:", error)

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json({ error: `OpenAI API error: ${error.message}` }, { status: error.status || 500 })
    }

    if (error instanceof Error) {
      return NextResponse.json({ error: `Unexpected error: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ error: "An unexpected error occurred during translation" }, { status: 500 })
  }
}

