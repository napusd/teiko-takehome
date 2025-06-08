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
