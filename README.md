# Hostel Price Scraper

A Node.js application that scrapes room prices from multiple hostels in Puerto Escondido, Mexico using Playwright.

## Features

- Scrapes prices for both dorm and private rooms from HostelWorld
- Supports scraping prices for multiple dates and hostels in parallel
- Saves data in both JSON and CSV formats
- Configurable date ranges via command line arguments
- Handles different room types and names

## Adding New Hostels

To add a new hostel to the scraper, follow these steps:

1. Open the `hostels-data.json` file in the project root directory
2. Add a new entry to the `hostels` array with the following structure:
```json
{
    "name": "Hostel Name",
    "path": "Hostel-Name/Puerto-Escondido/123456",
    "roomNames": [
        "Room Type 1 Name",
        "Room Type 2 Name",
        "Room Type 3 Name"
    ]
}
```

3. Replace the values with the actual information from the hostel's HostelWorld page:
   - The `path` should match the URL path after `hostelworld.com/hostel/`
   - The `roomNames` array should contain the exact names of the rooms as they appear on the hostel's page
4. Test the scraper with the new hostel by running:
```bash
node main <start_date> <end_date>
```

Note: Make sure to use the exact room names as they appear on the hostel's HostelWorld page, including any special characters or accents.

## Prerequisites

- Node.js 16+
- npm or pnpm

## Installation
1. Install dependencies
```
npm install
```
2. Install Playwright chromium
```
npx playwright install --with-deps chromium
```

## Execution
Syntaxis
```sh
node main <start_date> <end_date>
```
Date format: `DD/MM/YY`

Example
```sh
node main 01/05/2025 25/05/2025
```