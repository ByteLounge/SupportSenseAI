import requests, json
from requests.auth import HTTPBasicAuth

url = 'https://aicsupportsys.atlassian.net'
auth = HTTPBasicAuth('konuriyash@gmail.com', 'ATATT3xFfGF0ImJOMihs3EiNXN8okw5wEHQ52uyunLCG4Bl4PJQFI3nvsAp9hIU0lnXTRq3N_r_FXQyu5LcNZwRzL8g9O_ndYB0lyQt_a_05nlvr2ByIsk6ShAtmSaSxZWiFx4ZRMIYhj5g8MslVVbvLWSg1RejBVl-Cx52QWuziW5fw8WBx570=1A1A10F6')
headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}

keys = ['SCRUM-93', 'SCRUM-450', 'SCRUM-478', 'SCRUM-516', 'SCRUM-521']
for k in keys:
    r = requests.get(f'{url}/rest/api/3/issue/{k}?fields=summary,status,assignee,parent,subtasks,customfield_10016,customfield_10020', auth=auth, headers=headers)
    d = r.json().get('fields', {})
    sm = d.get('summary')
    pts = d.get('customfield_10016')
    st = d.get('status', {}).get('name')
    parent = d.get('parent', {}).get('key')
    subtasks = len(d.get('subtasks', []))
    sprints = [s.get('id') for s in d.get('customfield_10020', []) or []]
    print(f"{k}: {sm} | pts={pts} | st={st} | parent={parent} | subtasks={subtasks} | sprints={sprints}")
