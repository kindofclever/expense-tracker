import React from 'react';
import { Helmet } from 'react-helmet-async';

interface CustomHelmetProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: string;
  canonical?: string;
}

const CustomHelmet: React.FC<CustomHelmetProps> = ({
  title = 'Expense Tracker',
  description = 'Track your expenses efficiently with our Expense Tracker. Join now to manage your finances better!',
  keywords = 'Expense Tracker, Budgeting, Finance, Money Management',
  ogTitle = 'Expense Tracker',
  ogDescription = 'Track your expenses efficiently with our Expense Tracker. Join now to manage your finances better!',
  ogType = 'website',
  canonical,
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta charSet='UTF-8' />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1.0'
      />
      <meta
        name='description'
        content={description}
      />
      <meta
        name='keywords'
        content={keywords}
      />
      <meta
        property='og:title'
        content={ogTitle}
      />
      <meta
        property='og:description'
        content={ogDescription}
      />
      <meta
        property='og:type'
        content={ogType}
      />
      {canonical && (
        <link
          rel='canonical'
          href={canonical}
        />
      )}
      <link
        rel='icon'
        href='./public/favicon.ico'
        type='image/x-icon'
      />
    </Helmet>
  );
};

export default CustomHelmet;
