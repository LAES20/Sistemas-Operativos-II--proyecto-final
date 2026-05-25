import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function InputPassword({ label, placeholder, value, onChange, error }) {
  const [mostrar, setMostrar] = useState(false);

  return (
    <div className="mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <div className="relative">
        <input
          type={mostrar ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 transition ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        <button
          type="button"
          onClick={() => setMostrar(!mostrar)}
          className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
        >
          {mostrar ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
