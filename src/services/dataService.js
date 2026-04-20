import { storage } from "./storage";
import { isSupabaseConfigured, supabase } from "./supabaseClient";

const DASHBOARD_KEY_PREFIX = "momentum-dashboard";

const fallbackSeed = {
  profile: {
    focusHoursGoal: 12,
    preferredStudyBlock: 90,
    courseLoad: "Full semester",
    semesterGoal: "Stay ahead of deadlines and improve consistency.",
  },
  tasks: [
    {
      id: "seed-task-1",
      title: "Finish React project wireframes",
      course: "Building Web Applications",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString().slice(0, 10),
      priority: "high",
      status: "progress",
      estimateHours: 4,
      tags: ["ui", "planning"],
      notes: "Validate dashboard layout and mobile navigation.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "seed-task-2",
      title: "Revise database normalization",
      course: "Database Systems",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4).toISOString().slice(0, 10),
      priority: "medium",
      status: "todo",
      estimateHours: 2,
      tags: ["revision"],
      notes: "Focus on 2NF, 3NF and sample design questions.",
      createdAt: new Date().toISOString(),
    },
  ],
  sessions: [
    {
      id: "seed-session-1",
      topic: "React Router protected routes",
      course: "Building Web Applications",
      date: new Date().toISOString().slice(0, 10),
      duration: 90,
      energy: "high",
      outcome: "Completed protected route and auth context integration.",
      createdAt: new Date().toISOString(),
    },
  ],
};

function keyFor(userId) {
  return `${DASHBOARD_KEY_PREFIX}:${userId}`;
}

export const dataService = {
  async getDashboardData(userId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("planner_data")
        .select("payload")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) throw error;
      return data?.payload || fallbackSeed;
    }

    return storage.get(keyFor(userId), fallbackSeed);
  },

  async saveDashboardData(userId, payload) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from("planner_data").upsert(
        {
          user_id: userId,
          payload,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      );

      if (error) throw error;
      return;
    }

    storage.set(keyFor(userId), payload);
  },
};
