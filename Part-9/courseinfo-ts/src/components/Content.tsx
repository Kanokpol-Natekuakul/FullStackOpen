import { CoursePart } from '../types';

interface ContentProps {
  parts: CoursePart[];
}

const Content = ({ parts }: ContentProps) => (
  <div>
    {parts.map(part => (
      <p key={part.name}>
        {part.name} {part.exerciseCount}
      </p>
    ))}
  </div>
);

export default Content;
