## Note
I received this take-home on Monday and produced a working full-stack app by Thursday. However, only by Thursday that I notice that the take-home's requirements have changed tremendously which made me start over again. This subsequently made me missed the deadline and is the reason why I was only able to turn it in on Saturday.

This is a full-stack app as per the requirements of the write up. There is no way to run a full-stack app with a backend and database using Github Pages so I decided not to set up one. However, I have left the instructions to install and run this project on a unix-based system below. I also assume that you have some knowledge of pip and virtual environment. If you have any problems installing or running this locally, you can email me at pntsoi@ucsd.edu. I have provided screenshots of my app in the ./screenshot folder if you want to check out what it looks like.

## Installation
1. Create a virtual environment and source into it (I chose the name .teiko):
```
python3 -m venv .teiko
source ./.teiko/bin/activate
```

2. Install pandas, numpy, and flask:
```
pip3 install pandas
pip3 install numpy
pip3 install flask
pip3 install flask-cors
pip3 install SQLAlchemy
pip3 install Flask-SQLAlchemy
```

3. Change directory into ./my-app/be/instance/data

4. Allow full access to the teiko.db. (If it's not there, create it with sqlite3 using the same name)
```
chmod 777 teiko.db
```

5. Change directory out into /be and run
```
python3 restart_db.py
```
This will create, drop, and seed the database.

6. Run the backend server
```
python3 main.py
```

7. Install node, npm.

8. Change directory into my-app/fe and run:
```
npm install
```

This will subsequently build the project using Vite and install React, Tailwindcss, Plotly.js, React-plotly.

9. Now run the frontend app
```
npm run dev
```

10. You can now use the fullstack app at http://localhost:5173/

Note that the backend app using Flask is running on port 5000, while the frontend app is running on port 5173.

If you have any problem running or installing the app, please email pntsoi@ucsd.edu

## Schema Design

The database is designed into 3 tables:
1. Subject: (subject {primary_key}, condition, age, sex)
2. Sample: (sample, sample_type, treatment, response, time_from_treatment_start, cell_type, population_count) - {sample, cell_type} acts as primary_key
3. Overview: (sample {primary_key}, project, subject)

The Subject table is there to record subjects. Since we can safely assume that subject's age, condition, or sex in an experiment won't change, we can give it its own table so that it is efficient and non-repetitive to serve lookup of subjects. Not only that, by separating Subject into a separate table, we can insert subjects without needing an accompanying Sample or Project.

We can theoretically do the same thing with Project as well, but since projects don't have metadata that we can attach it with (project name, project creation date), it is a bit hard to separate it from other attributes and create a meaningful standalone table.

The Sample table is separated from the project and subject id to save redundancy. It will only carry information about the samples only. I also decided to split "b_cell", "nk_cell", etc. columns and merge them all into cell_type. Doing this will allow the user to add cell types without a rigid structure. We can see that some experiments could measure only "nk_cell" and "b_cell", so why should we lock the other cell types to one sample entry as well?

The Overview table is just there for fast projects look up and is used to link projects, subjects, and samples.

## Software Design

Since this is a small app, I decided to use Flask with sqlite as the backend, and use React as a frontend. The Flask backend will take care of any processing of adding, deleting an entry or filter the database and return the results. The frontend will do some processing as well, but mostly to collect inputs and craft request to send to the backend.

I used SQLAlchemy to save writing SQL queries for the backend.

The notable point and most of the engineering of this app is the frontend. It has 3 main components: Submit/Delete/Filter, Database View, and Summary View.

The Submit/Delete/Filter component takes input from the input fields and merge them into a json request to the backend server.

The Database View component renders the main database and automatically updates when the user inputs a new entry or filter the database. It main state - data - is the state that the whole app renders around. Both Database View and Summary View rerenders whenever this state is changed.

The Summary View comprises of the Plot, the Summary table, and the Cell Type comparison and Conclusion. It receives the data from the backend and does the processing to draw the summary table on its own. It also does its own computing to render the plot and draw the conclusion. The reason why I group these all together is because the relative frequency calculation is able to be used again for all 3 of these mini components.
