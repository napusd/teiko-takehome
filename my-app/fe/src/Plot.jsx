import Plot from "react-plotly.js";

export default function BoxPlot({ plotData }) {
  if (plotData === null) {
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
                Array(plotData[cell]["non-responders"].length).fill(cell),
              ),
              y: Object.values(plotData).flatMap(
                (cell) => cell["non-responders"],
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
}
