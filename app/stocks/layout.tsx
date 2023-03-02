import { PropsWithChildren } from 'react';
import Container from '@/components/Container';

const Layout = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Container className='page'>
      {children}
    </Container>
  )
}

export default Layout