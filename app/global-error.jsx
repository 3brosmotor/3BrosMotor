'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body className="p-8 font-sans text-center">
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <button
          type="button"
          onClick={() => reset && reset()}
          className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-semibold"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
