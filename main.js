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

import hostelsData from './hostels-data.json' with { type: 'json' };
const { hostels } = hostelsData;

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