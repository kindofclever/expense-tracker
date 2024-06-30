import { Link } from 'react-router-dom';
import { Spotlight } from '../ui/Spotlight';

const Header = () => {
  return (
    <header className='mb-10'>
      <h1 className='md:text-6xl text-4xl lg:text-8xl font-bold text-center  relative z-50 text-white pt-10'>
        <Spotlight
          className='absolute left-1/2 transform -translate-x-1/2 top-3'
          fill='white'
        />
        <Link to='/'>Expense Tracker</Link>
      </h1>
    </header>
  );
};
export default Header;
