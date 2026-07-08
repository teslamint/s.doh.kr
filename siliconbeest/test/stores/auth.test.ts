import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '@/stores/auth';

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.removeItem("siliconbeest_token"); localStorage.removeItem("siliconbeest_theme");
    document.cookie = 'siliconbeest_token=; Path=/; Max-Age=0';
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{}', { status: 200 })));
    vi.clearAllMocks();
  });

  it('initializes with no user', () => {
    const store = useAuthStore();
    expect(store.isAuthenticated).toBe(false);
    expect(store.currentUser).toBeNull();
    expect(store.token).toBeNull();
  });

  it('persists token to cookie', () => {
    const store = useAuthStore();
    store.setToken('test-token-123');
    expect(document.cookie).toContain('siliconbeest_token=test-token-123');
  });

  it('restores token from cookie', () => {
    document.cookie = 'siliconbeest_token=saved-token; Path=/';
    const store = useAuthStore();
    // Token should be restored on init
    expect(store.token).toBe('saved-token');
  });

  it('reports isAuthenticated when token present', () => {
    document.cookie = 'siliconbeest_token=saved-token; Path=/';
    const store = useAuthStore();
    expect(store.isAuthenticated).toBe(true);
  });

  it('clears state on logout', async () => {
    const store = useAuthStore();
    store.setToken('test-token');
    await store.logout();
    expect(store.token).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(document.cookie).not.toContain('siliconbeest_token=');
  });

  it('clearToken also nulls currentUser', () => {
    const store = useAuthStore();
    store.setToken('test-token');
    // manually set currentUser to something
    store.currentUser = { id: '1', username: 'test' } as any;
    store.clearToken();
    expect(store.currentUser).toBeNull();
  });

  it('isAdmin is false when no user', () => {
    const store = useAuthStore();
    expect(store.isAdmin).toBe(false);
  });

  it('isModerator is false when no user', () => {
    const store = useAuthStore();
    expect(store.isModerator).toBe(false);
  });
});
