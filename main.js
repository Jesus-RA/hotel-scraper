import { scrapeHostelWorldPerDay, writeToFile } from './scripts/scraper.js';
import parseJsonToCSV from './scripts/parseJsonToCSV.js';;
import path from 'path';
import dayjs from 'dayjs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const hostels = [
    {
        name: 'Tower-Bridge-Hostel',
        path: 'Tower-Bridge-Hostel/Puerto-Escondido/16507',
        roomNames: [
            'Básico Cama de matrimonio privada Baño compartido', 
            'Estándar 2 camas privadas Baño',
            'Estándar 8 Cama Dormitorio mixto Baño',
            'Estándar 6 Cama Dormitorio mixto Baño',
            'Estándar 4 Cama Dormitorios femeninos Baño',
        ]
    },
    {
        name: 'Puerto-Dreams-H',
        path: 'Puerto-Dreams-H/Puerto-Escondido/267977',
        roomNames: [
            'Básico 8 Cama Dormitorio mixto',
            'Estándar 4 Cama Dormitorio mixto Baño',
            'Estándar Cama de matrimonio privada Baño',
            'De lujo Cama de matrimonio privada Baño',
        ]
    },
    {
        name: 'Selina-Puerto-Escondido',
        path: 'Selina-Puerto-Escondido/Puerto-Escondido/285157',
        roomNames: [
            'Cama de matrimonio privada Baño compartido',
            'Estándar Cama de matrimonio privada Baño',
            'Básico 8 Cama Dormitorio mixto',
            'Básico 8 Cama Dormitorios femeninos',
        ]
    },
    {
        name: 'Viajero-Puerto-Escondido-Hostel',
        path: 'Viajero-Puerto-Escondido-Hostel/Puerto-Escondido/326368',
        roomNames: [
            'Superior Individual privada Baño',
            'Superior 2 camas privadas Baño',
            'Superior 3 Cama Privada Baño',
            'De lujo 2 camas privadas Baño',
            'De lujo 3 Cama Privada Baño',
            '4 Cama Dormitorio mixto Baño',
            '6 Cama Dormitorios femeninos Baño',
            '6 Cama Dormitorio mixto Baño',
        ]
    },
    {
        name: 'Straw-Hat-Surf-Hostel-Bar',
        path: 'Straw-Hat-Surf-Hostel-Bar/Puerto-Escondido/314224',
        roomNames: [
            'Estándar Cama de matrimonio privada Baño',
            'Estándar 8 Cama Dormitorio mixto Baño',
            'Estándar 8 Cama Dormitorios femeninos Baño',
        ]
    },
    {
        name: 'Che-Puerto-Escondido-Hostel-Bar',
        path: 'Che-Puerto-Escondido-Hostel-Bar/Puerto-Escondido/317986',
        roomNames: [
            'Estándar Cama de matrimonio privada Baño',
            'Estándar 8 Cama Dormitorios femeninos Baño',
            'Estándar 10 Cama Dormitorio mixto',
        ]
    },

]

const startDate = dayjs().format('YYYY-MM-DD');
const endDate = dayjs().endOf('month').format('YYYY-MM-DD');

await Promise.all(hostels.map(async (hostel) => {
    const rooms = await scrapeHostelWorldPerDay(hostel.path, startDate, endDate, 1, hostel.roomNames);
    await writeToFile(`hostels-rooms/json/${hostel.name}.json`, rooms);
}))

const hostelsNames = hostels.map(hostel => hostel.name);

hostelsNames.forEach(hostel => {
    const jsonFilePath = path.join(__dirname, `hostels-rooms/json/${hostel}.json`);
    const csvFilePath = path.join(__dirname, `hostels-rooms/csv/${hostel}.csv`);
    parseJsonToCSV(jsonFilePath, csvFilePath);
});

console.log('Done');