import requests, json
from collections import defaultdict
from requests.auth import HTTPBasicAuth

url = 'https://aicsupportsys.atlassian.net'
auth = HTTPBasicAuth('konuriyash@gmail.com', 'ATATT3xFfGF0ImJOMihs3EiNXN8okw5wEHQ52uyunLCG4Bl4PJQFI3nvsAp9hIU0lnXTRq3N_r_FXQyu5LcNZwRzL8g9O_ndYB0lyQt_a_05nlvr2ByIsk6ShAtmSaSxZWiFx4ZRMIYhj5g8MslVVbvLWSg1RejBVl-Cx52QWuziW5fw8WBx570=1A1A10F6')
headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}

all_issues = []
next_token = None
while True:
    payload = {
        'jql': 'project = SCRUM ORDER BY key ASC',
        'fields': ['key', 'summary', 'issuetype', 'status', 'customfield_10016', 'customfield_10020'],
        'maxResults': 100
    }
    if next_token:
        payload['nextPageToken'] = next_token
    r = requests.post(f'{url}/rest/api/3/search/jql', auth=auth, headers=headers, json=payload)
    data = r.json()
    issues = data.get('issues', [])
    all_issues.extend(issues)
    if data.get('isLast', True) or not data.get('nextPageToken'):
        break
    next_token = data.get('nextPageToken')

print(f"Total issues in SCRUM: {len(all_issues)}")
grouped = defaultdict(list)
for iss in all_issues:
    key = iss['key']
    summary = iss['fields']['summary']
    itype = iss['fields']['issuetype']['name']
    st = iss['fields']['status']['name']
    pts = iss['fields'].get('customfield_10016')
    sprints = iss['fields'].get('customfield_10020')
    sprint_ids = [s.get('id') for s in sprints] if sprints else []
    
    # identify tag
    tag = "OTHER"
    if summary.startswith("[EPIC]"):
        tag = "EPIC"
    elif summary.startswith("[DUPLICATE]"):
        tag = "DUPLICATE"
    elif summary.startswith("[SSAI-"):
        tag = summary.split("]")[0].replace("[", "")
    elif itype == "Subtask":
        tag = "SUBTASK"
    elif key in ["SCRUM-1", "SCRUM-2"]:
        tag = "STRAY"
    grouped[tag].append((key, summary, itype, st, pts, sprint_ids))

for tag, items in sorted(grouped.items()):
    print(f"\n--- Tag: {tag} ({len(items)} items) ---")
    for it in items[:5]:
        print(f"  {it[0]}: {it[1][:60]} | type={it[2]} | st={it[3]} | pts={it[4]} | sprints={it[5]}")
    if len(items) > 5:
        print(f"  ... and {len(items)-5} more")
