export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-slate-500 mb-8">The page you are looking for does not exist.</p>
        <a href="/" className="text-primary hover:underline">Return to Home</a>
      </div>
    </div>
  );
}
