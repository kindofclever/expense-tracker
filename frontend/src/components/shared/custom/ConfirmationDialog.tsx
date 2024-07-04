import Button from './Button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80'>
      <div className='bg-orangeWheel p-6 rounded-md shadow-md'>
        <h3 className='text-lg font-bold mb-4'>{title}</h3>
        <p>{message}</p>
        <div className='mt-6 flex justify-end gap-3'>
          <Button
            variant='form'
            onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant='danger'
            onClick={() => {
              onConfirm();
              onClose();
            }}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;