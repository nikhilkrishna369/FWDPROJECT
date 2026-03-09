'use strict';

/* ════════════════════════════════════════
   CO1 — SORTING & SEARCHING
   Quick-sort + Binary Search on price
   ════════════════════════════════════════ */

function quickSort(arr, lo = 0, hi = arr.length - 1) {
  if (lo >= hi) return arr;
  const pivot = arr[hi].price;
  let i = lo - 1;
  for (let j = lo; j < hi; j++) {
    if (arr[j].price <= pivot) { i++; [arr[i], arr[j]] = [arr[j], arr[i]]; }
  }
  [arr[i + 1], arr[hi]] = [arr[hi], arr[i + 1]];
  const p = i + 1;
  quickSort(arr, lo, p - 1);
  quickSort(arr, p + 1, hi);
  return arr;
}

function binarySearchByPrice(sorted, target) {
  let lo = 0, hi = sorted.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (sorted[mid].price === target) return mid;
    sorted[mid].price < target ? lo++ : hi--;
  }
  return -1;
}

/* ════════════════════════════════════════
   CO2 — DOUBLY LINKED LIST (Itinerary)
   ════════════════════════════════════════ */

class DLLNode {
  constructor(title, note) {
    this.title = title;
    this.note  = note;
    this.prev  = null;
    this.next  = null;
    this.id    = Date.now() + Math.random();
  }
}

class DoublyLinkedList {
  constructor() { this.head = null; this.tail = null; this.size = 0; }

  append(title, note) {
    const node = new DLLNode(title, note);
    if (!this.tail) { this.head = this.tail = node; }
    else { node.prev = this.tail; this.tail.next = node; this.tail = node; }
    this.size++;
    return node;
  }

  deleteById(id) {
    let cur = this.head;
    while (cur) {
      if (cur.id === id) {
        if (cur.prev) cur.prev.next = cur.next; else this.head = cur.next;
        if (cur.next) cur.next.prev = cur.prev; else this.tail = cur.prev;
        this.size--;
        return true;
      }
      cur = cur.next;
    }
    return false;
  }

  moveUp(id) {
    let cur = this.head;
    while (cur) {
      if (cur.id === id && cur.prev) {
        [cur.title, cur.prev.title] = [cur.prev.title, cur.title];
        [cur.note,  cur.prev.note]  = [cur.prev.note,  cur.note];
        [cur.id,    cur.prev.id]    = [cur.prev.id,    cur.id];
        return;
      }
      cur = cur.next;
    }
  }

  toArray() {
    const arr = []; let cur = this.head;
    while (cur) { arr.push({ id: cur.id, title: cur.title, note: cur.note }); cur = cur.next; }
    return arr;
  }
}

/* ════════════════════════════════════════
   CO3 — STACK + QUEUE + MIN-HEAP
   ════════════════════════════════════════ */

class Stack {
  constructor() { this.items = []; }
  push(x)   { this.items.push(x); }
  pop()     { return this.items.pop(); }
  isEmpty() { return this.items.length === 0; }
}

class Queue {
  constructor() { this.items = []; }
  enqueue(x) { this.items.push(x); }
  dequeue()  { return this.items.shift(); }
  isEmpty()  { return this.items.length === 0; }
}

class MinHeap {
  constructor() { this.heap = []; }
  insert(item) {
    this.heap.push(item);
    let i = this.heap.length - 1;
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (new Date(this.heap[p].travelDate) <= new Date(this.heap[i].travelDate)) break;
      [this.heap[p], this.heap[i]] = [this.heap[i], this.heap[p]];
      i = p;
    }
  }
  extractMin() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    const min = this.heap[0];
    this.heap[0] = this.heap.pop();
    let i = 0;
    while (true) {
      const l = 2*i+1, r = 2*i+2; let s = i;
      if (l < this.heap.length && new Date(this.heap[l].travelDate) < new Date(this.heap[s].travelDate)) s = l;
      if (r < this.heap.length && new Date(this.heap[r].travelDate) < new Date(this.heap[s].travelDate)) s = r;
      if (s === i) break;
      [this.heap[i], this.heap[s]] = [this.heap[s], this.heap[i]]; i = s;
    }
    return min;
  }
  get length() { return this.heap.length; }
}

/* ════════════════════════════════════════
   CO4 — HASH TABLE (user store)
   ════════════════════════════════════════ */

class HashTable {
  constructor(size = 53) { this.table = new Array(size); this.size = size; }
  _hash(key) {
    let h = 0;
    for (let i = 0; i < Math.min(key.length, 100); i++) h = (h * 31 + key.charCodeAt(i)) % this.size;
    return h;
  }
  set(key, value) {
    const idx = this._hash(key);
    if (!this.table[idx]) this.table[idx] = [];
    const pair = this.table[idx].find(p => p[0] === key);
    if (pair) pair[1] = value; else this.table[idx].push([key, value]);
  }
  get(key) {
    const idx = this._hash(key);
    if (!this.table[idx]) return null;
    const pair = this.table[idx].find(p => p[0] === key);
    return pair ? pair[1] : null;
  }
  delete(key) {
    const idx = this._hash(key);
    if (!this.table[idx]) return false;
    const i = this.table[idx].findIndex(p => p[0] === key);
    if (i !== -1) { this.table[idx].splice(i, 1); return true; }
    return false;
  }
  getAll() {
    const all = [];
    this.table.forEach(bucket => { if (bucket) bucket.forEach(([, v]) => all.push(v)); });
    return all;
  }
}

