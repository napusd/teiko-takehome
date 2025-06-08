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
      <p className="text-xl p-4">
        The database view will load the entries already in the teiko.db file and
        show it on the front end. The view follows the database schema defined
        in the README.md. This view also allow the users to filter the database
        or add or delete an entry. To add an entry, you would just need to fill
        in the input fields. Once done, you should only need to click submit. To
        delete an entry, you would only need to input the sample id and hit
        delete. All fields are required except for the time_from_treatment_start
        and response field. In the requirements, we are asked to implement a
        filter feature that counts the number of samples in a project or number
        of subjects that are responders or non-responders. I decided to
        implement a filter feature completely. The user will only need to tick
        the attributes manually, the database view will filter accordingly and
        at the bottom of each table will have a count of how many entries there
        are. Any attributes left unticked are shown by default.
      </p>
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
          Processed Summary View, Cell Type Comparison, and Visualizing Box
          Plots.
        </h1>
      </div>
      <p className="text-xl p-4">
        The summary table below is the view that shows the requested processed
        summary table following the schema: sample_id, total_count, population,
        count, relative_frequency. The comparison of relative frequency between
        cells is below the table. It is hardcoded to compare tr1, melanoma, PBMC
        reponders and non-responders only. Below that is the box plot of the
        relative frequency per cell type. All three of these components are
        reactive to the filter of the main database above!
      </p>
      <div className="flex flex-col">
        <SummaryView data={data} />
      </div>
      <div className="text-center my-6 m-48 p-48">.</div>
    </div>
  );
}

export default App;
