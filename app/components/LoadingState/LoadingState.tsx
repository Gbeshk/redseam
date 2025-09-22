
export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4000] mb-4"></div>
      <p className="text-gray-500">Loading cart...</p>
    </div>
  );
}