/* ════════════════════════════════════════
   CO4 — GRAPH BFS (Route Finder)
   ════════════════════════════════════════ */

const travelGraph = {
  'Paris':    ['Dubai', 'London', 'New York'],
  'Dubai':    ['Paris', 'Tokyo', 'Bali', 'Sydney'],
  'New York': ['Paris', 'Bali', 'London'],
  'Tokyo':    ['Dubai', 'Sydney'],
  'Bali':     ['New York', 'Dubai', 'Sydney'],
  'London':   ['Paris', 'New York', 'Dubai'],
  'Sydney':   ['Tokyo', 'Bali', 'Dubai'],
};

function bfsRoute(start, dest) {
  if (start === dest) return [start];
  const visited = new Set([start]);
  const queue = [[start]];
  while (queue.length) {
    const path = queue.shift();
    for (const nb of (travelGraph[path[path.length - 1]] || [])) {
      if (!visited.has(nb)) {
        const np = [...path, nb];
        if (nb === dest) return np;
        visited.add(nb);
        queue.push(np);
      }
    }
  }
  return null;
}

/* ════════════════════════════════════════
   APP STATE
   ════════════════════════════════════════ */

let currentUser      = null;
let _bidCounter      = Date.now(); // stable unique booking ID seed

const userStore  = new HashTable();
const undoStack  = new Stack();
const paymentQ   = new Queue();
const itinerary  = new DoublyLinkedList();
const queueMirror = [];   // visual mirror of recent queue activity

function nextBid() { return ++_bidCounter; }

/* ════════════════════════════════════════
   CONSTANTS
   ════════════════════════════════════════ */

const PACKAGES = [
  { name: 'Paris Tour',            price: 1200, emoji: '🗼' },
  { name: 'Dubai Adventure',       price: 1500, emoji: '🏙️' },
  { name: 'Maldives Holiday',      price: 2000, emoji: '🏝️' },
  { name: 'Bali Escape',           price: 1300, emoji: '🌴' },
  { name: 'New York Explorer',     price: 1100, emoji: '🗽' },
  { name: 'Tokyo Experience',      price: 1700, emoji: '⛩️' },
  { name: 'Swiss Alps Retreat',    price: 2200, emoji: '🏔️' },
  { name: 'Egypt Historical Tour', price: 1400, emoji: '🏛️' },
];

const QUOTES = [
  '"The world is a book — those who do not travel read only one page."',
  '"Travel is the only thing you buy that makes you richer."',
  '"Not all those who wander are lost." – Tolkien',
  '"Adventure is worthwhile." – Aesop',
  '"To travel is to live." – H.C. Andersen',
  '"Jobs fill your pocket. Adventures fill your soul."',
  '"Life is short and the world is wide."',
];

const COUPONS = { 'SAVE10': 0.10, 'TRAVEL20': 0.20, 'VIP30': 0.30 };

/* ════════════════════════════════════════
   STORAGE
   ════════════════════════════════════════ */

function loadUsersFromStorage() {
  try {
    const raw = localStorage.getItem('tp_users_v2');
    if (!raw) return;
    JSON.parse(raw).forEach(u => {
      if (!Array.isArray(u.history)) u.history = [];
      if (u.history) u.history.forEach(b => { if (!b._bid) b._bid = nextBid(); });
      userStore.set(u.email, u);
    });
  } catch(e) { console.warn('Storage load error', e); }
}

function persistUsers() {
  try {
    localStorage.setItem('tp_users_v2', JSON.stringify(userStore.getAll()));
  } catch(e) { console.warn('Storage save error', e); }
}

function updateCurrentUser() {
  userStore.set(currentUser.email, currentUser);
  persistUsers();
}

/* ════════════════════════════════════════
   TOAST SYSTEM
   ════════════════════════════════════════ */

function toast(msg, type = 'info') {
  const container = document.getElementById('toastContainer');
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.textContent = msg;
  container.appendChild(el);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => el.classList.add('show'));
  });
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 350);
  }, 3200);
}

/* ════════════════════════════════════════
   NAVIGATION
   ════════════════════════════════════════ */

