// CustomTagDialog.tsx
import React, { useState, FormEvent, ChangeEvent } from 'react';
import { useMutation } from '@apollo/client';
import { MdClose } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import Button from './Button';
import toast from 'react-hot-toast';
import { CREATE_CUSTOM_TAG } from '../../../graphql/mutations/tag.mutation';

interface CustomTagDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTagCreated: () => void;
}

const CustomTagDialog: React.FC<CustomTagDialogProps> = ({
  isOpen,
  onClose,
  onTagCreated,
}) => {
  const { t } = useTranslation();
  const [customTagName, setCustomTagName] = useState('');
  const [customTagSearchTerm, setCustomTagSearchTerm] = useState('');
  const [createCustomTag, { loading, error }] = useMutation(CREATE_CUSTOM_TAG);

  const handleCustomTagSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createCustomTag({
        variables: { name: customTagName, searchTerm: customTagSearchTerm },
      });
      setCustomTagName('');
      setCustomTagSearchTerm('');
      onTagCreated();
      onClose();
    } catch (err) {
      console.error('Error creating custom tag:', err);
      toast.error(t('customTagDialog.errorCreatingTag'));
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'customTagName') {
      setCustomTagName(value);
    } else if (name === 'customTagSearchTerm') {
      setCustomTagSearchTerm(value);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50'>
      <div className='bg-orangeWheel p-5 rounded-lg shadow-lg w-full max-w-md'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold'>{t('customTagDialog.title')}</h2>
          <Button
            variant='secondary'
            onClick={onClose}>
            <MdClose size={24} />
          </Button>
        </div>
        <form
          onSubmit={handleCustomTagSubmit}
          className='space-y-4'>
          <div>
            <label
              htmlFor='customTagName'
              className='block uppercase tracking-wide text-xs font-bold mb-2'>
              {t('customTagDialog.tagName')}
            </label>
            <input
              className='appearance-none block w-full focus:text-black bg-royalBlue border border-royalBlue rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-white'
              id='customTagName'
              name='customTagName'
              type='text'
              placeholder={t('customTagDialog.tagNamePlaceholder')}
              value={customTagName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label
              htmlFor='customTagSearchTerm'
              className='block uppercase tracking-wide text-xs font-bold mb-2'>
              {t('customTagDialog.searchTerm')}
            </label>
            <input
              className='appearance-none block w-full focus:text-black bg-royalBlue border border-royalBlue rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-white'
              id='customTagSearchTerm'
              name='customTagSearchTerm'
              type='text'
              placeholder={t('customTagDialog.searchTermPlaceholder')}
              value={customTagSearchTerm}
              onChange={handleInputChange}
              required
            />
          </div>
          {error && (
            <p className='text-madder'>
              {t('customTagDialog.errorCreatingTag')}
            </p>
          )}
          <div className='flex justify-end'>
            <Button
              type='submit'
              variant='primary'
              disabled={loading}>
              {loading
                ? t('customTagDialog.loading')
                : t('customTagDialog.create')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomTagDialog;
