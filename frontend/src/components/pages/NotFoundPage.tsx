import React from 'react';
import { useTranslation } from 'react-i18next';
import CustomHelmet from '../shared/custom/CustomHelmet';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <CustomHelmet
        title={t('notFoundPage.title')}
        description={t('notFoundPage.description')}
        keywords={t('notFoundPage.keywords')}
        canonical='/not-found'
      />
      <section>
        <div className=''>
          <div className='flex h-screen'>
            <div className='m-auto text-center'>
              <div>
                <img
                  src='/404.svg'
                  alt='404'
                  width={800}
                  height={200}
                />
              </div>
              <p className='text-sm md:text-base text-madder p-2 mb-4'>
                {t('notFoundPage.message')}
              </p>
              <a
                href='/'
                className='bg-transparent hover:bg-orangeWheel text-madder hover: rounded shadow hover:shadow-lg py-2 px-4 border border-madder hover:border-transparent'>
                {t('notFoundPage.homeButton')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NotFoundPage;
