const CACHE_NAME = 'desperte-v1';
const ASSETS = ['/', '/index.html', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

// Alarm notifications via service worker
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_ALARM') {
    const { alarm, delay } = e.data;
    setTimeout(() => {
      self.registration.showNotification('🎵 Desperte com Música', {
        body: `Alarme das ${alarm.hour}:${alarm.min} — ${alarm.label}`,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: 'alarm-' + alarm.id,
        requireInteraction: true,
        vibrate: [500, 200, 500, 200, 500],
        actions: [
          { action: 'stop', title: '⏹ Parar' },
          { action: 'snooze', title: '💤 Soneca 5min' }
        ]
      });
    }, delay);
  }

  if (e.data && e.data.type === 'SCHEDULE_BELL') {
    const { interval, label } = e.data;
    setInterval(() => {
      self.registration.showNotification('🔔 ' + label, {
        body: 'Sino periódico — ' + interval + ' minutos',
        icon: '/icon-192.png',
        tag: 'bell',
        silent: false,
        vibrate: [200, 100, 200]
      });
    }, interval * 60 * 1000);
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'snooze') {
    setTimeout(() => {
      self.registration.showNotification('🎵 Soneca — Desperte com Música', {
        body: 'Hora de acordar!',
        icon: '/icon-192.png',
        requireInteraction: true,
        vibrate: [500, 200, 500]
      });
    }, 5 * 60 * 1000);
  }
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(cs => {
      if (cs.length) cs[0].focus();
      else clients.openWindow('/');
    })
  );
});
