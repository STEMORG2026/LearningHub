export {
  playSpark,
  playCollision,
  playExplosion,
  playMotionHum,
  syncMutedState,
  syncIntensityState,
  syncAllStates,
  getAudioContext,
  AudioEngine,
} from './audio-adapter';

export {
  getQuizState,
  getSubjectQuestions,
  getAvailableSubjects,
  setQuizSubject,
  publishQuizStarted,
  publishQuizAnswerSubmitted,
  publishQuizCompleted,
} from './quiz-adapter';
export type {
  LegacyQuizState,
  QuestionData,
} from './quiz-adapter';

export {
  isCanvasActive,
  isBackgroundDisabled,
  getCanvasDimensions,
  getSimulationState,
  clickControlButton,
  enableBackground,
  disableBackground,
} from './canvas-adapter';
export type {
  CanvasSimulationState,
} from './canvas-adapter';

