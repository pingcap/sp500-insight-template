import { PropsWithChildren } from 'react';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <main className='container mx-auto px-2'>
      {children}
    </main>
  );
};

export default Layout;

