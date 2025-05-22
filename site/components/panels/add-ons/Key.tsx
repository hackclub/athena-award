export default function Key({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-gray-200 border border-gray-500 text-gray-500 text-sm p-1 rounded-md mx-1 font-mono">
      {children}
    </span>
  );
}
