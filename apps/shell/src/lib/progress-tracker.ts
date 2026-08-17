/**
 * Progress tracking — persists student progress across learning paths.
 *
 * Uses localStorage to persist progress. In a production system, this
 * would be replaced with a server-side persistence layer.
 */

export interface ProgressEntry {
  canonicalId: string;
  status: 'not_started' | 'in_progress' | 'completed';
  score: number;
  lastAccessed: string;
  timeSpentSeconds: number;
}

export interface StudentProgress {
  studentId: string;
  curriculum: string;
  grade: number;
  entries: ProgressEntry[];
  lastUpdated: string;
}

export class ProgressTracker {
  private storageKey = 'stem-tuition-progress';
  private studentId: string;

  constructor(studentId: string = 'anonymous') {
    this.studentId = studentId;
  }

  /**
   * Load progress from storage.
   */
  load(): StudentProgress {
    const data = localStorage.getItem(this.storageKey);
    if (!data) {
      return {
        studentId: this.studentId,
        curriculum: '',
        grade: 0,
        entries: [],
        lastUpdated: new Date().toISOString(),
      };
    }
    return JSON.parse(data);
  }

  /**
   * Save progress to storage.
   */
  save(progress: StudentProgress): void {
    progress.lastUpdated = new Date().toISOString();
    localStorage.setItem(this.storageKey, JSON.stringify(progress));
  }

  /**
   * Initialize a new learning path.
   */
  initPath(curriculum: string, grade: number): StudentProgress {
    const progress: StudentProgress = {
      studentId: this.studentId,
      curriculum,
      grade,
      entries: [],
      lastUpdated: new Date().toISOString(),
    };
    this.save(progress);
    return progress;
  }

  /**
   * Mark a topic as started.
   */
  startTopic(canonicalId: string): void {
    const progress = this.load();
    const existing = progress.entries.find(e => e.canonicalId === canonicalId);
    if (existing) {
      existing.status = 'in_progress';
      existing.lastAccessed = new Date().toISOString();
    } else {
      progress.entries.push({
        canonicalId,
        status: 'in_progress',
        score: 0,
        lastAccessed: new Date().toISOString(),
        timeSpentSeconds: 0,
      });
    }
    this.save(progress);
  }

  /**
   * Mark a topic as completed with a score.
   */
  completeTopic(canonicalId: string, score: number): void {
    const progress = this.load();
    const existing = progress.entries.find(e => e.canonicalId === canonicalId);
    if (existing) {
      existing.status = 'completed';
      existing.score = score;
      existing.lastAccessed = new Date().toISOString();
    } else {
      progress.entries.push({
        canonicalId,
        status: 'completed',
        score,
        lastAccessed: new Date().toISOString(),
        timeSpentSeconds: 0,
      });
    }
    this.save(progress);
  }

  /**
   * Record a question answer.
   */
  recordAnswer(canonicalId: string, isCorrect: boolean): void {
    const progress = this.load();
    const existing = progress.entries.find(e => e.canonicalId === canonicalId);
    if (existing) {
      const total = existing.score + (isCorrect ? 1 : 0);
      existing.score = total;
      existing.lastAccessed = new Date().toISOString();
    } else {
      progress.entries.push({
        canonicalId,
        status: 'in_progress',
        score: isCorrect ? 1 : 0,
        lastAccessed: new Date().toISOString(),
        timeSpentSeconds: 0,
      });
    }
    this.save(progress);
  }

  /**
   * Get overall progress percentage.
   */
  getCompletionPercentage(totalTopics: number): number {
    const progress = this.load();
    const completed = progress.entries.filter(e => e.status === 'completed').length;
    return totalTopics > 0 ? Math.round((completed / totalTopics) * 100) : 0;
  }

  /**
   * Get progress for a specific topic.
   */
  getTopicProgress(canonicalId: string): ProgressEntry | undefined {
    const progress = this.load();
    return progress.entries.find(e => e.canonicalId === canonicalId);
  }

  /**
   * Reset all progress.
   */
  reset(): void {
    localStorage.removeItem(this.storageKey);
  }
}
