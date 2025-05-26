import { chromium } from "playwright";
import dayjs from 'dayjs';
import fs from 'fs/promises';

/**
 * Scrape the hostel world website for the given hotel path, per day from start date to end date, guests and room names
 * @param {string} hotelPath - The path of the hotel
 * @param {string} startDate - The start date
 * @param {string} endDate - The end date
 * @param {number} guests - The number of guests
 */
async function scrapeHostelWorldPerDay(hostelPath, startDate, endDate, guests = 1, roomNames = []) { 
    const url = new URL(`https://www.spanish.hostelworld.com/pwa/hosteldetails.php/${hostelPath}`);
    url.searchParams.set('guests', guests);
    url.searchParams.set('origin', 'microsite');

    const privateRoomTypeSelector = '[data-testid="availability-table-private"] .table-container .room-container';
    const dormRoomTypeSelector = '[data-testid="availability-table-dorm"] .table-container .room-container';

    const browser = await chromium.launch({ headless: true });

    const page = await browser.newPage();

    const days = dayjs(endDate).diff(dayjs(startDate), 'day');
    const results = [];

    for(let i = 0; i < days; i++) {
        const start = dayjs(startDate).add(i, 'day');
        const end = dayjs(startDate).add(i+1, 'day');

        console.log(`\n\n\t * Procesando ${hostelPath} for date range ${start.format('DD/MM/YYYY')} - ${end.format('DD/MM/YYYY')}`)

        url.searchParams.set('from', start.format('YYYY-MM-DD'));
        url.searchParams.set('to', end.format('YYYY-MM-DD'));

        let rooms = [];
        
        try{
            await page.goto(url.toString(), { waitUntil: 'domcontentloaded' });
        }catch(error){
            console.log("Error al navegar a " + url.toString() + "\n" + error);
        }

        try{
            // Wait for the rooms to be visible
            await page.waitForSelector('.availability-wrapper .table-container .room-container', { timeout: 10000 });

            const privateRooms = await page.$$eval(privateRoomTypeSelector, (rooms, roomNames) => {
                return rooms
                    .filter(room => roomNames.includes(room.querySelector('.room-title-container')?.textContent?.trim()))
                    .map(room => {
                        const roomName = room.querySelector('.room-title-container')?.textContent?.trim() || 'Not found';
                        const price = room.querySelector('.rate-price-line .body-1-bld')?.textContent?.trim()?.replace('MXN', '') || 'Not found';
        
                        return {
                            room: roomName,
                            price,
                            type: 'private'
                        };
                    });
            }, roomNames);
        
            const dormRooms = await page.$$eval(dormRoomTypeSelector, (rooms, roomNames) => {
                return rooms
                    .filter(room => roomNames.includes(room.querySelector('.room-title-container')?.textContent?.trim()))
                    .map(room => {
                        const roomName = room.querySelector('.room-title-container')?.textContent?.trim() || 'Not found';
                        const price = room.querySelector('.rate-price-line .body-1-bld')?.textContent?.trim()?.replace('MXN', '') || 'Not found';
        
                        return {
                            room: roomName,
                            price,
                            type: 'dorm'
                        };
                    });
            }, roomNames);

            rooms = [...privateRooms, ...dormRooms];
        }catch(error){
            // If no rooms are found, push an empty object to the results array
            console.log(`\n\n\t * No se encontraron habitaciones disponibles para ${hostelPath} en el rango de fechas ${start.format('DD/MM/YYYY')} - ${end.format('DD/MM/YYYY')}`)
        }

        results.push({
            start_date: start.format('YYYY-MM-DD'),
            end_date: end.format('YYYY-MM-DD'),
            rooms,
        })
    }

    await browser.close();

    return results;
}

/**
 * Scrape the hostel world website for the given hotel path, start date, end date, guests and room names
 * @param {string} hotelPath - The path of the hotel
 * @param {string} startDate - The start date
 * @param {string} endDate - The end date
 * @param {number} guests - The number of guests
 */
async function scrapeHostelWorld(hotelPath, startDate, endDate, guests = 1, roomNames = []) { 
    const url = new URL(`https://www.spanish.hostelworld.com/pwa/hosteldetails.php/${hotelPath}`);
    url.searchParams.set('from', startDate);
    url.searchParams.set('to', endDate);
    url.searchParams.set('guests', guests);
    url.searchParams.set('origin', 'microsite');

    const privateRoomTypeSelector = '[data-testid="availability-table-private"]';
    const dormRoomTypeSelector = '[data-testid="availability-table-dorm"]';

    const browser = await chromium.launch({ headless: true });

    const page = await browser.newPage();
    await page.goto(url.toString());

    await page.waitForSelector('.availability-wrapper .table-container .room-container');

    const privateRooms = await page.$$eval(privateRoomTypeSelector, (rooms, roomNames) => {
        return rooms
            .filter(room => roomNames.includes(room.querySelector('.room-title-container')?.textContent?.trim()))
            .map(room => {
                const roomName = room.querySelector('.room-title-container')?.textContent?.trim() || 'Not found';
                const price = room.querySelector('.rate-price-line .body-1-bld')?.textContent?.trim()?.replace('MXN', '') || 'Not found';

                return {
                    room: roomName,
                    price,
                    type: 'private'
                };
            });
    }, roomNames);

    const dormRooms = await page.$$eval(dormRoomTypeSelector, (rooms, roomNames) => {
        return rooms
            .filter(room => roomNames.includes(room.querySelector('.room-title-container')?.textContent?.trim()))
            .map(room => {
                const roomName = room.querySelector('.room-title-container')?.textContent?.trim() || 'Not found';
                const price = room.querySelector('.rate-price-line .body-1-bld')?.textContent?.trim()?.replace('MXN', '') || 'Not found';

                return {
                    room: roomName,
                    price,
                    type: 'dorm'
                };
            });
    }, roomNames);

    await browser.close();
    return [...privateRooms, ...dormRooms];
}

/**
 * Write the data to a file
 * @param {string} fileName - The name of the file
 * @param {any} data - The data to write to the file
 */
async function writeToFile(fileName, data) {
    await fs.writeFile(fileName, JSON.stringify(data, null, 2));
}

export { scrapeHostelWorldPerDay, scrapeHostelWorld, writeToFile };