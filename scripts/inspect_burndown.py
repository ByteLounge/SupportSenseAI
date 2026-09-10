import requests, json
from datetime import datetime
from requests.auth import HTTPBasicAuth

url = 'https://aicsupportsys.atlassian.net'
auth = HTTPBasicAuth('konuriyash@gmail.com', 'ATATT3xFfGF0ImJOMihs3EiNXN8okw5wEHQ52uyunLCG4Bl4PJQFI3nvsAp9hIU0lnXTRq3N_r_FXQyu5LcNZwRzL8g9O_ndYB0lyQt_a_05nlvr2ByIsk6ShAtmSaSxZWiFx4ZRMIYhj5g8MslVVbvLWSg1RejBVl-Cx52QWuziW5fw8WBx570=1A1A10F6')
headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}

def ts_to_str(ts):
    if not ts: return "None"
    return datetime.fromtimestamp(ts / 1000).isoformat()

for sid in [68]:
    r = requests.get(f'{url}/rest/greenhopper/1.0/rapid/charts/scopechangeburndownchart?rapidViewId=1&sprintId={sid}', auth=auth, headers=headers)
    data = r.json()
    start = ts_to_str(data.get('startTime'))
    end = ts_to_str(data.get('endTime'))
    comp = ts_to_str(data.get('completeTime'))
    print(f"\n=================== SPRINT {sid} (Start: {start}, End: {end}, Complete: {comp}) ===================")
    changes = data.get('changes', {})
    for t_str, event_list in sorted(changes.items(), key=lambda x: int(x[0])):
        t = int(t_str)
        t_dt = ts_to_str(t)
        for ev in event_list:
            # key events
            added = ev.get('added')
            stat = ev.get('statC', {})
            col = ev.get('column')
            print(f"  [{t_dt}] key={ev.get('key')} added={added} statC={stat} col={col}")
