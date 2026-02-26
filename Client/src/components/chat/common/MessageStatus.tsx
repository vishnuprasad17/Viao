import { BiCheck, BiCheckDouble } from 'react-icons/bi';
import { MdError } from 'react-icons/md';
import { Spinner } from '@material-tailwind/react';

interface Props {
  status?: 'sending' | 'sent' | 'failed';
  isRead?: boolean;
  onRetry?: () => void;
}

const MessageStatus = ({ status, isRead, onRetry }: Props) => {
  if (status === 'sending') {
    return <Spinner className="h-3 w-3 ml-1" onPointerEnterCapture={undefined} onPointerLeaveCapture={undefined} />;
  }
  
  if (status === 'failed') {
    return (
      <button onClick={onRetry} className="text-red-500 hover:text-red-700 ml-1">
        <MdError className="h-4 w-4" title="Click to retry" />
      </button>
    );
  }
  
  if (isRead) {
    return <BiCheckDouble className="h-4 w-4 ml-1 text-blue-500" title="Read" />;
  }
  
  return <BiCheck className="h-4 w-4 ml-1 text-gray-500" title="Delivered" />;
};

export default MessageStatus;