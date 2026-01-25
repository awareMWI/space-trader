"use client";
import { useState } from 'react';

export default function Login() {
  const [token, setToken] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.length > 10) {
      localStorage.setItem('spacetraders_token', token);
      window.location.href = '/dashboard';
    } else {
      alert("Invalid Token");
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Access Fleet</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input 
          type="password" 
          placeholder="Paste Agent Token" 
          className="border p-2 text-black"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required 
        />
        <button type="submit" className="bg-green-600 text-white p-2 rounded">
          Connect to Command
        </button>
      </form>
      <p className="mt-4 text-sm">
        Don't have a token? <a href="/signup" className="text-blue-500 underline">Sign up here</a>.
      </p>
    </div>
  );
}