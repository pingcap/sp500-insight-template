import { PropsWithChildren } from 'react';
import Side from './side';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="container mx-auto px-4 md:grid md:grid-cols-12 gap-8">
      <aside className="md:col-span-4">
        <Side />
      </aside>
      <main className="md:col-span-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;

