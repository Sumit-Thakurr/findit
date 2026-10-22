const tabs = document.querySelectorAll('.tab');
const serviceCopy = {
  pg: { place: 'Where do you want to live?', date: 'Move-in date', guest: 'Residents', placeholder: 'Search a neighbourhood or city', toast: 'Searching for beautiful rooms around' },
  taxi: { place: 'Where should we pick you up?', date: 'When are you leaving?', guest: 'Passengers', placeholder: 'Enter pickup location', toast: 'Finding the nearest ride from' },
  hotel: { place: 'Where do you want to go?', date: 'Check-in date', guest: 'Guests & rooms', placeholder: 'Search city, landmark or hotel', toast: 'Finding stays in' }
};

tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(item => item.classList.remove('active'));
  tab.classList.add('active');
  const copy = serviceCopy[tab.dataset.service];
  document.getElementById('placeLabel').textContent = copy.place;
  document.getElementById('dateLabel').textContent = copy.date;
  document.getElementById('guestLabel').textContent = copy.guest;
  document.getElementById('location').placeholder = copy.placeholder;
}));

const toast = document.getElementById('toast');
document.getElementById('date').min = new Date().toISOString().split('T')[0];
document.getElementById('searchForm').addEventListener('submit', event => {
  event.preventDefault();
  const service = document.querySelector('.tab.active').dataset.service;
  const place = document.getElementById('location').value || 'your area';
  toast.textContent = `${serviceCopy[service].toast} ${place}…`;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
});
document.querySelectorAll('.card-link').forEach(link => link.addEventListener('click', e => {
  e.preventDefault();
  const label = link.dataset.pick;
  [...tabs].find(tab => tab.textContent.includes(label)).click();
  document.querySelector('.search-wrap').scrollIntoView({behavior:'smooth', block:'center'});
}));
document.querySelectorAll('.heart').forEach(button => button.addEventListener('click', () => {
  button.textContent = button.textContent === '♡' ? '♥' : '♡';
  button.style.color = button.textContent === '♥' ? '#ef6d5b' : '';
}));

const savedListings = JSON.parse(localStorage.getItem('findit-listings') || '[]');
if (savedListings.length) {
  const grid = document.getElementById('listingGrid');
  grid.innerHTML = savedListings.slice(0, 6).map((listing, index) => `
    <article class="listing">
      <div class="photo photo-${['one', 'two', 'three'][index % 3]}"><span class="tag">${listing.type || 'Stay'}</span><button class="heart">♡</button></div>
      <div class="listing-info"><div><h3>${escapeHtml(listing.name || 'Untitled listing')}</h3><p>${escapeHtml(listing.location || 'Location coming soon')}</p></div><strong>₹${escapeHtml(String(listing.price || '—'))}<small>${listing.type === 'Hotel' ? '/night' : listing.type === 'Taxi' ? '/ride' : '/mo'}</small></strong><div class="rating">★ ${escapeHtml(String(listing.rating || 'New'))} <span>(${escapeHtml(String(listing.reviews || 0))} reviews)</span></div></div>
    </article>`).join('');
  grid.querySelectorAll('.heart').forEach(button => button.addEventListener('click', () => {
    button.textContent = button.textContent === '♡' ? '♥' : '♡';
    button.style.color = button.textContent === '♥' ? '#ef6d5b' : '';
  }));
}

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]);
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js'));
}

