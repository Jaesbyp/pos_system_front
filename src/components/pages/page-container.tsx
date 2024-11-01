export default function PageContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="border p-4 border-opacity-5 bg-gray-700 w-full max-h-[100vh] h-full">
      {children}
    </div>
  );
}
