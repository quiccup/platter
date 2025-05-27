import React from 'react';
import Logo from '@/components/Logo';

interface Suggestion {
  icon: React.ReactNode;
  bg: string;
  text: string;
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
}

export const ChatInputBar: React.FC<ChatInputBarProps> = ({
  input,
  setInput,
  onSubmit,
  suggestions,
  onSuggestionClick,
  inputRef,
  isLoading,
  className = '',
}) => {
  // Responsive suggestion bubble classes
  const suggestionBubbleClass =
    'flex items-center gap-1 rounded-full px-3 py-1 text-xs bg-white border border-gray-200 shadow-sm hover:bg-gray-100 transition whitespace-nowrap ' +
    'md:px-3 md:py-1 md:text-xs ' +
    'sm:px-2 sm:py-0.5 sm:text-[11px]';

  return (
    <form className={`w-full max-w-md md:max-w-xl lg:max-w-2xl mx-auto sticky bottom-0 z-20 ${className}`} onSubmit={onSubmit}>
      {/* Recent Queries - smaller, closer, and clickable */}
      <div className="w-full mb-2 flex flex-col items-end">
        <div className="text-gray-400 text-xs mb-1">Recent queries</div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar w-full md:w-auto px-1" style={{ WebkitOverflowScrolling: 'touch' }}>
          {suggestions.map((q, i) => (
            <button
              key={i}
              type="button"
              className={suggestionBubbleClass + ' ' + q.bg}
              onClick={() => onSuggestionClick(q.text)}
              style={{ minHeight: 24 }}
            >
              <span className="w-4 h-4 flex items-center justify-center">{q.icon}</span>
              <span className="text-xs text-black whitespace-nowrap">{q.text}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center bg-gray-900 rounded-full px-4 py-2">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message..."
          className="pl-4 flex-1 bg-transparent text-white placeholder:text-gray-400 placeholder:text-xs md:placeholder:text-base border-0 focus:ring-0 focus:outline-none text-base md:text-lg min-h-[2.5rem] md:min-h-[3rem]"
        />
        <button type="submit" className="ml-2 bg-white rounded-full p-2 flex items-center justify-center" disabled={isLoading}>
          <Logo className="h-8 w-8" />
        </button>
      </div>
    </form>
  );
}; 