export default function TableSkeleton() {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-border text-muted-foreground">
              <th className="pb-3 font-medium">Preview</th>
              <th className="pb-3 font-medium">Details</th>
              <th className="pb-3 font-medium">Tech Stack</th>
              <th className="pb-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {/* 4 ta skeleton row loop kore dekhabo */}
            {[1, 2, 3, 4].map((index) => (
              <tr key={index} className="animate-pulse">
                <td className="py-4 pr-4 w-24">
                  <div className="w-16 h-12 bg-sidebar-accent rounded-md"></div>
                </td>
                <td className="py-4 pr-4">
                  <div className="h-4 bg-sidebar-accent rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-sidebar-accent rounded w-1/2"></div>
                </td>
                <td className="py-4 pr-4">
                  <div className="flex gap-2">
                    <div className="h-5 w-12 bg-sidebar-accent rounded-md"></div>
                    <div className="h-5 w-16 bg-sidebar-accent rounded-md"></div>
                  </div>
                </td>
                <td className="py-4 text-right">
                  <div className="h-8 w-8 bg-sidebar-accent rounded-md ml-auto"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
