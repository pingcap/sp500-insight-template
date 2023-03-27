import { notFound } from 'next/navigation';
import Content from './content.mdx';

export default function Home ({ params: { index } }: { params: { index: string } }) {
  if (index !== 'SP500') {
    notFound();
  }

  return (
    <>
      <div className="markdown-content basic-links">
        <Content index={index} />
      </div>
    </>
  );
}
