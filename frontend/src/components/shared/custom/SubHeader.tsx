const SubHeader = ({ text }: { text: string }) => {
  return (
    <p className='md:text-4xl text-2xl lg:text-4xl font-bold text-center relative z-50 bg-gradient-to-r from-orangeWheel via-royalBlue to-madder inline-block text-transparent bg-clip-text'>
      {text}
    </p>
  );
};

export default SubHeader;
