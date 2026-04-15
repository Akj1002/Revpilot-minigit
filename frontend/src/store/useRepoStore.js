import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useRepoStore = create(
    persist(
        (set, get) => ({
            user: null, 
            token: null,
            repos: [], 
            activeRepo: null, 
            branchId: null,
            isLoading: false,

            login: (userData, token) => {
                set({ user: userData, token });
                console.log("🔓 Session Started:", userData.name);
            },

            logout: () => {
                set({ user: null, token: null, branchId: null, repos: [], activeRepo: null });
                localStorage.removeItem('revbase-storage');
            },

            fetchRepos: async (userId) => {
                if (!userId) return;
                set({ isLoading: true });
                try {
                    const res = await fetch(`http://localhost:5000/api/repos/user/${userId}`, {
                        headers: { 'Authorization': `Bearer ${get().token}` }
                    });
                    const data = await res.json();
                    if (res.ok) set({ repos: data, isLoading: false });
                    else throw new Error(data.error);
                } catch (err) {
                    set({ isLoading: false });
                    console.error(err);
                }
            },

            fetchRepoById: async (repoId) => {
                set({ isLoading: true });
                try {
                    const res = await fetch(`http://localhost:5000/api/repos/${repoId}`, {
                        headers: { 'Authorization': `Bearer ${get().token}` }
                    });
                    const data = await res.json();
                    if (res.ok) set({ activeRepo: data, isLoading: false });
                    else throw new Error(data.error);
                } catch (err) {
                    set({ isLoading: false });
                    console.error(err);
                }
            },

            initRepository: async (repoData) => {
                const { token, user } = get();
                if (!token || !user) return alert("Session expired. Please log in again.");
                set({ isLoading: true });

                try {
                    const res = await fetch('http://localhost:5000/api/repos/init', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                        body: JSON.stringify({ ...repoData, ownerId: user.id }),
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error);

                    set(state => ({ branchId: data.branchId, repos: [data.repo, ...state.repos], isLoading: false }));
                    return data;
                } catch (err) {
                    set({ isLoading: false });
                    alert(err.message);
                }
            },

            runCodeBackend: async (code, language) => {
                try {
                    const res = await fetch('http://localhost:5000/api/repos/execute', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${get().token}` },
                        body: JSON.stringify({ code, language })
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error);
                    return data.output;
                } catch (err) { throw err; }
            },

            pushToBackend: async (repoId, content, message) => {
                try {
                    const res = await fetch(`http://localhost:5000/api/repos/${repoId}/push`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${get().token}` },
                        body: JSON.stringify({ content, message })
                    });
                    if (!res.ok) throw new Error("Failed to push");
                    return await res.json();
                } catch (err) { throw err; }
            },

            updateRepoName: async (repoId, newName) => {
                try {
                    const res = await fetch(`http://localhost:5000/api/repos/${repoId}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${get().token}` },
                        body: JSON.stringify({ newName })
                    });
                    const data = await res.json();
                    if (res.ok) set({ activeRepo: data.repo });
                    return data;
                } catch (err) { console.error(err); }
            },

            // --- THE NEW DELETE ACTION ---
            deleteRepository: async (repoId) => {
                try {
                    const res = await fetch(`http://localhost:5000/api/repos/${repoId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${get().token}` }
                    });
                    if (!res.ok) throw new Error("Failed to delete repository");
                    
                    // Immediately remove it from the UI list
                    set(state => ({
                        repos: state.repos.filter(repo => repo._id !== repoId)
                    }));
                } catch (err) {
                    console.error("Delete Error:", err);
                    alert(err.message);
                }
            },

            isAuthenticated: () => !!get().token,
        }),
        { 
            name: 'revbase-storage',
            partialize: (state) => ({ user: state.user, token: state.token, branchId: state.branchId }),
        }
    )
);