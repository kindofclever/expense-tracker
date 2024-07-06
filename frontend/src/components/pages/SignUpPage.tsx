import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import InputField from '../shared/custom/InputField';
import RadioButton from '../shared/custom/RadioButton';
import { SIGN_UP } from '../../graphql/mutations/user.mutation';
import Button from '../shared/custom/Button';
import CustomHelmet from '../shared/custom/CustomHelmet';

interface SignUpData {
  name: string;
  username: string;
  password: string;
  gender: string;
}

const SignUpPage: React.FC = () => {
  const { t } = useTranslation();
  const [signUpData, setSignUpData] = useState<SignUpData>({
    name: '',
    username: '',
    password: '',
    gender: '',
  });

  const [signup, { loading }] = useMutation(SIGN_UP, {
    refetchQueries: ['GetAuthenticatedUser'],
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signup({
        variables: {
          input: signUpData,
        },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(t('signUpPage.unknownError'));
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === 'radio') {
      setSignUpData((prevData) => ({
        ...prevData,
        gender: value,
      }));
    } else {
      setSignUpData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  return (
    <>
      <CustomHelmet
        title={t('signUpPage.title')}
        description={t('signUpPage.description')}
        keywords={t('signUpPage.keywords')}
        canonical='/signup'
      />
      <div className='h-screen flex justify-center items-center'>
        <div className='flex rounded-lg overflow-hidden z-50 bg-gray-300'>
          <div className='w-full bg-gray-100 min-w-80 sm:min-w-96 flex items-center justify-center'>
            <div className='max-w-md w-full p-6'>
              <h1 className='text-3xl font-semibold mb-6 text-black text-center'>
                {t('signUpPage.header')}
              </h1>
              <h2 className='text-sm font-semibold mb-6 text-gray-500 text-center'>
                {t('signUpPage.subHeader')}
              </h2>
              <form
                className='space-y-4'
                onSubmit={handleSubmit}>
                <InputField
                  label={t('signUpPage.fullName')}
                  id='name'
                  name='name'
                  value={signUpData.name}
                  onChange={handleChange}
                />
                <InputField
                  label={t('signUpPage.username')}
                  id='username'
                  name='username'
                  value={signUpData.username}
                  onChange={handleChange}
                />
                <InputField
                  label={t('signUpPage.password')}
                  id='password'
                  name='password'
                  type='password'
                  value={signUpData.password}
                  onChange={handleChange}
                />
                <div className='flex flex-col'>
                  <RadioButton
                    id='diverse'
                    label={t('signUpPage.gender.diverse')}
                    value='diverse'
                    onChange={handleChange}
                    checked={signUpData.gender === 'diverse'}
                  />
                  <RadioButton
                    id='female'
                    label={t('signUpPage.gender.female')}
                    value='female'
                    onChange={handleChange}
                    checked={signUpData.gender === 'female'}
                  />
                  <RadioButton
                    id='male'
                    label={t('signUpPage.gender.male')}
                    value='male'
                    onChange={handleChange}
                    checked={signUpData.gender === 'male'}
                  />
                </div>
                <div>
                  <Button
                    type='submit'
                    variant='black'
                    className='w-full'
                    disabled={loading}>
                    {loading
                      ? t('signUpPage.loading')
                      : t('signUpPage.signUpButton')}
                  </Button>
                </div>
              </form>
              <div className='mt-4 text-sm text-gray-600 text-center'>
                <p>
                  {t('signUpPage.loginPrompt')}{' '}
                  <Link
                    to='/login'
                    className='text-black hover:underline'>
                    {t('signUpPage.loginLink')}
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

export default SignUpPage;
