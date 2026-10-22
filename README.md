# 📅 NIMORA — Your Day. Intelligently Organized. (v1.0.0)

A modern, production-grade Daily Planner and MCP (Model Context Protocol) Hub built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**.

- **Live Cloud URL**: [https://agile-sirocco-oyrlj9z.tmp.now](https://agile-sirocco-oyrlj9z.tmp.now)
- **Claim & Make Permanent**: [Claim on Vercel](https://vercel.com/claim-deployment?code=9ea46908-d7e9-4695-ab7e-e6f19e821ce0)
- **Health Check**: `GET /api/health`
- **MCP Hub (16 Tools)**: `POST /api/mcp`

---

## 🌟 16-Module Feature Architecture

1. **Splash & Welcome**: Luxury emerald & gold brand entry.
2. **Account Setup & Onboarding**: Value pillars (*Plan smarter, Stay focused, Manage follow-ups, Work/life balance*) + account setup.
3. **Choose Your AI Assistant**: Integrations with **Claude**, **ChatGPT**, and **Gemini**.
4. **Connect Your Apps**: Interactive toggles for Google Calendar, Apple Calendar, Contacts, and WhatsApp.
5. **Home Dashboard**: Sudarshan profile, inspirational quote, 38% circular completion gauge, and timeline tasks.
6. **Daily Planner Timeline**: Color-coded time-blocked day agenda with floating `+` task action.
7. **Create New Task**: Multi-type task creator (Task, Follow-up, Call, Note) with related contact linking.
8. **Task Details & Edit**: Task details, Arun Mehta contact card, notes, and WhatsApp trigger.
9. **Contacts & Follow-ups**: CRM contacts list with follow-up countdowns and last-call dates.
10. **Contact Details & History**: Contact profile, interaction timeline, and follow-up logging.
11. **Voice Assistant**: Dark futuristic audio visualizer with animated sound waves and 3 voice prompt shortcuts.
12. **Smart AI Task Suggestions**: Proactive suggestions (Rohan materials, Site visit drawings, Call Priya, Team sync) with **+ Add**.
13. **iOS Home Screen Widget**: Glassmorphic dark iOS widget with NOW focus (*Client Call 9:00 AM*), NEXT item, mic shortcut, and iOS dock.
14. **Notifications & Snooze**: 9:00 lock screen notifications with time badges and Snooze/Open actions.
15. **WhatsApp Click-to-Chat**: In-app chat with Arun Mehta, double blue ticks `✓✓`, and green **"Open in WhatsApp"** button.
16. **Settings & Privacy**: Sudarshan Pro account details + 4 Privacy Pillar cards (*Secure & Private, Connect Only What You Need, Clear Permissions, Data Deletion*).

---

## 🚀 Running Locally

```bash
cd /Users/darshaananvekar/.gemini/antgravity/scratch/daily-planner
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠 16-Tool MCP JSON-RPC Server Reference

Endpoint: `POST /api/mcp`

| Tool | Purpose |
|---|---|
| `list_tasks` | Query tasks filtered by date, status, priority, or category |
| `get_task` | Fetch a single task by ID |
| `create_task` | Add a new task with schedule and tags |
| `update_task` | Modify fields on an existing task |
| `delete_task` | Remove a task |
| `complete_task` | Mark a task as completed |
| `search_tasks` | Full-text query on task title, description, or tags |
| `get_day_plan` | Retrieve day agenda, notes, and targets |
| `save_day_plan` | Save daily notes and goals |
| `get_stats` | View completion and status breakdown |
| `get_categories` | List all unique categories |
| `get_tags` | List all unique tags |
| `bulk_create` | Batch insert multiple tasks |
| `bulk_update_status` | Batch change task status |
| `get_upcoming` | Get agenda for next N days |
| `clear_completed` | Clean completed items for a date |

## 📤 Export to Calendar

The app provides two ways to export your tasks to iCalendar format:

1. **Export current day** – Click the **Export Day** button on the top‑right of the Day view. This generates an `.ics` file containing all tasks for the selected date with correct `DTSTART`/`DTEND` values based on each task’s `date` and optional `time`.
2. **Export all future tasks** – In the Settings screen there is an **Export All** button that creates an iCalendar file with every upcoming task (date ≥ today).

Both files can be imported into Google Calendar, Apple Calendar, Outlook, or any other calendar app that supports the `.ics` format.

### How to use
```bash
# From the UI – click the appropriate button → the file downloads automatically.
# Or programmatically via the MCP tool `export_ics` (see the MCP JSON‑RPC docs).
```

The generated iCalendar follows the RFC 5545 spec and includes:
- `UID` – a unique identifier for each task.
- `SUMMARY` – the task title.
- `DESCRIPTION` – optional description, tags, and priority.
- `DTSTART` / `DTEND` – real dates/times derived from the task data.

You can now add your planning data to any external calendar service without manual copy‑paste.
