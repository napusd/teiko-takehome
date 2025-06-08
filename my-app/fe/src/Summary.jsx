import { useState } from "react";
import Plot from "react-plotly.js";

export default function SummaryView({ data }) {
  const [cellType, setType] = useState("");
  const idTotalCount = {};
  const samples = data.sample;
  const subjects = data.subject.reduce((acc, item) => {
    acc[item.subject_id] = item;
    return acc;
  }, {});
  const sampleToSubject = data.overview.reduce((acc, item) => {
    acc[item.sample_id] = item.subject_id;
    return acc;
  }, {});
  const cellTypes = [
    "b_cell",
    "cd8_t_cell",
    "cd4_t_cell",
    "nk_cell",
    "monocyte",
  ];

  for (let i = 0; i < samples.length; i++) {
    const sample = samples[i];
    if (!(sample.sample_id in idTotalCount)) {
      idTotalCount[sample.sample_id] = 0;
    }
    idTotalCount[sample.sample_id] += sample.population_count;
  }
  const processedData = data.sample.map((element) => {
    return {
      sample_id: element.sample_id,
      total_count: idTotalCount[element.sample_id],
      population: element.cell_type,
      count: element.population_count,
      relative_frequency:
        element.population_count / idTotalCount[element.sample_id],
    };
  });

  const getAvg = (cellType, response) => {
    let count = 0;
    let relsum = 0;
    for (let i = 0; i < samples.length; i++) {
      let sample = samples[i];
      if (
        sample.cell_type === cellType &&
        sample.response === response &&
        sample.treatment === "tr1" &&
        sample.sample_type === "PBMC"
      ) {
        if (
          subjects[sampleToSubject[sample.sample_id]].condition === "melanoma"
        ) {
          count += 1;
          relsum += sample.population_count / idTotalCount[sample.sample_id];
        }
      }
    }

    return relsum / count;
  };

  const responderAvg = cellType ? getAvg(cellType, "y") : 0;
  const nonResponderAvg = cellType ? getAvg(cellType, "n") : 0;
  const diff = responderAvg - nonResponderAvg;

  let plotData = null;

  if (data) {
    plotData = {};
    cellTypes.forEach((type) => {
      plotData[type] = { responders: [], nonresponders: [] };
    });

    for (let i = 0; i < samples.length; i++) {
      let sample = samples[i];
      let subject_id = sampleToSubject[sample.sample_id];
      if (
        sample.treatment === "tr1" &&
        sample.sample_type === "PBMC" &&
        subjects[subject_id].condition === "melanoma"
      ) {
        if (sample.response === "y") {
          plotData[sample.cell_type].responders.push(
            sample.population_count / idTotalCount[sample.sample_id],
          );
        } else if (sample.response === "n") {
          plotData[sample.cell_type].nonresponders.push(
            sample.population_count / idTotalCount[sample.sample_id],
          );
        }
      }
    }
    console.log(
      Object.keys(plotData).flatMap((cell) =>
        Array(plotData[cell].responders.length).fill(cell),
      ),
    );
  }

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
      </div>
    );
  };

  const renderPlot = function (plotData) {
    if (!plotData || plotData.length === 0) {
      return <h2>Loading plots...</h2>;
    }
    return (
      <div className="flex justify-center">
        <div className="w-4/5 mx-auto p-8">
          <Plot
            data={[
              {
                x: Object.keys(plotData).flatMap((cell) =>
                  Array(plotData[cell].responders.length).fill(cell),
                ),
                y: Object.values(plotData).flatMap((cell) => cell.responders),
                name: "Responders",
                type: "box",
                marker: { color: "#1d4ed8" },
              },
              {
                x: Object.keys(plotData).flatMap((cell) =>
                  Array(plotData[cell]["nonresponders"].length).fill(cell),
                ),
                y: Object.values(plotData).flatMap(
                  (cell) => cell["nonresponders"],
                ),
                name: "Non-Responders",
                type: "box",
                marker: { color: "#f97316" },
              },
            ]}
            layout={{
              title: "Grouped Box Plot by Cell Type",
              boxmode: "group", // <-- Crucial for side-by-side
              xaxis: { title: "Cell Type" },
              yaxis: { title: "Values" },
              margin: { t: 50, l: 50, r: 30, b: 50 },
            }}
            style={{ width: "100%", height: "400px" }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-center gap-6 p-6 max-w-full mx-auto">
        {renderTable("Summary", processedData)}
      </div>

      <div className="p-4 border rounded-lg shadow max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Cell Type Comparison
        </h2>

        <div className="flex flex-col gap-4">
          <select
            value={cellType}
            onChange={(e) => setType(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Select cell type</option>
            {cellTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {cellType && (
          <div className="mt-6 text-center">
            <p>
              <strong>{cellType} responders</strong>: {responderAvg}
            </p>
            <p>
              <strong>{cellType} non responders</strong>: {nonResponderAvg}
            </p>
            <p className="mt-2 font-bold">
              Difference: {Math.abs(diff)} (
              {diff > 0
                ? `Responders' ${cellType} average relative frequency is higher`
                : `Non-responders' ${cellType} average relative frequency is higher`}
              )
            </p>
          </div>
        )}
      </div>
      {renderPlot(plotData)}
    </div>
  );
}
