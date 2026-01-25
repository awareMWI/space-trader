export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-slate-900 text-white flex items-center justify-center">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl border border-slate-700">
        <div className="text-center mb-6">
          <h2 className="text-blue-400 font-mono tracking-widest uppercase">SpaceTraders OS</h2>
        </div>
        {children}
      </div>
    </div>
  );
}