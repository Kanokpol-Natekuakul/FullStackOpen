import { DiaryEntry } from '../types';

const DiaryList = ({ entries }: { entries: DiaryEntry[] }) => (
  <div>
    <h2>Diary entries</h2>
    {entries.map(e => (
      <div key={e.id}>
        <strong>{e.date}</strong>
        <div>weather: {e.weather}</div>
        <div>visibility: {e.visibility}</div>
        <div>{e.comment}</div>
      </div>
    ))}
  </div>
);

export default DiaryList;
