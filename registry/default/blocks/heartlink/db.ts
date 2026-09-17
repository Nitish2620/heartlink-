import type { ChatItem } from './types';

export const INITIAL_CHATS: ChatItem[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    lastMessage: "Voice note (0:04)",
    timestamp: 'Just now',
    lastUpdated: Date.now(),
    unreadCount: 0,
    isOnline: true,
    isPinned: true,
    statusText: 'Active now',
    isNitroSubscriber: true,
    nitroTier: 'nitro_pro',
    isMatch: true,
    matchedAt: Date.now() - 3600000 * 20,
    expiresAt: Date.now() + 3600000 * 52,
    messages: [
      { id: 'm1', senderId: '1', senderName: 'Priya Sharma', text: 'Hey Ray! Did you check the latest design assets?', timestamp: '1:15 PM', isPinnedInThread: true },
      { id: 'm2', senderId: 'me', senderName: 'You', text: 'Yes, looking at them now. They look great!', timestamp: '1:18 PM', isMe: true, status: 'read', reactions: [{ emoji: 'thumbs-up', count: 1, users: ['1'] }] },
      { id: 'm3', senderId: '1', senderName: 'Priya Sharma', text: "I've sent the files over.", timestamp: '1:20 PM', reactions: [{ emoji: 'heart', count: 1, users: ['me'] }] },
      { 
        id: 'm4', 
        senderId: 'me', 
        senderName: 'You', 
        text: 'Perfect! I have verified the updates and pushed to main.', 
        timestamp: '1:22 PM', 
        isMe: true, 
        status: 'read' 
      }
    ]
  },
  {
    id: '2',
    name: 'James Okonkwo',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Let me check and get back to you.',
    timestamp: 'Yesterday',
    lastUpdated: Date.now() - 100000,
    isOnline: true,
    statusText: 'Online',
    isMatch: true,
    matchedAt: Date.now() - 3600000 * 70,
    expiresAt: Date.now() + 3600000 * 3.5, // 3.5 hours remaining!
    pulseExtended: false,
    messages: [
      { id: 'm1', senderId: '2', senderName: 'James Okonkwo', text: 'Can we schedule the review meeting tomorrow?', timestamp: 'Yesterday' },
      { id: 'm2', senderId: 'me', senderName: 'You', text: 'Sure, let me know what time works best.', timestamp: 'Yesterday', isMe: true, status: 'delivered' },
      { id: 'm3', senderId: '2', senderName: 'James Okonkwo', text: 'Let me check and get back to you.', timestamp: 'Yesterday' },
      { id: 'm4', senderId: 'me', senderName: 'You', text: 'Sounds good, no rush.', timestamp: '10:00 AM', isMe: true, status: 'sent' }
    ]
  },
  {
    id: '3',
    name: 'Elena Vasquez',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'The meeting link is in the calendar.',
    timestamp: 'Yesterday',
    lastUpdated: Date.now() - 200000,
    isOnline: false,
    statusText: 'Last seen yesterday',
    isMatch: true,
    matchedAt: Date.now() - 3600000 * 40,
    expiresAt: Date.now() + 3600000 * 32,
    messages: [
      { id: 'm1', senderId: '3', senderName: 'Elena Vasquez', text: 'The meeting link is in the calendar.', timestamp: 'Yesterday' }
    ]
  },
  {
    id: '4',
    name: 'Alex Turner',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Sure, no problem at all.',
    timestamp: 'Mon',
    lastUpdated: Date.now() - 300000,
    isOnline: false,
    statusText: 'Last seen Mon',
    isMatch: true,
    matchedAt: Date.now() - 3600000 * 60,
    expiresAt: Date.now() + 3600000 * 12,
    messages: [
      { id: 'm1', senderId: '4', senderName: 'Alex Turner', text: 'Sure, no problem at all.', timestamp: 'Mon' }
    ]
  },
  {
    id: '5',
    name: 'Yuki Tanaka',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    lastMessage: 'Looking forward to the demo.',
    timestamp: 'Mon',
    lastUpdated: Date.now() - 400000,
    isOnline: true,
    statusText: 'Online',
    messages: [
      { id: 'm1', senderId: '5', senderName: 'Yuki Tanaka', text: 'Looking forward to the demo.', timestamp: 'Mon' }
    ]
  }
];

const IDB_NAME = 'ChatSimpleDB';
const IDB_STORE = 'chats';
const IDB_VERSION = 1;

let _cachedDB: IDBDatabase | null = null;

export function openSimpleDB(): Promise<IDBDatabase> {
  if (_cachedDB) {
    try {
      if (_cachedDB.objectStoreNames.contains(IDB_STORE)) {
        return Promise.resolve(_cachedDB);
      }
    } catch {
      _cachedDB = null;
    }
  }
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, IDB_VERSION);
    req.onupgradeneeded = () => {
      try {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      } catch (err) {
        reject(err);
      }
    };
    req.onblocked = () => {
      console.warn('IDB Blocked: Please close other tabs.');
      _cachedDB = null;
    };
    req.onsuccess = () => {
      _cachedDB = req.result;
      _cachedDB.onclose = () => { _cachedDB = null; };
      resolve(_cachedDB);
    };
    req.onerror = () => reject(req.error);
  });
}

export function idbSaveChats(chats: ChatItem[], queueRef: React.MutableRefObject<Promise<void>>): Promise<void> {
  queueRef.current = queueRef.current.then(() => 
    openSimpleDB().then(db => {
      return new Promise<void>((resolve, reject) => {
        try {
          const tx = db.transaction(IDB_STORE, 'readwrite');
          tx.oncomplete = () => resolve();
          tx.onabort = () => reject(new Error('IDB Transaction aborted'));
          tx.onerror = () => reject(tx.error);
          
          tx.objectStore(IDB_STORE).put(chats, 'data');
        } catch (err) {
          reject(err);
        }
      });
    }).catch(err => {
      console.error('Save failed:', err);
    })
  );
  return queueRef.current;
}

export function idbLoadChats(): Promise<ChatItem[] | null> {
  return openSimpleDB().then(db => {
    return new Promise<ChatItem[] | null>((resolve, reject) => {
      try {
        const tx = db.transaction(IDB_STORE, 'readonly');
        const req = tx.objectStore(IDB_STORE).get('data');
        tx.oncomplete = () => {
          const val = req.result;
          if (Array.isArray(val) && val.length > 0) resolve(val);
          else resolve(null);
        };
        tx.onabort = () => reject(new Error('IDB Transaction aborted'));
        tx.onerror = () => reject(req.error);
      } catch (err) {
        reject(err);
      }
    });
  }).catch(() => null);
}

export function idbClearChats(queueRef: React.MutableRefObject<Promise<void>>): Promise<void> {
  queueRef.current = queueRef.current.then(() => 
    openSimpleDB().then(db => {
      return new Promise<void>((resolve, reject) => {
        try {
          const tx = db.transaction(IDB_STORE, 'readwrite');
          tx.oncomplete = () => resolve();
          tx.onabort = () => reject(new Error('IDB Transaction aborted'));
          tx.onerror = () => reject(tx.error);
          
          tx.objectStore(IDB_STORE).delete('data');
        } catch (err) {
          reject(err);
        }
      });
    }).catch(err => {
      console.error('Clear failed:', err);
    })
  );
  return queueRef.current;
}


