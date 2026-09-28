import requests, json
from requests.auth import HTTPBasicAuth

auth = HTTPBasicAuth('konuriyash@gmail.com', 'ATATT3xFfGF0ImJOMihs3EiNXN8okw5wEHQ52uyunLCG4Bl4PJQFI3nvsAp9hIU0lnXTRq3N_r_FXQyu5LcNZwRzL8g9O_ndYB0lyQt_a_05nlvr2ByIsk6ShAtmSaSxZWiFx4ZRMIYhj5g8MslVVbvLWSg1RejBVl-Cx52QWuziW5fw8WBx570=1A1A10F6')
headers = {'Accept': 'application/json', 'Content-Type': 'application/json'}

# 1. Create a test sprint
r_sp = requests.post('https://aicsupportsys.atlassian.net/rest/agile/1.0/sprint', auth=auth, headers=headers, json={
    'name': 'Test GH Start',
    'originBoardId': 1
})
sid = r_sp.json()['id']
print(f"Created future sprint {sid}")

# 2. Get start dialog data
r_get = requests.get(f'https://aicsupportsys.atlassian.net/rest/greenhopper/1.0/sprint/{sid}/start?rapidViewId=1', auth=auth, headers=headers)
print("Start dialog GET:", r_get.status_code, r_get.json().keys())

# 3. Add a task in To Do
requests.post('https://aicsupportsys.atlassian.net/rest/api/3/issue/SCRUM-478/transitions', auth=auth, headers=headers, json={'transition': {'id': '21'}})
requests.post(f'https://aicsupportsys.atlassian.net/rest/agile/1.0/sprint/{sid}/issue', auth=auth, headers=headers, json={'issues': ['SCRUM-478']})

# 4. Try starting sprint via GreenHopper start endpoint
body = {
    'sprintId': sid,
    'rapidViewId': 1,
    'name': 'Test GH Start',
    'startDate': '03/Aug/26 9:00 AM',
    'endDate': '15/Aug/26 6:00 PM'
}
r_start = requests.put(f'https://aicsupportsys.atlassian.net/rest/greenhopper/1.0/sprint/{sid}/start', auth=auth, headers=headers, json=body)
print("Start dialog PUT:", r_start.status_code, r_start.text)

# 5. Check chart
r_chart = requests.get(f'https://aicsupportsys.atlassian.net/rest/greenhopper/1.0/rapid/charts/scopechangeburndownchart?rapidViewId=1&sprintId={sid}', auth=auth, headers=headers)
d = r_chart.json()
print("openCloseChanges:", d.get('openCloseChanges'))

# Cleanup
requests.post('https://aicsupportsys.atlassian.net/rest/agile/1.0/sprint/187/issue', auth=auth, headers=headers, json={'issues': ['SCRUM-478']})
requests.post('https://aicsupportsys.atlassian.net/rest/api/3/issue/SCRUM-478/transitions', auth=auth, headers=headers, json={'transition': {'id': '51'}})
requests.delete(f'https://aicsupportsys.atlassian.net/rest/agile/1.0/sprint/{sid}', auth=auth, headers=headers)
print("Cleaned up.")
