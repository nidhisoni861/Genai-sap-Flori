#!/bin/bash
# Starts HANA Cloud and the TravelOrder AI apps (BTP trial stops them every night).
# Run in the SAP Business Application Studio terminal (logged in to Cloud Foundry). Copy lives in BAS at ~/start-exam.sh.
L=~/start-exam.log; echo "start $(date +%H:%M:%S)" > $L
cf update-service travelorder-hana -c '{"data":{"serviceStopped":false}}' >> $L 2>&1
for i in $(seq 1 60); do cf service travelorder-hana 2>/dev/null | grep -q "in progress" || break; sleep 10; done
echo "hana done $(date +%H:%M:%S)" >> $L
for a in TravelOrder-AI-srv TravelOrder-Overview-srv travelorder-afterbooking-srv TravelOrder-AI TravelOrder-Overview travelorder-afterbooking; do cf start $a > /dev/null 2>&1 && echo "started $a" >> $L || echo "FAILED $a" >> $L; done
for u in travelorder-ai/travelorderaiintake travelorder-overview/overview travelorder-afterbooking/afterbooking; do h=${u%%/*}; p=${u#*/}; echo "$(curl -s -o /dev/null -w %{http_code} https://e2029c81trial-dev-$h.cfapps.us10-001.hana.ondemand.com/$p/index.html) $h" >> $L; done
echo "ALL DONE $(date +%H:%M:%S)" >> $L
