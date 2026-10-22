const storageKey = 'findit-listings';
const input = document.getElementById('dataFile');
const preview = document.getElementById('dataPreview');
const count = document.getElementById('listingCount');
const toast = document.getElementById('toast');
let listings = JSON.parse(localStorage.getItem(storageKey) || '[]');

function notify(message) { toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3200); }
function cleanText(value) { return String(value ?? '').trim(); }
function render() {
  count.textContent = listings.length;
  preview.innerHTML = listings.length ? `<table><thead><tr><th>Name</th><th>Type</th><th>Location</th><th>Price</th></tr></thead><tbody>${listings.map(item => `<tr><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.type || '—')}</td><td>${escapeHtml(item.location || '—')}</td><td>₹${escapeHtml(item.price || '—')}</td></tr>`).join('')}</tbody></table>` : '<p class="empty-state">No uploaded listings yet.</p>';
}
function escapeHtml(value) { return cleanText(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]); }
function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/); if (lines.length < 2) throw new Error('Your CSV needs a heading row and at least one listing.');
  const headers = lines.shift().split(',').map(header => header.trim().toLowerCase());
  return lines.filter(Boolean).map(line => { const fields = line.split(','); return Object.fromEntries(headers.map((header, i) => [header, cleanText(fields[i])])); });
}
function validate(data) {
  if (!Array.isArray(data)) throw new Error('JSON files must contain an array of listings.');
  const valid = data.map(item => ({name: cleanText(item.name), location: cleanText(item.location), type: cleanText(item.type), price: cleanText(item.price), rating: cleanText(item.rating), reviews: cleanText(item.reviews)})).filter(item => item.name);
  if (!valid.length) throw new Error('Add at least one listing with a name.'); return valid;
}
document.getElementById('chooseFile').addEventListener('click', () => input.click());
input.addEventListener('change', async () => { const file = input.files[0]; if (!file) return; document.getElementById('fileStatus').textContent = file.name; try { const text = await file.text(); const raw = file.name.toLowerCase().endsWith('.json') ? JSON.parse(text) : parseCsv(text); listings = validate(raw); localStorage.setItem(storageKey, JSON.stringify(listings)); render(); notify(`${listings.length} listings are now live in Findit.`); } catch (error) { notify(error.message || 'We could not read that file.'); } });
document.getElementById('clearData').addEventListener('click', () => { listings = []; localStorage.removeItem(storageKey); render(); notify('Uploaded listings cleared.'); });
document.getElementById('downloadTemplate').addEventListener('click', () => { const blob = new Blob(['name,location,type,price,rating,reviews\nOlive House Residency,Koramangala,PG,9800,4.8,124\nSunset Suites,Goa,Hotel,4200,4.7,68'], {type: 'text/csv'}); const link = Object.assign(document.createElement('a'), {href: URL.createObjectURL(blob), download: 'findit-listing-template.csv'}); link.click(); URL.revokeObjectURL(link.href); });
render();

