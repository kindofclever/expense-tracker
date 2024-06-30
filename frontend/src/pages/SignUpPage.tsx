import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
// import { useMutation } from '@apollo/client';
import toast from 'react-hot-toast';
import RadioButton from '../components/custom/RadioButton';
import InputField from '../components/custom/InputField';

interface SignUpData {
  name: string;
  username: string;
  password: string;
  gender: string;
}

const SignUpPage: React.FC = () => {
  const [signUpData, setSignUpData] = useState<SignUpData>({
    name: '',
    username: '',
    password: '',
    gender: '',
  });

  // const [signup, { loading }] = useMutation(SIGN_UP, {
  //   refetchQueries: ['GetAuthenticatedUser'],
  // });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      console.log('signup data: ', signUpData);
      // await signup({
      //   variables: {
      //     input: signUpData,
      //   },
      // });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.message);
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
    <div className='h-screen flex justify-center items-center'>
      <div className='flex rounded-lg overflow-hidden z-50 bg-gray-300'>
        <div className='w-full bg-gray-100 min-w-80 sm:min-w-96 flex items-center justify-center'>
          <div className='max-w-md w-full p-6'>
            <h1 className='text-3xl font-semibold mb-6 text-black text-center'>
              Sign Up
            </h1>
            <h1 className='text-sm font-semibold mb-6 text-gray-500 text-center'>
              Join to keep track of your expenses
            </h1>
            <form
              className='space-y-4'
              onSubmit={handleSubmit}>
              <InputField
                label='Full Name'
                id='name'
                name='name'
                value={signUpData.name}
                onChange={handleChange}
              />
              <InputField
                label='Username'
                id='username'
                name='username'
                value={signUpData.username}
                onChange={handleChange}
              />
              <InputField
                label='Password'
                id='password'
                name='password'
                type='password'
                value={signUpData.password}
                onChange={handleChange}
              />
              <div className='flex flex-col'>
                <RadioButton
                  id='diverese'
                  label='Diverse'
                  value='diverse'
                  onChange={handleChange}
                  checked={signUpData.gender === 'diverse'}
                />
                <RadioButton
                  id='female'
                  label='Female'
                  value='female'
                  onChange={handleChange}
                  checked={signUpData.gender === 'female'}
                />
                <RadioButton
                  id='male'
                  label='Male'
                  value='male'
                  onChange={handleChange}
                  checked={signUpData.gender === 'male'}
                />
              </div>
              <div>
                <button
                  type='submit'
                  className='w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed'>
                  {/* {loading ? 'Loading...' : 'Sign Up'} */}
                  Sign Up
                </button>
              </div>
            </form>
            <div className='mt-4 text-sm text-gray-600 text-center'>
              <p>
                Already have an account?{' '}
                <Link
                  to='/login'
                  className='text-black hover:underline'>
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
