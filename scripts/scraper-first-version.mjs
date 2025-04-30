import { chromium } from "playwright";
import dayjs from 'dayjs';


async function scrapeHostelWorld(startDate, endDate, guests = 1, roomType = 'dorm', roomNames = []) {
    //const URL = 'https://www.spanish.hostelworld.com/pwa/hosteldetails.php/Tower-Bridge-Hostel/Puerto-Escondido/16507?from=2025-05-01&to=2025-05-02&guests=1&origin=microsite';
    const url = new URL('https://www.spanish.hostelworld.com/pwa/hosteldetails.php/Tower-Bridge-Hostel/Puerto-Escondido/16507?');
    url.searchParams.set('from', startDate);
    url.searchParams.set('to', endDate);
    url.searchParams.set('guests', guests);
    url.searchParams.set('origin', 'microsite');

    const roomTypeSelector = roomType === 'dorm' ? '[data-testid="availability-table-dorm"]' : '[data-testid="availability-table-private"]';

    const browser = await chromium.launch({ headless: true });

    const page = await browser.newPage();

    await page.goto(url.toString());

    await page.waitForSelector(`${roomTypeSelector} .table-container .room-container`);

    const rooms = await page.$$eval(`${roomTypeSelector} .table-container .room-container`, (rooms, roomNames) => {
        return rooms
            .filter(room => roomNames.includes(room.querySelector('.room-title-container')?.textContent?.trim()))
            .map(room => {
                // Add more specific selectors and error checking
                const roomName = room.querySelector('.room-title-container')?.textContent?.trim() || 'Not found';
                const price = room.querySelector('.rate-price-line .body-1-bld')?.textContent?.trim()?.replace('MXN', '') || 'Not found';

                return {
                    room: roomName,
                    price,
                };
            });
    }, roomNames);

    await browser.close();
    return rooms;
}

const startDate = '2025-05-01';
const endDate = '2025-05-31';

const privateRooms = ['Básico Cama de matrimonio privada Baño compartido', 'Estándar 2 camas privadas Baño'];
const dormRooms = [
    'Estándar 8 Cama Dormitorio mixto Baño',
    'Estándar 6 Cama Dormitorio mixto Baño',
    'Estándar 4 Cama Dormitorios femeninos Baño',
];

const roomNames = {
    private: privateRooms,
    dorm: dormRooms,
}

const roomsPriceByDay = {
    private: [],
    dorm: [],
};
const days = dayjs(endDate).diff(dayjs(startDate), 'day');

// Object.entries(roomNames).forEach(async ([roomType, roomNames]) => {
//     for(let i = 0; i < days; i++) {
//         let start = dayjs(startDate).add(i, 'day').format('YYYY-MM-DD');
//         let end = dayjs(startDate).add(i+1, 'day').format('YYYY-MM-DD');
        
//         const rooms = await scrapeHostelWorld(start, end, 1, roomType, roomNames);
    
//         const startDateFormatted = dayjs(start).format('MMM ddd');
//         const endDateFormatted = dayjs(end).format('MMM ddd');
    
//         roomsPriceByDay[roomType].push({
//             startDate: startDateFormatted,
//             endDate: endDateFormatted,
//             rooms: rooms,
//         });
//     }
// });


Promise.all(Object.entries(roomNames).map(async ([roomType, roomNames]) => {
    for(let i = 0; i < days; i++) {
        let start = dayjs(startDate).add(i, 'day').format('YYYY-MM-DD');
        let end = dayjs(startDate).add(i+1, 'day').format('YYYY-MM-DD');
        
        const rooms = await scrapeHostelWorld(start, end, 1, roomType, roomNames);
    
        const startDateFormatted = dayjs(start).format('DD/MM/YYYY');
        const endDateFormatted = dayjs(end).format('DD/MM/YYYY');
    
        roomsPriceByDay[roomType].push({
            startDate: startDateFormatted,
            endDate: endDateFormatted,
            rooms: rooms,
        });
    }
})).then(() => {
    console.log(JSON.stringify(roomsPriceByDay, null, 2));
});

/*
 Web scrapper to Hostel World to get the prices of the rooms for a specific date range
 
Input:
- Start date
- End date
- Guests
- Room type
- Room names

Output:



*/