function navigate(id) {
  const publicScreens = ['login', 'register'];

  // Guard: require login for protected screens
  if (!currentUser && !publicScreens.includes(id)) {
    navigate('login');
    return;
  }

  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById(id);
  if (screen) screen.classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navItem = document.getElementById('nav-' + id);
  if (navItem) navItem.classList.add('active');

  // Hide sidebar & hamburger on auth screens, show on app screens
  const isAuth = publicScreens.includes(id);
  const sidebar   = document.getElementById('sidebar');
  const hamburger = document.getElementById('hamburger');
  const main      = document.getElementById('mainContent');
  if (sidebar)   sidebar.style.display   = isAuth ? 'none' : '';
  if (hamburger) hamburger.style.display = isAuth ? 'none' : '';
  if (main)      main.style.marginLeft   = isAuth ? '0'    : '';

  closeSidebar();

  // Screen-specific init
  if (id === 'dashboard') renderDashboard();
  if (id === 'history')   initHistory();
  if (id === 'profile')   renderProfile();
  if (id === 'packages')  renderPackages();
  if (id === 'itinerary') renderItinerary();
  if (id === 'flights')   previewFlightPrice();
  if (id === 'cars')      previewCarPrice();
}

function toggleSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  const hamburger = document.getElementById('hamburger');
  const isOpen   = sidebar.classList.contains('open');
  if (isOpen) { closeSidebar(); }
  else {
    sidebar.classList.add('open');
    overlay.classList.add('open');
    hamburger.classList.add('open');
  }
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
  document.getElementById('hamburger').classList.remove('open');
}

function toggleTheme() {
  document.body.classList.toggle('light');
  document.getElementById('themeIcon').textContent =
    document.body.classList.contains('light') ? '◐' : '◑';
}

/* ════════════════════════════════════════
   AUTH
   ════════════════════════════════════════ */

function register() {
  const name  = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const pass  = document.getElementById('regPassword').value;

  if (!name || !email || !pass) { toast('All fields are required', 'error'); return; }
  if (pass.length < 6) { toast('Password must be at least 6 characters', 'error'); return; }
  if (!/\S+@\S+\.\S+/.test(email)) { toast('Please enter a valid email', 'error'); return; }
  if (userStore.get(email)) { toast('Email already registered', 'error'); return; }

  const user = { name, email, password: pass, history: [], itinerary: '', itDays: [] };
  userStore.set(email, user);
  persistUsers();
  toast('Account created! Please sign in.', 'success');
  // Clear form
  ['regName', 'regEmail', 'regPassword'].forEach(id => document.getElementById(id).value = '');
  showLogin();
}

function login() {
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const pass  = document.getElementById('loginPassword').value;

  if (!email || !pass) { toast('Please enter your credentials', 'error'); return; }

  const user = userStore.get(email);
  if (!user || user.password !== pass) { toast('Invalid email or password', 'error'); return; }

  currentUser = user;
  // Ensure all bookings have a stable _bid
  currentUser.history.forEach(b => { if (!b._bid) b._bid = nextBid(); });
  // Rebuild itinerary linked list from stored data
  itinerary.head = itinerary.tail = null; itinerary.size = 0;
  (currentUser.itDays || []).forEach(d => itinerary.append(d.title, d.note));
  // Persist session so reload restores it
  try { localStorage.setItem('tp_session', currentUser.email); } catch(e) {}
  // Clear forms
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';

  navigate('dashboard');
  toast(`Welcome back, ${user.name.split(' ')[0]}! ✦`, 'success');
}

function logout() {
  currentUser = null;
  // Clear DSA state on logout
  undoStack.items = [];
  queueMirror.length = 0;
  // Clear persisted session
  try { localStorage.removeItem('tp_session'); } catch(e) {}
  navigate('login');
  toast('Signed out successfully', 'info');
}

function showLogin()    { navigate('login'); }
function showRegister() { navigate('register'); }

/* ════════════════════════════════════════
   BOOKING PIPELINE — direct to history
   ════════════════════════════════════════ */

function applyCoupon(code, price) {
  const discount = COUPONS[(code || '').toUpperCase().trim()];
  return discount ? Math.round(price * (1 - discount)) : price;
}

function recordBooking(booking) {
  if (!Array.isArray(currentUser.history)) currentUser.history = [];
  const entry = { ...booking, _bid: nextBid(), status: 'confirmed', bookedAt: Date.now() };

  // CO3 — Enqueue → immediately dequeue (visual pass-through)
  queueMirror.push(entry);
  paymentQ.enqueue(entry);
  paymentQ.dequeue();
  queueMirror.shift();

  currentUser.history.push(entry);
  updateCurrentUser();
  renderDashboard();
  initHistory(false);
  toast(`✦ ${entry.type} booked — $${entry.price.toLocaleString()}`, 'success');
}

/* ════════════════════════════════════════
   PRICE PREVIEW HELPERS
   ════════════════════════════════════════ */

function previewFlightPrice() {
  const cls    = document.getElementById('seatClass')?.value;
  const coupon = document.getElementById('flightCoupon')?.value || '';
  if (!cls) return;
  const base  = cls === 'Economy' ? 200 : cls === 'Business' ? 500 : 900;
  const final = applyCoupon(coupon, base);
  const el    = document.getElementById('flightPrice');
  if (!el) return;
  el.textContent = coupon && applyCoupon(coupon, base) !== base
    ? `$${base} → $${final} (coupon applied)`
    : `Total: $${final}`;
}

