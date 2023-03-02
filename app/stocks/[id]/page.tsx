const Page = function ({ params }: { params: { id: string } }) {
  return <div className='font-bold'>{params.id}</div>
};

export default Page;
