import { CoursePart } from '../types';

const assertNever = (value: never): never => {
  throw new Error(`Unhandled course part: ${JSON.stringify(value)}`);
};

const Part = ({ part }: { part: CoursePart }) => {
  switch (part.kind) {
    case 'basic':
      return (
        <p>
          <strong>{part.name}</strong> {part.exerciseCount}<br />
          <em>{part.description}</em>
        </p>
      );
    case 'group':
      return (
        <p>
          <strong>{part.name}</strong> {part.exerciseCount}<br />
          project exercises {part.groupProjectCount}
        </p>
      );
    case 'background':
      return (
        <p>
          <strong>{part.name}</strong> {part.exerciseCount}<br />
          <em>{part.description}</em><br />
          <a href={part.backgroundMaterial}>{part.backgroundMaterial}</a>
        </p>
      );
    case 'special':
      return (
        <p>
          <strong>{part.name}</strong> {part.exerciseCount}<br />
          <em>{part.description}</em><br />
          required skills: {part.requirements.join(', ')}
        </p>
      );
    default:
      return assertNever(part);
  }
};

export default Part;
