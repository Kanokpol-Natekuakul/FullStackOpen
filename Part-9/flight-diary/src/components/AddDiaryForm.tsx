import { useState } from 'react';
import { NewDiaryEntry, Weather, Visibility } from '../types';

interface Props {
  onAdd: (entry: NewDiaryEntry) => Promise<void>;
}

const AddDiaryForm = ({ onAdd }: Props) => {
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await onAdd({ date, weather, visibility, comment });
      setDate('');
      setComment('');
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred');
    }
  };

  return (
    <div>
      <h2>Add new entry</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          date <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>
        <div>
          weather{' '}
          {Object.values(Weather).map(w => (
            <label key={w}>
              <input type="radio" name="weather" value={w} checked={weather === w} onChange={() => setWeather(w)} />
              {w}
            </label>
          ))}
        </div>
        <div>
          visibility{' '}
          {Object.values(Visibility).map(v => (
            <label key={v}>
              <input type="radio" name="visibility" value={v} checked={visibility === v} onChange={() => setVisibility(v)} />
              {v}
            </label>
          ))}
        </div>
        <div>
          comment <input value={comment} onChange={e => setComment(e.target.value)} />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  );
};

export default AddDiaryForm;
