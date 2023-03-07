import SP500Overview from '@/charts/SP500Overview';

export default function Home () {

  return (
    <main className='max-w-[960px] mx-auto'>
      <h1>S&P 500 History</h1>
      <SP500Overview />
    </main>
  );
}
