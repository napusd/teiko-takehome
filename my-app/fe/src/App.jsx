import { useEffect, useState } from "react";
import DBView from "./DBView";
import SummaryView from "./Summary";
import Form from "./Form";
import FilterDB from "./FilterDB";
import { handleSubmit, handleDelete } from "./handlers";

function App() {
  const [data, setData] = useState({
    subject: [],
    sample: [],
    overview: [],
  });

  const fetchData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/db");
      if (!res.ok) throw new Error("Failed to fetch data");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen px-4">
      <div className="text-center my-6">
        <h1 className="text-3xl font-bold">Database View</h1>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row justify-end gap-4">
          <Form
            onSubmit={(formData) => handleSubmit(formData, fetchData)}
            onDelete={(sample) => handleDelete(sample, fetchData)}
          />
          <FilterDB onFilter={setData} />
        </div>
        <DBView data={data} />
      </div>
      <div className="text-center my-6">
        <h1 className="text-3xl font-bold">
          Processed Summary View, Analysis, and Visualizing Box Plots.
        </h1>
      </div>
      <div className="flex flex-col">
        <SummaryView data={data} />
      </div>
      <div className="flex flex-col"></div>
    </div>
  );
}

export default App;
