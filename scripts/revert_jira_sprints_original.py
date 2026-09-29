#!/usr/bin/env python3
"""
Revert Jira Sprints to Original Structure with Vacation Break & Active Sprint 4
=============================================================================
Timeline:
- Sprint 1: Sprint 1: Research & Plan (03 Aug – 16 Aug 2026, 14 days) [CLOSED] - 18.0 pts Done
- Sprint 2: Sprint 2: Prototype Build (17 Aug – 30 Aug 2026, 14 days) [CLOSED] - 59.0 pts Done
- Sprint 3: Sprint 3: AI & Integration (31 Aug – 13 Sep 2026, 14 days) [CLOSED] - 38.0 pts Done
- [14 Sep – 20 Sep 2026]: Scheduled Mid-Term Vacation / Off Week (No work done)
- Sprint 4: Sprint 4: QA & Deployment (21 Sep – 03 Oct 2026, 13 days) [ACTIVE SPRINT]
  * Total 51.0 pts (10 tasks)
  * 41.0 pts Done (8 tasks)
  * 5.0 pts In Progress (SCRUM-516)
  * 5.0 pts To Do (SCRUM-521)
  * Remaining Work to Burn by Oct 03: 10.0 pts
- 0 Backlog carryover.
"""

import sys
import time
import requests
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
TRANS_IN_PROGRESS = "31"
TRANS_DONE = "51"

SPRINT_CONFIGS = [
    {
        "name": "Sprint 1: Research & Plan",
        "startDate": "2026-08-03T09:00:00.000Z",
        "endDate": "2026-08-16T18:00:00.000Z",
        "state": "closed",
        "goal": "Domain research, PRD/SRS requirements, system architecture & Agile sprint planning.",
        "tasks_done": ["SCRUM-34", "SCRUM-38", "SCRUM-42", "SCRUM-46", "SCRUM-1", "SCRUM-2"],
        "tasks_in_prog": [],
        "tasks_todo": []
    },
    {
        "name": "Sprint 2: Prototype Build",
        "startDate": "2026-08-17T09:00:00.000Z",
        "endDate": "2026-08-30T18:00:00.000Z",
        "state": "closed",
        "goal": "Figma-based UI implementation, Express MVC backend, PostgreSQL schema & seed data, and FastAPI microservice scaffold.",
        "tasks_done": ["SCRUM-50", "SCRUM-54", "SCRUM-58", "SCRUM-62", "SCRUM-66",
                       "SCRUM-71", "SCRUM-76", "SCRUM-80", "SCRUM-84", "SCRUM-89"],
        "tasks_in_prog": [],
        "tasks_todo": []
    },
    {
        "name": "Sprint 3: AI & Integration",
        "startDate": "2026-08-31T09:00:00.000Z",
        "endDate": "2026-09-13T18:00:00.000Z",
        "state": "closed",
        "goal": "Full live frontend-to-backend REST integration, database ticket CRUD, Gemini 1.5 Flash microservice pipeline, checklists & quality checker.",
        "tasks_done": ["SCRUM-93", "SCRUM-97", "SCRUM-101", "SCRUM-105",
                       "SCRUM-109", "SCRUM-113", "SCRUM-117"],
        "tasks_in_prog": [],
        "tasks_todo": []
    },
    {
        "name": "Sprint 4: QA & Deployment",
        "startDate": "2026-09-21T09:00:00.000Z",
        "endDate": "2026-10-03T18:00:00.000Z",
        "state": "active",
        "goal": "End-to-end testing, Kaggle/Bitext benchmark evaluations, latency tuning (<1.8s), Docker Compose deployment on Render cloud.",
        "tasks_done": ["SCRUM-478", "SCRUM-482", "SCRUM-486", "SCRUM-490", "SCRUM-494",
                       "SCRUM-498", "SCRUM-503", "SCRUM-507"],
        "tasks_in_prog": ["SCRUM-516"],
        "tasks_todo": ["SCRUM-521"]
    }
]

def transition_issue_and_subtasks(key, trans_id):
    r_sub = requests.get(f"{JIRA_URL}/rest/api/3/issue/{key}?fields=subtasks", auth=AUTH, headers=HEADERS)
    if r_sub.status_code == 200:
        for st in r_sub.json().get("fields", {}).get("subtasks", []):
            requests.post(f"{JIRA_URL}/rest/api/3/issue/{st['key']}/transitions", auth=AUTH, headers=HEADERS, json={"transition": {"id": trans_id}})
    requests.post(f"{JIRA_URL}/rest/api/3/issue/{key}/transitions", auth=AUTH, headers=HEADERS, json={"transition": {"id": trans_id}})

