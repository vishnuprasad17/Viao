import { Alert } from '@material-tailwind/react';

const ConnectionStatus = () => (
  <div className="fixed top-0 left-0 right-0 z-50">
    <Alert color="red" className="rounded-none">
      <div className="flex items-center justify-center">
        <span className="mr-2">⚠️</span>
        Connection lost. Reconnecting...
      </div>
    </Alert>
  </div>
);
export default ConnectionStatus;