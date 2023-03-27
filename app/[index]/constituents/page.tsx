import Content from './content.mdx';

export default function Page ({ params: { index } }: { params: { index: string } }) {
  return (
    <div className="markdown-content basic-links">
      <Content index={index} />
    </div>
  );
}