import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    for (const [key, value] of formData.entries()) {
      console.log(
        `${key}:`,
        value instanceof File ? `File: ${value.name}` : value
      );
    }

    const response = await fetch(
      "https://api.redseam.redberryinternship.ge/api/register",
      {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      }
    );

    const text = await response.text();
    console.log("API Response text:", text.substring(0, 200) + "...");

    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      if (text.includes("<!doctype html>") || text.includes("<html>")) {
        return NextResponse.json(
          {
            message: "API endpoint not found. Please check the API URL.",
            debug: "Received HTML instead of JSON response",
          },
          { status: 500 }
        );
      }
      data = { message: text || "Invalid response from server" };
    }

    return NextResponse.json(data, { status: response.status });
  } catch (err: unknown) {
    console.error("API route error:", err);

    const message = "Server proxy error. Please try again.";
    let debug: string | undefined = undefined;

    if (err instanceof Error) {
      debug = err.message;
    }

    return NextResponse.json(
      {
        message,
        debug,
      },
      { status: 500 }
    );
  }
}
