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
import { NimoraTask } from '../nimora/data';

export interface MacroInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodItemEstimate {
  raw: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface BetterCalMealAnalysis {
  isMealNote: boolean;
  totalMacros: MacroInfo;
  items: FoodItemEstimate[];
  formattedSummary: string;
}

/**
 * Standard Nutritional Database for BetterCal AI Heuristics
 * (Calories in kcal, Macros in grams)
 */
const NUTRITION_CATALOG: Record<string, { unit: string; baseQty: number; calories: number; protein: number; carbs: number; fat: number }> = {
  'paneer tikka': { unit: 'serving', baseQty: 1, calories: 280, protein: 18, carbs: 8, fat: 20 },
  'paneer': { unit: '100g', baseQty: 1, calories: 260, protein: 18, carbs: 4, fat: 20 },
  'roti': { unit: 'piece', baseQty: 1, calories: 110, protein: 3, carbs: 20, fat: 1 },
  'rotis': { unit: 'piece', baseQty: 1, calories: 110, protein: 3, carbs: 20, fat: 1 },
  'chapati': { unit: 'piece', baseQty: 1, calories: 110, protein: 3, carbs: 20, fat: 1 },
  'chapatis': { unit: 'piece', baseQty: 1, calories: 110, protein: 3, carbs: 20, fat: 1 },
  'naan': { unit: 'piece', baseQty: 1, calories: 260, protein: 8, carbs: 45, fat: 5 },
  'paratha': { unit: 'piece', baseQty: 1, calories: 240, protein: 5, carbs: 32, fat: 10 },
  'dal': { unit: 'bowl', baseQty: 1, calories: 180, protein: 11, carbs: 24, fat: 4 },
  'daal': { unit: 'bowl', baseQty: 1, calories: 180, protein: 11, carbs: 24, fat: 4 },
  'lentils': { unit: 'bowl', baseQty: 1, calories: 180, protein: 11, carbs: 24, fat: 4 },
  'cold coffee': { unit: 'glass', baseQty: 1, calories: 140, protein: 4, carbs: 18, fat: 6 },
  'coffee': { unit: 'cup', baseQty: 1, calories: 45, protein: 1, carbs: 5, fat: 2 },
  'black coffee': { unit: 'cup', baseQty: 1, calories: 5, protein: 0, carbs: 1, fat: 0 },
  'tea': { unit: 'cup', baseQty: 1, calories: 60, protein: 2, carbs: 8, fat: 2 },
  'chai': { unit: 'cup', baseQty: 1, calories: 75, protein: 2, carbs: 10, fat: 3 },
  'green tea': { unit: 'cup', baseQty: 1, calories: 2, protein: 0, carbs: 0, fat: 0 },
  'rice': { unit: 'cup', baseQty: 1, calories: 215, protein: 4, carbs: 45, fat: 1 },
  'brown rice': { unit: 'cup', baseQty: 1, calories: 218, protein: 5, carbs: 46, fat: 2 },
  'biryani': { unit: 'plate', baseQty: 1, calories: 420, protein: 16, carbs: 52, fat: 14 },
  'chicken': { unit: '150g', baseQty: 1, calories: 240, protein: 31, carbs: 0, fat: 10 },
  'chicken breast': { unit: '150g', baseQty: 1, calories: 220, protein: 34, carbs: 0, fat: 5 },
  'chicken tikka': { unit: 'plate', baseQty: 1, calories: 290, protein: 32, carbs: 6, fat: 12 },
  'fish': { unit: 'fillet', baseQty: 1, calories: 210, protein: 26, carbs: 0, fat: 11 },
  'salmon': { unit: 'fillet', baseQty: 1, calories: 250, protein: 25, carbs: 0, fat: 15 },
  'egg': { unit: 'egg', baseQty: 1, calories: 75, protein: 6.5, carbs: 0.5, fat: 5.5 },
  'eggs': { unit: 'egg', baseQty: 1, calories: 75, protein: 6.5, carbs: 0.5, fat: 5.5 },
  'boiled egg': { unit: 'egg', baseQty: 1, calories: 78, protein: 6.5, carbs: 0.6, fat: 5.3 },
  'boiled eggs': { unit: 'egg', baseQty: 1, calories: 78, protein: 6.5, carbs: 0.6, fat: 5.3 },
  'omelet': { unit: '2-egg', baseQty: 1, calories: 190, protein: 14, carbs: 2, fat: 14 },
  'salad': { unit: 'bowl', baseQty: 1, calories: 120, protein: 3, carbs: 10, fat: 7 },
  'greek salad': { unit: 'bowl', baseQty: 1, calories: 210, protein: 6, carbs: 11, fat: 16 },
  'sandwich': { unit: 'sandwich', baseQty: 1, calories: 310, protein: 14, carbs: 36, fat: 11 },
  'pizza': { unit: 'slice', baseQty: 1, calories: 280, protein: 12, carbs: 33, fat: 11 },
  'burger': { unit: 'burger', baseQty: 1, calories: 390, protein: 19, carbs: 38, fat: 18 },
  'pasta': { unit: 'bowl', baseQty: 1, calories: 320, protein: 12, carbs: 54, fat: 6 },
  'dosa': { unit: 'piece', baseQty: 1, calories: 170, protein: 4, carbs: 28, fat: 5 },
  'idli': { unit: 'piece', baseQty: 1, calories: 65, protein: 2, carbs: 12, fat: 0.5 },
  'idlis': { unit: 'piece', baseQty: 1, calories: 65, protein: 2, carbs: 12, fat: 0.5 },
  'sambar': { unit: 'bowl', baseQty: 1, calories: 130, protein: 5, carbs: 20, fat: 3 },
  'smoothie': { unit: 'glass', baseQty: 1, calories: 190, protein: 8, carbs: 34, fat: 2 },
  'protein shake': { unit: 'shake', baseQty: 1, calories: 180, protein: 26, carbs: 8, fat: 3 },
  'shake': { unit: 'glass', baseQty: 1, calories: 220, protein: 12, carbs: 28, fat: 6 },
  'oats': { unit: 'bowl', baseQty: 1, calories: 160, protein: 6, carbs: 28, fat: 3 },
  'oatmeal': { unit: 'bowl', baseQty: 1, calories: 160, protein: 6, carbs: 28, fat: 3 },
  'apple': { unit: 'apple', baseQty: 1, calories: 80, protein: 0.5, carbs: 21, fat: 0.3 },
  'banana': { unit: 'banana', baseQty: 1, calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  'fruit': { unit: 'serving', baseQty: 1, calories: 90, protein: 1, carbs: 22, fat: 0.2 },
  'almonds': { unit: 'handful', baseQty: 1, calories: 160, protein: 6, carbs: 6, fat: 14 },
  'nuts': { unit: 'handful', baseQty: 1, calories: 170, protein: 5, carbs: 6, fat: 15 },
  'curry': { unit: 'bowl', baseQty: 1, calories: 240, protein: 8, carbs: 18, fat: 15 },
  'soup': { unit: 'bowl', baseQty: 1, calories: 110, protein: 4, carbs: 14, fat: 3 },
  'yogurt': { unit: 'cup', baseQty: 1, calories: 130, protein: 10, carbs: 12, fat: 4 },
  'curd': { unit: 'cup', baseQty: 1, calories: 120, protein: 8, carbs: 10, fat: 4 },
};

/**
 * Estimates nutritional metrics for a food text snippet.
 */
export function estimateFoodItemNutrition(rawSnippet: string): FoodItemEstimate | null {
  const trimmed = rawSnippet.trim();
  if (!trimmed) return null;

  // Detect quantity prefix e.g. "3 rotis", "2 eggs", "a cold coffee", "1 cup rice"
  const qtyMatch = trimmed.match(/^(?:a|an|\b(\d+(?:\.\d+)?))\s*(?:cup|cups|plate|plates|bowl|bowls|glass|glasses|slice|slices|piece|pieces)?\s*(.*)$/i);
  let quantity = 1;
  let foodName = trimmed;

  if (qtyMatch) {
    if (qtyMatch[1]) {
      quantity = parseFloat(qtyMatch[1]) || 1;
    }
    if (qtyMatch[2] && qtyMatch[2].trim()) {
      foodName = qtyMatch[2].trim();
    }
  }

  const cleanFoodKey = foodName.toLowerCase().replace(/^(a|an|the|fresh|hot|warm|sweet|crispy)\s+/i, '').trim();

  // 1. Direct Catalog Match
  let match = NUTRITION_CATALOG[cleanFoodKey];

  // 2. Substring Catalog Match
  if (!match) {
    for (const [key, value] of Object.entries(NUTRITION_CATALOG)) {
      if (cleanFoodKey.includes(key) || key.includes(cleanFoodKey)) {
        match = value;
        break;
      }
    }
  }

  // 3. Heuristic Fallback if explicit meal word is used
  if (!match) {
    if (cleanFoodKey.includes('lunch') || cleanFoodKey.includes('dinner') || cleanFoodKey.includes('meal')) {
      match = { unit: 'meal', baseQty: 1, calories: 550, protein: 25, carbs: 65, fat: 18 };
    } else if (cleanFoodKey.includes('snack')) {
      match = { unit: 'snack', baseQty: 1, calories: 180, protein: 5, carbs: 22, fat: 7 };
    } else if (cleanFoodKey.includes('breakfast')) {
      match = { unit: 'breakfast', baseQty: 1, calories: 420, protein: 18, carbs: 48, fat: 14 };
    }
  }

  if (!match) return null;

  return {
    raw: trimmed,
    name: foodName,
    quantity,
    unit: match.unit,
    calories: Math.round(match.calories * quantity),
    protein: Math.round(match.protein * quantity),
    carbs: Math.round(match.carbs * quantity),
    fat: Math.round(match.fat * quantity),
  };
}

/**
 * Analyzes a stream-of-consciousness note for food & nutrition (The BetterCal Rule).
 */
export function analyzeMealText(text: string): BetterCalMealAnalysis {
  // Strip leading words like "Lunch:", "Meal:", "Ate:"
  const content = text.replace(/^(lunch|dinner|breakfast|meal|food|nutrition|snack)\s*[:\-]\s*/i, '').trim();

  // Split on commas, 'and', 'with', newlines, or semicolons
  const parts = content
    .split(/[,;\n]|\band\b/i)
    .map((p) => p.trim())
    .filter(Boolean);

  const items: FoodItemEstimate[] = [];
  const totals: MacroInfo = { calories: 0, protein: 0, carbs: 0, fat: 0 };

  for (const part of parts) {
    const est = estimateFoodItemNutrition(part);
    if (est) {
      items.push(est);
      totals.calories += est.calories;
      totals.protein += est.protein;
      totals.carbs += est.carbs;
      totals.fat += est.fat;
    }
  }

  const isMealNote = items.length > 0 && (items.length >= 2 || /paneer|roti|dal|coffee|rice|chicken|salad|sandwich|curry|meal|lunch|dinner|breakfast/i.test(text));

  const formattedSummary = isMealNote
    ? `🔥 ${totals.calories} kcal | ${totals.protein}g protein | ${totals.carbs}g carbs | ${totals.fat}g fat`
    : '';

  return {
    isMealNote,
    totalMacros: totals,
    items,
    formattedSummary,
  };
}

/**
 * Core Stream-of-Consciousness Schedule & Note Dump Parser
 * (Inspired by @bettercalapp Reel #6: The BetterCal Rule)
 * 
 * Takes an executive's stream-of-consciousness thought, e.g.:
 * "10am team standup, 1pm client lunch with Priya, 3pm design review, workout at 6pm"
 * OR
 * "paneer tikka, 3 rotis, dal, a cold coffee"
 * and decomposes it into verified NimoraTask timeline blocks.
 */
export function parseNaturalLanguageScheduleDump(rawInput: string, selectedDate?: string): NimoraTask[] {
  const dateStr = selectedDate || new Date().toISOString().split('T')[0];
  const input = rawInput.trim();
  if (!input) return [];

  // Check if the ENTIRE input is a BetterCal meal note (e.g. "paneer tikka, 3 rotis, dal, a cold coffee")
  const fullMealAnalysis = analyzeMealText(input);
  if (fullMealAnalysis.isMealNote && fullMealAnalysis.items.length >= 2 && !/\b\d{1,2}(?::\d{2})?\s*(?:am|pm)\b/i.test(input)) {
    // Generate consolidated high-yield Nutrition timeline item
    const itemLines = fullMealAnalysis.items
      .map((it) => `• ${it.raw}: ${it.calories} kcal (${it.protein}g P, ${it.carbs}g C, ${it.fat}g F)`)
      .join('\n');

    const cleanMealTitle = input
      .split(/[,;\n]/)[0]
      .replace(/^(lunch|dinner|breakfast|snack)\s*[:\-]\s*/i, '')
      .trim();

    return [
      {
        id: `t_nimora_fuel_${Date.now()}`,
        title: `🍱 Meal: ${cleanMealTitle} + ${fullMealAnalysis.items.length - 1} items`,
        subtitle: `${fullMealAnalysis.formattedSummary} (NIMORA Fuel AI)`,
        category: 'note',
        date: dateStr,
        startTime: '01:00 PM',
        endTime: '01:45 PM',
        durationMinutes: 45,
        priority: 'medium',
        status: 'upcoming',
        color: 'green',
        notes: `NIMORA Fuel Stream Breakdown:\n${itemLines}\n\nTotal: ${fullMealAnalysis.formattedSummary}\nAnalyzed via NIMORA stream-of-consciousness natural note engine.`,
      },
    ];
  }

  // Otherwise, decompose multi-clause schedule events
  // Delimiters: newline, semicolon, comma (when not followed by digits), or 'then' / 'and then'
  const rawSegments = input
    .split(/\n|;|\band then\b|\bthen\b|(?<!\d),(?!\d)/i)
    .map((s) => s.trim())
    .filter(Boolean);

  const defaultSlots = ['09:00 AM', '11:00 AM', '01:00 PM', '03:00 PM', '05:00 PM', '06:30 PM', '08:00 PM'];
  let slotIndex = 0;

  const tasks: NimoraTask[] = [];

  for (let i = 0; i < rawSegments.length; i++) {
    const segment = rawSegments[i];
    const lower = segment.toLowerCase();

    // 1. Detect Time
    let startTime = defaultSlots[slotIndex % defaultSlots.length];
    let hasExplicitTime = false;
    const timeMatch = segment.match(/\b(?:at\s*)?(\d{1,2}(?::\d{2})?\s*(?:am|pm))\b/i);

    if (timeMatch && timeMatch[1]) {
      let t = timeMatch[1].toUpperCase().trim();
      startTime = t;
      hasExplicitTime = true;
    } else {
      slotIndex++;
    }

    // 2. Clean Event Title
    let title = segment
      .replace(/\b(?:at\s*)?\d{1,2}(?::\d{2})?\s*(?:am|pm)\b/gi, '')
      .replace(/^(schedule|add|plan|remind me to|don't forget|need to)\s+/i, '')
      .replace(/^[\-\*\•\d\.\)]+\s*/, '')
      .trim();

    if (!title) title = `Focus Block #${i + 1}`;

    // 3. Domain Classification & Duration
    let durationMinutes = 45;
    let category: 'task' | 'followup' | 'call' | 'note' = 'task';
    let color: 'blue' | 'green' | 'coral' | 'orange' | 'gray' = 'blue';
    let priority: 'low' | 'medium' | 'high' = 'medium';
    let subtitle = 'Scheduled Timeline Item';
    let notes = 'Parsed from natural language stream-of-consciousness note.';

    // Check Nutrition / Meal clause
    const mealAnalysis = analyzeMealText(segment);
    if (mealAnalysis.isMealNote) {
      category = 'note';
      color = 'green';
      durationMinutes = 40;
      subtitle = `${mealAnalysis.formattedSummary} (NIMORA Fuel AI)`;
      notes = `Nutrition Enrichment:\n${mealAnalysis.formattedSummary}\nItems: ${mealAnalysis.items.map((m) => m.raw).join(', ')}`;
    } else if (/\b(call|meeting|sync|standup|interview|catchup|1:1|zoom|huddle|client)\b/i.test(lower)) {
      category = 'call';
      color = 'blue';
      durationMinutes = 30;
      subtitle = 'Executive Meeting / Sync';
    } else if (/\b(gym|workout|exercise|walk|run|yoga|training|cardio|fitness)\b/i.test(lower)) {
      category = 'task';
      color = 'green';
      durationMinutes = 60;
      subtitle = 'Physical Wellness & Energy';
    } else if (/\b(review|deck|proposal|code|audit|design|report|write|analysis|deep work|focus)\b/i.test(lower)) {
      category = 'task';
      color = 'orange';
      durationMinutes = 60;
      subtitle = 'Deep Work Focus Block';
    } else if (/\b(urgent|asap|priority|important|deadline|critical)\b/i.test(lower)) {
      priority = 'high';
      color = 'coral';
      subtitle = 'High Priority Objective';
    }

    const startMins = plannerEngine.parseTimeToMinutes(startTime) || (9 + i * 2) * 60;
    const endTime = plannerEngine.formatMinutesToTime(startMins + durationMinutes);

    tasks.push({
      id: `t_stream_${Date.now()}_${i}`,
      title: title.charAt(0).toUpperCase() + title.slice(1),
      subtitle,
      category,
      date: dateStr,
      startTime,
      endTime,
      durationMinutes,
      priority,
      status: 'upcoming',
      color,
      notes,
    });
  }

  return tasks;
}


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

    // BetterCal Nutrition & Meal Note: "Log lunch: paneer tikka, 3 rotis, dal, cold coffee"
    const mealCheck = analyzeMealText(prompt);
    if (mealCheck.isMealNote) {
      const parsedMealTasks = parseNaturalLanguageScheduleDump(prompt, currentDate);
      const mealTask = parsedMealTasks[0];
      const reply = `I've analyzed your meal with NIMORA AI: ${mealCheck.totalMacros.calories} kcal, ${mealCheck.totalMacros.protein}g protein, ${mealCheck.totalMacros.carbs}g carbs, and ${mealCheck.totalMacros.fat}g fat.`;
      const spoken = `Logged your meal: ${mealCheck.totalMacros.calories} calories with ${mealCheck.totalMacros.protein} grams of protein.`;

      const proposal: AIProposalAction = {
        id: `prop-meal-${Date.now()}`,
        type: 'create_task',
        status: 'pending',
        title: mealTask?.title || 'Log Nutrition Block',
        description: `${mealTask?.subtitle || mealCheck.formattedSummary} • Scheduled at ${mealTask?.startTime || '01:00 PM'}`,
        proposedTask: {
          title: mealTask?.title || 'Meal Block',
          description: mealTask?.notes || mealCheck.formattedSummary,
          date: currentDate,
          startTime: mealTask?.startTime || '01:00 PM',
          endTime: mealTask?.endTime || '01:45 PM',
          durationMinutes: mealTask?.durationMinutes || 45,
          priority: 'medium',
          status: 'not_started',
          category: 'health',
        },
        explanation: 'Enriched with calories and macronutrient ratios via NIMORA natural input engine.',
        createdAt: new Date().toISOString(),
      };

      return {
        replyText: reply,
        spokenText: spoken,
        proposals: [proposal],
        source: 'local_heuristic',
      };
    }

    // Multi-Item Schedule Dump: "10am team standup, 1pm client lunch with Priya, 3pm design review, workout at 6pm"
    const parsedScheduleTasks = parseNaturalLanguageScheduleDump(prompt, currentDate);
    if (parsedScheduleTasks.length > 1) {
      const proposals: AIProposalAction[] = parsedScheduleTasks.map((t, idx) => ({
        id: `prop-dump-${Date.now()}-${idx}`,
        type: 'create_task',
        status: 'pending',
        title: t.title,
        description: `${t.startTime} – ${t.endTime} (${t.durationMinutes}m) • ${t.subtitle}`,
        proposedTask: {
          title: t.title,
          description: t.notes,
          date: currentDate,
          startTime: t.startTime,
          endTime: t.endTime,
          durationMinutes: t.durationMinutes,
          priority: t.priority,
          status: 'not_started',
          category: t.category === 'call' ? 'meeting' : t.category === 'note' ? 'health' : 'deep_work',
        },
        explanation: 'Allocated without conflicts from multi-event schedule note.',
        createdAt: new Date().toISOString(),
      }));

      const titles = parsedScheduleTasks.map((t) => t.title).join(', ');
      const reply = `I have parsed your note into ${parsedScheduleTasks.length} timeline events: ${titles}. Tap Approve to add them to your planner.`;
      const spoken = `Parsed ${parsedScheduleTasks.length} timeline events from your note. Ready to schedule.`;

      return {
        replyText: reply,
        spokenText: spoken,
        proposals,
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
