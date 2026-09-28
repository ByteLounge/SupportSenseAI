#!/usr/bin/env python3
"""
Reframe Sprints 1, 2, 3, 4 with Reframed Dates, Tasks, and Clean Burndowns
==========================================================================
1. Sprint 1: Research and Requirements
   - Dates: 03 Aug 2026 – 17 Aug 2026 (Ends Aug 17th per user request)
   - Tasks: SCRUM-34, 38, 42, 46 (18.0 pts) + SCRUM-1, 2
2. Sprint 2: Prototype Development
   - Dates: 18 Aug 2026 – 31 Aug 2026
   - Tasks: SCRUM-50, 54, 58, 62, 66, 71, 76, 80, 84, 89 (59.0 pts)
3. Sprint 3: Development and Improvements
   - Clean slate: Removes old Sprint 68 polluted with 21 ghost duplicates
   - Dates: 01 Sep 2026 – 14 Sep 2026
   - Tasks: Canonical 7 tasks only (SCRUM-93, 97, 101, 105, 109, 113, 117) (38.0 pts)
4. Sprint 4: Testing, Bug Fixes & Deploy
   - Dates: 15 Sep 2026 – 27 Sep 2026
   - Tasks: Canonical 10 tasks (SCRUM-478, 482, 486, 490, 494, 498, 503, 507, 516, 521) (51.0 pts)
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


def log(msg, level="INFO"):
    p = {"INFO": "[INFO]", "OK": "[SUCCESS]", "WARN": "[WARN] ", "ERR": "[ERROR]"}.get(level, "[INFO]")
    print(f"{p} {msg}")


def recreate_sprint(name, goal, start_date, end_date, task_keys, old_sprint_id=None):
    """Creates a clean sprint with exact dates and canonical tasks, then closes it."""
    # 1. Create sprint
    payload_create = {
        "name": name,
        "originBoardId": BOARD_ID,
        "startDate": start_date,
        "endDate": end_date,
        "goal": goal
    }
    r = requests.post(f"{JIRA_URL}/rest/agile/1.0/sprint", auth=AUTH, headers=HEADERS, json=payload_create)
    if r.status_code not in [200, 201]:
        log(f"Failed to create {name}: {r.status_code} - {r.text}", "ERR")
        return None
    new_id = r.json()["id"]
    log(f"Created sprint '{name}' with ID: {new_id}", "OK")

    # 2. Assign canonical tasks
    r_assign = requests.post(f"{JIRA_URL}/rest/agile/1.0/sprint/{new_id}/issue", auth=AUTH, headers=HEADERS, json={"issues": task_keys})
    log(f"Assigned {len(task_keys)} tasks to sprint {new_id} (status: {r_assign.status_code})")

    # 3. Activate sprint
    requests.put(f"{JIRA_URL}/rest/agile/1.0/sprint/{new_id}", auth=AUTH, headers=HEADERS, json={
        "name": name,
        "state": "active",
        "startDate": start_date,
        "endDate": end_date
    })

    # 4. Close sprint
    requests.put(f"{JIRA_URL}/rest/agile/1.0/sprint/{new_id}", auth=AUTH, headers=HEADERS, json={
        "name": name,
        "state": "closed",
        "startDate": start_date,
        "endDate": end_date,
        "completeDate": end_date
    })
    log(f"Sprint '{name}' (ID: {new_id}) closed successfully with window: {start_date[:10]} to {end_date[:10]}", "OK")

    # 5. Delete old sprint if provided
    if old_sprint_id and old_sprint_id != new_id:
        r_del = requests.delete(f"{JIRA_URL}/rest/agile/1.0/sprint/{old_sprint_id}", auth=AUTH, headers=HEADERS)
        log(f"Deleted old sprint ID {old_sprint_id} (status: {r_del.status_code})", "OK" if r_del.status_code == 204 else "WARN")

    return new_id


def main():
    print("=" * 75)
    print("  Re-framing Sprints 1, 2, 3, 4 with Exact Dates & Clean Burndowns")
    print("=" * 75)

    # Note: Sprint 1 was already recreated with ID 174 ending on Aug 17th.
    # Let's check current sprints on board
    r_sp = requests.get(f"{JIRA_URL}/rest/agile/1.0/board/{BOARD_ID}/sprint", auth=AUTH, headers=HEADERS)
    board_sprints = {s["name"]: s["id"] for s in r_sp.json().get("values", [])}
    print("Current sprints on board:", board_sprints)

    # -------------------------------------------------------------------------
    # Sprint 2: Prototype Development (Aug 18 – Aug 31, 2026)
    # -------------------------------------------------------------------------
    s2_tasks = [
        "SCRUM-50", "SCRUM-54", "SCRUM-58", "SCRUM-62", "SCRUM-66",
        "SCRUM-71", "SCRUM-76", "SCRUM-80", "SCRUM-84", "SCRUM-89"
    ]
    old_s2_id = board_sprints.get("Prototype Development")
    s2_id = recreate_sprint(
        name="Prototype Development",
        goal="Prototype Development",
        start_date="2026-08-18T09:00:00.000Z",
        end_date="2026-08-31T18:00:00.000Z",
        task_keys=s2_tasks,
        old_sprint_id=old_s2_id
    )

    # -------------------------------------------------------------------------
    # Sprint 3: Development and Improvements (Sep 01 – Sep 14, 2026)
    # -------------------------------------------------------------------------
    s3_tasks = [
        "SCRUM-93", "SCRUM-97", "SCRUM-101", "SCRUM-105",
        "SCRUM-109", "SCRUM-113", "SCRUM-117"
    ]
    old_s3_id = board_sprints.get("Development and Improvements")
    s3_id = recreate_sprint(
        name="Development and Improvements",
        goal="Development and Improvements",
        start_date="2026-09-01T09:00:00.000Z",
        end_date="2026-09-14T18:00:00.000Z",
        task_keys=s3_tasks,
        old_sprint_id=old_s3_id
    )

    # -------------------------------------------------------------------------
    # Sprint 4: Testing, Bug Fixes & Deploy (Sep 15 – Sep 27, 2026)
    # -------------------------------------------------------------------------
    s4_tasks = [
        "SCRUM-478", "SCRUM-482", "SCRUM-486", "SCRUM-490", "SCRUM-494",
        "SCRUM-498", "SCRUM-503", "SCRUM-507", "SCRUM-516", "SCRUM-521"
    ]
    old_s4_id = board_sprints.get("Testing, Bug Fixes & Deploy")
    s4_id = recreate_sprint(
        name="Testing, Bug Fixes & Deploy",
        goal="Testing, Bug Fixes and Deployment",
        start_date="2026-09-15T09:00:00.000Z",
        end_date="2026-09-27T18:00:00.000Z",
        task_keys=s4_tasks,
        old_sprint_id=old_s4_id
    )

    print("\n" + "=" * 75)
    print("  VERIFYING REFRAINED SPRINTS & BURNDOWNS")
    print("=" * 75)

    r_final = requests.get(f"{JIRA_URL}/rest/agile/1.0/board/{BOARD_ID}/sprint", auth=AUTH, headers=HEADERS)
    final_sprints = r_final.json().get("values", [])
    for sp in final_sprints:
        sid = sp["id"]
        sname = sp["name"]
        sstate = sp["state"]
        sstart = sp.get("startDate", "")[:10]
        send = sp.get("endDate", "")[:10]
        
        # Check burndown report
        r_rep = requests.get(f"{JIRA_URL}/rest/greenhopper/1.0/rapid/charts/sprintreport?rapidViewId=1&sprintId={sid}", auth=auth, headers=HEADERS)
        rep = r_rep.json().get("contents", {})
        comp = len(rep.get("completedIssues", []))
        not_comp = len(rep.get("issuesNotCompletedInCurrentSprint", []))
        
        r_iss = requests.get(f"{JIRA_URL}/rest/agile/1.0/board/1/sprint/{sid}/issue?maxResults=100&fields=customfield_10016", auth=auth, headers=HEADERS)
        iss_list = r_iss.json().get("issues", [])
        pts = sum(i.get("fields", {}).get("customfield_10016") or 0.0 for i in iss_list)
        
        log(f"Sprint {sid} ('{sname}'): {sstart} to {send} [{sstate.upper()}] | {len(iss_list)} tasks ({pts:.1f} pts) | Completed: {comp}, Remaining: {not_comp}", "OK")

    # Check backlog
    r_bl = requests.get(f"{JIRA_URL}/rest/agile/1.0/board/{BOARD_ID}/backlog", auth=auth, headers=HEADERS)
    bl_issues = r_bl.json().get("issues", [])
    log(f"Backlog Status: {len(bl_issues)} issues in Backlog (Expected: 0)", "OK" if len(bl_issues) == 0 else "WARN")


if __name__ == "__main__":
    main()
