# Setup Toolchain for Vacancy App
This guide will help you setup the basic JS toolchain on your machine. When you finish this guide, you will be able to run the Vacancy app.

First, you need to install NodeJS. On something unix-ish, the best option here is [NVM](https://github.com/nvm-sh/nvm). Follow the setup instructions on that page. If you are on windows, just download the latest Node JS binary.

To make sure you have node installed, type `node -v` on the command line and make sure you get the version you expect.

Next, you need to install app specific dependencies. From the `/frontend` directory run `npm i`. Wait. Meditate.

After the npm install finishes, run `npm start`. Your browser will open and display the Vacancy app.
