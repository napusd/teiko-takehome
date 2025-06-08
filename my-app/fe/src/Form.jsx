function Form({ onSubmit, onDelete }) {
  const handleDelete = (e) => {
    e.preventDefault();
    const sample = document.getElementById("delete-sample").value;
    if (sample.trim()) {
      console.log({ sample });
      onDelete({ sample });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const project = document.getElementById("project").value;
    const subject = document.getElementById("subject").value;
    const condition = document.getElementById("condition").value;
    const age = parseInt(document.getElementById("age").value || 0, 10);
    const sex = document.getElementById("sex").value;
    const sample = document.getElementById("sample").value;
    const sampleType = document.getElementById("sample_type").value;
    const treatment = document.getElementById("treatment").value;
    const response = document.getElementById("response").value;
    const time = parseInt(
      document.getElementById("time_from_treatment_start").value || 0,
      10,
    );
    const bCell = parseInt(document.getElementById("b_cell").value || 0, 10);
    const cd8TCell = parseInt(
      document.getElementById("cd8_t_cell").value || 0,
      10,
    );
    const cd4TCell = parseInt(
      document.getElementById("cd4_t_cell").value || 0,
      10,
    );
    const nkCell = parseInt(document.getElementById("nk_cell").value || 0, 10);
    const monocyte = parseInt(
      document.getElementById("monocyte").value || 0,
      10,
    );

    const data = {
      project,
      subject,
      condition,
      age,
      sex,
      sample,
      sample_type: sampleType,
      treatment,
      response,
      time_from_treatment_start: time,
      b_cell: bCell,
      cd8_t_cell: cd8TCell,
      cd4_t_cell: cd4TCell,
      nk_cell: nkCell,
      monocyte,
    };

    console.log(data);
    onSubmit(data);
  };

  const fields = [
    { required: true, label: "Project", name: "project", type: "text" },
    { required: true, label: "Subject", name: "subject", type: "text" },
    { required: true, label: "Condition", name: "condition", type: "text" },
    { required: true, label: "Age", name: "age", type: "number" },
    { required: true, label: "Sex", name: "sex", type: "text" },
    { required: true, label: "Sample", name: "sample", type: "text" },
    { required: true, label: "Sample Type", name: "sample_type", type: "text" },
    { required: true, label: "Treatment", name: "treatment", type: "text" },
    { required: false, label: "Response", name: "response", type: "text" },
    {
      required: false,
      label: "Time from Treatment Start",
      name: "time_from_treatment_start",
      type: "number",
      placeholder: "e.g. 0, 16",
    },
    { required: true, label: "B Cell", name: "b_cell", type: "number" },
    { required: true, label: "CD8 T Cell", name: "cd8_t_cell", type: "number" },
    { required: true, label: "CD4 T Cell", name: "cd4_t_cell", type: "number" },
    { required: true, label: "NK Cell", name: "nk_cell", type: "number" },
    { required: true, label: "Monocyte", name: "monocyte", type: "number" },
  ];

  return (
    <div className="p-6 border rounded-lg shadow w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Submit and Delete Form
      </h2>

      {/* Insert Form */}
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
        {fields.map((field) => (
          <div key={field.name} className="flex flex-col">
            <label className="mb-1 font-medium">{field.label}</label>
            <input
              id={field.name}
              type={field.type}
              name={field.name}
              placeholder={field.placeholder || ""}
              required={field.required}
              className="border border-gray-300 rounded px-3 py-2 min-w-[150px]"
            />
          </div>
        ))}

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>

      {/* Delete Form */}
      <form onSubmit={handleDelete} className="flex items-center gap-4">
        <div className="flex flex-col">
          <label className="mb-1 font-medium">Sample to Delete</label>
          <input
            id="delete-sample"
            name="delete-sample"
            type="text"
            required
            className="border border-gray-300 rounded px-3 py-2 min-w-[250px]"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Delete
        </button>
      </form>
    </div>
  );
}

export default Form;
