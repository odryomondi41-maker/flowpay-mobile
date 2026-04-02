import { User } from '../hooks/use-payhub';

/**
 * Analytics Event Structure
 */
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  timestamp?: string; // Made optional to simplify calls
}

/**
 * Logs an event to the analytics system
 */
const log_event = (user: User | null, event: string | AnalyticsEvent) => {
  const eventData: AnalyticsEvent = typeof event === 'string' 
    ? { name: event, timestamp: new Date().toISOString() } 
    : { ...event, timestamp: event.timestamp || new Date().toISOString() };
  
  console.log(`📊 [Analytics] User: ${user?.email || 'Anonymous'} | Event: ${eventData.name}`, eventData.properties || '');
  
  // Persist to local storage for demo purposes
  const history = JSON.parse(localStorage.getItem('analytics_history') || '[]');
  history.push({ user: user?.email, ...eventData });
  localStorage.setItem('analytics_history', JSON.stringify(history.slice(-100)));
};

/**
 * Mock behavior analysis
 */
const analyze_behavior = () => {
  console.log('👀 Analyzing user behavior patterns...');
};

/**
 * Mock tutorial display
 */
const show_tutorial = () => {
  console.log('📚 Showing onboarding tutorial to user...');
};

/**
 * Marks a user as onboarded in the system
 */
const mark_onboarded = (user: User | null) => {
  if (user) {
    console.log(`✅ User ${user.email} marked as onboarded`);
    localStorage.setItem(`onboarded_${user.email}`, 'true');
  }
};

/**
 * Performs user onboarding
 */
export function onboard_user(user: User | null) {
  show_tutorial();
  mark_onboarded(user);
}

/**
 * Tracks a general event
 */
export function track_event(user: User | null, event: string | AnalyticsEvent) {
  log_event(user, event);
  analyze_behavior();
}

/**
 * Analytics Model class for advanced tracking and insights
 */
export class AnalyticsModel {
  private user: User | null;

  constructor(user: User | null = null) {
    this.user = user;
  }

  /**
   * Track an event using the instance user
   */
  track_event(event: string | AnalyticsEvent) {
    log_event(this.user, event);
  }

  /**
   * Returns calculated insights based on logged data
   */
  get_insights() {
    console.log('📈 Generating insights from analytics data...');
    const history = JSON.parse(localStorage.getItem('analytics_history') || '[]');
    return {
      totalEvents: history.length,
      topEvents: this.calculateTopEvents(history),
      lastActive: history.length > 0 ? history[history.length - 1].timestamp : null
    };
  }

  private calculateTopEvents(history: any[]) {
    const counts: Record<string, number> = {};
    history.forEach(h => {
      counts[h.name] = (counts[h.name] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }
}