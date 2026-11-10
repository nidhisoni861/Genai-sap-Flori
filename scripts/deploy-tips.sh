#!/bin/bash
# Deploys P3 database + server with the AI travel suggestions, then restores the environment variables.
P=/home/user/projects; L=~/tips-deploy.log; A=TravelOrder-Overview-srv
echo "start $(date +%H:%M:%S)" > $L
[ -f ~/backup-before-tips.tgz ] || tar czf ~/backup-before-tips.tgz -C $P TravelOrder-Overview/db TravelOrder-Overview/srv TravelOrder-Overview/app/overview/annotations.cds && echo "backup ok" >> $L
tar xzf /tmp/tipspkg.tgz -C $P --exclude=deploy-tips.sh --exclude='._*' 2>/dev/null; find $P/TravelOrder-Overview -name '._*' -not -path '*/node_modules/*' -delete; echo "files copied" >> $L
cd $P/TravelOrder-Overview && rm -rf mta_archives && mbt build -p=cf > ~/mbt-tips.log 2>&1 && cf deploy mta_archives/*.mtar -m TravelOrder-Overview-db-deployer -m $A -f > ~/deploy-tips.log 2>&1 && echo "deployed $(date +%H:%M:%S)" >> $L || { echo "FAILED $(date +%H:%M:%S)" >> $L; exit 1; }
cf set-env $A OPENAI_API_KEY "$(grep -E '^OPENAI_API_KEY=' $P/TravelOrder-Overview/.env | head -1 | cut -d= -f2-)" > /dev/null
cf set-env $A OPENAI_MODEL gpt-4o-mini > /dev/null
cf set-env $A FLOW_KEY "$(cat ~/.flow-key)" > /dev/null
cf restart $A > /dev/null 2>&1 && echo "restarted" >> $L
echo "env names: $(cf env $A | sed -n '/User-Provided:/,/^$/p' | grep -v User-Provided | cut -d: -f1 | tr '\n' ' ')" >> $L
echo "ALL DONE $(date +%H:%M:%S)" >> $L
