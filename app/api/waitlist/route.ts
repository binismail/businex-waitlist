import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Here you can add your API logic to handle the form submission
    // For example, sending to your backend service

    return NextResponse.json({ message: "Successfully joined waitlist" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}

