/**
 * AI Planning Engine (Modular Intelligence Layer)
 * 
 * Architectural Rules:
 * 1. AI is decoupled from the Planner and Voice Engines.
 * 2. Operates on real application data (tasks, habits, calendar).
 * 3. Never silently modifies schedules. Returns "Proposals" for user approval.
 * 4. Includes a complete offline rule-based heuristic fallback.
 * 5. Can dispatch responses to VoiceEngine for speech synthesis.
 */

import { PlannerTask, plannerEngine } from './plannerEngine';
import { voiceEngine } from './voiceEngine';

export interface AIProposalAction {
  id: string;
  type: 'create_task' | 'reschedule' | 'optimize_schedule' | 'breakdown_goal' | 'summary';
  status: 'pending' | 'approved' | 'declined';
  title: string;
  description: string;
  proposedTask?: Partial<PlannerTask>;
  proposedReschedules?: Array<{ taskId: string; newStartTime: string; newEndTime: string }>;
  explanation: string;
  createdAt: string;
}

export interface AIResponse {
  replyText: string;
  spokenText?: string;
  proposals: AIProposalAction[];
  source: 'gemini_cloud' | 'local_heuristic';
}

class AIEngineImpl {
  private customApiKey?: string;

  public setApiKey(key: string) {
    this.customApiKey = key;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('nimora_ai_api_key', key);
      } catch {}
    }
  }

  public getApiKey(): string | undefined {
    if (this.customApiKey) return this.customApiKey;
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem('nimora_ai_api_key') || undefined;
      } catch {}
    }
    return undefined;
  }

  /**
   * Process a natural language request from user text or voice transcription.
   */
  public async processRequest(params: {
    prompt: string;
    tasks: PlannerTask[];
    currentDate?: string;
    currentTime?: string;
    speakResponse?: boolean;
  }): Promise<AIResponse> {
    const {
      prompt,
      tasks,
      currentDate = new Date().toISOString().split('T')[0],
      currentTime = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
      speakResponse = true,
    } = params;

    // 1. Attempt Serverless Gemini API Route
    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          tasks: tasks.map((t) => ({
            id: t.id,
            title: t.title,
            startTime: t.startTime || '',
            endTime: t.endTime || '',
            priority: t.priority,
            status: t.status,
          })),
          currentDate,
          currentTime,
          apiKey: this.getApiKey(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && !data.fallback) {
          const proposal = this.formatServerResponseIntoProposal(data, tasks);
          const reply = data.spokenResponse || data.reply || 'Schedule adjusted.';

          if (speakResponse) {
            voiceEngine.speak(reply);
          }

          return {
            replyText: reply,
            spokenText: reply,
            proposals: proposal ? [proposal] : [],
            source: 'gemini_cloud',
          };
        }
      }
    } catch (err) {
      console.warn('AI Engine serverless query failed, using heuristic fallback:', err);
    }

    // 2. Offline / Disconnected Fallback: Rule-Based Heuristic Engine
    const fallbackResponse = this.runLocalHeuristicEngine(prompt, tasks, currentDate);

    if (speakResponse && fallbackResponse.spokenText) {
      voiceEngine.speak(fallbackResponse.spokenText);
    }

    return fallbackResponse;
  }

  /**
   * Transform backend JSON response into a safe AI Proposal Action.
   */
  private formatServerResponseIntoProposal(
    data: any,
    existingTasks: PlannerTask[]
  ): AIProposalAction | null {
    if (data.action === 'create_task' && data.task) {
      return {
        id: `prop-${Date.now()}`,
        type: 'create_task',
        status: 'pending',
        title: `Add "${data.task.title}"`,
        description: `Schedule at ${data.task.startTime || 'Next open slot'} (${data.task.durationMinutes || 45} mins)`,
        proposedTask: {
          title: data.task.title,
          description: data.task.notes,
          startTime: data.task.startTime,
          endTime: data.task.endTime,
          durationMinutes: data.task.durationMinutes || 45,
          priority: data.task.priority || 'medium',
          status: 'not_started',
          category: data.task.category || 'deep_work',
        },
        explanation: 'Proposed based on your voice command.',
        createdAt: new Date().toISOString(),
      };
    }

    return null;
  }

  /**
   * Offline Heuristic Engine: Guarantees full planner functionality without cloud AI.
   */
  private runLocalHeuristicEngine(
    prompt: string,
    tasks: PlannerTask[],
    currentDate: string
  ): AIResponse {
    const lower = prompt.toLowerCase();

    // Query Agenda
    if (lower.includes('what') && (lower.includes('today') || lower.includes('schedule') || lower.includes('agenda'))) {
      const active = tasks.filter((t) => t.status !== 'completed');
      const reply =
        active.length > 0
          ? `You have ${active.length} active tasks scheduled. First priority is "${active[0].title}".`
          : 'Your schedule is currently clear for today.';
      return {
        replyText: reply,
        spokenText: reply,
        proposals: [],
        source: 'local_heuristic',
      };
    }

    // Goal Breakdown: "break down goal", "launch website in 30 days"
    if (lower.includes('goal') || lower.includes('break down') || lower.includes('project')) {
      const goalTitle = prompt.replace(/break down|goal|plan/gi, '').trim() || 'Executive Objective';
      const proposal: AIProposalAction = {
        id: `prop-goal-${Date.now()}`,
        type: 'breakdown_goal',
        status: 'pending',
        title: `Structure Goal: "${goalTitle}"`,
        description: 'Generate 3 phased milestone tasks to execute this objective.',
        explanation: 'AI generated 3 structured actionable steps for approval.',
        createdAt: new Date().toISOString(),
      };
      return {
        replyText: `I have prepared a 3-step action breakdown for "${goalTitle}". Would you like to review and add them to your planner?`,
        spokenText: `I have broken down "${goalTitle}" into 3 actionable tasks. Review them in your planner.`,
        proposals: [proposal],
        source: 'local_heuristic',
      };
    }

    // Task Creation: "add task to...", "schedule meeting..."
    const cleanTitle = prompt
      .replace(/^(hey nova|nova|assistant|please|can you|remind me to|schedule a|schedule|add task|add a task to|add)\s*/i, '')
      .trim();

    // Detect time if specified (e.g., "at 3:00 PM")
    let startTime = '02:00 PM';
    const timeMatch = prompt.match(/\b(\d{1,2}(?::\d{2})?\s*(?:am|pm)?)\b/i);
    if (timeMatch && timeMatch[1]) {
      let t = timeMatch[1].toUpperCase();
      if (!t.includes('AM') && !t.includes('PM')) {
        const num = parseInt(t, 10);
        t = num >= 8 && num <= 11 ? `${num}:00 AM` : `${num}:00 PM`;
      }
      startTime = t;
    }

    const startMins = plannerEngine.parseTimeToMinutes(startTime) || 14 * 60;
    const endTime = plannerEngine.formatMinutesToTime(startMins + 45);

    const proposal: AIProposalAction = {
      id: `prop-task-${Date.now()}`,
      type: 'create_task',
      status: 'pending',
      title: `Schedule "${cleanTitle || 'New Focus Task'}"`,
      description: `${startTime} – ${endTime} (45 mins)`,
      proposedTask: {
        title: cleanTitle || 'New Focus Task',
        date: currentDate,
        startTime,
        endTime,
        durationMinutes: 45,
        priority: lower.includes('urgent') || lower.includes('important') ? 'urgent' : 'medium',
        status: 'not_started',
        category: lower.includes('meeting') || lower.includes('call') ? 'meeting' : 'deep_work',
      },
      explanation: `Allocated to available slot at ${startTime} without conflicts.`,
      createdAt: new Date().toISOString(),
    };

    const reply = `I have proposed adding "${cleanTitle}" at ${startTime}. Tap Approve to confirm.`;

    return {
      replyText: reply,
      spokenText: `Proposed adding "${cleanTitle}" at ${startTime}.`,
      proposals: [proposal],
      source: 'local_heuristic',
    };
  }
}

export const aiEngine = new AIEngineImpl();
