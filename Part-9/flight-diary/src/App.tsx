import { useEffect, useState } from 'react';
import axios from 'axios';
import { DiaryEntry, NewDiaryEntry } from './types';
import { getAll, create } from './services/diaryService';
import DiaryList from './components/DiaryList';
import AddDiaryForm from './components/AddDiaryForm';

const App = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    getAll().then(setEntries);
  }, []);

  const addEntry = async (entry: NewDiaryEntry): Promise<void> => {
    try {
      const newEntry = await create(entry);
      setEntries(entries.concat(newEntry));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const message = err.response?.data as string | undefined;
        throw new Error(message ?? err.message);
      }
      throw err;
    }
  };

  return (
    <div>
      <h1>Flight Diary</h1>
      <AddDiaryForm onAdd={addEntry} />
      <DiaryList entries={entries} />
    </div>
  );
};

export default App;
