import { useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import InputField from '../shared/custom/InputField';
import toast from 'react-hot-toast';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../../graphql/mutations/user.mutation';
import Button from '../shared/custom/Button';
import CustomHelmet from '../shared/custom/CustomHelmet';

interface LoginData {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const [loginData, setLoginData] = useState<LoginData>({
    username: '',
    password: '',
  });

  const [login, { loading }] = useMutation(LOGIN, {
    refetchQueries: ['GetAuthenticatedUser'],
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password)
      return toast.error(t('loginPage.fillAllFields'));
    try {
      await login({ variables: { input: loginData } });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t('loginPage.unknownError'));
      }
    }
  };

  return (
    <>
      <CustomHelmet
        title={t('loginPage.title')}
        description={t('loginPage.description')}
        keywords={t('loginPage.keywords')}
        canonical='/login'
      />
      <div className='flex justify-center items-center h-screen'>
        <div className='flex rounded-lg overflow-hidden z-50 bg-gray-300'>
          <div className='w-full bg-gray-100 min-w-80 sm:min-w-96 flex items-center justify-center'>
            <div className='max-w-md w-full p-6'>
              <h1 className='text-3xl font-semibold mb-6 text-black text-center'>
                {t('loginPage.header')}
              </h1>
              <h2 className='text-sm font-semibold mb-6 text-gray-500 text-center'>
                {t('loginPage.subHeader')}
              </h2>
              <form
                className='space-y-4'
                onSubmit={handleSubmit}>
                <InputField
                  label={t('loginPage.username')}
                  id='username'
                  name='username'
                  value={loginData.username}
                  onChange={handleChange}
                />
                <InputField
                  label={t('loginPage.password')}
                  id='password'
                  name='password'
                  type='password'
                  value={loginData.password}
                  onChange={handleChange}
                />
                <Button
                  type='submit'
                  variant='black'
                  className='w-full'
                  disabled={loading}>
                  {loading
                    ? t('loginPage.loading')
                    : t('loginPage.loginButton')}
                </Button>
              </form>
              <div className='mt-4 text-sm text-gray-600 text-center'>
                <p>
                  {t('loginPage.signupPrompt')}{' '}
                  <Link
                    to='/signup'
                    className='text-black hover:underline'>
                    {t('loginPage.signupLink')}
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
