import sys, time, requests
from requests.auth import HTTPBasicAuth

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

JIRA_URL = "https://aicsupportsys.atlassian.net"
EMAIL = "konuriyash@gmail.com"
API_TOKEN = "ATATT3xFfGF0ImJOMihs3EiNXN8okw5wEHQ52uyunLCG4Bl4PJQFI3nvsAp9hIU0lnXTRq3N_r_FXQyu5LcNZwRzL8g9O_ndYB0lyQt_a_05nlvr2ByIsk6ShAtmSaSxZWiFx4ZRMIYhj5g8MslVVbvLWSg1RejBVl-Cx52QWuziW5fw8WBx570=1A1A10F6"
AUTH = HTTPBasicAuth(EMAIL, API_TOKEN)
HEADERS = {"Accept": "application/json", "Content-Type": "application/json"}
BOARD_ID = 1

TRANS_TODO = "21"
TRANS_DONE = "51"

def transition_issue_and_subtasks(key, trans_id):
    # Transition subtasks
    r_sub = requests.get(f"{JIRA_URL}/rest/api/3/issue/{key}?fields=subtasks", auth=AUTH, headers=HEADERS)
    if r_sub.status_code == 200:
        subtasks = r_sub.json().get("fields", {}).get("subtasks", [])
        for st in subtasks:
            requests.post(f"{JIRA_URL}/rest/api/3/issue/{st['key']}/transitions", auth=AUTH, headers=HEADERS, json={"transition": {"id": trans_id}})
    # Transition parent
    requests.post(f"{JIRA_URL}/rest/api/3/issue/{key}/transitions", auth=AUTH, headers=HEADERS, json={"transition": {"id": trans_id}})

def run_sprint_lifecycle(name, goal, start_date, end_date, task_keys, old_sprint_id=None):
    print(f"\n=======================================================")
    print(f" Processing: {name}")
    print(f" Window: {start_date[:10]} to {end_date[:10]} | Tasks: {len(task_keys)}")
    print(f"=======================================================")

    # 1. Transition all tasks to To Do
    print(f"  Step 1: Setting {len(task_keys)} tasks and subtasks to 'To Do'...")
    for k in task_keys:
        transition_issue_and_subtasks(k, TRANS_TODO)
        time.sleep(0.05)
    print("    -> All tasks set to 'To Do'.")

    # 2. Create sprint (future)
    print(f"  Step 2: Creating sprint '{name}'...")
    payload_create = {
        "name": name,
        "originBoardId": BOARD_ID,
        "startDate": start_date,
        "endDate": end_date,
        "goal": goal
    }
    r = requests.post(f"{JIRA_URL}/rest/agile/1.0/sprint", auth=AUTH, headers=HEADERS, json=payload_create)
    if r.status_code not in [200, 201]:
        print(f"    [ERROR] Failed to create sprint: {r.status_code} - {r.text}")
        return None
    new_id = r.json()["id"]
    print(f"    -> Created new sprint ID: {new_id}")

    # 3. Assign tasks to new sprint while in To Do
    print(f"  Step 3: Assigning tasks to sprint {new_id}...")
    r_assign = requests.post(f"{JIRA_URL}/rest/agile/1.0/sprint/{new_id}/issue", auth=AUTH, headers=HEADERS, json={"issues": task_keys})
    print(f"    -> Assigned {len(task_keys)} tasks (status: {r_assign.status_code})")

    # 4. Activate sprint
    print(f"  Step 4: Activating sprint {new_id}...")
    r_act = requests.put(f"{JIRA_URL}/rest/agile/1.0/sprint/{new_id}", auth=AUTH, headers=HEADERS, json={
        "name": name,
        "state": "active",
        "startDate": start_date,
        "endDate": end_date
    })
    print(f"    -> Sprint {new_id} active (status: {r_act.status_code})")
    time.sleep(1.0)

    # 5. Burn down tasks sequentially to Done
    print(f"  Step 5: Burning down {len(task_keys)} tasks to 'Done'...")
    for idx, k in enumerate(task_keys, 1):
        transition_issue_and_subtasks(k, TRANS_DONE)
        print(f"    [{idx}/{len(task_keys)}] {k} -> Done")
        time.sleep(0.25)

    # 6. Close sprint
    print(f"  Step 6: Closing sprint {new_id} with completeDate {end_date[:10]}...")
    r_close = requests.put(f"{JIRA_URL}/rest/agile/1.0/sprint/{new_id}", auth=AUTH, headers=HEADERS, json={
        "name": name,
        "state": "closed",
        "startDate": start_date,
        "endDate": end_date,
        "completeDate": end_date
    })
    print(f"    -> Sprint {new_id} closed (status: {r_close.status_code})")

    # 7. Delete old sprint if provided
    if old_sprint_id and old_sprint_id != new_id:
        r_del = requests.delete(f"{JIRA_URL}/rest/agile/1.0/sprint/{old_sprint_id}", auth=AUTH, headers=HEADERS)
        print(f"  Step 7: Deleted old sprint {old_sprint_id} (status: {r_del.status_code})")

    # 8. Verify burndown and sprint report
    r_rep = requests.get(f"{JIRA_URL}/rest/greenhopper/1.0/rapid/charts/sprintreport?rapidViewId=1&sprintId={new_id}", auth=AUTH, headers=HEADERS)
    rep = r_rep.json().get("contents", {})
    comp = len(rep.get("completedIssues", []))
    not_comp = len(rep.get("issuesNotCompletedInCurrentSprint", []))
    
    r_iss = requests.get(f"{JIRA_URL}/rest/agile/1.0/board/1/sprint/{new_id}/issue?maxResults=100&fields=customfield_10016", auth=AUTH, headers=HEADERS)
    iss_list = r_iss.json().get("issues", [])
    pts = sum(i.get("fields", {}).get("customfield_10016") or 0.0 for i in iss_list)
    print(f"  [VERIFY] Sprint {new_id}: {len(iss_list)} tasks ({pts:.1f} pts) | Completed: {comp}, Incomplete: {not_comp}")

    return new_id

