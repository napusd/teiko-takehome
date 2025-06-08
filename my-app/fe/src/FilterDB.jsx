import { useRef } from "react";

export default function FilterDB({ onFilter }) {
  const formRef = useRef(null);
  const timeStartRef = useRef(null);
  const timeEndRef = useRef(null);
  const projectRef = useRef(null);

  const options = {
    response: ["y", "n"],
    treatment: ["tr1", "none"],
    condition: ["melanoma", "healthy", "lung"],
    sample_type: ["PBMC", "cancer"],
    sex: ["M", "F"],
  };

  const applyFilters = async () => {
    const filters = {};

    for (const category of Object.keys(options)) {
      const checkboxes = formRef.current.querySelectorAll(
        `input[name="${category}"]:checked`,
      );
      filters[category] = Array.from(checkboxes).map((cb) => cb.value);
    }

    // Time from treatment start
    const start = timeStartRef.current.value.trim();
    const end = timeEndRef.current.value.trim();
    if (start || end) {
      filters.time_from_treatment_start = {
        start: start ? Number(start) : null,
        end: end ? Number(end) : null,
      };
    }

    // Projects input (comma or space separated)
    const rawProjects = projectRef.current.value.trim();
    if (rawProjects) {
      filters.projects = rawProjects
        .split(/[, ]+/)
        .map((proj) => proj.trim())
        .filter((proj) => proj !== "");
    }

    try {
      const res = await fetch("http://localhost:5000/api/db/filter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filters),
      });
      if (!res.ok) throw new Error("Failed to apply filters");
      const data = await res.json();
      onFilter(data);
    } catch (err) {
      console.error("Filter error:", err);
    }
  };

  return (
    <div
      ref={formRef}
      className="p-6 border rounded-lg shadow w-full max-w-4xl mx-auto"
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">Filter Data</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {Object.entries(options).map(([category, values]) => (
          <div key={category}>
            <h3 className="font-semibold mb-1 capitalize">{category}</h3>
            {values.map((value) => (
              <label key={value} className="block text-sm">
                <input
                  type="checkbox"
                  name={category}
                  value={value}
                  className="mr-2"
                />
                {value}
              </label>
            ))}
          </div>
        ))}

        {/* Time Range */}
        <div className="col-span-2">
          <h3 className="font-semibold mb-1">Time from Treatment Start</h3>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Start"
              ref={timeStartRef}
              className="border px-2 py-1 rounded w-full"
            />
            <input
              type="number"
              placeholder="End"
              ref={timeEndRef}
              className="border px-2 py-1 rounded w-full"
            />
          </div>
        </div>

        {/* Projects */}
        <div className="col-span-2">
          <h3 className="font-semibold mb-1">Projects</h3>
          <input
            type="text"
            placeholder="Comma or space separated"
            ref={projectRef}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
      </div>

      <div className="mt-6 text-center">
        <button
          onClick={applyFilters}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
