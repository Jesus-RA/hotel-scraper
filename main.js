import { scrapeHostelWorldPerDay, writeToFile } from './scripts/scraper.js';
import parseJsonToCSV from './scripts/parseJsonToCSV.js';;
import path from 'path';
import dayjs from 'dayjs';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(customParseFormat);

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
    {
        name: 'Madre-Tierra-Hotel-Coworking-Hostel',
        path: 'Madre-Tierra-Hotel-Coworking-Hostel/Puerto-Escondido/316134',
        roomNames: [
            'Básico 2 camas privadas Baño compartido',
            'Estándar 5 Cama Dormitorios femeninos',
            'Estándar 5 Cama Dormitorio mixto',
        ]
    },
    {
        name: 'Nopalero-Hostel',
        path: 'Nopalero-Hostel/Puerto-Escondido/312199',
        roomNames: [
            'Estándar 8 Cama Dormitorios femeninos',
            'Estándar 8 Cama Dormitorio mixto',
        ]
    },
    {
        name: 'Villa-Bonobo',
        path: 'Villa-Bonobo/Puerto-Escondido/309229',
        roomNames: [
            'Estándar Cama de matrimonio privada Baño',
            'Estándar 3 Cama Habitación familiar Baño',
            'De lujo Cama de matrimonio privada Baño',
            'De lujo Cama de matrimonio privada Baño',
            'Estándar 4 Cama Dormitorio mixto Baño',
        ]
    },
    {
        name: 'Bonita-Escondida',
        path: 'Bonita-Escondida/Puerto-Escondido/295767',
        roomNames: [
            'Superior Cama de matrimonio privada Baño',
            'De lujo 2 camas privadas Baño',
            'De lujo 4 Cama Dormitorios femeninos Baño',
            'Estándar 6 Cama Dormitorio mixto Baño',
        ]
    },
    {
        name: 'La-Palmera-Hostel',
        path: 'La-Palmera-Hostel/Puerto-Escondido/321038',
        roomNames: [
            'De lujo 6 Cama Dormitorios femeninos',
            'De lujo 6 Cama Dormitorio mixto',
        ]
    }
];

let startDate = dayjs().startOf('month');
let endDate;

const [customStartDate, customEndDate] = process.argv.slice(2);
const errors = [];

if(customStartDate && !dayjs(customStartDate, 'DD/MM/YYYY', true).isValid()) {
    errors.push('La fecha de inicio no es valida, el formato debe ser DD/MM/YYYY');
}

if(customEndDate && !dayjs(customEndDate, 'DD/MM/YYYY', true).isValid()) {
    errors.push('La fecha de fin no es valida, el formato debe ser DD/MM/YYYY');
}

if(errors.length > 0) {
    console.log(errors.join('\n'));
    process.exit(1);
}

startDate = dayjs(customStartDate, 'DD/MM/YYYY');

if(customEndDate) {
    endDate = dayjs(customEndDate, 'DD/MM/YYYY');
}else{
    endDate = dayjs(startDate).endOf('month');
}

// console.log({ startDate, endDate });

console.log('Iniciando proceso... \n');
console.log(`Fecha de inicio: ${startDate.format('DD/MM/YYYY')} \n`);
console.log(`Fecha de fin: ${endDate.format('DD/MM/YYYY')} \n`);

if(startDate.isAfter(endDate)) {
    console.log('La fecha de inicio no puede ser mayor a la fecha de fin');
    process.exit(1);
}


await Promise.all(hostels.map(async (hostel) => {
    console.log(`\nProcesando ${hostel.name}`)
    const rooms = await scrapeHostelWorldPerDay(hostel.path, startDate.format('YYYY-MM-DD'), endDate.format('YYYY-MM-DD'), 1, hostel.roomNames);
    await writeToFile(`hostels-rooms/json/${hostel.name}.json`, rooms);
    console.log(`\n${hostel.name} procesado correctamente`)
}))

const hostelsNames = hostels.map(hostel => hostel.name);

console.log('\n\nProcesando archivos JSON a CSV...\n')
hostelsNames.forEach(hostel => {
    const jsonFilePath = path.join(__dirname, `hostels-rooms/json/${hostel}.json`);
    const csvFilePath = path.join(__dirname, `hostels-rooms/csv/${hostel}.csv`);
    parseJsonToCSV(jsonFilePath, csvFilePath);
});
console.log('Archivos JSON convertidos a CSV correctamente \n\n')

console.log('Proceso completado, los archivos se han guardado en la carpeta hostels-rooms ✅');