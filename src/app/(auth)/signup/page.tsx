"use client";
import { useState } from 'react';

export default function SignUp() {
  const [symbol, setSymbol] = useState('');
  const [faction, setFaction] = useState('COSMIC'); // Default faction

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch('https://api.spacetraders.io/v2/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symbol, faction }),
    });

    const result = await response.json();

    if (result.data) {
      const token = result.data.token;
      // In a real app, save this to a Cookie or Database. 
      // For now, let's just alert it so you don't lose it.
      alert(`Agent Created! SAVE THIS TOKEN: ${token}`);
      localStorage.setItem('spacetraders_token', token);
      window.location.href = '/dashboard';
    } else {
      alert(`Error: ${result.error.message}`);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register New Agent</h1>
      <form onSubmit={handleRegister} className="flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="Callsign (3-14 characters)" 
          className="border p-2 text-black"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          required 
        />
        <select 
          className="border p-2 text-black"
          value={faction}
          onChange={(e) => setFaction(e.target.value)}
        >
          <option value="COSMIC">Cosmic</option>
          <option value="VOID">Void</option>
          <option value="GALACTIC">Galactic</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">
          Initialize Agent
        </button>
      </form>
    </div>
  );
}