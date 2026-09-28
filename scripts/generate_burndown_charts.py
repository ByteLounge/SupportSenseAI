#!/usr/bin/env python3
"""
Generate High-Resolution Agile Sprint Burndown Charts for SupportSense AI
========================================================================
Illustrates 4 two-week sprints where actual remaining work closely overlaps
the ideal guideline, demonstrating consistent daily burn rate to 0 pts.
"""

import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import numpy as np
from datetime import datetime, timedelta

# Set style
plt.style.use('seaborn-v0_8-whitegrid' if 'seaborn-v0_8-whitegrid' in plt.style.available else 'default')
fig, axs = plt.subplots(2, 2, figsize=(13.5, 9.5), dpi=300)
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
        'dates_str': '03 Aug 2026 – 16 Aug 2026 (14 Days)',
        'start_date': datetime(2026, 8, 3),
        'total_pts': 18.0,
        # Daily remaining points closely tracking linear burn
        'daily_pts': [18.0, 18.0, 15.5, 15.0, 13.0, 12.0, 10.5, 9.0, 8.0, 6.0, 5.0, 3.0, 2.0, 1.0, 0.0],
        'target_pts': 18.0
    },
    {
        'ax': axs[0, 1],
        'title': 'Sprint 2: Prototype Development',
        'dates_str': '17 Aug 2026 – 30 Aug 2026 (14 Days)',
        'start_date': datetime(2026, 8, 17),
        'total_pts': 59.0,
        # Daily remaining points closely tracking linear burn
        'daily_pts': [59.0, 59.0, 52.0, 48.0, 43.5, 39.0, 34.0, 29.5, 25.0, 20.0, 16.0, 11.5, 6.5, 2.5, 0.0],
        'target_pts': 59.0
    },
    {
        'ax': axs[1, 0],
        'title': 'Sprint 3: Development and Improvements',
        'dates_str': '31 Aug 2026 – 13 Sep 2026 (14 Days)',
        'start_date': datetime(2026, 8, 31),
        'total_pts': 38.0,
        # Daily remaining points closely tracking linear burn
        'daily_pts': [38.0, 38.0, 34.0, 31.0, 27.5, 24.5, 22.0, 19.0, 16.0, 13.0, 9.5, 7.0, 4.0, 1.5, 0.0],
        'target_pts': 38.0
    },
    {
        'ax': axs[1, 1],
        'title': 'Sprint 4: Testing, Bug Fixes and Deployment',
        'dates_str': '14 Sep 2026 – 27 Sep 2026 (14 Days)',
        'start_date': datetime(2026, 9, 14),
        'total_pts': 51.0,
        # Daily remaining points closely tracking linear burn
        'daily_pts': [51.0, 51.0, 45.0, 42.0, 37.5, 33.0, 29.5, 25.5, 21.0, 17.5, 13.5, 9.5, 5.0, 2.0, 0.0],
        'target_pts': 51.0
    }
]

for sc in sprint_configs:
    ax = sc['ax']
    days = 15  # Day 0 to Day 14 (15 data points)
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

plt.suptitle('SupportSense AI — Agile Sprint Burndown Analytics (4 Sprints × 2 Weeks)',
             fontsize=14.5, fontweight='bold', color=COLOR_NAVY, y=0.995)
plt.tight_layout(rect=[0, 0.02, 1, 0.97])

output_png = 'docs_sprint_burndown_charts.png'
plt.savefig(output_png, dpi=300, bbox_inches='tight')
print(f"[SUCCESS] High-resolution burndown charts generated: {output_png}")
