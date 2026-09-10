import requests, time
from requests.auth import HTTPBasicAuth

url = 'https://aicsupportsys.atlassian.net'
auth = HTTPBasicAuth('konuriyash@gmail.com', 'ATATT3xFfGF0ImJOMihs3EiNXN8okw5wEHQ52uyunLCG4Bl4PJQFI3nvsAp9hIU0lnXTRq3N_r_FXQyu5LcNZwRzL8g9O_ndYB0lyQt_a_05nlvr2ByIsk6ShAtmSaSxZWiFx4ZRMIYhj5g8MslVVbvLWSg1RejBVl-Cx52QWuziW5fw8WBx570=1A1A10F6')
headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}
board_id = 1

# 1. Create Sprint 0 with short name (24 chars <= 30)
r = requests.post(f'{url}/rest/agile/1.0/sprint', auth=auth, headers=headers, json={
    'name': 'Sprint 0: Setup & Spikes',
    'originBoardId': board_id,
    'startDate': '2026-07-20T09:00:00.000Z',
    'endDate': '2026-08-02T18:00:00.000Z',
    'goal': 'Repository scaffolding, prototyping spikes and architecture setup.'
})
print('Create Sprint 0:', r.status_code, r.text)
if r.status_code in [200, 201]:
    sp0_id = r.json()['id']
else:
    # check existing
    res = requests.get(f'{url}/rest/agile/1.0/board/{board_id}/sprint', auth=auth, headers=headers)
    for sp in res.json().get('values', []):
        if 'Sprint 0' in sp.get('name'):
            sp0_id = sp.get('id')
            break

print('Using Sprint 0 ID:', sp0_id)

# 2. Canonical keys that MUST stay in their sprints
CANONICAL_TASKS_S1 = ['SCRUM-34', 'SCRUM-38', 'SCRUM-42', 'SCRUM-46']
CANONICAL_TASKS_S2 = ['SCRUM-50', 'SCRUM-54', 'SCRUM-58', 'SCRUM-62', 'SCRUM-66', 'SCRUM-71', 'SCRUM-76', 'SCRUM-80', 'SCRUM-84', 'SCRUM-89']
CANONICAL_TASKS_S3 = ['SCRUM-93', 'SCRUM-97', 'SCRUM-101', 'SCRUM-105', 'SCRUM-109', 'SCRUM-113', 'SCRUM-117']
CANONICAL_TASKS_S4 = ['SCRUM-478', 'SCRUM-482', 'SCRUM-486', 'SCRUM-490', 'SCRUM-494', 'SCRUM-498', 'SCRUM-503', 'SCRUM-507', 'SCRUM-516', 'SCRUM-521']
CANONICAL_EPICS = ['SCRUM-28', 'SCRUM-29', 'SCRUM-30', 'SCRUM-31', 'SCRUM-32', 'SCRUM-33']

# Subtasks of canonical tasks
canonical_subtasks = set()
for t in CANONICAL_TASKS_S1 + CANONICAL_TASKS_S2 + CANONICAL_TASKS_S3 + CANONICAL_TASKS_S4:
    res = requests.get(f'{url}/rest/api/3/issue/{t}?fields=subtasks', auth=auth, headers=headers)
    for st in res.json().get('fields', {}).get('subtasks', []):
        canonical_subtasks.add(st['key'])

canonical_set = set(CANONICAL_TASKS_S1 + CANONICAL_TASKS_S2 + CANONICAL_TASKS_S3 + CANONICAL_TASKS_S4 + CANONICAL_EPICS) | canonical_subtasks
print(f'Total canonical issues to preserve: {len(canonical_set)}')

# 3. Find stray issues currently in Sprint 68, Sprint 69, and Backlog
stray_to_archive = []

