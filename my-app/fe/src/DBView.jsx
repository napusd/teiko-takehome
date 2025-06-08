export default function DBView({ data }) {
  const renderTable = (title, rows) => {
    if (!rows || rows.length === 0) {
      return (
        <div className="w-full max-w-sm h-96 border rounded-lg p-4 shadow">
          <h2 className="text-lg font-semibold mb-2">{title}</h2>
          <p className="text-gray-500 italic">No data available</p>
        </div>
      );
    }

    const columns = Object.keys(rows[0]);

    return (
      <div className="w-full flex-grow h-150 border rounded-lg shadow p-4 flex flex-col">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <div className="overflow-y-auto flex-grow">
          <table className="min-w-full table-auto text-sm">
            <thead>
              <tr className="bg-gray-100">
                {columns.map((col) => (
                  <th key={col} className="px-2 py-1 border">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="odd:bg-white even:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col} className="px-2 py-1 border">
                      {row[col]?.toString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-2 text-right text-sm text-gray-700">
          Entry count: {rows.length}
        </div>
      </div>
    );
  };
  return (
    <div className="flex flex-row justify-center gap-6 p-6 max-w-full mx-auto">
      {renderTable("Subject", data.subject)}
      {renderTable("Sample", data.sample)}
      {renderTable("Overview", data.overview)}
    </div>
  );
}
