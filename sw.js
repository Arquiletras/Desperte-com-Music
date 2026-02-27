const CACHE_NAME = 'desperte-v2';
const ASSETS = [
  '/Desperte-com-Music/',
  '/Desperte-com-Music/index.html',
  '/Desperte-com-Music/manifest.json',
  '/Desperte-com-Music/icon-192.png',
  '/Desperte-com-Music/icon-512.png',
  '/Desperte-com-Music/icon-maskable-192.png',
  '/Desperte-com-Music/icon-maskable-512.png'
];

// Install — cache all assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  clients.claim();
});

// Fetch — serve from cache, fallback to network
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(response => {
        // Cache new requests dynamically
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => caches.match('/Desperte-com-Music/index.html'));
    })
  );
});

// ─── Alarm Notifications ─────────────────────────────────────────────────
const scheduledAlarms = new Map();
const bellIntervals = new Map();

self.addEventListener('message', e => {
  if (!e.data) return;

  // Schedule alarm notification
  if (e.data.type === 'SCHEDULE_ALARM') {
    const { alarm, delay } = e.data;
    // Clear existing if same id
    if (scheduledAlarms.has(alarm.id)) clearTimeout(scheduledAlarms.get(alarm.id));
    const tid = setTimeout(() => {
      self.registration.showNotification('🎵 Desperte com Música', {
        body: `⏰ Alarme das ${String(alarm.hour).padStart(2,'0')}:${String(alarm.min).padStart(2,'0')} — ${alarm.label}`,
        icon: '/Desperte-com-Music/icon-192.png',
        badge: '/Desperte-com-Music/icon-192.png',
        tag: 'alarm-' + alarm.id,
        requireInteraction: true,
        vibrate: [500, 200, 500, 200, 500, 200, 500],
        actions: [
          { action: 'stop',   title: '⏹ Parar'       },
          { action: 'snooze', title: '💤 Soneca 5min'  }
        ]
      });
      scheduledAlarms.delete(alarm.id);
    }, delay);
    scheduledAlarms.set(alarm.id, tid);
  }

  // Cancel alarm
  if (e.data.type === 'CANCEL_ALARM') {
    if (scheduledAlarms.has(e.data.id)) {
      clearTimeout(scheduledAlarms.get(e.data.id));
      scheduledAlarms.delete(e.data.id);
    }
  }

  // Schedule bell interval
  if (e.data.type === 'SCHEDULE_BELL') {
    const { interval, label } = e.data;
    // Clear old bell
    if (bellIntervals.has('bell')) clearInterval(bellIntervals.get('bell'));
    const iid = setInterval(() => {
      self.registration.showNotification('🔔 ' + label, {
        body: `Sino periódico — a cada ${interval} minutos`,
        icon: '/Desperte-com-Music/icon-192.png',
        tag: 'bell',
        silent: false,
        vibrate: [200, 100, 200, 100, 200]
      });
    }, interval * 60 * 1000);
    bellIntervals.set('bell', iid);
  }

  // Stop bell
  if (e.data.type === 'STOP_BELL') {
    if (bellIntervals.has('bell')) {
      clearInterval(bellIntervals.get('bell'));
      bellIntervals.delete('bell');
    }
  }
});

// Notification click handler
self.addEventListener('notificationclick', e => {
  e.notification.close();

  if (e.action === 'snooze') {
    setTimeout(() => {
      self.registration.showNotification('💤 Soneca — Desperte com Música', {
        body: 'Hora de acordar de verdade agora! 🎵',
        icon: '/Desperte-com-Music/icon-192.png',
        requireInteraction: true,
        vibrate: [500, 200, 500, 200, 500]
      });
    }, 5 * 60 * 1000);
    return;
  }

  // Open app on stop or tap
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
      const focused = cs.find(c => c.focused);
      if (focused) return focused.focus();
      if (cs.length) return cs[0].focus();
      return clients.openWindow('/Desperte-com-Music/');
    })
  );
});

// Push notifications (future use)
self.addEventListener('push', e => {
  if (!e.data) return;
  const data = e.data.json();
  e.waitUntil(
    self.registration.showNotification(data.title || '🎵 Desperte', {
      body: data.body || 'Hora de acordar!',
      icon: '/Desperte-com-Music/icon-192.png'
    })
  );
});
