import { uid } from "../utils/uid";
import { storage } from "./storage";
import { isSupabaseConfigured, supabase } from "./supabaseClient";

const DEMO_SESSION_KEY = "momentum-demo-session";
const DEMO_USERS_KEY = "momentum-demo-users";

const listeners = new Set();

function emit(session) {
  listeners.forEach((listener) => listener(session));
}

function getDemoUsers() {
  return storage.get(DEMO_USERS_KEY, []);
}

function saveDemoUsers(users) {
  storage.set(DEMO_USERS_KEY, users);
}

function normalizeDemoUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export const authService = {
  async getSession() {
    if (isSupabaseConfigured) {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      return {
        user: session?.user
          ? {
              id: session.user.id,
              name:
                session.user.user_metadata?.name ||
                session.user.email?.split("@")[0] ||
                "Student",
              email: session.user.email,
            }
          : null,
        mode: "supabase",
      };
    }

    return {
      user: storage.get(DEMO_SESSION_KEY, null),
      mode: "demo",
    };
  },

  onAuthStateChange(listener) {
    listeners.add(listener);

    let unsubscribe = null;
    if (isSupabaseConfigured) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        emit({
          user: session?.user
            ? {
                id: session.user.id,
                name:
                  session.user.user_metadata?.name ||
                  session.user.email?.split("@")[0] ||
                  "Student",
                email: session.user.email,
              }
            : null,
          mode: "supabase",
        });
      });
      unsubscribe = () => subscription.unsubscribe();
    }

    return () => {
      listeners.delete(listener);
      unsubscribe?.();
    };
  },

  async login({ email, password }) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      return {
        user: {
          id: data.user.id,
          name: data.user.user_metadata?.name || email.split("@")[0],
          email: data.user.email,
        },
        mode: "supabase",
      };
    }

    const users = getDemoUsers();
    const matchingUser = users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
    );

    if (!matchingUser) {
      throw new Error("Incorrect email or password for demo mode.");
    }

    const sessionUser = normalizeDemoUser(matchingUser);
    storage.set(DEMO_SESSION_KEY, sessionUser);
    emit({ user: sessionUser, mode: "demo" });

    return { user: sessionUser, mode: "demo" };
  },

  async signup({ name, email, password }) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      if (error) throw error;

      return {
        user: data.user
          ? {
              id: data.user.id,
              name: data.user.user_metadata?.name || name,
              email: data.user.email,
            }
          : null,
        mode: "supabase",
      };
    }

    const users = getDemoUsers();
    const exists = users.some((user) => user.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      throw new Error("A demo account with this email already exists.");
    }

    const newUser = {
      id: uid("user"),
      name: name.trim() || email.split("@")[0],
      email,
      password,
    };

    const nextUsers = [...users, newUser];
    saveDemoUsers(nextUsers);

    const sessionUser = normalizeDemoUser(newUser);
    storage.set(DEMO_SESSION_KEY, sessionUser);
    emit({ user: sessionUser, mode: "demo" });

    return { user: sessionUser, mode: "demo" };
  },

  async logout() {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      emit({ user: null, mode: "supabase" });
      return;
    }

    storage.remove(DEMO_SESSION_KEY);
    emit({ user: null, mode: "demo" });
  },

  async updateProfile(updates) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          name: updates.name,
        },
      });
      if (error) throw error;

      const updatedUser = {
        id: data.user.id,
        name: data.user.user_metadata?.name || updates.name || "Student",
        email: data.user.email,
      };
      emit({ user: updatedUser, mode: "supabase" });
      return updatedUser;
    }

    const sessionUser = storage.get(DEMO_SESSION_KEY, null);
    if (!sessionUser) {
      throw new Error("No active session.");
    }

    const nextUser = { ...sessionUser, ...updates };
    storage.set(DEMO_SESSION_KEY, nextUser);
    const users = getDemoUsers().map((user) =>
      user.id === nextUser.id ? { ...user, ...updates } : user
    );
    saveDemoUsers(users);
    emit({ user: nextUser, mode: "demo" });
    return nextUser;
  },
};

