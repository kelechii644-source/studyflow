import { useState, useEffect, useRef } from "react";

const SUBJECTS = ["Mathematics", "English", "Science", "History", "Physics", "Chemistry", "Biology", "Literature"];

const FREE_LIMIT = 2;

export default function StudyFlow() {
  const [screen, setScreen] = useState("home"); // home, timer, tasks, progress, upgrade
  const [isPremium, setIsPremium] = useState(false);
  const [subjects, setSubjects] = useState([
    { id: 1, name: "Mathematics", color: "#6366f1", sessions: 3, minutes: 75 },
    { id: 2, name: "English", color: "#ec4899", sessions: 1, minutes: 25 },
  ]);
  const [tasks, setTasks] = useState([
    { id: 1, text: "Read Chapter 5 - Physics", done: false, subject: "Physics" },
    { id: 2, text: "Complete Math exercises pg 42", done: true, subject: "Mathematics" },
    { id: 3, text: "Write essay introduction", done: false, subject: "English" },
  ]);
  const [newTask, setNewTask] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState("focus"); // focus, break
  const [sessionsToday, setSessionsToday] = useState(2);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (timerRunning) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds(s => {
          if (s <= 1) {
            setTimerRunning(false);
            setSessionsToday(prev => prev + 1);
            return timerMode === "focus" ? 5 * 60 : 25 * 60;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerRunning, timerMode]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const totalMinutes = subjects.reduce((a, b) => a + b.minutes, 0);
  const completedTasks = tasks.filter(t => t.done).length;

  const addTask = () => {
    if (!newTask.trim()) return;
    if (!isPremium && tasks.length >= 5) { setShowUpgradeModal(true); return; }
    setTasks([...tasks, { id: Date.now(), text: newTask, done: false, subject: "General" }]);
    setNewTask("");
  };

  const addSubject = () => {
    if (!newSubject.trim()) return;
    if (!isPremium && subjects.length >= FREE_LIMIT) { setShowUpgradeModal(true); return; }
    const colors = ["#6366f1", "#ec4899", "#f59e0b", "#10b981", "#3b82f6", "#ef4444"];
    setSubjects([...subjects, { id: Date.now(), name: newSubject, color: colors[subjects.length % colors.length], sessions: 0, minutes: 0 }]);
    setNewSubject("");
  };

  const timerProgress = timerMode === "focus"
    ? ((25 * 60 - timerSeconds) / (25 * 60)) * 100
    : ((5 * 60 - timerSeconds) / (5 * 60)) * 100;

  const circumference = 2 * Math.PI * 90;

  return (
    <div style={{ minHeight: "100vh", background: "#0d0d14", fontFamily: "'Segoe UI', sans-serif", color: "#fff", maxWidth: "420px", margin: "0 auto", position: "relative" }}>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ background: "#1a1a2e", borderRadius: "24px", padding: "28px", border: "1px solid rgba(99,102,241,0.3)", width: "100%", maxWidth: "360px" }}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🚀</div>
              <h2 style={{ margin: "0 0 8px", fontSize: "22px", fontWeight: "800" }}>Upgrade to Premium</h2>
              <p style={{ color: "#9ca3af", fontSize: "14px", margin: 0 }}>Unlock everything and study smarter</p>
            </div>
            {["Unlimited subjects & tasks", "AI study recommendations", "Detailed analytics & reports", "Export study data", "Priority support"].map((f, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{ color: "#6366f1", fontSize: "16px" }}>✓</span>
                <span style={{ color: "#d1d5db", fontSize: "14px" }}>{f}</span>
              </div>
            ))}
            <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(236,72,153,0.2))", borderRadius: "16px", padding: "16px", textAlign: "center", margin: "20px 0" }}>
              <div style={{ fontSize: "32px", fontWeight: "800", color: "#fff" }}>$4.99<span style={{ fontSize: "14px", color: "#9ca3af", fontWeight: "400" }}>/month</span></div>
              <div style={{ color: "#6366f1", fontSize: "13px", marginTop: "4px" }}>Cancel anytime</div>
            </div>
            <button onClick={() => { setIsPremium(true); setShowUpgradeModal(false); }} style={{ width: "100%", padding: "16px", borderRadius: "14px", border: "none", background: "linear-gradient(135deg, #6366f1, #ec4899)", color: "#fff", fontSize: "16px", fontWeight: "700", cursor: "pointer", marginBottom: "10px" }}>
              Start Premium Now 🚀
            </button>
            <button onClick={() => setShowUpgradeModal(false)} style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#9ca3af", fontSize: "14px", cursor: "pointer" }}>
              Maybe later
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "22px", fontWeight: "800", background: "linear-gradient(135deg, #6366f1, #ec4899)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>StudyFlow</div>
          <div style={{ color: "#6b7280", fontSize: "12px" }}>Study smarter, not harder</div>
        </div>
        {isPremium ? (
          <div style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700" }}>⭐ PREMIUM</div>
        ) : (
          <button onClick={() => setShowUpgradeModal(true)} style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#6366f1", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
            Upgrade ✨
          </button>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: "20px", paddingBottom: "90px" }}>

        {/* HOME */}
        {screen === "home" && (
          <div>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "24px" }}>
              {[
                { label: "Sessions Today", value: sessionsToday, icon: "🎯" },
                { label: "Minutes Studied", value: totalMinutes, icon: "⏱️" },
                { label: "Tasks Done", value: `${completedTasks}/${tasks.length}`, icon: "✅" },
              ].map((s, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.04)", borderRadius: "16px", padding: "14px", textAlign: "center", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ fontSize: "20px", marginBottom: "4px" }}>{s.icon}</div>
                  <div style={{ fontSize: "18px", fontWeight: "800", color: "#fff" }}>{s.value}</div>
                  <div style={{ fontSize: "10px", color: "#6b7280", marginTop: "2px" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Quick Start */}
            <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(236,72,153,0.15))", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "20px", padding: "20px", marginBottom: "20px" }}>
              <h3 style={{ margin: "0 0 6px", fontSize: "16px", fontWeight: "700" }}>Ready to study? 📚</h3>
              <p style={{ color: "#9ca3af", fontSize: "13px", margin: "0 0 16px" }}>Start a 25-minute focus session</p>
              <button onClick={() => setScreen("timer")} style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #6366f1, #ec4899)", color: "#fff", fontSize: "15px", fontWeight: "700", cursor: "pointer" }}>
                Start Focus Session ▶
              </button>
            </div>

            {/* Subjects */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <h3 style={{ margin: 0, fontSize: "15px", fontWeight: "700" }}>My Subjects</h3>
                {!isPremium && <span style={{ color: "#6b7280", fontSize: "12px" }}>{subjects.length}/{FREE_LIMIT} free</span>}
              </div>
              {subjects.map(sub => (
                <div key={sub.id} style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.04)", borderRadius: "14px", padding: "14px", marginBottom: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: sub.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>📚</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "14px", fontWeight: "600" }}>{sub.name}</div>
                    <div style={{ color: "#6b7280", fontSize: "12px" }}>{sub.sessions} sessions · {sub.minutes} min</div>
                  </div>
                  <div style={{ width: "40px", height: "4px", borderRadius: "2px", background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                    <div style={{ width: `${Math.min((sub.minutes / 120) * 100, 100)}%`, height: "100%", background: sub.color, borderRadius: "2px" }} />
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                <input value={newSubject} onChange={e => setNewSubject(e.target.value)} placeholder="Add subject..." style={{ flex: 1, padding: "12px 14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "14px", outline: "none" }} />
                <button onClick={addSubject} style={{ padding: "12px 16px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #6366f1, #ec4899)", color: "#fff", fontSize: "20px", cursor: "pointer" }}>+</button>
              </div>
            </div>

            {/* Recent Tasks */}
            <div>
              <h3 style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: "700" }}>Today's Tasks</h3>
              {tasks.slice(0, 3).map(task => (
                <div key={task.id} onClick={() => setTasks(tasks.map(t => t.id === task.id ? { ...t, done: !t.done } : t))}
                  style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.04)", borderRadius: "14px", padding: "14px", marginBottom: "8px", border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer" }}>
                  <div style={{ width: "22px", height: "22px", borderRadius: "6px", border: task.done ? "none" : "2px solid rgba(255,255,255,0.2)", background: task.done ? "linear-gradient(135deg, #6366f1, #ec4899)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {task.done && <span style={{ fontSize: "12px" }}>✓</span>}
                  </div>
                  <span style={{ fontSize: "14px", color: task.done ? "#6b7280" : "#fff", textDecoration: task.done ? "line-through" : "none" }}>{task.text}</span>
                </div>
              ))}
              <button onClick={() => setScreen("tasks")} style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#6366f1", fontSize: "14px", cursor: "pointer", marginTop: "4px" }}>
                View all tasks →
              </button>
            </div>
          </div>
        )}

        {/* TIMER */}
        {screen === "timer" && (
          <div style={{ textAlign: "center" }}>
            <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "800" }}>Focus Timer</h2>
            <p style={{ color: "#6b7280", fontSize: "13px", margin: "0 0 32px" }}>Stay focused, take breaks</p>

            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "32px" }}>
              {["focus", "break"].map(mode => (
                <button key={mode} onClick={() => { setTimerMode(mode); setTimerRunning(false); setTimerSeconds(mode === "focus" ? 25 * 60 : 5 * 60); }}
                  style={{ padding: "8px 20px", borderRadius: "20px", border: "none", background: timerMode === mode ? "linear-gradient(135deg, #6366f1, #ec4899)" : "rgba(255,255,255,0.06)", color: "#fff", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                  {mode === "focus" ? "🎯 Focus" : "☕ Break"}
                </button>
              ))}
            </div>

            {/* Circle Timer */}
            <div style={{ position: "relative", display: "inline-block", marginBottom: "32px" }}>
              <svg width="220" height="220" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="110" cy="110" r="90" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle cx="110" cy="110" r="90" fill="none" stroke="url(#grad)" strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={circumference} strokeDashoffset={circumference - (timerProgress / 100) * circumference} style={{ transition: "stroke-dashoffset 0.5s" }} />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ fontSize: "42px", fontWeight: "800", letterSpacing: "-2px" }}>{formatTime(timerSeconds)}</div>
                <div style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>{timerMode === "focus" ? "Focus Time" : "Break Time"}</div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={() => { setTimerRunning(false); setTimerSeconds(timerMode === "focus" ? 25 * 60 : 5 * 60); }}
                style={{ width: "56px", height: "56px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: "20px", cursor: "pointer" }}>↺</button>
              <button onClick={() => setTimerRunning(!timerRunning)}
                style={{ width: "80px", height: "80px", borderRadius: "50%", border: "none", background: "linear-gradient(135deg, #6366f1, #ec4899)", color: "#fff", fontSize: "28px", cursor: "pointer" }}>
                {timerRunning ? "⏸" : "▶"}
              </button>
              <button onClick={() => { setTimerRunning(false); setTimerMode(m => m === "focus" ? "break" : "focus"); setTimerSeconds(timerMode === "focus" ? 5 * 60 : 25 * 60); }}
                style={{ width: "56px", height: "56px", borderRadius: "50%", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.06)", color: "#fff", fontSize: "20px", cursor: "pointer" }}>⏭</button>
            </div>

            {!isPremium && (
              <div onClick={() => setShowUpgradeModal(true)} style={{ marginTop: "24px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "14px", padding: "14px", cursor: "pointer" }}>
                <div style={{ color: "#6366f1", fontSize: "13px", fontWeight: "600" }}>⭐ Premium: Custom timer durations + AI focus tips</div>
              </div>
            )}
          </div>
        )}

        {/* TASKS */}
        {screen === "tasks" && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "800" }}>My Tasks</h2>
            <p style={{ color: "#6b7280", fontSize: "13px", margin: "0 0 20px" }}>{completedTasks} of {tasks.length} completed</p>

            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()} placeholder="Add a new task..." style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", fontSize: "14px", outline: "none" }} />
              <button onClick={addTask} style={{ padding: "14px 18px", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, #6366f1, #ec4899)", color: "#fff", fontSize: "20px", cursor: "pointer" }}>+</button>
            </div>

            {tasks.map(task => (
              <div key={task.id} style={{ display: "flex", alignItems: "center", gap: "12px", background: "rgba(255,255,255,0.04)", borderRadius: "14px", padding: "16px", marginBottom: "8px", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div onClick={() => setTasks(tasks.map(t => t.id === task.id ? { ...t, done: !t.done } : t))}
                  style={{ width: "24px", height: "24px", borderRadius: "7px", border: task.done ? "none" : "2px solid rgba(255,255,255,0.2)", background: task.done ? "linear-gradient(135deg, #6366f1, #ec4899)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}>
                  {task.done && <span style={{ fontSize: "13px" }}>✓</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", color: task.done ? "#6b7280" : "#fff", textDecoration: task.done ? "line-through" : "none" }}>{task.text}</div>
                  <div style={{ fontSize: "11px", color: "#4b5563", marginTop: "2px" }}>{task.subject}</div>
                </div>
                <button onClick={() => setTasks(tasks.filter(t => t.id !== task.id))} style={{ background: "none", border: "none", color: "#4b5563", fontSize: "16px", cursor: "pointer" }}>×</button>
              </div>
            ))}

            {!isPremium && (
              <div onClick={() => setShowUpgradeModal(true)} style={{ marginTop: "12px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "14px", padding: "14px", textAlign: "center", cursor: "pointer" }}>
                <div style={{ color: "#6366f1", fontSize: "13px", fontWeight: "600" }}>⭐ Premium: Unlimited tasks + due dates + reminders</div>
              </div>
            )}
          </div>
        )}

        {/* PROGRESS */}
        {screen === "progress" && (
          <div>
            <h2 style={{ margin: "0 0 4px", fontSize: "20px", fontWeight: "800" }}>My Progress</h2>
            <p style={{ color: "#6b7280", fontSize: "13px", margin: "0 0 20px" }}>Keep the momentum going!</p>

            <div style={{ background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(236,72,153,0.15))", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "20px", padding: "20px", marginBottom: "20px", textAlign: "center" }}>
              <div style={{ fontSize: "48px", fontWeight: "800" }}>{sessionsToday}</div>
              <div style={{ color: "#9ca3af", fontSize: "14px" }}>Sessions completed today</div>
              <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "12px" }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ width: "32px", height: "32px", borderRadius: "8px", background: i < sessionsToday ? "linear-gradient(135deg, #6366f1, #ec4899)" : "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>
                    {i < sessionsToday ? "🔥" : ""}
                  </div>
                ))}
              </div>
            </div>

            <h3 style={{ margin: "0 0 12px", fontSize: "15px", fontWeight: "700" }}>Time per Subject</h3>
            {subjects.map(sub => (
              <div key={sub.id} style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", color: "#d1d5db" }}>{sub.name}</span>
                  <span style={{ fontSize: "13px", color: "#6b7280" }}>{sub.minutes} min</span>
                </div>
                <div style={{ height: "8px", borderRadius: "4px", background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                  <div style={{ width: `${Math.min((sub.minutes / Math.max(...subjects.map(s => s.minutes))) * 100, 100)}%`, height: "100%", background: sub.color, borderRadius: "4px", transition: "width 0.5s" }} />
                </div>
              </div>
            ))}

            {!isPremium && (
              <div onClick={() => setShowUpgradeModal(true)} style={{ marginTop: "20px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "16px", padding: "16px", textAlign: "center", cursor: "pointer" }}>
                <div style={{ fontSize: "24px", marginBottom: "8px" }}>📊</div>
                <div style={{ color: "#fff", fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>Unlock Full Analytics</div>
                <div style={{ color: "#6b7280", fontSize: "12px" }}>Weekly reports, streaks, and study insights</div>
                <div style={{ color: "#6366f1", fontSize: "13px", fontWeight: "700", marginTop: "10px" }}>Upgrade to Premium →</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Nav */}
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: "420px", background: "rgba(13,13,20,0.95)", backdropFilter: "blur(10px)", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", padding: "12px 0 20px" }}>
        {[
          { id: "home", icon: "🏠", label: "Home" },
          { id: "timer", icon: "⏱️", label: "Timer" },
          { id: "tasks", icon: "✅", label: "Tasks" },
          { id: "progress", icon: "📊", label: "Progress" },
        ].map(nav => (
          <button key={nav.id} onClick={() => setScreen(nav.id)}
            style={{ flex: 1, background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <span style={{ fontSize: "22px" }}>{nav.icon}</span>
            <span style={{ fontSize: "11px", color: screen === nav.id ? "#6366f1" : "#4b5563", fontWeight: screen === nav.id ? "700" : "400" }}>{nav.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
