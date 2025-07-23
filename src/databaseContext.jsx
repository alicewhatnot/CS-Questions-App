import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

const DatabaseContext = createContext(null);

export function DatabaseProvider({ children }) {
  const dbRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function setup() {
      let sqlite;
      let sqliteConnection;

      if (Capacitor.getPlatform() === 'web') {
        if ('defineCustomElements' in CapacitorSQLite) {
          await CapacitorSQLite.defineCustomElements(window);
        }
        sqlite = CapacitorSQLite;
        await sqlite.initWebStore();
      } else {
        sqlite = CapacitorSQLite;
      }

      sqliteConnection = new SQLiteConnection(sqlite);

      if (Capacitor.getPlatform() !== 'web') {
        try {
          await sqliteConnection.importPreloadedDatabase({
            dbName: 'questionsDB',
            asset: true, // VERY important: tells it to load from the app bundle
          });
          console.log('Imported preloaded DB');
        } catch (e) {
          console.warn('Failed to import preloaded DB:', e);
        }
      }

      const db = await sqliteConnection.createConnection('questionsDB', false, 'no-encryption', 1);
      await db.open();

      if (isMounted) {
        dbRef.current = db;
        setIsReady(true);
      }
    }

    setup();

    return () => {
      isMounted = false;
      (async () => {
        try {
          if (dbRef.current) {
            await dbRef.current.close();
          }
        } catch (e) {
          console.warn('DB close error', e);
        }
      })();
    };
  }, []);

  return (
    <DatabaseContext.Provider value={{ dbRef, isReady }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  return useContext(DatabaseContext);
}