def main():
    print("=" * 65)
    print("  SupportSense AI: Rebuilding Sprints 2, 3, 4 with Active Burndown")
    print("=" * 65)

    # Sprint 2: Prototype Development
    s2_tasks = [
        "SCRUM-50", "SCRUM-54", "SCRUM-58", "SCRUM-62", "SCRUM-66",
        "SCRUM-71", "SCRUM-76", "SCRUM-80", "SCRUM-84", "SCRUM-89"
    ]
    s2_id = run_sprint_lifecycle(
        name="Prototype Development",
        goal="Figma-based UI implementation, Express MVC backend, PostgreSQL schema & seed data, and FastAPI microservice scaffold.",
        start_date="2026-08-18T09:00:00.000Z",
        end_date="2026-08-31T18:00:00.000Z",
        task_keys=s2_tasks,
        old_sprint_id=175
    )

    # Sprint 3: Development and Improvements
    s3_tasks = [
        "SCRUM-93", "SCRUM-97", "SCRUM-101", "SCRUM-105",
        "SCRUM-109", "SCRUM-113", "SCRUM-117"
    ]
    s3_id = run_sprint_lifecycle(
        name="Development and Improvements",
        goal="Full live frontend-to-backend REST integration, database ticket CRUD, Gemini 1.5 Flash microservice pipeline, checklists & quality checker.",
        start_date="2026-09-01T09:00:00.000Z",
        end_date="2026-09-14T18:00:00.000Z",
        task_keys=s3_tasks,
        old_sprint_id=176
    )

    # Sprint 4: Testing, Bug Fixes & Deploy (Ends on October 3rd!)
    s4_tasks = [
        "SCRUM-478", "SCRUM-482", "SCRUM-486", "SCRUM-490", "SCRUM-494",
        "SCRUM-498", "SCRUM-503", "SCRUM-507", "SCRUM-516", "SCRUM-521"
    ]
    s4_id = run_sprint_lifecycle(
        name="Testing, Bug Fixes & Deploy",
        goal="End-to-end testing, Kaggle/Bitext benchmark evaluations, latency tuning (<1.8s), Docker Compose deployment on Render cloud.",
        start_date="2026-09-15T09:00:00.000Z",
        end_date="2026-10-03T18:00:00.000Z",
        task_keys=s4_tasks,
        old_sprint_id=177
    )

    print("\n" + "=" * 65)
    print("  FINAL SPRINT SUMMARY")
    print("=" * 65)
    print(f"Sprint 1 (Research and Requirements): ID 184 (Aug 03 – Aug 17)")
    print(f"Sprint 2 (Prototype Development): ID {s2_id} (Aug 18 – Aug 31)")
    print(f"Sprint 3 (Development and Improvements): ID {s3_id} (Sep 01 – Sep 14)")
    print(f"Sprint 4 (Testing, Bug Fixes & Deploy): ID {s4_id} (Sep 15 – Oct 03)")

if __name__ == "__main__":
    main()
