import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteConnection,  } from '@capacitor-community/sqlite';
import { defineCustomElements } from 'jeep-sqlite/loader';

const DatabaseContext = createContext(null);

export function DatabaseProvider({ children }) {
  const dbRef = useRef(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function setup() {
      let sqlite = CapacitorSQLite;
      let sqliteConnection = new SQLiteConnection(sqlite);

      if (Capacitor.getPlatform() === 'web') {
        window.SQLWASM_PATH = '/assets/sql-wasm.wasm';
        await defineCustomElements(window);
        await sqlite.initWebStore();
      } else if (Capacitor.getPlatform() === 'ios') {
        try {
          console.log("Attempting DB copy from assets...");
          await sqlite.copyFromAssets();
          console.log('Imported preloaded DB');

        } catch (e) {
          console.log('! Bundle URL:', window.location.href);
          console.warn('! Failed to import preloaded DB:', e);
        }
      }

      try {
       const connExists = await sqliteConnection.isConnection('questions');
        if (connExists.result) {
          await sqliteConnection.closeConnection('questions');
        }

        const db = await sqliteConnection.createConnection('questions', false, 'no-encryption', 1);
        await db.open();

        if (isMounted) {
          dbRef.current = db;
          setIsReady(true);
        }
      } catch (err) {
        console.error("Error during DB setup:", err);
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
