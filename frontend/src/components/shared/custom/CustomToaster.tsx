import { Toaster, ToastBar } from 'react-hot-toast';

const CustomToaster = () => {
  return (
    <Toaster
      position='top-center'
      toastOptions={{
        success: {
          style: {
            background: '#496DDB', // royalBlue
            color: '#EEF1EF', // white
          },
          iconTheme: {
            primary: '#EEF1EF', // white
            secondary: '#496DDB', // royalBlue
          },
        },
        error: {
          style: {
            background: '#A20021', // madder
            color: '#EEF1EF', // white
          },
          iconTheme: {
            primary: '#EEF1EF', // white
            secondary: '#A20021', // madder
          },
        },
      }}>
      {(t) => (
        <ToastBar
          toast={t}
          style={{
            ...t.style,
            animation: t.visible
              ? t.type === 'error'
                ? 'shake 1.5s '
                : 'custom-enter 1s ease'
              : 'custom-exit 1s ease',
            borderLeftWidth: '4px',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            borderLeftColor:
              t.type === 'success'
                ? '#496DDB'
                : t.type === 'error'
                ? '#A20021'
                : '#EE8434',
            outline: '2px solid #EEF1EF',
            outlineOffset: '2px',
          }}
        />
      )}
    </Toaster>
  );
};

export default CustomToaster;
