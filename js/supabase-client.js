/* ============================================
   VYTAL — Supabase Client + Offline Queue
   UMD pattern, IIFE, no ES modules
   ============================================ */
(function() {
  'use strict';

  // TODO: Replace with your Supabase project credentials
  var SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
  var SUPABASE_KEY = 'YOUR_ANON_KEY';

  var client = null;
  var isOnline = navigator.onLine;

  /* --- Init Supabase --- */
  function init() {
    if (window.supabase && window.supabase.createClient) {
      client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    }
  }

  /* --- Offline Queue --- */
  var QUEUE_KEY = 'vytal_sync_queue';

  function getQueue() {
    try {
      return JSON.parse(localStorage.getItem(QUEUE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveQueue(queue) {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    updateSyncBadge();
  }

  function addToQueue(table, data) {
    var queue = getQueue();
    queue.push({
      id: Date.now() + '_' + Math.random().toString(36).substr(2, 6),
      table: table,
      data: data,
      timestamp: new Date().toISOString()
    });
    saveQueue(queue);
  }

  /* --- Sync Badge (red dot on nav) --- */
  function updateSyncBadge() {
    var queue = getQueue();
    var badges = document.querySelectorAll('.sync-badge');
    for (var i = 0; i < badges.length; i++) {
      if (queue.length > 0) {
        badges[i].classList.add('visible');
      } else {
        badges[i].classList.remove('visible');
      }
    }
  }

  /* --- Flush Queue to Supabase --- */
  function flushQueue() {
    if (!client || !isOnline) return Promise.resolve();
    var queue = getQueue();
    if (queue.length === 0) return Promise.resolve();

    var remaining = [];
    var promises = [];

    for (var i = 0; i < queue.length; i++) {
      (function(item) {
        var p = client.from(item.table).insert(item.data)
          .then(function(res) {
            if (res.error) {
              remaining.push(item);
            }
          })
          .catch(function() {
            remaining.push(item);
          });
        promises.push(p);
      })(queue[i]);
    }

    return Promise.all(promises).then(function() {
      saveQueue(remaining);
    });
  }

  /* --- CRUD Operations (online-first, queue fallback) --- */

  function insert(table, data) {
    if (!client || !isOnline) {
      addToQueue(table, data);
      return Promise.resolve({ data: data, offline: true });
    }

    return client.from(table).insert(data).select()
      .then(function(res) {
        if (res.error) {
          addToQueue(table, data);
          return { data: data, offline: true, error: res.error };
        }
        return { data: res.data, offline: false };
      })
      .catch(function() {
        addToQueue(table, data);
        return { data: data, offline: true };
      });
  }

  function select(table, filters) {
    if (!client || !isOnline) {
      return Promise.resolve({ data: [], offline: true });
    }

    var query = client.from(table).select('*');

    if (filters) {
      Object.keys(filters).forEach(function(key) {
        query = query.eq(key, filters[key]);
      });
    }

    return query.order('created_at', { ascending: false }).limit(100)
      .then(function(res) {
        return { data: res.data || [], error: res.error };
      })
      .catch(function() {
        return { data: [], offline: true };
      });
  }

  function update(table, id, data) {
    if (!client || !isOnline) {
      return Promise.resolve({ offline: true });
    }
    return client.from(table).update(data).eq('id', id)
      .then(function(res) {
        return { data: res.data, error: res.error };
      });
  }

  /* --- Network listeners --- */
  window.addEventListener('online', function() {
    isOnline = true;
    flushQueue();
  });

  window.addEventListener('offline', function() {
    isOnline = false;
  });

  /* --- LocalStorage helpers --- */
  function localGet(key, fallback) {
    try {
      var v = localStorage.getItem('vytal_' + key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) {
      return fallback;
    }
  }

  function localSet(key, value) {
    try {
      localStorage.setItem('vytal_' + key, JSON.stringify(value));
    } catch (e) { /* storage full */ }
  }

  /* --- Init on load --- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      init();
      updateSyncBadge();
      flushQueue();
    });
  } else {
    init();
    updateSyncBadge();
    flushQueue();
  }

  /* --- Public API --- */
  window.VYTAL_DB = {
    insert: insert,
    select: select,
    update: update,
    flushQueue: flushQueue,
    getQueueLength: function() { return getQueue().length; },
    localGet: localGet,
    localSet: localSet,
    isOnline: function() { return isOnline; }
  };

})();
