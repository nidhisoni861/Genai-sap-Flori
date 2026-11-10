#!/bin/bash
# The key is read from ~/.flow-key in BAS (private file, never in Git).
# Deploys the P1-P4 connection: only the server modules of P3, P4 and P2, then sets the BTP environment variables.
P=/home/user/projects; L=~/flow-deploy.log; KEY=$(cat ~/.flow-key)
H=cfapps.us10-001.hana.ondemand.com; OV=https://e2029c81trial-dev-travelorder-overview-srv.$H; AB=https://e2029c81trial-dev-travelorder-afterbooking-srv.$H
echo "start $(date +%H:%M:%S)" > $L
for a in TravelOrder-AI-srv TravelOrder-Overview-srv travelorder-afterbooking-srv; do echo "env names before $a: $(cf env $a 2>/dev/null | sed -n '/User-Provided:/,/^$/p' | grep -v User-Provided | cut -d: -f1 | tr '\n' ' ')" >> $L; done
[ -f ~/backup-before-flow.tgz ] || tar czf ~/backup-before-flow.tgz -C $P TravelOrder-AI/srv TravelOrder-Overview/srv TravelOrder-AfterBooking/srv && echo "backup ok" >> $L
tar xzf /tmp/flowpkg.tgz -C $P --exclude=flowpkg --exclude='._*' 2>/dev/null; find $P/TravelOrder-AI $P/TravelOrder-Overview $P/TravelOrder-AfterBooking -name '._*' -not -path '*/node_modules/*' -delete && echo "files copied" >> $L
deploy() { cd $P/$1 && rm -rf mta_archives && mbt build -p=cf > ~/mbt-$2.log 2>&1 && cf deploy mta_archives/*.mtar -m $2 -f > ~/deploy-$2.log 2>&1 && echo "deployed $2 $(date +%H:%M:%S)" >> $L || echo "FAILED $2 $(date +%H:%M:%S)" >> $L; }
deploy TravelOrder-Overview TravelOrder-Overview-srv
deploy TravelOrder-AfterBooking travelorder-afterbooking-srv
deploy TravelOrder-AI TravelOrder-AI-srv
okey() { grep -E '^OPENAI_API_KEY=' $P/$1/.env | head -1 | cut -d= -f2-; }
cf set-env TravelOrder-AI-srv OPENAI_API_KEY "$(okey TravelOrder-AI)" > /dev/null
cf set-env TravelOrder-Overview-srv OPENAI_API_KEY "$(okey TravelOrder-Overview)" > /dev/null
for a in TravelOrder-AI-srv TravelOrder-Overview-srv; do cf set-env $a OPENAI_MODEL gpt-4o-mini > /dev/null; done
for a in TravelOrder-AI-srv TravelOrder-Overview-srv travelorder-afterbooking-srv; do cf set-env $a FLOW_KEY "$KEY" > /dev/null; done
cf set-env TravelOrder-AI-srv FLOW_OVERVIEW_URL "$OV" > /dev/null; cf set-env TravelOrder-AI-srv FLOW_AFTERBOOKING_URL "$AB" > /dev/null
echo "env set" >> $L
for a in TravelOrder-Overview-srv travelorder-afterbooking-srv TravelOrder-AI-srv; do cf restart $a > /dev/null 2>&1 && echo "restarted $a" >> $L || echo "FAILED restart $a" >> $L; done
for a in TravelOrder-AI-srv TravelOrder-Overview-srv travelorder-afterbooking-srv; do echo "env names after $a: $(cf env $a 2>/dev/null | sed -n '/User-Provided:/,/^$/p' | grep -v User-Provided | cut -d: -f1 | tr '\n' ' ')" >> $L; done
for u in travelorder-ai-srv travelorder-overview-srv travelorder-afterbooking-srv; do f=receiveBooking; [ $u = travelorder-ai-srv ] && f=receiveRequest; echo "no-key test $u: $(curl -s -o /dev/null -w %{http_code} -X POST https://e2029c81trial-dev-$u.$H/odata/v4/flow/$f -H 'Content-Type: application/json' -d '{}')" >> $L; done
echo "ALL DONE $(date +%H:%M:%S)" >> $L
