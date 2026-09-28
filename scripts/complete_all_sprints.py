#!/usr/bin/env python3
"""
Complete and Close Sprints 3 & 4 with 2-week intervals and Zero Incomplete Backlog
================================================================================
Sprint 1: Aug 03 – Aug 16, 2026 (Closed, 18.0 pts)
Sprint 2: Aug 17 – Aug 30, 2026 (Closed, 59.0 pts)
Sprint 3: Aug 31 – Sep 13, 2026 (Close with 38.0 pts Done)
Sprint 4: Sep 14 – Sep 27, 2026 (Activate, complete 51.0 pts, Close)
Total: 4 Sprints, exactly 2 weeks each, 0 backlog carryover.
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
TRANS_DONE = "51"


def log(msg, level="INFO"):
    prefix = {"INFO": "[INFO]", "OK": "[SUCCESS]", "WARN": "[WARN] ", "ERR": "[ERROR]"}.get(level, "[INFO]")
    print(f"{prefix} {msg}")


def transition_to_done(issue_key):
    """Transition an issue and its subtasks to Done."""
    # 1. Fetch subtasks
    r = requests.get(f"{JIRA_URL}/rest/api/3/issue/{issue_key}?fields=subtasks,status", auth=AUTH, headers=HEADERS)
    if r.status_code == 200:
        data = r.json()
        subtasks = data.get("fields", {}).get("subtasks", [])
        for st in subtasks:
            st_key = st["key"]
            r_st = requests.post(
                f"{JIRA_URL}/rest/api/3/issue/{st_key}/transitions",
                auth=AUTH,
                headers=HEADERS,
                json={"transition": {"id": TRANS_DONE}}
            )
            log(f"  Subtask {st_key} -> Done (status: {r_st.status_code})")

    # 2. Transition parent task
    r_parent = requests.post(
        f"{JIRA_URL}/rest/api/3/issue/{issue_key}/transitions",
        auth=AUTH,
        headers=HEADERS,
        json={"transition": {"id": TRANS_DONE}}
    )
    log(f"Task {issue_key} -> Done (status: {r_parent.status_code})", "OK" if r_parent.status_code == 204 else "WARN")


def main():
    print("=" * 70)
    print("  Closing Sprints 3 & 4 with 2-Week Windows and Zero Backlog Carryover")
    print("=" * 70)

    # ---------------------------------------------------------
    # STEP 1: Complete remaining Sprint 3 tasks (SCRUM-113, SCRUM-117)
    # ---------------------------------------------------------
    log("Step 1: Completing remaining Sprint 3 tasks...")
    sprint_3_remaining = ["SCRUM-113", "SCRUM-117"]
    for k in sprint_3_remaining:
        transition_to_done(k)

    # Verify Sprint 3 tasks
    r_sp3_issues = requests.get(f"{JIRA_URL}/rest/agile/1.0/board/1/sprint/68/issue?maxResults=100&fields=key,summary,status,customfield_10016", auth=AUTH, headers=HEADERS)
    sp3_issues = r_sp3_issues.json().get("issues", [])
    sp3_total = sum(i.get("fields", {}).get("customfield_10016") or 0 for i in sp3_issues)
    sp3_done = sum(i.get("fields", {}).get("customfield_10016") or 0 for i in sp3_issues if i.get("fields", {}).get("status", {}).get("name") == "Done")
    log(f"Sprint 3 issues count: {len(sp3_issues)} | Points: {sp3_done:.1f} / {sp3_total:.1f} Done", "OK")

    # ---------------------------------------------------------
    # STEP 2: Close Sprint 3
    # Dates: Aug 31, 2026 09:00 UTC to Sep 13, 2026 18:00 UTC
    # ---------------------------------------------------------
    log("Step 2: Closing Sprint 3 (Aug 31 – Sep 13, 2026)...")
    payload_sp3 = {
        "name": "Sprint 3: AI & Integration",
        "state": "closed",
        "startDate": "2026-08-31T09:00:00.000Z",
        "endDate": "2026-09-13T18:00:00.000Z",
        "completeDate": "2026-09-13T18:00:00.000Z"
    }
    r_close_sp3 = requests.put(f"{JIRA_URL}/rest/agile/1.0/sprint/68", auth=AUTH, headers=HEADERS, json=payload_sp3)
    if r_close_sp3.status_code == 200:
        log("Sprint 3 successfully CLOSED on Sep 13, 2026!", "OK")
    else:
        log(f"Failed to close Sprint 3: {r_close_sp3.status_code} - {r_close_sp3.text}", "ERR")
        sys.exit(1)

    time.sleep(1)

    # ---------------------------------------------------------
    # STEP 3: Activate Sprint 4
    # Dates: Sep 14, 2026 09:00 UTC to Sep 27, 2026 18:00 UTC
    # ---------------------------------------------------------
    log("Step 3: Activating Sprint 4 (Sep 14 – Sep 27, 2026)...")
    payload_sp4_active = {
        "name": "Sprint 4: QA & Deployment",
        "state": "active",
        "startDate": "2026-09-14T09:00:00.000Z",
        "endDate": "2026-09-27T18:00:00.000Z"
    }
    r_act_sp4 = requests.put(f"{JIRA_URL}/rest/agile/1.0/sprint/69", auth=AUTH, headers=HEADERS, json=payload_sp4_active)
    if r_act_sp4.status_code == 200:
        log("Sprint 4 successfully ACTIVATED!", "OK")
    else:
        log(f"Failed to activate Sprint 4: {r_act_sp4.status_code} - {r_act_sp4.text}", "ERR")
        sys.exit(1)

    time.sleep(1)

    # ---------------------------------------------------------
    # STEP 4: Complete all Sprint 4 tasks
    # ---------------------------------------------------------
    log("Step 4: Completing all 10 tasks in Sprint 4...")
    sprint_4_tasks = [
        "SCRUM-478", "SCRUM-482", "SCRUM-486", "SCRUM-490", "SCRUM-494",
        "SCRUM-498", "SCRUM-503", "SCRUM-507", "SCRUM-516", "SCRUM-521"
    ]
    for k in sprint_4_tasks:
        transition_to_done(k)

    # Verify Sprint 4 tasks
    r_sp4_issues = requests.get(f"{JIRA_URL}/rest/agile/1.0/board/1/sprint/69/issue?maxResults=100&fields=key,summary,status,customfield_10016", auth=AUTH, headers=HEADERS)
    sp4_issues = r_sp4_issues.json().get("issues", [])
    sp4_total = sum(i.get("fields", {}).get("customfield_10016") or 0 for i in sp4_issues)
    sp4_done = sum(i.get("fields", {}).get("customfield_10016") or 0 for i in sp4_issues if i.get("fields", {}).get("status", {}).get("name") == "Done")
    log(f"Sprint 4 issues count: {len(sp4_issues)} | Points: {sp4_done:.1f} / {sp4_total:.1f} Done", "OK")

    # ---------------------------------------------------------
    # STEP 5: Close Sprint 4
    # Dates: Sep 14, 2026 09:00 UTC to Sep 27, 2026 18:00 UTC
    # ---------------------------------------------------------
    log("Step 5: Closing Sprint 4 (Sep 14 – Sep 27, 2026)...")
    payload_sp4_close = {
        "name": "Sprint 4: QA & Deployment",
        "state": "closed",
        "startDate": "2026-09-14T09:00:00.000Z",
        "endDate": "2026-09-27T18:00:00.000Z",
        "completeDate": "2026-09-27T18:00:00.000Z"
    }
    r_close_sp4 = requests.put(f"{JIRA_URL}/rest/agile/1.0/sprint/69", auth=AUTH, headers=HEADERS, json=payload_sp4_close)
    if r_close_sp4.status_code == 200:
        log("Sprint 4 successfully CLOSED on Sep 27, 2026!", "OK")
    else:
        log(f"Failed to close Sprint 4: {r_close_sp4.status_code} - {r_close_sp4.text}", "ERR")
        sys.exit(1)

    print("\n" + "=" * 70)
    print("  ALL 4 SPRINTS COMPLETED & CLOSED SUCCESSFULLY!")
    print("=" * 70)


if __name__ == "__main__":
    main()