# Sprints 68 & 69
for sid in [68, 69]:
    res = requests.get(f'{url}/rest/agile/1.0/board/{board_id}/sprint/{sid}/issue?maxResults=100', auth=auth, headers=headers)
    for iss in res.json().get('issues', []):
        if iss['key'] not in canonical_set:
            stray_to_archive.append(iss['key'])

# Backlog
res = requests.get(f'{url}/rest/agile/1.0/board/{board_id}/backlog?maxResults=100', auth=auth, headers=headers)
for iss in res.json().get('issues', []):
    if iss['key'] not in canonical_set:
        stray_to_archive.append(iss['key'])

# Also check for any duplicate epics or stray issues
res_all = requests.post(f'{url}/rest/api/3/search/jql', auth=auth, headers=headers, json={
    'jql': 'project = SCRUM AND (status != Done OR labels = duplicate OR summary ~ "DUPLICATE") maxResults 100',
    'fields': ['key']
})
for iss in res_all.json().get('issues', []):
    if iss['key'] not in canonical_set and iss['key'] not in stray_to_archive:
        stray_to_archive.append(iss['key'])

stray_to_archive = list(dict.fromkeys(stray_to_archive))
print(f'Stray issues to move into Sprint 0: {len(stray_to_archive)}')

# 4. Move all stray issues to Sprint 0 in batches
for i in range(0, len(stray_to_archive), 50):
    batch = stray_to_archive[i:i+50]
    r_mv = requests.post(f'{url}/rest/agile/1.0/sprint/{sp0_id}/issue', auth=auth, headers=headers, json={'issues': batch})
    print(f'Batch {i}..{i+len(batch)} moved: {r_mv.status_code}')
    time.sleep(0.3)

# 5. Activate Sprint 0
r_act = requests.put(f'{url}/rest/agile/1.0/sprint/{sp0_id}', auth=auth, headers=headers, json={
    'name': 'Sprint 0: Setup & Spikes',
    'state': 'active',
    'startDate': '2026-07-20T09:00:00.000Z',
    'endDate': '2026-08-02T18:00:00.000Z'
})
print('Activate Sprint 0:', r_act.status_code, r_act.text)

# 6. Close Sprint 0
r_cls = requests.put(f'{url}/rest/agile/1.0/sprint/{sp0_id}', auth=auth, headers=headers, json={
    'name': 'Sprint 0: Setup & Spikes',
    'state': 'closed',
    'startDate': '2026-07-20T09:00:00.000Z',
    'endDate': '2026-08-02T18:00:00.000Z',
    'completeDate': '2026-08-02T18:00:00.000Z'
})
print('Close Sprint 0:', r_cls.status_code, r_cls.text)

# 7. Verification of all Sprints and Backlog
print('\n================== FINAL VERIFICATION ==================')
targets = [
    (1, 'Sprint 1', 18.0, 4),
    (35, 'Sprint 2', 59.0, 10),
    (68, 'Sprint 3', 38.0, 7),
    (69, 'Sprint 4', 51.0, 10)
]
for sid, name, target_pts, target_count in targets:
    res = requests.get(f'{url}/rest/agile/1.0/board/{board_id}/sprint/{sid}/issue?maxResults=100&fields=key,summary,status,customfield_10016', auth=auth, headers=headers)
    issues = res.json().get('issues', [])
    pts = sum(iss.get('fields', {}).get('customfield_10016') or 0 for iss in issues)
    done_pts = sum(iss.get('fields', {}).get('customfield_10016') or 0 for iss in issues if iss.get('fields', {}).get('status', {}).get('name') == 'Done')
    print(f'{name} (ID: {sid}): {len(issues)} issues (Target: {target_count}) | {pts:.1f} pts (Target: {target_pts:.1f} pts) | Done: {done_pts:.1f} pts')

# Check backlog
res_bl = requests.get(f'{url}/rest/agile/1.0/board/{board_id}/backlog', auth=auth, headers=headers)
bl_count = len(res_bl.json().get('issues', []))
print(f'Backlog count: {bl_count} issues (Target: 0 issues)')
