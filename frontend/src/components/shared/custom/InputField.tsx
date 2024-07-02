import { ChangeEvent } from 'react';

interface InputFieldProps {
  label: string;
  id: string;
  name: string;
  type?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  name,
  type = 'text',
  onChange,
  value,
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className='block text-black text-sm font-medium '>
        {label}
      </label>
      <input
        className='mt-1 p-2 w-full border rounded-md ack focus:border-royalBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300'
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default InputField;