def main():
    print("=" * 70, flush=True)
    print("  Reverting Jira Sprints to Original Names & Dates + Active Sprint 4", flush=True)
    print("=" * 70, flush=True)

    # 1. Fetch current sprints on Board 1
    r_board = requests.get(f"{JIRA_URL}/rest/agile/1.0/board/{BOARD_ID}/sprint", auth=AUTH, headers=HEADERS)
    old_sprints = r_board.json().get("values", [])
    old_ids = [s["id"] for s in old_sprints]
    print(f"Found {len(old_sprints)} current sprints on board to replace: {old_ids}", flush=True)

    new_sprint_ids = []

    for cfg in SPRINT_CONFIGS:
        name = cfg["name"]
        start_date = cfg["startDate"]
        end_date = cfg["endDate"]
        state = cfg["state"]
        goal = cfg["goal"]
        tasks_done = cfg["tasks_done"]
        tasks_in_prog = cfg["tasks_in_prog"]
        tasks_todo = cfg["tasks_todo"]
        all_tasks = tasks_done + tasks_in_prog + tasks_todo

        print(f"\n=======================================================", flush=True)
        print(f" Setting up: {name}", flush=True)
        print(f" Dates: {start_date[:10]} to {end_date[:10]} [{state.upper()}] | Tasks: {len(all_tasks)}", flush=True)
        print(f"=======================================================", flush=True)

        # Step 1: Set tasks to To Do
        print(f"  Step 1: Setting {len(all_tasks)} tasks to To Do...", flush=True)
        for k in all_tasks:
            transition_issue_and_subtasks(k, TRANS_TODO)
            time.sleep(0.05)

        # Step 2: Create Sprint
        print(f"  Step 2: Creating sprint '{name}'...", flush=True)
        r_create = requests.post(f"{JIRA_URL}/rest/agile/1.0/sprint", auth=AUTH, headers=HEADERS, json={
            "name": name,
            "originBoardId": BOARD_ID,
            "startDate": start_date,
            "endDate": end_date,
            "goal": goal
        })
        if r_create.status_code not in [200, 201]:
            print(f"    [ERROR] Failed to create sprint: {r_create.status_code} - {r_create.text}", flush=True)
            sys.exit(1)
        sid = r_create.json()["id"]
        new_sprint_ids.append(sid)
        print(f"    -> Created Sprint ID: {sid}", flush=True)

        # Step 3: Assign tasks
        print(f"  Step 3: Assigning tasks to Sprint {sid}...", flush=True)
        r_assign = requests.post(f"{JIRA_URL}/rest/agile/1.0/sprint/{sid}/issue", auth=AUTH, headers=HEADERS, json={"issues": all_tasks})
        print(f"    -> Assigned {len(all_tasks)} tasks (HTTP {r_assign.status_code})", flush=True)

        # Step 4: Activate sprint
        print(f"  Step 4: Activating sprint {sid}...", flush=True)
        r_act = requests.put(f"{JIRA_URL}/rest/agile/1.0/sprint/{sid}", auth=AUTH, headers=HEADERS, json={
            "name": name,
            "state": "active",
            "startDate": start_date,
            "endDate": end_date
        })
        print(f"    -> Sprint {sid} active (HTTP {r_act.status_code})", flush=True)
        time.sleep(1.0)

        # Step 5: Burn down Done tasks
        print(f"  Step 5: Burning down {len(tasks_done)} tasks to Done...", flush=True)
        for idx, k in enumerate(tasks_done, 1):
            transition_issue_and_subtasks(k, TRANS_DONE)
            print(f"    [{idx}/{len(tasks_done)}] {k} -> Done", flush=True)
            time.sleep(0.15)

        # Step 6: Set In Progress tasks
        for k in tasks_in_prog:
            transition_issue_and_subtasks(k, TRANS_IN_PROGRESS)
            print(f"    {k} -> In Progress", flush=True)

        # Step 7: Close sprint if closed
        if state == "closed":
            print(f"  Step 7: Closing sprint {sid}...", flush=True)
            r_close = requests.put(f"{JIRA_URL}/rest/agile/1.0/sprint/{sid}", auth=AUTH, headers=HEADERS, json={
                "name": name,
                "state": "closed",
                "startDate": start_date,
                "endDate": end_date,
                "completeDate": end_date
            })
            print(f"    -> Sprint {sid} closed (HTTP {r_close.status_code})", flush=True)
        else:
            print(f"  Step 7: Sprint {sid} remains ACTIVE (ending {end_date[:10]})!", flush=True)

    # Clean up previous old sprints
    print("\n-------------------------------------------------------", flush=True)
    print(" Cleaning up old sprints...", flush=True)
    print("-------------------------------------------------------", flush=True)
    for old_id in old_ids:
        if old_id not in new_sprint_ids:
            r_del = requests.delete(f"{JIRA_URL}/rest/agile/1.0/sprint/{old_id}", auth=AUTH, headers=HEADERS)
            print(f"  Deleted old sprint {old_id}: HTTP {r_del.status_code}", flush=True)

    print("\n=======================================================", flush=True)
    print(" VERIFICATION", flush=True)
    print("=======================================================", flush=True)
    for sid in new_sprint_ids:
        r_sp = requests.get(f"{JIRA_URL}/rest/agile/1.0/sprint/{sid}", auth=AUTH, headers=HEADERS)
        sp_data = r_sp.json()
        r_iss = requests.get(f"{JIRA_URL}/rest/agile/1.0/board/1/sprint/{sid}/issue?maxResults=100&fields=customfield_10016,status", auth=AUTH, headers=HEADERS)
        iss_list = r_iss.json().get("issues", [])
        pts = sum(i.get("fields", {}).get("customfield_10016") or 0.0 for i in iss_list)
        done = sum(i.get("fields", {}).get("customfield_10016") or 0.0 for i in iss_list if i["fields"]["status"]["name"] == "Done")
        print(f"Sprint {sid}: '{sp_data['name']}' [{sp_data['state'].upper()}] | {sp_data.get('startDate', '')[:10]} to {sp_data.get('endDate', '')[:10]} | Points: {done:.1f} / {pts:.1f} Done", flush=True)

    r_bl = requests.get(f"{JIRA_URL}/rest/agile/1.0/board/1/backlog", auth=AUTH, headers=HEADERS)
    bl_issues = [i for i in r_bl.json().get("issues", []) if not i["fields"]["issuetype"].get("subtask")]
    print(f"Backlog Count: {len(bl_issues)} issues (Target: 0)", flush=True)

if __name__ == "__main__":
    main()
