export default function TestTailwind() {
  return (
    <div className="min-h-screen bg-black p-8">
      <div className="space-y-4">
        <div className="bg-rose-500 text-white p-4 rounded-lg">
          🔴 RED - If you see this, Tailwind is working
        </div>
        <div className="bg-indigo-500 text-white p-4 rounded-lg">
          🔵 BLUE - If you see this, Tailwind is working
        </div>
        <div className="bg-emerald-500 text-white p-4 rounded-lg">
          🟢 GREEN - If you see this, Tailwind is working
        </div>
      </div>
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-500 to-rose-500 text-white rounded-lg">
        🌈 GRADIENT - If you see purple to pink, gradients work
      </div>
    </div>
  )
}