function previewHotelPrice() {
  const ci     = document.getElementById('checkIn')?.value;
  const co     = document.getElementById('checkOut')?.value;
  const stars  = document.getElementById('hotelStars')?.value;
  const coupon = document.getElementById('hotelCoupon')?.value || '';
  const el     = document.getElementById('hotelPrice');
  if (!el) return;
  if (!ci || !co) { el.textContent = ''; return; }
  const nights = Math.max(1, Math.round((new Date(co) - new Date(ci)) / 86400000));
  const rate   = stars == 3 ? 100 : stars == 4 ? 180 : 300;
  const base   = nights * rate;
  const final  = applyCoupon(coupon, base);
  el.textContent = coupon && final !== base
    ? `${nights} night(s) × $${rate} = $${base} → $${final} (coupon)`
    : `${nights} night(s) × $${rate} = $${final}`;
}

function previewCarPrice() {
  const type   = document.getElementById('carType')?.value;
  const coupon = document.getElementById('carCoupon')?.value || '';
  const el     = document.getElementById('carPrice');
  if (!el || !type) return;
  const base  = type === 'Sedan' ? 60 : type === 'SUV' ? 90 : 150;
  const final = applyCoupon(coupon, base);
  el.textContent = coupon && final !== base
    ? `$${base}/day → $${final}/day (coupon applied)`
    : `Total: $${final}/day`;
}

/* ════════════════════════════════════════
   FLIGHT BOOKING
   ════════════════════════════════════════ */

function bookFlight() {
  const from   = document.getElementById('from').value.trim();
  const to     = document.getElementById('to').value.trim();
  const date   = document.getElementById('flightDate').value;
  const cls    = document.getElementById('seatClass').value;
  const coupon = document.getElementById('flightCoupon').value;
  if (!from || !to || !date) { toast('Please fill all fields', 'error'); return; }
  if (new Date(date) < new Date(new Date().toDateString())) { toast('Travel date cannot be in the past', 'error'); return; }
  const base  = cls === 'Economy' ? 200 : cls === 'Business' ? 500 : 900;
  const price = applyCoupon(coupon, base);
  recordBooking({
    type: 'Flight',
    detail: `${from} → ${to} (${cls})`,
    price,
    travelDate: date,
    date: new Date().toLocaleString()
  });
  // Clear form
  ['from','to','flightDate','flightCoupon'].forEach(id => document.getElementById(id).value = '');
  previewFlightPrice();
}

/* ════════════════════════════════════════
   HOTEL BOOKING
   ════════════════════════════════════════ */

function bookHotel() {
  const city   = document.getElementById('hotelCity').value.trim();
  const ci     = document.getElementById('checkIn').value;
  const co     = document.getElementById('checkOut').value;
  const stars  = document.getElementById('hotelStars').value;
  const coupon = document.getElementById('hotelCoupon').value;
  if (!city || !ci || !co) { toast('Please fill all fields', 'error'); return; }
  if (new Date(co) <= new Date(ci)) { toast('Check-out must be after check-in', 'error'); return; }
  const nights = Math.max(1, Math.round((new Date(co) - new Date(ci)) / 86400000));
  const rate   = stars == 3 ? 100 : stars == 4 ? 180 : 300;
  const price  = applyCoupon(coupon, rate * nights);
  recordBooking({
    type: 'Hotel',
    detail: `${city} (${stars}★, ${nights} night${nights > 1 ? 's' : ''})`,
    price,
    travelDate: ci,
    date: new Date().toLocaleString()
  });
  ['hotelCity','checkIn','checkOut','hotelCoupon'].forEach(id => document.getElementById(id).value = '');
  previewHotelPrice();
}

/* ════════════════════════════════════════
   CAR BOOKING
   ════════════════════════════════════════ */

function bookCar() {
  const city   = document.getElementById('carCity').value.trim();
  const date   = document.getElementById('carDate').value;
  const type   = document.getElementById('carType').value;
  const coupon = document.getElementById('carCoupon').value;
  if (!city || !date) { toast('Please fill all fields', 'error'); return; }
  const base  = type === 'Sedan' ? 60 : type === 'SUV' ? 90 : 150;
  const price = applyCoupon(coupon, base);
  recordBooking({
    type: 'Car',
    detail: `${type} in ${city}`,
    price,
    travelDate: date,
    date: new Date().toLocaleString()
  });
  ['carCity','carDate','carCoupon'].forEach(id => document.getElementById(id).value = '');
  previewCarPrice();
}

/* ════════════════════════════════════════
   PACKAGES — Binary Search (CO1)
   ════════════════════════════════════════ */

function renderPackages(highlightPrice = null) {
  const grid = document.getElementById('packagesGrid');
  if (!grid) return;
  grid.innerHTML = '';
  PACKAGES.forEach((pkg, idx) => {
    const highlighted = highlightPrice !== null && pkg.price === highlightPrice;
    const card = document.createElement('div');
    card.className = `pkg-card${highlighted ? ' pkg-highlight' : ''}`;
    card.innerHTML = `
      <span class="pkg-emoji">${pkg.emoji}</span>
      <h3>${escHtml(pkg.name)}</h3>
      <div class="pkg-price">$${pkg.price.toLocaleString()}</div>
      <button class="btn-primary sm pkg-book-btn" data-idx="${idx}">Book Now</button>
    `;
    card.querySelector('.pkg-book-btn').addEventListener('click', () => bookPackage(idx));
    grid.appendChild(card);
  });
}

