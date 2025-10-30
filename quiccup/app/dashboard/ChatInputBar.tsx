import React from 'react';
import Logo from '@/components/Logo';

interface Suggestion {
  icon: React.ReactNode;
  bg: string;
  text: string;
  subtext?: string;
}

interface ChatInputBarProps {
  input: string;
  setInput: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  suggestions: Suggestion[];
  onSuggestionClick: (text: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  isLoading?: boolean;
  className?: string;
  disabled?: boolean;
  data: any;
  isChatView: boolean;
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  input,
  setInput,
  onSubmit,
  suggestions,
  onSuggestionClick,
  inputRef,
  isLoading,
  disabled,
  data,
  isChatView
}) => {
  return (
    <div className='w-full max-w-[700px] mx-auto'>
      {!isChatView && (
        <>
        <div className="flex flex-col items-start justify-start w-full mb-8">
          <h1 className="text-[25px] font-bold text-orange-500">Welcome to {data?.navbar?.heading}</h1>
          <p className="text-[25px] font-light text-gray-500">What can I get you started with?</p>
        </div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {suggestions.map((suggestion, i) => (
          <button
            key={i}
            onClick={() => onSuggestionClick(suggestion.text)}
            className="bg-white rounded-2xl p-3 text-left shadow-sm hover:bg-white-500 hover:border-gray-900 transition-all duration-200 border border-gray-300 group"
          >
            <h3 className="text-md font-semibold text-gray-900 mb-1 group-hover:text-black transition-colors">{suggestion.text}</h3>
            {suggestion.subtext && (
              <p className="text-grey-500 group-hover:text-black transition-colors">{suggestion.subtext}</p>
            )}
          </button>
        ))}
      </div>
      </>
      )}
  

      {/* Input Section */}
      <form onSubmit={onSubmit} className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="How can I help you?"
            className="w-full bg-gray-50 border border-gray-300 rounded-2xl py-6 px-8 text-gray-600 placeholder:text-gray-500 focus:ring-0 focus:outline-none text-lg"
            disabled={disabled}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button
              type="submit"
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              disabled={isLoading || disabled}
            >
            <Logo className="w-6 h-6" color="black" border="white" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}; 