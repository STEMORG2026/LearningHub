export interface CanvasSimulationState {
  backgroundDisabled: boolean;
  blackholeDisabled: boolean;
}

function getCanvasElement(): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null;
  return document.getElementById('stemBackgroundCanvas') as HTMLCanvasElement | null;
}

export function isCanvasActive(): boolean {
  const canvas = getCanvasElement();
  if (!canvas) return false;
  return canvas.style.display !== 'none' && !canvas.classList.contains('bg-disabled');
}

export function isBackgroundDisabled(): boolean {
  const canvas = getCanvasElement();
  if (!canvas) return false;
  return canvas.classList.contains('bg-disabled') || canvas.style.display === 'none';
}

export function getCanvasDimensions(): { width: number; height: number } | null {
  const canvas = getCanvasElement();
  if (!canvas) return null;
  return { width: canvas.width, height: canvas.height };
}

export function getSimulationState(): CanvasSimulationState {
  return {
    backgroundDisabled: isBackgroundDisabled(),
    blackholeDisabled: typeof document !== 'undefined' && document.querySelector('#ctrlBlackholeBtn')
      ? !document.querySelector('#ctrlBlackholeBtn')?.classList.contains('active')
      : true,
  };
}

export function clickControlButton(buttonId: string): void {
  if (typeof document === 'undefined') return;
  const btn = document.getElementById(buttonId) as HTMLButtonElement | null;
  if (btn) {
    btn.click();
  }
}

export function enableBackground(): void {
  const canvas = getCanvasElement();
  if (canvas) {
    canvas.classList.remove('bg-disabled');
    canvas.style.display = 'block';
  }
}

export function disableBackground(): void {
  const canvas = getCanvasElement();
  if (canvas) {
    canvas.classList.add('bg-disabled');
    canvas.style.display = 'none';
  }
}
