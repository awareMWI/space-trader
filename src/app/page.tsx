/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [agents, setAgents] = useState<any[]>([]);
  const [newSymbol, setNewSymbol] = useState('');
  const [newFaction, setNewFaction] = useState('COSMIC');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      if (user) fetchSavedAgents(user.id);
    };
    init();
  }, []);

  const fetchSavedAgents = async (userId: string) => {
    const { data } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', userId);
    setAgents(data || []);
  };

  const handleRegisterAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Register with SpaceTraders
      const res = await fetch('https://api.spacetraders.io/v2/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: newSymbol, faction: newFaction }),
      });
      const result = await res.json();

      if (result.data) {
        // 2. Save to Supabase
        const { error } = await supabase.from('agents').insert([
          {
            user_id: user.id,
            account_id: result.data.agent.accountId,
            symbol: result.data.agent.symbol,
            token: result.data.token,
            faction: newFaction,
          },
        ]);

        if (error) throw error;
        alert('Agent Commissioned!');
        setNewSymbol('');
        fetchSavedAgents(user.id);
      } else {
        alert(result.error.message);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user)
    return (
      <div className='p-8'>
        Please{' '}
        <a href='/login' className='text-blue-400 underline'>
          Login
        </a>
      </div>
    );

  return (
    <div className='p-8 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
      {/* SECTION 1: REGISTER */}
      <section className='bg-slate-900 p-6 rounded-xl border border-slate-700 h-fit'>
        <h2 className='text-xl font-bold mb-4 text-white'>
          Register New Agent
        </h2>
        <form onSubmit={handleRegisterAgent} className='flex flex-col gap-4'>
          <input
            type='text'
            placeholder='Callsign (3-14 chars)'
            className='p-2 rounded bg-white text-black'
            value={newSymbol}
            onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
            required
          />
          <select
            className='p-2 rounded bg-white text-black'
            value={newFaction}
            onChange={(e) => setNewFaction(e.target.value)}
          >
            <option value='COSMIC'>Cosmic</option>
            <option value='VOID'>Void</option>
            <option value='GALACTIC'>Galactic</option>
            <option value='QUANTUM'>Quantum</option>
            <option value='DOMINION'>Dominion</option>
          </select>
          <button
            type='submit'
            disabled={loading}
            className='bg-blue-600 p-2 rounded font-bold hover:bg-blue-500 transition'
          >
            {loading ? 'Initializing...' : 'Register Agent'}
          </button>
        </form>
      </section>

      {/* SECTION 2: LIST AGENTS */}
      <section className='md:col-span-2'>
        <h2 className='text-2xl font-bold mb-4 text-white'>
          Your Fleet Agents
        </h2>
        <div className='grid gap-4'>
          {agents.length === 0 && (
            <p className='text-slate-400 italic'>
              No agents found. Register one to begin.
            </p>
          )}
          {agents.map((agent) => (
            <div
              key={agent.id}
              className='bg-slate-800 p-4 rounded-lg border border-slate-700 flex justify-between items-center'
            >
              <div>
                <h3 className='text-lg font-mono font-bold text-green-400'>
                  {agent.symbol}
                </h3>
                <p className='text-xs text-slate-400'>ID: {agent.account_id}</p>
                <p className='text-sm text-slate-300'>
                  Faction: {agent.faction}
                </p>
              </div>
              <button
                onClick={() =>
                  alert(`Stored Token: ${agent.token.substring(0, 15)}...`)
                }
                className='text-xs bg-slate-700 px-3 py-1 rounded hover:bg-slate-600'
              >
                View Token
              </button>
            </div>
          ))}
        </div>
      </section>

      <button
        onClick={() =>
          supabase.auth.signOut().then(() => window.location.reload())
        }
        className='fixed bottom-4 right-4 bg-red-900/50 text-red-200 px-4 py-2 rounded text-xs border border-red-800'
      >
        Logout Account
      </button>
    </div>
  );
}