function bookPackage(idx) {
  const pkg = PACKAGES[idx];
  if (!pkg) { toast('Package not found', 'error'); return; }
  recordBooking({
    type: 'Package',
    detail: pkg.name,
    price: pkg.price,
    travelDate: new Date().toISOString().split('T')[0],
    date: new Date().toLocaleString()
  });
}

function searchPackageByPrice() {
  const target = parseInt(document.getElementById('pkgSearchPrice').value);
  const banner = document.getElementById('pkgSearchResult');
  if (isNaN(target)) { toast('Enter a valid price', 'error'); return; }
  // CO1 — sort then binary search
  const sorted = [...PACKAGES].sort((a, b) => a.price - b.price);
  let lo = 0, hi = sorted.length - 1, found = null;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (sorted[mid].price === target) { found = sorted[mid]; break; }
    sorted[mid].price < target ? lo++ : hi--;
  }
  if (found) {
    banner.textContent = `✦ Found: ${found.name} — $${found.price.toLocaleString()}`;
    banner.className = 'result-banner found';
    renderPackages(target);
  } else {
    banner.textContent = `No package found at $${target.toLocaleString()}`;
    banner.className = 'result-banner notfound';
    renderPackages();
  }
}

/* ════════════════════════════════════════
   ITINERARY — Doubly Linked List (CO2)
   ════════════════════════════════════════ */

function addItDay() {
  const title = document.getElementById('itDayTitle').value.trim();
  const note  = document.getElementById('itDayNote').value.trim();
  if (!title) { toast('Enter a day title', 'error'); return; }
  itinerary.append(title, note);
  document.getElementById('itDayTitle').value = '';
  document.getElementById('itDayNote').value  = '';
  saveItDays();
  renderItinerary();
  toast('Day added', 'success');
}

function deleteItDay(id) {
  itinerary.deleteById(id);
  saveItDays();
  renderItinerary();
}

function moveItDayUp(id) {
  itinerary.moveUp(id);
  saveItDays();
  renderItinerary();
}

function saveItDays() {
  currentUser.itDays = itinerary.toArray().map(n => ({ title: n.title, note: n.note }));
  updateCurrentUser();
}

function renderItinerary() {
  const container = document.getElementById('itDayList');
  if (!container) return;
  const nodes = itinerary.toArray();
  if (!nodes.length) {
    container.innerHTML = '<p style="color:var(--text3);font-size:13px;font-style:italic">No days added yet. Start planning your trip!</p>';
  } else {
    container.innerHTML = nodes.map((n, i) => `
      <div class="it-day-card">
        <div class="it-day-num">Day ${i + 1}</div>
        <div class="it-day-body">
          <strong>${escHtml(n.title)}</strong>
          ${n.note ? `<p>${escHtml(n.note)}</p>` : ''}
        </div>
        <div class="it-day-actions">
          ${i > 0 ? `<button class="icon-btn" onclick="moveItDayUp(${n.id})" title="Move Up">↑</button>` : ''}
          <button class="icon-btn danger" onclick="deleteItDay(${n.id})" title="Delete">✕</button>
        </div>
      </div>
    `).join('');
  }
  const ta = document.getElementById('itineraryText');
  if (ta) ta.value = currentUser.itinerary || '';
}

function saveItinerary() {
  currentUser.itinerary = document.getElementById('itineraryText').value;
  updateCurrentUser();
  toast('Notes saved', 'success');
}

/* ════════════════════════════════════════
   HISTORY — full rewrite
   ════════════════════════════════════════ */

/* ─ Type helpers ─ */
function typeIcon(type) {
  return { Flight: '✦', Hotel: '▦', Car: '◉', Package: '◈' }[type] || '◈';
}
function typeEmoji(type) {
  return { Flight: '✈️', Hotel: '🏨', Car: '🚗', Package: '📦' }[type] || '🎫';
}
function badgeClass(type) {
  return `badge-${type.toLowerCase()}`;
}
function iconBgClass(type) {
  return `hi-${type.toLowerCase()}`;
}
function truncate(str, n) { return str.length > n ? str.slice(0, n) + '…' : str; }
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ─ Queue visualiser ─ */
function refreshQueueVisual() {
  const el = document.getElementById('queueVisual');
  if (!el) return;
  if (!queueMirror.length) {
    el.innerHTML = '<div class="ds-empty">Queue is empty</div>';
    return;
  }
  el.innerHTML = queueMirror.map((item, i) => `
    <div class="q-item ${i === 0 ? 'q-front' : ''}">
      ${i === 0 ? '<span class="q-tag">NEXT</span>' : ''}
      <span class="q-item-icon">${typeEmoji(item.type)}</span>
      <div class="q-item-info">
        <span class="q-item-type">${item.type}</span>
        <span class="q-item-detail">${truncate(item.detail, 22)}</span>
      </div>
      <span class="q-item-price">$${item.price.toLocaleString()}</span>
    </div>
  `).join('');
}

