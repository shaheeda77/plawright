# plawright
This Playwright script automates login, navigates to a challenge page, finds a hidden "Launch" button, and clicks it.

1️ Install Dependencies:
npm install playwright fs

2️ Install Playwright Browsers (if not installed):
npx playwright install

3️ Run the Script:
node scraper.js

working :
1.Load session or log in using stored credentials and save session data.
2.Navigate to the challenge page after successful authentication.
3.Check if the 'Launch' button is hidden using Playwright selectors.
4.Reveal and click the button by scrolling or using JavaScript execution.
5.Wait for actions and close the browser after completing the task. 
