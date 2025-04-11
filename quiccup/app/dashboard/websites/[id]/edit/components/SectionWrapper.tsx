interface SectionWrapperProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  darkBackground?: boolean;
}

export function SectionWrapper({ children, fullWidth, darkBackground }: SectionWrapperProps) {
  return (
    <div className={`w-full py-12 ${darkBackground ? 'bg-gray-950' : ''}`}>
      {!fullWidth ? (
        <div className="container mx-auto px-4">
          <div className={`${
            !darkBackground 
              ? 'bg-white dark:bg-gray-900' 
              : 'bg-[#111827]'  // This is the third darker shade
          } rounded-[2rem] overflow-hidden p-4`}>
            {children}
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
} 