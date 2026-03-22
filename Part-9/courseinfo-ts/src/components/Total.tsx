import { CoursePart } from '../types';

interface TotalProps {
  parts: CoursePart[];
}

const Total = ({ parts }: TotalProps) => (
  <p>Number of exercises {parts.reduce((sum, part) => sum + part.exerciseCount, 0)}</p>
);

export default Total;
