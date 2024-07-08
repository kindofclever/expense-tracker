interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
  variant?:
    | 'primary'
    | 'secondary'
    | 'form'
    | 'black'
    | 'danger'
    | 'investment'
    | 'saving'
    | 'expense';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  className = '',
  disabled = false,
  variant = 'primary',
}) => {
  const baseStyles = 'px-4 py-2 rounded text-white font-bold';

  const variantStyles = {
    expense: 'bg-orangeWheel hover:bg-madder',
    saving: 'bg-royalBlue hover:bg-madder',
    investment: 'bg-madder hover:bg-orangeWheel',
    primary: 'bg-orangeWheel hover:bg-madder',
    secondary: 'bg-royalBlue hover:bg-madder',
    form: 'bg-royalBlue hover:bg-madder border border-royalBlue hover:border-madder text-lg',
    danger: 'bg-madder hover:bg-orangeWheel',
    black:
      'bg-black text-white hover:bg-gray-800 focus:outline-none focus:bg-black focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed',
  };

  const combinedStyles = `${baseStyles} ${
    variantStyles[variant]
  } ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  return (
    <button
      type={type}
      onClick={onClick}
      className={combinedStyles}
      disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
