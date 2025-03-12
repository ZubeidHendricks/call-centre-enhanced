import { NextResponse } from 'next/server';
import { fetchAccessToken } from "hume";

export async function GET() {
  try {
    // Get the token using the Hume API keys from environment variables
    const accessToken = await fetchAccessToken({
      apiKey: String(process.env.HUME_API_KEY),
      secretKey: String(process.env.HUME_SECRET_KEY),
    });

    if (accessToken === "undefined" || !accessToken) {
      return NextResponse.json(
        { error: 'Failed to get access token' },
        { status: 500 }
      );
    }

    // Return the token in the response
    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error('Error fetching Hume access token:', error);
    return NextResponse.json(
      { error: 'Failed to get access token' },
      { status: 500 }
    );
  }
}
