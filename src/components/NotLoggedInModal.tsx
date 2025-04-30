import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const NotLoggedInModal = ({ show }: { show: boolean }) => {
  const [showModal, setShowModal] = useState<boolean>(show);
  const navigate = useNavigate();

  useEffect(() => {
    setShowModal(show);
  }, [show]);

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-blue-50 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-auto text-center">
        <h2 className="text-2xl font-semibold mb-4">Login Required</h2>
        <p className="text-xl mb-6">Please log in to access this page.</p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md hover:cursor-pointer"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
};

export default NotLoggedInModal;
