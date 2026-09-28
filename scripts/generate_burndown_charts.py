#!/usr/bin/env python3
"""
Generate High-Resolution Agile Sprint Burndown Charts for SupportSense AI
========================================================================
Illustrates 4 sprints with exact dates requested by the user:
- Sprint 1: 03 Aug 2026 – 15 Aug 2026 (ends 15th August)
- Sprint 2: 16 Aug 2026 – 29 Aug 2026 (ends 29th August)
- Sprint 3: 30 Aug 2026 – 12 Sep 2026 (ends 12th September)
- Sprint 4: 13 Sep 2026 – 03 Oct 2026 (ends 3rd October)

All sprints show graphs going down from total story points to 0,
closely tracking and overlapping the ideal burn rate guideline.
"""

import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import numpy as np
from datetime import datetime, timedelta

# Set style
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
fig, axs = plt.subplots(2, 2, figsize=(14, 10), dpi=300)
fig.patch.set_facecolor('#FFFFFF')

# Color palette
COLOR_NAVY = '#20235B'
COLOR_GUIDELINE = '#D9383A'  # Jira Red Guideline
COLOR_ACTUAL = '#1D5BB6'     # Jira Blue Remaining Work
COLOR_FILL = '#EBF3FC'       # Soft Blue Fill
COLOR_ACCENT = '#2E7D32'     # Green completed accent
COLOR_GOLD = '#D9A14A'

sprint_configs = [
    {
        'ax': axs[0, 0],
        'title': 'Sprint 1: Research and Requirements',
        'dates_str': '03 Aug 2026 – 15 Aug 2026 (13 Days)',
        'start_date': datetime(2026, 8, 3),
        'total_pts': 18.0,
        # Daily remaining points closely tracking linear burn across 13 calendar days (Aug 03 to Aug 15)
        'daily_pts': [18.0, 18.0, 16.5, 15.0, 13.5, 12.0, 10.5, 9.0, 7.5, 6.0, 4.0, 2.0, 0.0],
        'target_pts': 18.0
    },
    {
        'ax': axs[0, 1],
        'title': 'Sprint 2: Prototype Development',
        'dates_str': '16 Aug 2026 – 29 Aug 2026 (14 Days)',
        'start_date': datetime(2026, 8, 16),
        'total_pts': 59.0,
        # Daily remaining points closely tracking linear burn across 14 calendar days (Aug 16 to Aug 29)
        'daily_pts': [59.0, 59.0, 53.5, 48.0, 43.5, 39.0, 34.5, 30.0, 25.5, 21.0, 16.0, 11.0, 5.5, 0.0],
        'target_pts': 59.0
    },
    {
        'ax': axs[1, 0],
        'title': 'Sprint 3: Development and Improvements',
        'dates_str': '30 Aug 2026 – 12 Sep 2026 (14 Days)',
        'start_date': datetime(2026, 8, 30),
        'total_pts': 38.0,
        # Daily remaining points closely tracking linear burn across 14 calendar days (Aug 30 to Sep 12)
        'daily_pts': [38.0, 38.0, 34.5, 31.0, 27.5, 24.5, 21.5, 18.5, 15.0, 12.0, 9.0, 6.0, 3.0, 0.0],
        'target_pts': 38.0
    },
    {
        'ax': axs[1, 1],
        'title': 'Sprint 4: Testing, Bug Fixes and Deployment',
        'dates_str': '13 Sep 2026 – 03 Oct 2026 (21 Days)',
        'start_date': datetime(2026, 9, 13),
        'total_pts': 51.0,
        # Daily remaining points closely tracking linear burn across 21 calendar days (Sep 13 to Oct 03)
        'daily_pts': [51.0, 51.0, 48.5, 46.0, 43.5, 41.0, 38.5, 36.0, 33.5, 31.0, 28.5, 26.0, 23.5, 21.0, 18.0, 15.0, 12.0, 9.0, 6.0, 3.0, 0.0],
        'target_pts': 51.0
    }
]

for sc in sprint_configs:
    ax = sc['ax']
    days = len(sc['daily_pts'])
    date_list = [sc['start_date'] + timedelta(days=i) for i in range(days)]
    
    # Ideal guideline (straight line from total_pts to 0.0)
    guideline = np.linspace(sc['total_pts'], 0.0, days)
    actual = sc['daily_pts']
    
    # Fill under actual line
    ax.fill_between(date_list, actual, 0, color=COLOR_FILL, alpha=0.6, label='_nolegend_')
    
    # Guideline line
    ax.plot(date_list, guideline, color=COLOR_GUIDELINE, linestyle='--', linewidth=2.4, label='Guideline (Ideal Burn Rate)', zorder=3)
    
    # Actual remaining work line
    ax.plot(date_list, actual, color=COLOR_ACTUAL, linestyle='-', linewidth=2.6, marker='o', markersize=5.5, label='Remaining Work (Actual)', zorder=4)
    
    # Highlight final 0 point
    ax.scatter([date_list[-1]], [0], color=COLOR_ACCENT, s=80, zorder=5, edgecolor='#FFFFFF', linewidth=1.5)
    
    # Formatting
    ax.set_title(f"{sc['title']}\n{sc['dates_str']}", fontsize=11.5, fontweight='bold', color=COLOR_NAVY, pad=9)
    ax.set_ylabel('Story Points Remaining', fontsize=9.5, fontweight='semibold', color=COLOR_NAVY)
    ax.set_ylim(-1, sc['total_pts'] * 1.14)
    ax.grid(True, linestyle=':', alpha=0.55, color='#BBBBBB')
    
    # Date formatting on X-axis
    ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %d'))
    ax.xaxis.set_major_locator(mdates.DayLocator(interval=2))
    plt.setp(ax.xaxis.get_majorticklabels(), rotation=30, ha='right', fontsize=8.5)
    ax.tick_params(axis='y', labelsize=8.5)
    
    # Annotation badge: 100% Delivered
    badge_text = f"Initial: {int(sc['total_pts'])} pts\nBurned: {int(sc['total_pts'])} pts (100%)\nBacklog: 0 pts | Closed"
    ax.text(0.96, 0.93, badge_text, transform=ax.transAxes, fontsize=8.5,
            verticalalignment='top', horizontalalignment='right',
            bbox=dict(boxstyle='round,pad=0.5', facecolor='#F8F9FA', edgecolor='#D0D5DD', linewidth=1.0, alpha=0.95))
    
    ax.legend(loc='lower left', frameon=True, facecolor='#FFFFFF', framealpha=0.9, fontsize=8.5)

plt.suptitle('SupportSense AI — Agile Sprint Burndown Analytics (4 Sprints)',
             fontsize=14.5, fontweight='bold', color=COLOR_NAVY, y=0.995)
plt.tight_layout(rect=[0, 0.02, 1, 0.97])

output_png = 'docs_sprint_burndown_charts.png'
plt.savefig(output_png, dpi=300, bbox_inches='tight')
print(f"[SUCCESS] High-resolution burndown charts generated: {output_png}")
