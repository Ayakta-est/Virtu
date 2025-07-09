import React from "react";

export default function EventModal({ event, onClose }) {
  if (!event) return null;

  const { title, start, end, type, status, notes } = event;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl"
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-3">{title}</h2>
        <div className="space-y-2 text-sm">
          <p><span className="font-semibold">Tipo:</span> {type}</p>
          {status && <p><span className="font-semibold">Estado:</span> {status}</p>}
          <p><span className="font-semibold">Fecha:</span> {start}{end ? ` → ${end}` : ""}</p>
          {notes && <p><span className="font-semibold">Notas:</span> {notes}</p>}
        </div>
      </div>
    </div>
  );
}