/* ─ Stack visualiser ─ */
function refreshStackVisual() {
  const el  = document.getElementById('stackVisual');
  const btn = document.getElementById('undoBtn');
  if (!el) return;
  const items = [...undoStack.items].reverse(); // top of stack first
  if (!items.length) {
    el.innerHTML = '<div class="ds-empty">Stack is empty</div>';
    if (btn) btn.disabled = true;
    return;
  }
  if (btn) btn.disabled = false;
  el.innerHTML = items.map((item, i) => `
    <div class="s-item ${i === 0 ? 's-top' : ''}">
      ${i === 0 ? '<span class="s-tag">TOP</span>' : ''}
      <span class="s-item-icon">${typeEmoji(item.type)}</span>
      <div class="s-item-info">
        <span class="s-item-type">${item.type}</span>
        <span class="s-item-detail">${truncate(item.detail, 22)}</span>
      </div>
      <span class="s-item-price">$${item.price.toLocaleString()}</span>
    </div>
  `).join('');
}

/* ─ Stats bar ─ */
function renderHistStats() {
  const el = document.getElementById('histStatsRow');
  if (!el || !currentUser) return;
  const h     = currentUser.history;
  const total = h.reduce((s, b) => s + b.price, 0);
  const types = {};
  h.forEach(b => types[b.type] = (types[b.type] || 0) + 1);
  const mostBookedEntry = Object.entries(types).sort((a, b) => b[1] - a[1])[0];

  el.innerHTML = `
    <div class="hstat-card">
      <div class="hstat-icon">◷</div>
      <div class="hstat-info">
        <span class="hstat-val">${h.length}</span>
        <span class="hstat-label">Total Bookings</span>
      </div>
    </div>
    <div class="hstat-card">
      <div class="hstat-icon">◈</div>
      <div class="hstat-info">
        <span class="hstat-val">$${total.toLocaleString()}</span>
        <span class="hstat-label">Total Spent</span>
      </div>
    </div>
    <div class="hstat-card">
      <div class="hstat-icon">${mostBookedEntry ? typeEmoji(mostBookedEntry[0]) : '—'}</div>
      <div class="hstat-info">
        <span class="hstat-val">${mostBookedEntry ? mostBookedEntry[0] : '—'}</span>
        <span class="hstat-label">Most Booked</span>
      </div>
    </div>
    <div class="hstat-card">
      <div class="hstat-icon">📚</div>
      <div class="hstat-info">
        <span class="hstat-val">${undoStack.items.length}</span>
        <span class="hstat-label">Undo Stack</span>
      </div>
    </div>
  `;
}

/* ─ Cancel a booking (uses stable _bid) ─ */
function cancelBooking(bid) {
  const idx = currentUser.history.findIndex(b => b._bid === bid);
  if (idx === -1) { toast('Booking not found', 'error'); return; }
  const removed = currentUser.history.splice(idx, 1)[0];
  undoStack.push(removed);  // CO3 — push to stack
  updateCurrentUser();
  applyHistoryFilters();
  renderDashboard();
  renderHistStats();
  refreshStackVisual();
  toast('Booking cancelled — hit Undo to restore', 'info');
}

/* ─ Undo (pop from stack) ─ */
function undoCancel() {
  if (undoStack.isEmpty()) { toast('Nothing to undo', 'error'); return; }
  const booking = undoStack.pop();  // CO3 — pop from stack
  currentUser.history.push(booking);
  updateCurrentUser();
  applyHistoryFilters();
  renderDashboard();
  renderHistStats();
  refreshStackVisual();
  toast(`↩ Restored: ${booking.type} — ${booking.detail}`, 'success');
}

/* ─ Live text search ─ */
function liveSearchHistory() {
  const val = document.getElementById('histSearchInput').value;
  const btn = document.getElementById('clearSearchBtn');
  if (btn) btn.classList.toggle('visible', val.length > 0);
  applyHistoryFilters();
}

function clearSearch() {
  document.getElementById('histSearchInput').value = '';
  const btn = document.getElementById('clearSearchBtn');
  if (btn) btn.classList.remove('visible');
  applyHistoryFilters();
}

/* ─ Price binary search ─ */
function searchHistoryByPrice() {
  const target = parseInt(document.getElementById('histSearchPrice').value);
  const banner = document.getElementById('searchResultBanner');
  if (isNaN(target)) { toast('Enter a valid price', 'error'); return; }

  // CO1 — quickSort then binary search
  const sorted = quickSort([...currentUser.history]);
  const idx    = binarySearchByPrice(sorted, target);
  if (idx !== -1) {
    const matches = sorted.filter(b => b.price === target);
    banner.textContent = `Binary Search ✦ — Found ${matches.length} booking${matches.length !== 1 ? 's' : ''} at $${target.toLocaleString()}`;
    banner.className   = 'result-banner found';
    renderHistory(matches);
  } else {
    banner.textContent = `Binary Search — No bookings found at $${target.toLocaleString()}`;
    banner.className   = 'result-banner notfound';
    renderHistory([]);
  }
}

