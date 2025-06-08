export const handleSubmit = async (formData, fetchData) => {
  try {
    const res = await fetch("http://localhost:5000/api/db/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (!res.ok) throw new Error("Submit failed");
    await fetchData();
  } catch (err) {
    console.error("Submit error:", err);
  }
};

export const handleDelete = async (sample, fetchData) => {
  try {
    const res = await fetch("http://localhost:5000/api/db/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sample),
    });
    if (!res.ok) throw new Error("Delete failed");
    await fetchData();
  } catch (err) {
    console.error("Delete error:", err);
  }
};
