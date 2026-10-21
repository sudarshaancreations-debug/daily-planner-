# 📅 Daily Planner & MCP Hub (v1.0.0)

A modern, production-grade Daily Planner and MCP (Model Context Protocol) Hub built with **Next.js (App Router)**, **TypeScript**, and **Tailwind CSS**. Designed for seamless local execution and instant one-click deployment to **Vercel** with zero external dependencies required.

---

## 🌟 Highlights

- **Three-Column Daily Planner UI**:
  - **Left Sidebar**: Date navigation, quick today jump, category filtering, and hotkey guides.
  - **Center Workspace**: Task management with live status toggling (To Do ➔ In Progress ➔ Done), search, tag filtering, and time/duration details.
  - **Right Panel**: Home-screen style widget with completion progress ring, daily statistics, priority goals, and auto-saving daily notes.
- **Push-to-Talk Voice Interface**:
  - Voice overlay powered by Web Speech API.
  - Keyboard shortcut: Press `V` anywhere to trigger voice input.
- **16-Tool MCP JSON-RPC Server**:
  - Built-in MCP server at `/api/mcp` supporting JSON-RPC 2.0 protocol.
  - Tools include: `list_tasks`, `get_task`, `create_task`, `update_task`, `delete_task`, `complete_task`, `search_tasks`, `get_day_plan`, `save_day_plan`, `get_stats`, `get_categories`, `get_tags`, `bulk_create`, `bulk_update_status`, `get_upcoming`, and `clear_completed`.
- **Health Check API**: `/api/health` returning live JSON status and version info.
- **Vercel Native**: Fully optimized for Vercel serverless edge deployment with zero configuration.

---

## 🚀 Getting Started

### 1. Run Locally

```bash
cd /Users/darshaananvekar/.gemini/antgravity/scratch/daily-planner
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Deploy to Vercel

You have two simple options to deploy to Vercel:

#### Option A: Using Vercel CLI (Installed)
In your terminal, run:
```bash
cd /Users/darshaananvekar/.gemini/antgravity/scratch/daily-planner
vercel
```
Follow the interactive prompts to link or log in to your Vercel account.

#### Option B: Deploy via GitHub
1. Create a repository on [GitHub](https://github.com/new).
2. Push your project:
   ```bash
   git remote add origin https://github.com/<your-username>/daily-planner.git
   git branch -M main
   git push -u origin main --tags
   ```
3. Go to [Vercel Dashboard](https://vercel.com/new) and import the repository. Vercel will automatically detect Next.js and deploy!

---

## 🔌 Connecting Supabase (Optional Database Integration)

The app is currently architected with a local client-side and server-side in-memory DB layer. If you want to connect a persistent remote PostgreSQL database with Supabase:
1. Create a project at [Supabase](https://supabase.com).
2. Install the client: `npm install @supabase/supabase-js`.
3. Add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to your `.env.local` or Vercel environment variables.

---

## 🛠 MCP Tools Reference

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
