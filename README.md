# Hostel Price Scraper

A Node.js application that scrapes room prices from multiple hostels in Puerto Escondido, Mexico using Playwright.

## Features

- Scrapes prices for both dorm and private rooms from HostelWorld
- Supports scraping prices for multiple dates and hostels in parallel
- Saves data in both JSON and CSV formats
- Configurable date ranges via command line arguments
- Handles different room types and names

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