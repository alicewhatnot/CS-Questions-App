import React, { createContext, useContext, useEffect, useRef } from 'react';
import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite';

const DatabaseContext = createContext(null);

export function DatabaseProvider({ children }) {
  const sqlite = useRef(new SQLiteConnection(CapacitorSQLite));
  const dbRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const openDb = async () => {
      try {
        const isConn = await sqlite.current.isConnection('questionsDB');
        let db;
        if (!isConn.result) {
          db = await sqlite.current.createConnection('questionsDB', false, 'no-encryption', 1);
          await db.open();
        } else {
          db = await sqlite.current.retrieveConnection('questionsDB');
        }
        dbRef.current = db;
      } catch (err) {
        console.error('Error opening DB:', err);
      }
    };
    openDb();
    return () => {
      isMounted = false;
      (async () => {
        try {
          if (dbRef.current) {
            await dbRef.current.close();
            await sqlite.current.closeConnection('questionsDB');
          }
        } catch {}
      })();
    };
  }, []);

  return (
    <DatabaseContext.Provider value={dbRef}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase() {
  return useContext(DatabaseContext);
}
