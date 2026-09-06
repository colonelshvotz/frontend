// pages/admin/invites.js
//
// Admin page for creating and managing invite links.
// Place this file at: pages/admin/invites.js in your Next.js frontend.
//
// Updated with:
// - Password protection gate
// - Scenario rules textarea
// - Admin password header on all API calls

import { useState, useEffect } from "react";

export default function InviteAdminPage() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [adminPassword, setAdminPassword] = useState(""); // stored after login
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Form state
  //const [genre, setGenre] = useState("fantasy");
  //const [characterName, setCharacterName] = useState("");
  //const [characterDescription, setCharacterDescription] = useState("");
  const [storyIdea, setStoryIdea] = useState("");
  //const [narratorStyle, setNarratorStyle] = useState("neutral");
  const [readingLevel, setReadingLevel] = useState("");
  const [letAIDecide, setLetAIDecide] = useState(true);
  const [rules, setRules] = useState(""); // Scenario rules (one per line)

  // UI state
  const [loading, setLoading] = useState(false);
  const [invites, setInvites] = useState([]);
  const [loadingInvites, setLoadingInvites] = useState(true);
  const [createdLink, setCreatedLink] = useState(null);
  const [copySuccess, setCopySuccess] = useState("");
  const [error, setError] = useState("");

  const baseURL = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "");
  const frontendURL = typeof window !== "undefined" ? window.location.origin : "";

  // Helper: get auth headers
  const authHeaders = () => ({
    "Content-Type": "application/json",
    "X-Admin-Password": adminPassword,
  });

  // Check if session password exists on mount
  useEffect(() => {
    const savedPassword = sessionStorage.getItem("admin_password");
    if (savedPassword) {
      setAdminPassword(savedPassword);
      setIsAuthenticated(true);
    }
  }, []);

  // Load invites once authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchInvites();
    }
  }, [isAuthenticated]);

  // === AUTH ===
  const handleLogin = async () => {
    setAuthLoading(true);
    setAuthError("");

    try {
      const res = await fetch(`${baseURL}/verify-admin-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setAdminPassword(password);
        sessionStorage.setItem("admin_password", password);
        setIsAuthenticated(true);
        setPassword("");
      } else {
        setAuthError("Invalid password. Please try again.");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setAuthError("Connection error. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminPassword("");
    sessionStorage.removeItem("admin_password");
    setInvites([]);
  };

  // === API CALLS (all include admin password header) ===

  const fetchInvites = async () => {
    setLoadingInvites(true);
    try {
      const res = await fetch(`${baseURL}/list-invites`, {
        headers: { "X-Admin-Password": adminPassword },
      });
      if (res.status === 401) {
        handleLogout();
        return;
      }
      const data = await res.json();
      setInvites(data.invites || []);
    } catch (err) {
      console.error("Failed to load invites:", err);
    } finally {
      setLoadingInvites(false);
    }
  };

  // Generate random character name
  const generateRandomName = async () => {
    try {
      const res = await fetch(`${baseURL}/generate-name?genre=${encodeURIComponent(genre)}`);
      const data = await res.json();
      setCharacterName(data.name);
    } catch (err) {
      console.error("Failed to generate name:", err);
    }
  };

  // Generate random story idea
  const generateRandomIdea = async () => {
    try {
      const res = await fetch(`${baseURL}/generate-idea?genre=${encodeURIComponent(genre)}`);
      const data = await res.json();
      setStoryIdea(data.idea);
    } catch (err) {
      console.error("Failed to generate idea:", err);
    }
  };

  // Create a new invite
  const createInvite = async () => {
    

    setLoading(true);
    setError("");

    // Parse rules: split by newlines, trim whitespace, remove empty lines
    const rulesArray = rules
      .split("\n")
      .map((r) => r.trim())
      .filter((r) => r.length > 0);

    try {
      const res = await fetch(`${baseURL}/create-invite`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          //genre,
          
          story_idea: storyIdea,
          let_ai_decide: letAIDecide,
          skip_image: true,
          //narrator_style: narratorStyle,
          reading_level: readingLevel || null,
          rules: rulesArray,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Failed to create invite.");
        return;
      }

      const fullLink = `${frontendURL}${data.path}`;
      setCreatedLink({
        token: data.token,
        path: data.path,
        fullLink,
        expiresAt: data.expires_at,
      });

      // Refresh the invites list
      fetchInvites();

      // Clear form
      
      setStoryIdea("");
      setRules("");
    } catch (err) {
      console.error("Failed to create invite:", err);
      setError("Failed to create invite. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Copy link to clipboard
  const copyToClipboard = async (link) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopySuccess(link);
      setTimeout(() => setCopySuccess(""), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Delete an invite
  const deleteInvite = async (token) => {
    if (!confirm("Are you sure you want to delete this invite?")) return;

    try {
      await fetch(`${baseURL}/invite/${token}`, {
        method: "DELETE",
        headers: { "X-Admin-Password": adminPassword },
      });
      fetchInvites();
    } catch (err) {
      console.error("Failed to delete invite:", err);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-green-600";
      case "in_progress":
        return "bg-yellow-600";
      case "completed":
        return "bg-blue-600";
      case "expired":
        return "bg-gray-600";
      default:
        return "bg-gray-600";
    }
  };

  // === PASSWORD GATE ===
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#12110f] text-white flex items-center justify-center p-6">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold mb-2 text-center">Admin Access</h1>
          <p className="text-gray-400 text-sm text-center mb-6">
            Enter the admin password to manage invite links.
          </p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Enter admin password..."
            className="w-full p-3 bg-gray-700 rounded text-white mb-4"
            autoFocus
          />

          {authError && (
            <div className="mb-4 p-3 bg-red-900 text-red-200 rounded text-sm">
              {authError}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={authLoading || !password}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 rounded font-semibold disabled:opacity-50"
          >
            {authLoading ? "Verifying..." : "Log In"}
          </button>
        </div>
      </div>
    );
  }

  // === MAIN ADMIN PAGE ===
  return (
    <div className="min-h-screen bg-[#12110f] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-3xl font-bold">Invite Link Manager</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm"
          >
            Log Out
          </button>
        </div>
        <p className="text-gray-400 mb-8">
          Create one-time story links to share with users for psychological assessment.
        </p>

        {/* Create New Invite Form */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Create New Invite</h2>

          

          

         
          {/* Story Idea */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Story Premise</label>
            <div className="flex gap-2">
              <textarea
                value={storyIdea}
                onChange={(e) => setStoryIdea(e.target.value)}
                placeholder="Optional: specific story premise or scenario..."
                className="flex-1 p-2 bg-gray-700 rounded text-white h-20"
              />
              <button
                onClick={generateRandomIdea}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-sm h-fit"
              >
                Random
              </button>
            </div>
          </div>

          {/* Scenario Rules */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">
              Scenario Rules (one per line)
            </label>
            <textarea
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              placeholder={
                "Enter rules that cannot be broken no matter what the user tries.\n" +
                "Example:\n" +
                "The troll guarding the bridge cannot be defeated by violence\n" +
                "The magic sword can only be found in the cave behind the waterfall\n" +
                "The shopkeeper will never sell items for less than full price"
              }
              className="w-full p-2 bg-gray-700 rounded text-white h-32 font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              These rules are re-enforced every turn. The AI will maintain them no matter what the player attempts.
            </p>
          </div>

          {/* Reading Level */}
          <div className="mb-4">
            <label className="block text-sm text-gray-400 mb-1">Reading Level (optional)</label>
            <input
              type="text"
              value={readingLevel}
              onChange={(e) => setReadingLevel(e.target.value)}
              placeholder="e.g., 12 (age) or 800L (Lexile)"
              className="w-full p-2 bg-gray-700 rounded text-white"
            />
          </div>

          {/* Let AI Decide */}
          <div className="mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={letAIDecide}
                onChange={(e) => setLetAIDecide(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Let AI decide story direction (recommended)</span>
            </label>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-900 text-red-200 rounded">
              {error}
            </div>
          )}

          {/* Create Button */}
          <button
            onClick={createInvite}
            disabled={loading}
            className="w-full py-3 bg-amber-600 hover:bg-amber-500 rounded font-semibold disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Invite Link"}
          </button>

          {/* Created Link Display */}
          {createdLink && (
            <div className="mt-4 p-4 bg-green-900 rounded">
              <p className="text-sm text-green-200 mb-2">Invite created successfully!</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={createdLink.fullLink}
                  className="flex-1 p-2 bg-gray-800 rounded text-white text-sm"
                />
                <button
                  onClick={() => copyToClipboard(createdLink.fullLink)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded text-sm"
                >
                  {copySuccess === createdLink.fullLink ? "Copied!" : "Copy"}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Expires: {new Date(createdLink.expiresAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Existing Invites List */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Existing Invites</h2>
            <button
              onClick={fetchInvites}
              className="text-sm text-gray-400 hover:text-white"
            >
              Refresh
            </button>
          </div>

          {loadingInvites ? (
            <p className="text-gray-400">Loading invites...</p>
          ) : invites.length === 0 ? (
            <p className="text-gray-400">No invites created yet.</p>
          ) : (
            <div className="space-y-3">
              {invites.map((invite) => (
                <div
                  key={invite.token}
                  className="flex items-center justify-between p-3 bg-gray-700 rounded"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{invite.participant_id || "—"}</span>
                      
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${getStatusColor(invite.status)}`}
                      >
                        {invite.status}
                      </span>
                      {invite.rules_count > 0 && (
                        <span className="text-xs px-2 py-0.5 rounded bg-purple-700">
                          {invite.rules_count} rule{invite.rules_count > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      Created: {new Date(invite.created_at).toLocaleString()} |
                      Expires: {new Date(invite.expires_at).toLocaleDateString()}
                      {invite.trait_summary?.total_choices > 0 && (
                        <span>
                          {" "}| Choices: {invite.trait_summary.total_choices}
                          {invite.trait_summary.personality?.mbti_type && (
                            <span> | MBTI: {invite.trait_summary.personality.mbti_type}</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {invite.status === "pending" && (
                      <button
                        onClick={() => copyToClipboard(`${frontendURL}${invite.path}`)}
                        className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-sm"
                      >
                        {copySuccess === `${frontendURL}${invite.path}` ? "Copied" : "Copy Link"}
                      </button>
                    )}
                    <button
                      onClick={() => deleteInvite(invite.token)}
                      className="px-3 py-1 bg-red-800 hover:bg-red-700 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
