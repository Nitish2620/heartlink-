/**
 * useProfileSync — Shared React hook for seamless IndexedDB-backed
 * full profile state synchronization across all Discord clone components.
 *
 * HOW IT WORKS:
 * 1. On mount: reads the persisted UserProfileData from UserProfileCardDB.
 * 2. On write: updates IndexedDB AND dispatches a custom window event
 *    ("userProfileChanged") so all other mounted components react instantly.
 * 3. On listen: subscribes to the custom event so changes from ANY component
 *    are reflected everywhere in real-time without page refresh.
 *
 * USAGE:
 *   const [profile, setProfile] = useProfileSync(initialProfile);
 *   // `profile` always reflects the latest state from any source.
 *   // `setProfile(newProfile)` persists to IndexedDB + broadcasts globally.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import type { UserProfileData } from '../../registry/default/blocks/user-profile-card/types';

const DB_NAME = 'UserProfileCardDB';
const DB_VERSION = 1;
const STORE_NAME = 'profileData';
const KEY = 'userProfileState';
const EVENT_NAME = 'userProfileChanged';

/**
 * Opens (or creates) the UserProfileCardDB and returns a promise of IDBDatabase.
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Reads the current UserProfileData from IndexedDB.
 */
async function readProfileFromIDB(): Promise<UserProfileData | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const req = tx.objectStore(STORE_NAME).get(KEY);
      req.onsuccess = () => {
        resolve(req.result ?? null);
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Writes the full UserProfileData to IndexedDB.
 */
async function writeProfileToIDB(profile: UserProfileData): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(profile, KEY);
  } catch {
    // Silently fail — IndexedDB may be unavailable in certain environments
  }
}

/**
 * The main hook: returns [currentProfile, setProfile].
 *
 * @param initialProfile - The profile from props (used as default until IndexedDB loads).
 */
export function useProfileSync(
  initialProfile: UserProfileData
): [UserProfileData, (profile: UserProfileData) => void] {
  const [profile, setProfileState] = useState<UserProfileData>(initialProfile);
  const isHydrated = useRef(false);

  // 1. On mount: hydrate from IndexedDB (overrides prop if persisted value exists)
  useEffect(() => {
    let cancelled = false;
    readProfileFromIDB().then((stored) => {
      if (!cancelled && stored) {
        setProfileState(stored);
      }
      isHydrated.current = true;
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Global event listener: sync state when OTHER components change it
  useEffect(() => {
    const handleProfileChange = (e: Event) => {
      const customEvent = e as CustomEvent<UserProfileData>;
      if (customEvent.detail) {
        setProfileState(customEvent.detail);
      }
    };

    window.addEventListener(EVENT_NAME, handleProfileChange);
    return () => window.removeEventListener(EVENT_NAME, handleProfileChange);
  }, []);

  // 3. Setter function: updates local state, IndexedDB, and broadcasts to other components
  const setProfile = useCallback((newProfile: UserProfileData) => {
    // A) Update local React state instantly
    setProfileState(newProfile);

    // B) Fire and forget: Persist to IndexedDB
    writeProfileToIDB(newProfile);

    // C) Broadcast to all other active instances
    const event = new CustomEvent(EVENT_NAME, { detail: newProfile });
    window.dispatchEvent(event);
  }, []);

  return [profile, setProfile];
}
