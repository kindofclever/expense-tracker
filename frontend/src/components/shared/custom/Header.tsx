import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const { t } = useTranslation();

  return (
    <h1 className='text-4xl lg:text-6xl font-bold text-center relative z-50 pt-10 mb-10'>
      <Link to='/'>{t('header.welcome')}</Link>
    </h1>
  );
};

export default Header;
