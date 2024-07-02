import { ReactNode } from 'react';

interface GridBackgroundProps {
  children: ReactNode;
}

const GridBackground: React.FC<GridBackgroundProps> = ({ children }) => {
  return (
    <div className='w-full bg-black  bg-grid-small-white/[0.2] relative'>
      <div className='absolute pointer-events-none inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_90%,black)]'></div>
      {children}
    </div>
  );
};

export default GridBackground;
