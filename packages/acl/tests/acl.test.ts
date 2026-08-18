import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  isCanvasActive,
  getCanvasDimensions,
  isBackgroundDisabled,
  getSimulationState,
  clickControlButton,
  enableBackground,
  disableBackground,
} from '../src/index';

function makeCanvas(options: { disabled?: boolean; display?: string; width?: number; height?: number } = {}): {
  classList: { contains: (c: string) => boolean; add: (c: string) => void; remove: (c: string) => void };
  style: { display: string };
  width: number;
  height: number;
} {
  const classes = new Set<string>();
  if (options.disabled) classes.add('bg-disabled');
  return {
    classList: {
      contains: (c: string) => classes.has(c),
      add: (c: string) => {
        classes.add(c);
      },
      remove: (c: string) => {
        classes.delete(c);
      },
    },
    style: { display: options.display ?? 'block' },
    width: options.width ?? 800,
    height: options.height ?? 600,
  };
}

function makeButton(active: boolean): { classList: { contains: (c: string) => boolean }; click: ReturnType<typeof vi.fn> } {
  const classes = new Set<string>();
  if (active) classes.add('active');
  return {
    classList: {
      contains: (c: string) => classes.has(c),
    },
    click: vi.fn(),
  };
}

function stubDocument(canvas: unknown, button?: unknown): void {
  vi.stubGlobal('document', {
    getElementById: (id: string) => {
      if (id === 'stemBackgroundCanvas') return canvas;
      if (button && id === 'ctrlBlackholeBtn') return button;
      return null;
    },
    querySelector: (sel: string) => (sel === '#ctrlBlackholeBtn' ? button ?? null : null),
  });
}

describe('canvas-adapter', () => {
  it('isCanvasActive returns false when no canvas element', () => {
    expect(isCanvasActive()).toBe(false);
  });

  it('getCanvasDimensions returns null when no canvas element', () => {
    expect(getCanvasDimensions()).toBeNull();
  });

  it('isBackgroundDisabled returns false when no canvas element', () => {
    expect(isBackgroundDisabled()).toBe(false);
  });

  it('getSimulationState returns defaults when no canvas element', () => {
    const state = getSimulationState();
    expect(state.backgroundDisabled).toBe(false);
    expect(state.blackholeDisabled).toBe(true);
  });

  it('enableBackground and disableBackground do not throw when no canvas', () => {
    expect(() => enableBackground()).not.toThrow();
    expect(() => disableBackground()).not.toThrow();
  });
});

describe('canvas-adapter (DOM present)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('isCanvasActive is true for an enabled, visible canvas', () => {
    stubDocument(makeCanvas());
    expect(isCanvasActive()).toBe(true);
  });

  it('isCanvasActive is false when canvas display is none', () => {
    stubDocument(makeCanvas({ display: 'none' }));
    expect(isCanvasActive()).toBe(false);
  });

  it('isCanvasActive is false when canvas is disabled', () => {
    stubDocument(makeCanvas({ disabled: true }));
    expect(isCanvasActive()).toBe(false);
  });

  it('isBackgroundDisabled is true when canvas is disabled', () => {
    stubDocument(makeCanvas({ disabled: true }));
    expect(isBackgroundDisabled()).toBe(true);
  });

  it('isBackgroundDisabled is true when display is none', () => {
    stubDocument(makeCanvas({ display: 'none' }));
    expect(isBackgroundDisabled()).toBe(true);
  });

  it('isBackgroundDisabled is false for an enabled visible canvas', () => {
    stubDocument(makeCanvas());
    expect(isBackgroundDisabled()).toBe(false);
  });

  it('getCanvasDimensions reads width and height from the live canvas', () => {
    stubDocument(makeCanvas({ width: 1024, height: 768 }));
    expect(getCanvasDimensions()).toEqual({ width: 1024, height: 768 });
  });

  it('enableBackground clears bg-disabled and shows the canvas', () => {
    stubDocument(makeCanvas({ disabled: true, display: 'none' }));
    enableBackground();
    expect(isBackgroundDisabled()).toBe(false);
    expect(isCanvasActive()).toBe(true);
  });

  it('disableBackground adds bg-disabled and hides the canvas', () => {
    stubDocument(makeCanvas());
    disableBackground();
    expect(isBackgroundDisabled()).toBe(true);
    expect(isCanvasActive()).toBe(false);
  });

  it('getSimulationState reflects an inactive blackhole control', () => {
    stubDocument(makeCanvas(), makeButton(false));
    const state = getSimulationState();
    expect(state.backgroundDisabled).toBe(false);
    expect(state.blackholeDisabled).toBe(true);
  });

  it('getSimulationState reflects an active blackhole control', () => {
    stubDocument(makeCanvas(), makeButton(true));
    expect(getSimulationState().blackholeDisabled).toBe(false);
  });

  it('getSimulationState reports backgroundDisabled when canvas is disabled', () => {
    stubDocument(makeCanvas({ disabled: true }), makeButton(true));
    expect(getSimulationState().backgroundDisabled).toBe(true);
  });

  it('clickControlButton clicks an existing control', () => {
    const btn = makeButton(true);
    stubDocument(makeCanvas(), btn);
    clickControlButton('ctrlBlackholeBtn');
    expect(btn.click).toHaveBeenCalledTimes(1);
  });

  it('clickControlButton does nothing when the control is missing', () => {
    stubDocument(makeCanvas());
    expect(() => clickControlButton('missing')).not.toThrow();
  });
});