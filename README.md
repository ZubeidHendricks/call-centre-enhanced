# Call Centre Enhanced

## Overview

This project is an enhanced version of a call center application built with Next.js and Hume's Empathic Voice Interface (EVI). It includes additional functionality for managing phone calls, reading contacts from CSV files, and saving conversation history.

## Features

- Voice-based conversations powered by Hume AI
- Upload and manage contact lists from CSV files
- Automated dialing interface
- Conversation history and note-taking
- Previous conversation context for improved calls

## Getting Started

1. Clone this repository
2. Install dependencies with `npm install` or `pnpm install`
3. Create a `.env` file based on `.env.example`
4. Add your Hume AI API keys to the `.env` file
5. Run the development server with `npm run dev`

## Environment Variables

- `HUME_API_KEY` - Your Hume AI API key
- `HUME_SECRET_KEY` - Your Hume AI Secret key
- `NEXT_PUBLIC_HUME_CONFIG_ID` - (Optional) Hume configuration ID

## Sample CSV Format

The application accepts CSV files with the following format:

```
id,number,name,notes
001,+15551234567,John Smith,Previous customer interested in premium plan
002,+15559876543,Jane Doe,Called last month about technical issues
```

## Credits

This project is built on top of the Hume EVI Next.js Starter template with added functionality for call center management.
