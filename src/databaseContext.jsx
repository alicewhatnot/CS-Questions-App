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

         if (Capacitor.getPlatform() === 'web') {
          // Fetch the JSON export of your DB
          const response = await fetch('/assets/databases/questions.json');
          const jsonDB = await response.json();
          console.log('JSON data loaded:', jsonDB);

          // Create tables if they don't exist
          await db.execute(`
          CREATE TABLE IF NOT EXISTS questions (
              id INTEGER PRIMARY KEY NOT NULL,
              question TEXT NOT NULL,
              marks INTEGER,
              mark_scheme TEXT,
              topic TEXT,
              subtopic TEXT,
              question_type TEXT,
              wrong_choices TEXT
            );
          `);

          for (const row of jsonDB.questions) {
            const { id, question, marks, mark_scheme, topic, subtopic, question_type, wrong_choices } = row;
            await db.run(
              `INSERT OR REPLACE INTO questions (id, question, marks, mark_scheme, topic, subtopic, question_type, wrong_choices) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
              [id, question, marks, mark_scheme, topic, subtopic, question_type, wrong_choices]
            );
          }

          console.log('Database JSON imported successfully on web');
        }

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
