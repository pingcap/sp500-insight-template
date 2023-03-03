import { PropsWithChildren } from 'react';
import Collections from '@/app/collections/Collections';
import Active from '@/app/collections/(detail)/Active';
import CollectionsToolbar from '@/app/collections/CollectionsToolbar';

type RouteProps = {
  params: { id: string }
}

const Layout = ({ children }: PropsWithChildren<RouteProps>) => {

  return (
    <div key="yo" className="lg:grid grid-cols-7 gap-4">
      <aside className="col-span-2">
        <CollectionsToolbar />
        <Active>
          <Collections />
        </Active>
      </aside>
      <main className="col-span-5">
        {children}
      </main>
    </div>
  );
};

export default Layout;
