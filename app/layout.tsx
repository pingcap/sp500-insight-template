import './globals.css';
import Navigator from './Navigator';

export const metadata = {
  title: 'S&P500 Insights',
  description: 'This is a sample stock analysis application. We have selected S&P 500 Index data and detailed stock price changes for constituent stocks from 2013.1 to 2023.1 for this sample program. Based on this sample program, you can learn how to build a stock analysis program on TiDB Serverless and Data API. We will provide you with the sample code and dataset of this application for reference.',
};

export default function RootLayout ({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
    <body>
    <Navigator />
    <main className="max-w-[960px] mx-auto">
      {children}
    </main>
    </body>
    </html>
  );
}
