import React from "react";
import { useEffect, useState } from "react";
import BoxPlot from "./Plot";

export default function Blog() {
  const [error, setError] = useState(null);
  const [plotData, setPlots] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/plots")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch plots");
        }
        return res.json();
      })
      .then((data) => setPlots(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return (
      <div className="text-red-600 text-center mt-20">
        Error loading blog: {error}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 font-sans text-black">
      <div className="max-w-7xl mx-auto space-y-10">
        <section className="space-y-2">
          <h1 className="text-3xl font-bold text-black">Python Assignment:</h1>
          <h2 className="text-2xl font-bold text-black p-4">
            Part 1: Generating a processed .csv
          </h2>
          <p className="text-xl pl-2">
            For this problem, the script used to generate this is in {"{"}
            $PROJECT_DIR{"}"}/main.py. It will need pandas to run. Once done, it
            will produced process-cell-count.csv that fits the description of
            the table requirements. You could also find processed-cell-count.csv
            as the result of running this script.
          </p>
          <h2 className="text-2xl font-bold text-black p-4">
            Part 2a: Generating a box plot
          </h2>
          <p className="text-xl pl-2">
            I created a fullstack app for this problem, which is the app you're
            looking at now if you're able to read this. The frontend is run on
            React and built with Vite. I used Plotly to help with the plot. The
            backend is just a small Flask app started on port 5000. Once booted,
            the frontend will query the backend, and then it will read from
            cell-count.csv and processed the data to build the box plot and
            response that data to the frontend again. I then used Plotly to use
            the responsed data to draw a box plot.
          </p>
          <BoxPlot plotData={plotData} />
          <h2 className="text-2xl font-bold text-black p-4">
            Part 2b: Analysis
          </h2>
          <p className="text-xl pl-2">
            Initial thought: Right away, we notice that the sample sizes for
            these populations are very small ({"<"} 30), so any statistical
            tests that rely on the Central Limit Theorem are off the hook and we
            need to use something that plays well with small sample sizes.{" "}
            <br></br>
            Most of the statistical techniques I learned in my classes are for
            large enough sample sizes, and if not, we can assume some type of
            distribution on the population. However, working with these samples,
            I'm not confident enough to say that they follow any type of
            distribution. My plan is to use the means of each cell type's
            relative frequency to measure how much different the responders
            group is to the non-responders group. Fit it into a hypothesis test,
            our null hypothesis would be that the difference of the means of
            relative frequency of a cell type would be the same. Our alternate
            would be that they are not the same. Then, I'll look for tests that
            work well with small sample sizes and unknown distribution.<br></br>
            Since the sample size is small, we could generate a
            t-confidence-interval of the mean of the responders group and
            non-responders group to see how well they overlap each other. But
            doing so would require the assumption of normality in the
            distribution. I wouldn't think that's a good idea considering how
            some group of the populations are very skewed (monocyte and b_cell
            non-responders).<br></br>
            At this point, I would conclude that just by looking at the box
            plot, the b_cell, cd4_t_cell, and cd8_t_cell are the most
            significantly different. Mainly because the median of these
            population are way off in comparison to cd8_t_cell and nk_cell. Not
            only that, the fences of each group in these population don't even
            intersect. If I have to choose which population is the most
            different, that would be the monocyte where the median of the
            responders group is 0.075 while the non-responders group is 0.28
            <br></br>
          </p>
        </section>
        <section className="space-y-2">
          <h1 className="text-3xl font-bold text-black">
            Database Assignment:
          </h1>
          <h2 className="text-2xl font-bold text-black p-4">
            Part 1: Database schema design.
          </h2>
          <p className="text-xl pl-2">
            To approach this problem, I have to write out the functional
            dependencies of the attributes of this database. One thing that is
            very clear is that sample is a key and will uniquely identified all
            other attributes. I will also make another assumption that the age,
            sex, and condition of a subject will not change. Hence, the subject
            attribute will also uniquely identified condition, age, and sex.
            <br></br>
            For now, the project attribute itself is not uniquely identifying
            any other attributes. I am tempted to group it with other attributes
            such that they uniquely identify a set of other attributes as well.
            The reason is that when the user load up a project, they should be
            able to load all samples within the project very quickly, so it
            makes sense that project should be a key in a table. However, I
            can't seem to find a good grouping of project with other attributes.
            <br></br>
            One last thing is that since the users are going to read the cell
            count a lot, we can group it into (sample, cell_type, count). This
            means the database will have some extra attributes such as cell_type
            but it will give us another useful decomposition as well.
            <br></br>
            Our final answer will have 3 tables: <br></br>
            1. Subject: (subject, condition, age, sex) <br></br>
            2. Sample: (sample, sample_type, treatment, response,
            time_from_treatment, cell_type (the values will be the type of
            cell), population_count (the values will be the number of cells of
            that type of that sample)) <br></br>
            3. Overview: (sample, project, subject)
          </p>
          <h2 className="text-2xl font-bold text-black p-4">
            Part 2: Advantages of the schema.
          </h2>
          <p className="text-xl pl-2">
            Storing this information in a database will entrust the underlying
            database system to store a big bulk of data efficiently on disk.
            This ensures fast querying on the database. We could imagine a
            hundreds of projects with hundreds of thousands of samples each.{" "}
            <br></br>
            Part of the reason why I was looking for decomposition is that it
            saves redundancy. If we had stored the data as one table, we would
            notice that attributes like projects, subjects, etc. will be
            repeated a lot which is wasteful. We also notice that if the age or
            condition of the patient is changed, it could possibly be changed in
            one place and not another. We also can't record or insert a new
            subject if they haven't had a sample yet. All of these and many more
            reasons are why we should look to decompose our table reasonably.
          </p>
          <h2 className="text-2xl font-bold text-black p-4">Part 3:</h2>
          <p className="text-xl pl-2">
            SELECT condition, COUNT(*) AS (condition, total_subjects) <br></br>
            FROM Subject <br></br>
            GROUP BY condition;
          </p>
          <h2 className="text-2xl font-bold text-black p-4">Part 4:</h2>
          <p className="text-xl pl-2">
            SELECT * FROM Sample s<br></br>
            WHERE s.sample_type = 'PBMC' AND s.cell_type = 'melanoma' <br></br>
            AND s.time_from_treatment = 0 AND s.treatment='tr1'<br></br>
          </p>
          <h2 className="text-2xl font-bold text-black p-4">Part 5:</h2>
          <p className="text-xl pl-2">
            CREATE VIEW q4 AS <br></br>
            SELECT * FROM Sample s<br></br>
            WHERE s.sample_type = 'PBMC' AND s.cell_type = 'melanoma' <br></br>
            AND s.time_from_treatment = 0 AND s.treatment='tr1';<br></br>
          </p>
          <h2 className="text-2xl font-bold text-black p-4">Part 5a:</h2>
          <p className="text-xl pl-2">
            SELECT o.project, COUNT(*) AS project, num_samples <br></br>
            FROM Overview o, q4 q <br></br>
            WHERE o.sample = q.sample <br></br>
            GROUP BY o.project;
          </p>
          <h2 className="text-2xl font-bold text-black p-4">Part 5b:</h2>
          <p className="text-xl pl-2">
            SELECT response, COUNT(*) FROM q4 <br></br>
            GROUP BY response;
          </p>
          <h2 className="text-2xl font-bold text-black p-4">Part 5c:</h2>
          <p className="text-xl pl-2">
            SELECT sex, COUNT(*) FROM q4 <br></br>
            GROUP BY sex;
          </p>
        </section>
      </div>
    </main>
  );
}
