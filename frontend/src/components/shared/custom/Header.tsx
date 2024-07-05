import { MdKeyboardArrowLeft } from 'react-icons/md';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from './Button';
import { ButtonWithTooltip } from '../ui/ButtonWithTooltip';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <header className='text-4xl lg:text-6xl font-bold text-center relative z-50 pt-10 mb-10'>
      {location.pathname !== '/' && (
        <ButtonWithTooltip
          message='Go back'
          onClick={handleBackClick}>
          <Button variant='secondary'>
            <MdKeyboardArrowLeft size={24} />
          </Button>
        </ButtonWithTooltip>
      )}
      <h1>
        <Link to='/'>Expense Tracker</Link>
      </h1>
    </header>
  );
};

export default Header;
