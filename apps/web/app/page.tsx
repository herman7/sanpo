import type { TestSanpo } from '@sanpo/types';

export default function Home() {
  const test: TestSanpo = {
    title: 'Hello Sanpo',
    name: 'Herman7'
  };
  return <div>{`${test.title} I'm ${test.name}`}</div>;
}