export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-red-600">Unauthorized</h1>
      <p className="text-lg">You do not have permission to view this page.</p>
    </div>
  );
}
