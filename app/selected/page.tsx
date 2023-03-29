import Stocks from './Stocks';

const DISABLE_EDIT = process.env.DISABLE_EDIT_TRACK_SYMBOL === 'true';

const Page = () => {

  return (
    <>
      <h2>Selected stocks</h2>
      <p className="my-4">
        On this page, you can add the stocks you want to follow by clicking the &apos;+&apos; button. Clicking on the name of a stock will take you to its detailed page, where you can see its performance over time.
      </p>
      <Stocks disableEdit={DISABLE_EDIT} />
    </>
  );
};

export default Page;
