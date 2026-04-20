import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { dataService } from "../services/dataService";
import { uid } from "../utils/uid";
import { AuthContext } from "./AuthContext";

export const AppDataContext = createContext(null);

function startOfWeek(date) {
  const clone = new Date(date);
  const day = clone.getDay();
  const diff = clone.getDate() - day + (day === 0 ? -6 : 1);
  clone.setDate(diff);
  clone.setHours(0, 0, 0, 0);
  return clone;
}

function createInitialState() {
  return {
    tasks: [],
    sessions: [],
    profile: {
      focusHoursGoal: 12,
      preferredStudyBlock: 90,
      courseLoad: "Full semester",
      semesterGoal: "Stay ahead of deadlines and improve consistency.",
    },
  };
}

export function AppDataProvider({ children }) {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [state, setState] = useState(createInitialState());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setState(createInitialState());
      setError("");
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      try {
        const snapshot = await dataService.getDashboardData(user.id);
        setState({
          tasks: snapshot.tasks,
          sessions: snapshot.sessions,
          profile: snapshot.profile,
        });
        setError("");
      } catch (loadError) {
        setError(loadError.message || "Unable to load your planner data.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isAuthenticated, user]);

  const persist = async (nextState) => {
    if (!user) return;
    setState(nextState);
    await dataService.saveDashboardData(user.id, nextState);
  };

  const addTask = async (taskInput) => {
    const task = {
      id: uid("task"),
      title: taskInput.title.trim(),
      course: taskInput.course.trim(),
      dueDate: taskInput.dueDate,
      priority: taskInput.priority,
      status: taskInput.status,
      estimateHours: Number(taskInput.estimateHours),
      tags: taskInput.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      notes: taskInput.notes.trim(),
      createdAt: new Date().toISOString(),
    };

    await persist({ ...state, tasks: [task, ...state.tasks] });
  };

  const updateTask = async (taskId, updates) => {
    const nextState = {
      ...state,
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...updates,
              estimateHours: Number(updates.estimateHours ?? task.estimateHours),
              tags: Array.isArray(updates.tags)
                ? updates.tags
                : String(updates.tags ?? "")
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean),
            }
          : task
      ),
    };

    await persist(nextState);
  };

  const removeTask = async (taskId) => {
    await persist({
      ...state,
      tasks: state.tasks.filter((task) => task.id !== taskId),
    });
  };

  const addSession = async (sessionInput) => {
    const session = {
      id: uid("session"),
      topic: sessionInput.topic.trim(),
      course: sessionInput.course.trim(),
      date: sessionInput.date,
      duration: Number(sessionInput.duration),
      energy: sessionInput.energy,
      outcome: sessionInput.outcome.trim(),
      createdAt: new Date().toISOString(),
    };

    await persist({ ...state, sessions: [session, ...state.sessions] });
  };

  const removeSession = async (sessionId) => {
    await persist({
      ...state,
      sessions: state.sessions.filter((session) => session.id !== sessionId),
    });
  };

  const updateProfile = async (updates) => {
    await persist({
      ...state,
      profile: {
        ...state.profile,
        ...updates,
        focusHoursGoal: Number(updates.focusHoursGoal ?? state.profile.focusHoursGoal),
        preferredStudyBlock: Number(
          updates.preferredStudyBlock ?? state.profile.preferredStudyBlock
        ),
      },
    });
  };

  const derived = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const completedTasks = state.tasks.filter((task) => task.status === "done");
    const urgentTasks = state.tasks.filter((task) => {
      const due = new Date(task.dueDate);
      const hoursLeft = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
      return task.status !== "done" && hoursLeft <= 72;
    });
    const weeklySessions = state.sessions.filter((session) => {
      const sessionDate = new Date(session.date);
      return sessionDate >= weekStart && sessionDate < weekEnd;
    });
    const weeklyFocusHours = weeklySessions.reduce(
      (sum, session) => sum + session.duration / 60,
      0
    );
    const completionRate = state.tasks.length
      ? Math.round((completedTasks.length / state.tasks.length) * 100)
      : 0;
    const taskStatusData = [
      { name: "Todo", value: state.tasks.filter((task) => task.status === "todo").length },
      {
        name: "In Progress",
        value: state.tasks.filter((task) => task.status === "progress").length,
      },
      { name: "Done", value: completedTasks.length },
    ];

    const focusTrend = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + index);
      const label = date.toLocaleDateString("en-US", { weekday: "short" });
      const isoDate = date.toISOString().slice(0, 10);
      const minutes = state.sessions
        .filter((session) => session.date === isoDate)
        .reduce((sum, session) => sum + session.duration, 0);

      return {
        day: label,
        hours: Number((minutes / 60).toFixed(1)),
      };
    });

    return {
      completionRate,
      weeklyFocusHours: Number(weeklyFocusHours.toFixed(1)),
      urgentTasks,
      completedTasks,
      taskStatusData,
      focusTrend,
    };
  }, [state]);

  const value = useMemo(
    () => ({
      ...state,
      ...derived,
      isLoading,
      error,
      addTask,
      updateTask,
      removeTask,
      addSession,
      removeSession,
      updateProfile,
    }),
    [derived, error, isLoading, state]
  );

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

