import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen grid place-items-center p-6">
      <div className="text-center space-y-3">
        <div className="text-6xl font-black text-blue-600">404</div>
        <div className="text-gray-600">Page not found</div>
        <Link className="btn" to="/">Go Home</Link>
      </div>
    </div>
  );
}
