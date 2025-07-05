import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <h1 className="text-7xl font-extrabold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Oops! Page not found.</p>
      <Button onClick={() => {
        navigate(-1);
      }} sx={{
        bgcolor: 'black',
        color: 'white'
      }} >
        Back
      </Button>
    </div>
  );
}