function clearPriceSearch() {
  document.getElementById('histSearchPrice').value = '';
  const banner = document.getElementById('searchResultBanner');
  if (banner) { banner.textContent = ''; banner.className = 'result-banner'; }
  applyHistoryFilters();
}

/* ─ Main filter + sort ─ */
function applyHistoryFilters() {
  // Clear price-search banner when re-filtering manually
  const banner = document.getElementById('searchResultBanner');
  if (banner && !banner.textContent.includes('Binary Search')) {
    banner.textContent = ''; banner.className = 'result-banner';
  }

  const query  = (document.getElementById('histSearchInput')?.value || '').toLowerCase().trim();
  const type   = document.getElementById('histFilterType')?.value || 'all';
  const sortBy = document.getElementById('histSortBy')?.value || 'newest';

  // Always start from a fresh copy in original push-order
  let list = [...currentUser.history];

  // Text filter
  if (query) list = list.filter(b =>
    b.detail.toLowerCase().includes(query) ||
    b.type.toLowerCase().includes(query)
  );

  // Type filter
  if (type !== 'all') list = list.filter(b => b.type === type);

  // Sort
  switch (sortBy) {
    case 'newest':     list.reverse(); break;
    case 'oldest':     /* already chronological */ break;
    case 'price-high': list.sort((a, b) => b.price - a.price); break;
    case 'price-low':  quickSort(list); break;  // CO1
  }

  // Clear binary-search banner on manual filter change
  if (banner && banner.textContent.startsWith('Binary Search')) {
    banner.textContent = ''; banner.className = 'result-banner';
  }

  renderHistory(list);
  renderHistStats();
  refreshQueueVisual();
  refreshStackVisual();
}

