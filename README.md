1. Create a virtual environment and source into it (I chose the name .teiko):
```
python -m venv .teiko
source ./.teiko/bin/activate
```
2. Install pandas, numpy, and flask:
```
pip3 install pandas
pip3 install numpy
pip3 install flask
pip3 install flask-cors
```
3. You can now run
```
python3 main.py
```
in the project root directory. This will produce a .csv that is the answer to the first question.
3. Install node, npm.
4. Change directory into my-app/fe and run:
```
cd my-app/fe
npm install
```
This will subsequently build the project using Vite and install React, Tailwindcss, Plotly.js, React-plotly.
5. Change directory in my-app/be and run:
```
python3 main.py
```
6. Create another terminal and change directory to my-app/fe and run:
```
npm run dev
```
7. You can now use the fullstack app at http://localhost:5173/

If you have any problem running or installing the app, please email pntsoi@ucsd.edu
