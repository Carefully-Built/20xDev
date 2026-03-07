import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import {
  getIntercomAppId,
  loadIntercomScript,
  bootIntercom,
  updateIntercom,
  shutdownIntercom,
} from '@/lib/intercom';

describe('Intercom — #10', () => {
  let originalEnv: string | undefined;

  beforeEach(() => {
    originalEnv = process.env['NEXT_PUBLIC_INTERCOM_APP_ID'];
    // Reset DOM
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    // Reset window.Intercom
    delete window.Intercom;
    delete window.intercomSettings;
  });

  afterEach(() => {
    if (originalEnv !== undefined) {
      process.env['NEXT_PUBLIC_INTERCOM_APP_ID'] = originalEnv;
    } else {
      delete process.env['NEXT_PUBLIC_INTERCOM_APP_ID'];
    }
  });

  // TEST-001: REQ-001 — Intercom CDN script injected when env var is set
  it('TEST-001: injects Intercom CDN script tag when called with appId', () => {
    loadIntercomScript('test123');

    const script = document.getElementById('intercom-script') as HTMLScriptElement | null;
    expect(script).not.toBeNull();
    expect(script?.src).toContain('widget.intercom.io/widget/test123');
  });

  // TEST-002: REQ-002 — window.Intercom('boot') called with app_id
  it('TEST-002: bootIntercom calls window.Intercom with boot and app_id', () => {
    process.env['NEXT_PUBLIC_INTERCOM_APP_ID'] = 'test-app-id';
    const mockIntercom = vi.fn();
    window.Intercom = mockIntercom;

    bootIntercom();

    expect(mockIntercom).toHaveBeenCalledWith('boot', expect.objectContaining({
      app_id: 'test-app-id',
      alignment: 'right',
      vertical_padding: 20,
    }));
  });

  // TEST-003: REQ-007 — No script when env var unset
  it('TEST-003: getIntercomAppId returns undefined when env var is not set', () => {
    delete process.env['NEXT_PUBLIC_INTERCOM_APP_ID'];

    const result = getIntercomAppId();
    expect(result).toBeUndefined();
  });

  // TEST-004: REQ-SEC-003 — SSR guards on all functions
  it('TEST-004: bootIntercom no-ops when window.Intercom is undefined', () => {
    process.env['NEXT_PUBLIC_INTERCOM_APP_ID'] = 'test-app-id';
    // window.Intercom is not set
    expect(() => bootIntercom()).not.toThrow();
  });

  // TEST-005: REQ-011 — Script loads lazily (async)
  it('TEST-005: injected script has async attribute', () => {
    loadIntercomScript('test123');

    const script = document.getElementById('intercom-script') as HTMLScriptElement | null;
    expect(script).not.toBeNull();
    expect(script?.async).toBe(true);
  });

  // TEST-006: REQ-SEC-001 + REQ-SEC-002 — App ID from env only
  it('TEST-006: getIntercomAppId reads from process.env', () => {
    process.env['NEXT_PUBLIC_INTERCOM_APP_ID'] = 'env-app-id';

    const result = getIntercomAppId();
    expect(result).toBe('env-app-id');
  });

  // TEST-007: Script idempotency — loadIntercomScript does not duplicate
  it('TEST-007: loadIntercomScript is idempotent (does not create duplicate scripts)', () => {
    loadIntercomScript('test123');
    loadIntercomScript('test123');

    const scripts = document.querySelectorAll('#intercom-script');
    expect(scripts.length).toBe(1);
  });

  // TEST-008: updateIntercom calls window.Intercom('update')
  it('TEST-008: updateIntercom calls window.Intercom with update command', () => {
    const mockIntercom = vi.fn();
    window.Intercom = mockIntercom;

    updateIntercom({ name: 'Test User' });

    expect(mockIntercom).toHaveBeenCalledWith('update', { name: 'Test User' });
  });

  // TEST-009: shutdownIntercom calls window.Intercom('shutdown')
  it('TEST-009: shutdownIntercom calls window.Intercom with shutdown command', () => {
    const mockIntercom = vi.fn();
    window.Intercom = mockIntercom;

    shutdownIntercom();

    expect(mockIntercom).toHaveBeenCalledWith('shutdown');
  });

  // TEST-010: REQ-SEC-004 — No user data passed in boot call
  it('TEST-010: bootIntercom does not pass name, email, or user_id by default', () => {
    process.env['NEXT_PUBLIC_INTERCOM_APP_ID'] = 'test-app-id';
    const mockIntercom = vi.fn();
    window.Intercom = mockIntercom;

    bootIntercom();

    const bootArgs = mockIntercom.mock.calls[0]?.[1] as Record<string, unknown>;
    expect(bootArgs).not.toHaveProperty('name');
    expect(bootArgs).not.toHaveProperty('email');
    expect(bootArgs).not.toHaveProperty('user_id');
  });

  // TEST-011: loadIntercomScript initializes command queue when Intercom not present
  it('TEST-011: loadIntercomScript creates command queue when window.Intercom is undefined', () => {
    loadIntercomScript('test123');

    expect(typeof window.Intercom).toBe('function');
  });

  // TEST-012: updateIntercom no-ops when window.Intercom is undefined
  it('TEST-012: updateIntercom no-ops when window.Intercom is undefined', () => {
    expect(() => updateIntercom({ name: 'Test' })).not.toThrow();
  });

  // TEST-013: shutdownIntercom no-ops when window.Intercom is undefined
  it('TEST-013: shutdownIntercom no-ops when window.Intercom is undefined', () => {
    expect(() => shutdownIntercom()).not.toThrow();
  });

  // TEST-014: bootIntercom no-ops when appId is not set
  it('TEST-014: bootIntercom no-ops when env var is not set', () => {
    delete process.env['NEXT_PUBLIC_INTERCOM_APP_ID'];
    const mockIntercom = vi.fn();
    window.Intercom = mockIntercom;

    bootIntercom();

    expect(mockIntercom).not.toHaveBeenCalled();
  });

  // TEST-015: REQ-UX-002 — vertical_padding >= 20 to avoid Sonner overlap
  it('TEST-015: bootIntercom sets vertical_padding to 20 by default', () => {
    process.env['NEXT_PUBLIC_INTERCOM_APP_ID'] = 'test-app-id';
    const mockIntercom = vi.fn();
    window.Intercom = mockIntercom;

    bootIntercom();

    const bootArgs = mockIntercom.mock.calls[0]?.[1] as Record<string, unknown>;
    expect(bootArgs['vertical_padding']).toBe(20);
  });
});
