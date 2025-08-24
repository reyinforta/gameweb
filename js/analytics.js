// ===================================
// ANALYTICS TRACKING SYSTEM
// ===================================
// File ini menangani tracking visitor dan page views

class AnalyticsTracker {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.startTime = Date.now();
        this.supabaseUrl = 'https://your-project.supabase.co'; // Ganti dengan URL Supabase Anda
        this.supabaseKey = 'your-anon-key'; // Ganti dengan anon key Anda
        this.waitForSupabase();
    }

    // Wait for Supabase client to be available
    async waitForSupabase() {
        // Temporarily disable Supabase analytics completely
        console.warn('Analytics disabled - using localStorage fallback only');
        this.init();
        return;
        
        // Original code commented out to prevent Supabase errors
        // let attempts = 0;
        // const maxAttempts = 50; // Wait up to 5 seconds
        // 
        // while (attempts < maxAttempts) {
        //     if (typeof supabase !== 'undefined') {
        //         this.init();
        //         return;
        //     }
        //     await new Promise(resolve => setTimeout(resolve, 100));
        //     attempts++;
        // }
        // 
        // // If Supabase is not available after waiting, still initialize
        // console.warn('Supabase client not found, using localStorage fallback');
        // this.init();
    }

    // Generate unique session ID
    generateSessionId() {
        return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Initialize tracking
    init() {
        this.trackPageView();
        this.setupEventListeners();
    }

    // Get visitor information
    getVisitorInfo() {
        const userAgent = navigator.userAgent;
        const deviceInfo = this.getDeviceInfo(userAgent);
        
        return {
            ip_address: null, // Will be set by server
            page_url: window.location.pathname,
            page_title: document.title,
            user_agent: userAgent,
            referrer: document.referrer || null,
            session_id: this.sessionId,
            device_type: deviceInfo.device,
            browser: deviceInfo.browser,
            os: deviceInfo.os,
            visit_timestamp: new Date().toISOString()
        };
    }

    // Detect device, browser, and OS
    getDeviceInfo(userAgent) {
        const device = /Mobile|Android|iPhone|iPad/.test(userAgent) ? 
                      (/iPad/.test(userAgent) ? 'tablet' : 'mobile') : 'desktop';
        
        let browser = 'Unknown';
        if (userAgent.includes('Chrome')) browser = 'Chrome';
        else if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Safari')) browser = 'Safari';
        else if (userAgent.includes('Edge')) browser = 'Edge';
        else if (userAgent.includes('Opera')) browser = 'Opera';
        
        let os = 'Unknown';
        if (userAgent.includes('Windows')) os = 'Windows';
        else if (userAgent.includes('Mac')) os = 'macOS';
        else if (userAgent.includes('Linux')) os = 'Linux';
        else if (userAgent.includes('Android')) os = 'Android';
        else if (userAgent.includes('iOS')) os = 'iOS';
        
        return { device, browser, os };
    }

    // Track page view
    async trackPageView() {
        try {
            const visitorInfo = this.getVisitorInfo();
            // Don't include event fields for page views
            delete visitorInfo.event_name;
            delete visitorInfo.event_data;
            await this.sendToDatabase(visitorInfo);
        } catch (error) {
            console.error('Analytics tracking error:', error);
        }
    }

    // Send data to database
    async sendToDatabase(data) {
        try {
            // Temporarily disable Supabase analytics to prevent errors
            // if (typeof supabase !== 'undefined') {
            //     const { error } = await supabase
            //         .from('visitor_logs')
            //         .insert([data]);
            //     
            //     if (error) throw error;
            // } else {
                this.saveToLocalStorage(data);
            // }
        } catch (error) {
            console.error('Failed to send analytics data:', error);
            this.saveToLocalStorage(data);
        }
    }

    // Save to localStorage as fallback
    saveToLocalStorage(data) {
        try {
            const existingData = JSON.parse(localStorage.getItem('analytics_data') || '[]');
            existingData.push(data);
            
            // Keep only last 100 entries
            if (existingData.length > 100) {
                existingData.splice(0, existingData.length - 100);
            }
            
            localStorage.setItem('analytics_data', JSON.stringify(existingData));
        } catch (error) {
            console.error('Failed to save to localStorage:', error);
        }
    }

    // Track custom events
    trackEvent(eventName, eventData = {}) {
        try {
            const basicInfo = {
                page_url: window.location.pathname,
                page_title: document.title,
                session_id: this.sessionId,
                visit_timestamp: new Date().toISOString(),
                event_name: eventName,
                event_data: eventData
            };
            
            this.sendToDatabase(basicInfo);
        } catch (error) {
            console.error('Event tracking error:', error);
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Track time on page when user leaves
        window.addEventListener('beforeunload', () => {
            const timeOnPage = Math.round((Date.now() - this.startTime) / 1000);
            this.trackEvent('page_exit', { time_on_page: timeOnPage });
        });

        // Track clicks on important elements
        document.addEventListener('click', (event) => {
            const target = event.target;
            
            // Track button clicks
            if (target.tagName === 'BUTTON' || target.classList.contains('btn')) {
                this.trackEvent('button_click', {
                    button_text: target.textContent.trim(),
                    button_id: target.id,
                    button_class: target.className
                });
            }
            
            // Track link clicks
            if (target.tagName === 'A') {
                this.trackEvent('link_click', {
                    link_text: target.textContent.trim(),
                    link_url: target.href,
                    link_target: target.target
                });
            }
        });

        // Track scroll depth
        let maxScrollDepth = 0;
        window.addEventListener('scroll', () => {
            const scrollDepth = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );
            
            if (scrollDepth > maxScrollDepth) {
                maxScrollDepth = scrollDepth;
                
                // Track milestone scroll depths
                if ([25, 50, 75, 100].includes(scrollDepth)) {
                    this.trackEvent('scroll_depth', { depth: scrollDepth });
                }
            }
        });
    }

    // Get analytics data from localStorage (for development)
    getLocalAnalyticsData() {
        try {
            return JSON.parse(localStorage.getItem('analytics_data') || '[]');
        } catch (error) {
            console.error('Failed to get analytics data:', error);
            return [];
        }
    }

    // Clear local analytics data
    clearLocalAnalyticsData() {
        localStorage.removeItem('analytics_data');
    }
}

// Initialize analytics tracking when page loads
let analyticsTracker;

// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        analyticsTracker = new AnalyticsTracker();
    });
} else {
    analyticsTracker = new AnalyticsTracker();
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnalyticsTracker;
}

// Global functions for manual tracking
window.trackEvent = function(eventName, eventData) {
    if (analyticsTracker) {
        analyticsTracker.trackEvent(eventName, eventData);
    }
};

window.getAnalyticsData = function() {
    if (analyticsTracker) {
        return analyticsTracker.getLocalAnalyticsData();
    }
    return [];
};