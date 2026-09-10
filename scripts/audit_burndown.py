import requests, json
from requests.auth import HTTPBasicAuth

url = 'https://aicsupportsys.atlassian.net'
auth = HTTPBasicAuth('konuriyash@gmail.com', 'ATATT3xFfGF0ImJOMihs3EiNXN8okw5wEHQ52uyunLCG4Bl4PJQFI3nvsAp9hIU0lnXTRq3N_r_FXQyu5LcNZwRzL8g9O_ndYB0lyQt_a_05nlvr2ByIsk6ShAtmSaSxZWiFx4ZRMIYhj5g8MslVVbvLWSg1RejBVl-Cx52QWuziW5fw8WBx570=1A1A10F6')
headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}

print('=================== BURNDOWN CHART & SPRINT AUDIT ===================')
sprint_info = [
    (1, 'Sprint 1: Research & Plan', 18.0, 4, 'Aug 03 – Aug 16, 2026', 'closed'),
    (35, 'Sprint 2: Prototype Build', 59.0, 10, 'Aug 17 – Aug 30, 2026', 'closed'),
    (68, 'Sprint 3: AI & Integration', 38.0, 7, 'Aug 31 – Sep 13, 2026', 'active'),
    (69, 'Sprint 4: QA & Deployment', 51.0, 10, 'Sep 14 – Sep 27, 2026', 'future')
]

for sid, name, target_pts, target_count, dates, state in sprint_info:
    r_issues = requests.get(f'{url}/rest/agile/1.0/board/1/sprint/{sid}/issue?maxResults=100&fields=key,summary,status,customfield_10016', auth=auth, headers=headers)
    data = r_issues.json()
    issues = data.get('issues', [])
    pts = sum(iss.get('fields', {}).get('customfield_10016') or 0 for iss in issues)
    done_pts = sum(iss.get('fields', {}).get('customfield_10016') or 0 for iss in issues if iss.get('fields', {}).get('status', {}).get('name') == 'Done')
    in_prog_pts = sum(iss.get('fields', {}).get('customfield_10016') or 0 for iss in issues if iss.get('fields', {}).get('status', {}).get('name') == 'In Progress')
    todo_pts = sum(iss.get('fields', {}).get('customfield_10016') or 0 for iss in issues if iss.get('fields', {}).get('status', {}).get('name') == 'To Do')
    
    r_rep = requests.get(f'{url}/rest/greenhopper/1.0/rapid/charts/sprintreport?rapidViewId=1&sprintId={sid}', auth=auth, headers=headers)
    rep_data = r_rep.json().get('contents', {})
    completed = len(rep_data.get('completedIssues', []))
    not_completed = len(rep_data.get('issuesNotCompletedInCurrentSprint', []))

    print(f'\n--- {name} (ID: {sid}) [{state.upper()}] ---')
    print(f'  Dates: {dates}')
    print(f'  Canonical Issues: {len(issues)} (Expected: {target_count})')
    print(f'  Story Points: Total={pts:.1f} pts (Target={target_pts:.1f}) | Done={done_pts:.1f} pts | InProgress={in_prog_pts:.1f} pts | ToDo={todo_pts:.1f} pts')
    print(f'  Sprint Report: Completed Issues={completed}, Remaining Issues={not_completed}')
    for iss in issues:
        st = iss['fields']['status']['name']
        p = iss['fields'].get('customfield_10016')
        k = iss['key']
        sm = iss['fields']['summary']
        print(f'    [{k}] ({p} pts) [{st}] {sm}')

# Backlog count
res_bl = requests.get(f'{url}/rest/agile/1.0/board/1/backlog', auth=auth, headers=headers)
all_bl = res_bl.json().get('issues', [])
std_bl = [iss for iss in all_bl if iss['fields']['issuetype']['subtask'] is False]
print('\n--- BACKLOG AUDIT ---')
print(f'  Total Standard Stories/Tasks in Backlog: {len(std_bl)} (Expected: 0)')
