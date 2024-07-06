import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <h1 className='text-4xl lg:text-6xl font-bold text-center relative z-50 pt-10 mb-10'>
      <Link to='/'>Welcome to the Expense Tracker</Link>
    </h1>
  );
};

export default Header;
