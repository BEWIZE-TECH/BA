import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface FeedbackButtonsProps {
  messageId: string;
  onFeedback: (messageId: string, type: 'up' | 'down') => void;
}

export function FeedbackButtons({ messageId, onFeedback }: FeedbackButtonsProps) {
  return (
    <div className="flex gap-2 mt-3 z-10 shrink-0">
      <button 
        onClick={() => onFeedback(messageId, 'up')}
        className="p-1.5 rounded-md text-gray-600 hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors"
      >
        <ThumbsUp size={14} />
      </button>
      <button 
        onClick={() => onFeedback(messageId, 'down')}
        className="p-1.5 rounded-md text-gray-600 hover:text-red-500 hover:bg-red-500/10 transition-colors"
      >
        <ThumbsDown size={14} />
      </button>
    </div>
  );
}