export default function SkeletonLoading() {
  return (
    <>
      <div className="animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
        <div className="h-40 bg-gray-300 rounded"></div>
      </div>
    </>
  );
}
