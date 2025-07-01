import React, { useEffect } from 'react';
import rigoImageUrl from '../assets/img/rigo-baby.jpg';
import useGlobalReducer from '../hooks/useGlobalReducer';

interface ApiResponse {
  message: string;
}

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();

  const loadMessage = async (): Promise<ApiResponse | void> => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL as string | undefined;

      if (!backendUrl) {
        throw new Error('VITE_BACKEND_URL is not defined in .env file');
      }

      const response = await fetch(`${backendUrl}/api/hello`);
      const data: ApiResponse = await response.json();

      if (response.ok) {
        dispatch({ type: 'set_hello', payload: data.message });
      }

      return data;
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : 'Unknown error occurred while fetching message';
      throw new Error(
        `Could not fetch the message from the backend. Please check if the backend is running and the backend port is public. Details: ${msg}`
      );
    }
  };

  useEffect(() => {
    loadMessage();
  }, []);

  return (
    <div className="text-center mt-5">
      <h1 className="display-4 bg-sky-500 text-white">Hello Rigo!!</h1>
      <p className="lead">
        <img
          src={rigoImageUrl}
          className="img-fluid rounded-circle mb-3"
          alt="Rigo Baby"
        />
      </p>
      <div className="alert alert-info">
        {store.message ? (
          <span>{store.message}</span>
        ) : (
          <span className="text-danger">
            Loading message from the backend (make sure your python 🐍 backend is running)...
          </span>
        )}
      </div>
    </div>
  );
};
