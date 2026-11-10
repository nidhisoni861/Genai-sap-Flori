# Exam morning checklist

BTP trial stops HANA Cloud and all apps every night. Without these steps every app link shows "404 Not Found".

Start 40 minutes before the exam.

1. Open SAP Business Application Studio (dev space ws-18b6c), open a terminal and run:
   ~/start-exam.sh
   It starts HANA Cloud, waits until it is ready, then starts the 6 apps.
   Check progress with: cat ~/start-exam.log
   Done when the last line is "ALL DONE" and the three lines before it start with 200 or 302.
   If BAS asks to log in to Cloud Foundry first: cf login (API https://api.cf.us10-001.hana.ondemand.com, org e2029c81trial, space dev).

2. Start the Project 1 assistant on the Mac (Terminal):
   cd ~/sap-final-exam/code/TravelOrder-Assistant-local && npm start
   Open the start page http://localhost:4010/start (the Assistant is http://localhost:4010)

3. Open each app once with the full links (the short links end on "Where to?"):
   - P2 Intake:       https://e2029c81trial-dev-travelorder-ai.cfapps.us10-001.hana.ondemand.com/travelorderaiintake/index.html
   - P3 Overview:     https://e2029c81trial-dev-travelorder-overview.cfapps.us10-001.hana.ondemand.com/overview/index.html
   - P4 AfterBooking: https://e2029c81trial-dev-travelorder-afterbooking.cfapps.us10-001.hana.ondemand.com/afterbooking/index.html
   Log in with the SAP account; check that each list shows data.

If an app still shows 404 after ALL DONE: in BAS run  cf apps  and  cf start <app name>  for any app that is "stopped".
