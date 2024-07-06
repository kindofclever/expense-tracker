import { Outlet } from 'react-router-dom';
import Header from '../shared/custom/Header';

const Layout: React.FC = () => {
  return (
    <div className='min-h-screen flex flex-col mx-5'>
      <header>
        <Header />
      </header>
      <main className='flex-grow'>
        <Outlet />
      </main>
      <footer className='text-center p-4'>
        © 2024 Expense Tracker. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
