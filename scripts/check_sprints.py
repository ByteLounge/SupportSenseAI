import requests, json
from requests.auth import HTTPBasicAuth

url = 'https://aicsupportsys.atlassian.net'
auth = HTTPBasicAuth('konuriyash@gmail.com', 'ATATT3xFfGF0ImJOMihs3EiNXN8okw5wEHQ52uyunLCG4Bl4PJQFI3nvsAp9hIU0lnXTRq3N_r_FXQyu5LcNZwRzL8g9O_ndYB0lyQt_a_05nlvr2ByIsk6ShAtmSaSxZWiFx4ZRMIYhj5g8MslVVbvLWSg1RejBVl-Cx52QWuziW5fw8WBx570=1A1A10F6')
headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}

for sid in [1, 35, 68, 69]:
    r = requests.get(f'{url}/rest/agile/1.0/board/1/sprint/{sid}/issue?maxResults=100&fields=key,summary,status,customfield_10016', auth=auth, headers=headers)
    data = r.json()
    issues = data.get('issues', [])
    total_pts = sum([iss.get('fields', {}).get('customfield_10016') or 0 for iss in issues])
    print(f"\n=== Sprint ID {sid} === (Total issues: {len(issues)}, Total points: {total_pts})")
    for iss in issues:
        pts = iss.get('fields', {}).get('customfield_10016')
        st = iss.get('fields', {}).get('status', {}).get('name')
        sm = iss.get('fields', {}).get('summary')
        print(f"  {iss['key']}: {sm} | Status: {st} | Points: {pts}")
