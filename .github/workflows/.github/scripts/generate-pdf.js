const fs = require('fs');
const PDFDocument = require('pdfkit');

const LOG_PATH = './floor_check_log.json';
const PDF_PATH = './floor_check_log.pdf';

// Load log data
let logs = [];
if (fs.existsSync(LOG_PATH)) {
  logs = JSON.parse(fs.readFileSync(LOG_PATH, 'utf-8'));
}

const locations = [
  'Vmax', 'Screen X', 'Cinema 3', 'Cinema 4', 'Cinema 5', 'Cinema 6', 'Cinema 7', 'Cinema 8',
  'Male bathroom', 'Female bathroom', 'Access bathroom'
];

// Group logs by location, unique names, times only
function groupLogs(logs) {
  const grouped = {};
  locations.forEach(loc => { grouped[loc] = []; });
  logs.forEach(entry => {
    if (grouped[entry.location]) {
      let person = grouped[entry.location].find(e => e.name === entry.name);
      if (!person) {
        grouped[entry.location].push({ name: entry.name, times: [entry.time] });
      } else {
        person.times.push(entry.time);
      }
    }
  });
  return grouped;
}

const grouped = groupLogs(logs);
const today = new Date().toLocaleDateString();

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream(PDF_PATH));

doc.fontSize(20).text('Floor Check Log', { align: 'left' });
doc.moveDown(0.5);
doc.fontSize(12).text(`Date: ${today}`);
doc.moveDown(1);

locations.forEach(loc => {
  doc.font('Helvetica-Bold').fontSize(14).text(loc);
  doc.font('Helvetica').fontSize(12);
  const entries = grouped[loc];
  if (entries.length === 0) {
    doc.fillColor('#888').text('No entries', { indent: 20 });
    doc.fillColor('#000');
  } else {
    entries.forEach(person => {
      let line = `${person.name}`;
      if (person.times.length > 0) {
        line += `: ${person.times.join(', ')}`;
      }
      doc.text(line, { indent: 20 });
    });
  }
  doc.moveDown(0.5);
});

doc.end();
