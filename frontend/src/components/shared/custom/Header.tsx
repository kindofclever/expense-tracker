import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className='mb-10'>
      <h1 className='md:text-6xl text-4xl lg:text-8xl font-bold text-center  relative z-50 text-white pt-10'>
        <Link to='/'>Expense Tracker</Link>
      </h1>
    </header>
  );
};
export default Header;
