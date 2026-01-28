'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      window.location.href = '/';
    }
    setLoading(false);
  };

  return (
    <div className='p-8 max-w-sm mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Login</h1>
      <form onSubmit={handleLogin} className='flex flex-col gap-4'>
        <input
          type='email'
          placeholder='Email'
          className='border p-2 text-black bg-white rounded'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type='password'
          placeholder='Password'
          className='border p-2 text-black bg-white rounded'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type='submit'
          disabled={loading}
          className='bg-green-600 text-white p-2 rounded font-bold disabled:bg-gray-400'
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <p className='mt-4 text-sm'>
        Need an account?{' '}
        <a href='/signup' className='text-blue-500'>
          Sign Up
        </a>
      </p>
    </div>
  );
}