/* ─ Render history list ─ */
function renderHistory(list) {
  const ul    = document.getElementById('historyList');
  const empty = document.getElementById('emptyHistory');
  if (!ul) return;
  ul.innerHTML = '';

  if (!list || !list.length) {
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';

  list.forEach(b => {
    if (!b._bid) b._bid = nextBid(); // safety fallback

    const li = document.createElement('li');
    li.className = 'history-item';
    li.innerHTML = `
      <div class="hi-icon-wrap">
        <div class="hi-icon ${iconBgClass(b.type)}">${typeEmoji(b.type)}</div>
      </div>
      <div class="hi-body">
        <div class="hi-top">
          <span class="hi-type-badge ${badgeClass(b.type)}">${b.type}</span>
          <span class="hi-price">$${b.price.toLocaleString()}</span>
        </div>
        <div class="hi-detail">${escHtml(b.detail)}</div>
        <div class="hi-meta">
          <span>Booked ${b.date}</span>
          ${b.travelDate ? `<span>Travel: ${b.travelDate}</span>` : ''}
        </div>
      </div>
      <div class="hi-actions">
        <button class="btn-danger" onclick="cancelBooking(${b._bid})">Cancel</button>
      </div>
    `;
    ul.appendChild(li);
  });
}

/* ─ Entry point for history section ─ */
function initHistory(resetFilters = true) {
  if (!currentUser) return;

  if (resetFilters) {
    // Reset all filter controls
    const searchInput = document.getElementById('histSearchInput');
    const filterType  = document.getElementById('histFilterType');
    const sortBy      = document.getElementById('histSortBy');
    const priceInput  = document.getElementById('histSearchPrice');
    const banner      = document.getElementById('searchResultBanner');
    const clearBtn    = document.getElementById('clearSearchBtn');

    if (searchInput) searchInput.value = '';
    if (filterType)  filterType.value  = 'all';
    if (sortBy)      sortBy.value      = 'newest';
    if (priceInput)  priceInput.value  = '';
    if (banner)    { banner.textContent = ''; banner.className = 'result-banner'; }
    if (clearBtn)    clearBtn.classList.remove('visible');
  }

  // Show newest first by default
  renderHistory([...currentUser.history].reverse());
  renderHistStats();
  refreshQueueVisual();
  refreshStackVisual();
}

/* ════════════════════════════════════════
   DASHBOARD
   ════════════════════════════════════════ */

function renderDashboard() {
  if (!currentUser) return;
  const typeCounts = {};
  let total = 0;
  currentUser.history.forEach(b => {
    typeCounts[b.type] = (typeCounts[b.type] || 0) + 1;
    total += b.price;
  });
  document.getElementById('flightCount').textContent  = typeCounts['Flight']  || 0;
  document.getElementById('hotelCount').textContent   = typeCounts['Hotel']   || 0;
  document.getElementById('carCount').textContent     = typeCounts['Car']     || 0;
  document.getElementById('packageCount').textContent = typeCounts['Package'] || 0;
  document.getElementById('totalSpend').textContent   = `$${total.toLocaleString()}`;

  // Spend bar (capped at $50,000 for visual)
  const bar = document.getElementById('spendBar');
  if (bar) bar.style.width = Math.min(100, (total / 50000) * 100) + '%';

  // Greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const greetEl = document.getElementById('dashGreeting');
  if (greetEl) greetEl.textContent = `${greeting}, ${currentUser.name.split(' ')[0]}`;

  // CO3 — Min-Heap for upcoming trips by nearest date
  const heap  = new MinHeap();
  const today = new Date().toISOString().split('T')[0];
  currentUser.history.forEach(b => { if (b.travelDate && b.travelDate >= today) heap.insert(b); });

  const ul = document.getElementById('upcomingTrips');
  if (!ul) return;
  ul.innerHTML = '';
  let shown = 0;
  while (heap.length > 0 && shown < 5) {
    const t  = heap.extractMin();
    const li = document.createElement('li');
    li.className = 'trip-item';
    li.innerHTML = `
      <span class="trip-dot"></span>
      <strong>${t.type}</strong> — ${truncate(t.detail, 28)}
      <em>${t.travelDate}</em>
    `;
    ul.appendChild(li);
    shown++;
  }
  if (!shown) ul.innerHTML = '<li class="empty-note">No upcoming trips yet</li>';

  // Quote
  const quoteEl = document.getElementById('dailyQuoteBox');
  if (quoteEl) quoteEl.textContent = QUOTES[new Date().getDay() % QUOTES.length];
}

/* ════════════════════════════════════════
   ROUTE FINDER — BFS Graph (CO4)
   ════════════════════════════════════════ */

function showRoute() {
  const from = document.getElementById('routeFrom').value;
  const to   = document.getElementById('routeTo').value;
  const box  = document.getElementById('routeResult');
  if (!from || !to) { box.innerHTML = '<span class="notfound">Select both cities.</span>'; return; }
  if (from === to)  { box.innerHTML = `<span class="found">You're already there! 📍</span>`; return; }
  const path = bfsRoute(from, to);
  if (path) {
    const stops = path.length - 1;
    box.innerHTML =
      `<span class="found">Shortest route — ${stops} stop${stops !== 1 ? 's' : ''}:</span><br>` +
      path.map(c => `<span class="route-stop">${c}</span>`).join(' → ');
  } else {
    box.innerHTML = `<span class="notfound">No route found between ${from} and ${to}.</span>`;
  }
}

/* ════════════════════════════════════════
   PROFILE
   ════════════════════════════════════════ */

function renderProfile() {
  if (!currentUser) return;
  const initials = currentUser.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  document.getElementById('profileAvatar').textContent = initials;
  document.getElementById('profileInfo').innerHTML = `
    <p><strong>Name</strong> — ${escHtml(currentUser.name)}</p>
    <p><strong>Email</strong> — ${escHtml(currentUser.email)}</p>
    <p><strong>Bookings</strong> — ${currentUser.history.length}</p>
    <p><strong>Total Spent</strong> — $${currentUser.history.reduce((a, b) => a + b.price, 0).toLocaleString()}</p>
  `;
  document.getElementById('editName').value  = currentUser.name;
  document.getElementById('editEmail').value = currentUser.email;
}

function saveProfile() {
  const name  = document.getElementById('editName').value.trim();
  const email = document.getElementById('editEmail').value.trim().toLowerCase();
  if (!name || !email) { toast('Fields cannot be empty', 'error'); return; }
  if (!/\S+@\S+\.\S+/.test(email)) { toast('Invalid email address', 'error'); return; }
  if (email !== currentUser.email && userStore.get(email)) {
    toast('Email already in use', 'error'); return;
  }
  if (email !== currentUser.email) {
    userStore.delete(currentUser.email);
    currentUser.email = email;
  }
  currentUser.name = name;
  updateCurrentUser();
  renderProfile();
  toast('Profile updated', 'success');
}

/* ════════════════════════════════════════
   KEYBOARD SHORTCUTS
   ════════════════════════════════════════ */

document.addEventListener('keydown', e => {
  // Escape closes sidebar on mobile
  if (e.key === 'Escape') closeSidebar();
});

/* ════════════════════════════════════════
   INIT
   ════════════════════════════════════════ */

loadUsersFromStorage();

(function boot() {
  // Hide sidebar/hamburger until we know login state
  const sidebar   = document.getElementById('sidebar');
  const hamburger = document.getElementById('hamburger');
  const main      = document.getElementById('mainContent');
  if (sidebar)   sidebar.style.display   = 'none';
  if (hamburger) hamburger.style.display = 'none';
  if (main)      main.style.marginLeft   = '0';

  // Try restoring a saved session
  try {
    const savedEmail = localStorage.getItem('tp_session');
    if (savedEmail) {
      const user = userStore.get(savedEmail);
      if (user) {
        currentUser = user;
        currentUser.history.forEach(b => { if (!b._bid) b._bid = nextBid(); });
        itinerary.head = itinerary.tail = null; itinerary.size = 0;
        (currentUser.itDays || []).forEach(d => itinerary.append(d.title, d.note));
        navigate('dashboard');
        return;
      }
      localStorage.removeItem('tp_session');
    }
  } catch(e) { console.warn('Session restore error', e); }

  // No valid session — go to login
  navigate('login');
})();
