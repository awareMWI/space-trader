'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert('Account created!');
      window.location.href = '/';
    }
    setLoading(false);
  };

  return (
    <div className='p-8 max-w-sm mx-auto'>
      <h1 className='text-2xl font-bold mb-6'>Create Account</h1>
      <form onSubmit={handleSignUp} className='flex flex-col gap-4'>
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
          className='bg-blue-600 text-white p-2 rounded font-bold disabled:bg-gray-400'
        >
          {loading ? 'Creating...' : 'Sign Up'}
        </button>
      </form>
      <p className='mt-4 text-sm'>
        Already have an account?{' '}
        <a href='/login' className='text-blue-500'>
          Login
        </a>
      </p>
    </div>
  );
}
