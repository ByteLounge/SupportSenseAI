import requests, json
from requests.auth import HTTPBasicAuth

url = 'https://aicsupportsys.atlassian.net'
auth = HTTPBasicAuth('konuriyash@gmail.com', 'ATATT3xFfGF0ImJOMihs3EiNXN8okw5wEHQ52uyunLCG4Bl4PJQFI3nvsAp9hIU0lnXTRq3N_r_FXQyu5LcNZwRzL8g9O_ndYB0lyQt_a_05nlvr2ByIsk6ShAtmSaSxZWiFx4ZRMIYhj5g8MslVVbvLWSg1RejBVl-Cx52QWuziW5fw8WBx570=1A1A10F6')
headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}

print('=================== BURNDOWN CHART & SPRINT AUDIT ===================')

# Fetch all sprints on Board 1
r_board = requests.get(f'{url}/rest/agile/1.0/board/1/sprint', auth=auth, headers=headers)
sprints = r_board.json().get('values', [])
print(f'Total Sprints on Board 1: {len(sprints)}')

total_pts = 0.0

for sp in sprints:
    sid = sp['id']
    name = sp['name']
    state = sp['state']
    s_start = sp.get('startDate', '')[:10]
    s_end = sp.get('endDate', '')[:10]
    
    r_issues = requests.get(f'{url}/rest/agile/1.0/board/1/sprint/{sid}/issue?maxResults=100&fields=key,summary,status,customfield_10016', auth=auth, headers=headers)
    data = r_issues.json()
    issues = data.get('issues', [])
    pts = sum(iss.get('fields', {}).get('customfield_10016') or 0 for iss in issues)
    done_pts = sum(iss.get('fields', {}).get('customfield_10016') or 0 for iss in issues if iss.get('fields', {}).get('status', {}).get('name') == 'Done')
    in_prog_pts = sum(iss.get('fields', {}).get('customfield_10016') or 0 for iss in issues if iss.get('fields', {}).get('status', {}).get('name') == 'In Progress')
    todo_pts = sum(iss.get('fields', {}).get('customfield_10016') or 0 for iss in issues if iss.get('fields', {}).get('status', {}).get('name') == 'To Do')
    total_pts += pts

    r_rep = requests.get(f'{url}/rest/greenhopper/1.0/rapid/charts/sprintreport?rapidViewId=1&sprintId={sid}', auth=auth, headers=headers)
    rep_data = r_rep.json().get('contents', {})
    completed = len(rep_data.get('completedIssues', []))
    not_completed = len(rep_data.get('issuesNotCompletedInCurrentSprint', []))

    print(f"\n--- {name} (ID: {sid}) [{state.upper()}] ---")
    print(f"  Window: {s_start} to {s_end}")
    print(f"  Issues Count: {len(issues)}")
    print(f"  Story Points: Total={pts:.1f} pts | Done={done_pts:.1f} pts | InProgress={in_prog_pts:.1f} pts | ToDo={todo_pts:.1f} pts")
    print(f"  Sprint Report: Completed Issues={completed}, Remaining Issues={not_completed}")
    for iss in issues:
        st = iss['fields']['status']['name']
        p = iss['fields'].get('customfield_10016')
        k = iss['key']
        sm = iss['fields']['summary']
        print(f"    [{k}] ({p} pts) [{st}] {sm}")

# Backlog count
res_bl = requests.get(f'{url}/rest/agile/1.0/board/1/backlog', auth=auth, headers=headers)
all_bl = res_bl.json().get('issues', [])
std_bl = [iss for iss in all_bl if iss['fields']['issuetype']['subtask'] is False]
print('\n--- BACKLOG AUDIT ---')
print(f'  Total Standard Stories/Tasks in Backlog: {len(std_bl)} (Target: 0)')
print(f'  Total Story Points across Board: {total_pts:.1f} (Target: 166.0)')
