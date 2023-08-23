import { Outlet } from 'react-router-dom';
import ScrollToTop from 'react-scroll-to-top';
import { NavBar } from '@/components/common';
import '@/styles/index.css';

export default function LayoutPage() {

  return (
    <>
      <ScrollToTop />
      <header>
          <h1>Storer TP</h1>
        <NavBar />
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
