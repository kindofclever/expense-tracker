import CustomHelmet from '../shared/custom/CustomHelmet';

const NotFoundPage: React.FC = () => {
  return (
    <>
      <CustomHelmet
        title='Not Found - Expense Tracker'
        description='Sorry but this page does not exist - Use Expense Tracker to start managing your finances efficiently.'
        keywords='Not found, Expense Tracker, Budgeting, Finance'
        canonical='/signup'
      />
      <section>
        <div className=''>
          <div className='flex h-screen'>
            <div className='m-auto text-center'>
              <div>
                <img
                  src='/404.svg'
                  alt='404'
                />
              </div>
              <p className='text-sm md:text-base text-[#F6009B] p-2 mb-4'>
                The stuff you were looking for doesn't exist
              </p>
              <a
                href='/'
                className='bg-transparent hover:bg-[#F6009B] text-[#F6009B] hover: rounded shadow hover:shadow-lg py-2 px-4 border border-[#F6009B] hover:border-transparent'>
                Take me home
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFoundPage;
