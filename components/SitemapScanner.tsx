/**
 * ============================================================================
 * SitemapScanner | Enterprise Sitemap Discovery v90.0 (FIXED)
 * ============================================================================
 */

import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { BlogPost, AppConfig, SitemapState } from '../types';
import { 
  fetchAndParseSitemap, 
  validateManualUrl, 
  createBlogPostFromUrl,
  calculatePostPriority,
  fetchPageContent,
} from '../utils';
import Toastify from 'toastify-js';
import { BatchProcessor } from './BatchProcessor';

// ============================================================================
// TYPES
// ============================================================================

interface SitemapScannerProps {
  onPostSelect: (post: BlogPost) => void;
  savedState: SitemapState;
  onStateChange: (state: SitemapState) => void;
  config: AppConfig;
}

type ScanStatus = 'idle' | 'scanning' | 'auditing' | 'complete' | 'error';
type FilterTab = 'all' | 'critical' | 'high' | 'medium' | 'low' | 'monetized';

// ============================================================================
// HELPER: Show Toast
// ============================================================================

const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  };
  
  Toastify({
    text: message,
    duration: 4000,
    gravity: 'bottom',
    position: 'right',
    style: {
      background: colors[type],
      borderRadius: '12px',
      fontWeight: 'bold',
    },
  }).showToast();
};

// ============================================================================
// COMPONENT
// ============================================================================

export const SitemapScanner: React.FC<SitemapScannerProps> = ({
  onPostSelect,
  savedState,
  onStateChange,
  config,
}) => {
  // ========== STATE ==========
  const [sitemapUrl, setSitemapUrl] = useState(savedState.url || '');
  const [posts, setPosts] = useState<BlogPost[]>(savedState.posts || []);
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showManualAdd, setShowManualAdd] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const [showBatchProcessor, setShowBatchProcessor] = useState(false);
  const [auditProgress, setAuditProgress] = useState({ current: 0, total: 0 });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ========== REFS ==========
  const abortControllerRef = useRef<AbortController | null>(null);

  // ========== SYNC STATE ==========
  useEffect(() => {
    if (posts.length > 0 || sitemapUrl) {
      onStateChange({
        url: sitemapUrl,
        posts,
        lastScanned: Date.now(),
      });
    }
  }, [posts, sitemapUrl, onStateChange]);

  // ========== FILTERED POSTS ==========
  const filteredPosts = useMemo(() => {
    let result = [...posts];

    // Filter by tab
    if (filterTab !== 'all') {
      if (filterTab === 'monetized') {
        result = result.filter(p => p.monetizationStatus === 'monetized');
      } else {
        result = result.filter(p => p.priority === filterTab && p.monetizationStatus === 'opportunity');
      }
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(query) || 
        p.url.toLowerCase().includes(query)
      );
    }

    return result;
  }, [posts, filterTab, searchQuery]);

  // ========== STATS ==========
  const stats = useMemo(() => ({
    total: posts.length,
    critical: posts.filter(p => p.priority === 'critical' && p.monetizationStatus === 'opportunity').length,
    high: posts.filter(p => p.priority === 'high' && p.monetizationStatus === 'opportunity').length,
    medium: posts.filter(p => p.priority === 'medium' && p.monetizationStatus === 'opportunity').length,
    low: posts.filter(p => p.priority === 'low' && p.monetizationStatus === 'opportunity').length,
    monetized: posts.filter(p => p.monetizationStatus === 'monetized').length,
  }), [posts]);

  // ========== MAIN FETCH HANDLER ==========
  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedUrl = sitemapUrl.trim();
    if (!trimmedUrl) {
      showToast('Please enter a domain or sitemap URL', 'warning');
      return;
    }

    // Cancel any existing operation
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setStatus('scanning');
    setErrorMessage(null);
    
    console.log('[SitemapScanner] Starting fetch for:', trimmedUrl);

    try {
      const discoveredPosts = await fetchAndParseSitemap(trimmedUrl, config);
      
      console.log('[SitemapScanner] Discovered posts:', discoveredPosts.length);
      
      if (discoveredPosts.length === 0) {
        throw new Error('No posts found in sitemap');
      }
      
      setPosts(discoveredPosts);
      setStatus('complete');
      
      showToast(`✓ Found ${discoveredPosts.length} pages!`, 'success');
      
      // Auto-run deep audit if reasonable number of posts
      if (discoveredPosts.length > 0 && discoveredPosts.length <= 100) {
        runDeepAudit(discoveredPosts);
      }
      
    } catch (error: any) {
      console.error('[SitemapScanner] Fetch error:', error);
      
      const message = error.message || 'Unknown error occurred';
      setErrorMessage(message);
      setStatus('error');
      
      // More helpful error messages
      if (message.includes('All proxies failed')) {
        showToast('Network error: Unable to reach the sitemap. The site may be blocking requests. Try "Add URL Manually" instead.', 'error');
      } else if (message.includes('No sitemap found')) {
        showToast(message, 'warning');
      } else {
        showToast(`Scan Failed: ${message.substring(0, 100)}`, 'error');
      }
    }
  };

  // ========== DEEP AUDIT ==========
  const runDeepAudit = async (postsToAudit: BlogPost[]) => {
    if (postsToAudit.length === 0) return;
    
    setStatus('auditing');
    setAuditProgress({ current: 0, total: postsToAudit.length });
    
    const updatedPosts = [...postsToAudit];
    const concurrency = Math.min(config.concurrencyLimit || 3, 5);
    
    let completed = 0;
    
    const processPost = async (index: number) => {
      const post = updatedPosts[index];
      
      try {
        // Fetch content for priority analysis
        const { content } = await fetchPageContent(config, post.url);
        
        // Calculate priority based on content
        const { priority, type, status: monetizationStatus } = calculatePostPriority(
          post.title,
          content
        );
        
        updatedPosts[index] = {
          ...post,
          priority,
          postType: type,
          monetizationStatus,
        };
      } catch {
        // Keep default priority on error
      }
      
      completed++;
      setAuditProgress({ current: completed, total: postsToAudit.length });
    };

    // Process in batches
    for (let i = 0; i < postsToAudit.length; i += concurrency) {
      const batch = [];
      for (let j = i; j < Math.min(i + concurrency, postsToAudit.length); j++) {
        batch.push(processPost(j));
      }
      await Promise.all(batch);
    }

    setPosts(updatedPosts);
    setStatus('complete');
    
    const opportunities = updatedPosts.filter(p => p.monetizationStatus === 'opportunity').length;
    showToast(`Audit complete: ${opportunities} monetization opportunities found`, 'success');
  };

  // ========== MANUAL ADD ==========
  const handleManualAdd = () => {
    const validation = validateManualUrl(manualUrl);
    
    if (!validation.isValid) {
      showToast(validation.error || 'Invalid URL', 'error');
      return;
    }

    // Check for duplicates
    if (posts.some(p => p.url.toLowerCase() === validation.normalizedUrl.toLowerCase())) {
      showToast('This URL is already in the list', 'warning');
      return;
    }

    const newPost = createBlogPostFromUrl(validation.normalizedUrl, posts.length);
    setPosts(prev => [newPost, ...prev]);
    setManualUrl('');
    setShowManualAdd(false);
    
    showToast('URL added successfully', 'success');
  };

  // ========== ALTERNATIVE: TRY WORDPRESS API ==========
  const tryWordPressAPI = async () => {
    if (!config.wpUrl || !config.wpUser || !config.wpAppPassword) {
      showToast('Configure WordPress credentials first (click gear icon)', 'warning');
      return;
    }

    setStatus('scanning');
    setErrorMessage(null);

    try {
      const apiBase = config.wpUrl.replace(/\/$/, '') + '/wp-json/wp/v2';
      const auth = btoa(`${config.wpUser}:${config.wpAppPassword}`);
      
      // Fetch posts from WordPress API
      const response = await fetch(`${apiBase}/posts?per_page=100&status=publish`, {
        headers: { 'Authorization': `Basic ${auth}` },
      });

      if (!response.ok) {
        throw new Error(`WordPress API error: ${response.status}`);
      }

      const wpPosts = await response.json();
      
      if (wpPosts.length === 0) {
        throw new Error('No published posts found');
      }

      const discoveredPosts: BlogPost[] = wpPosts.map((p: any, index: number) => ({
        id: p.id,
        title: p.title?.rendered || 'Untitled',
        url: p.link,
        postType: 'post',
        priority: 'medium' as const,
        monetizationStatus: 'opportunity' as const,
      }));

      setPosts(discoveredPosts);
      setSitemapUrl(config.wpUrl);
      setStatus('complete');
      
      showToast(`✓ Found ${discoveredPosts.length} posts via WordPress API`, 'success');
      
      // Run audit
      runDeepAudit(discoveredPosts);
      
    } catch (error: any) {
      console.error('[WordPress API] Error:', error);
      setStatus('error');
      setErrorMessage(error.message);
      showToast(`WordPress API error: ${error.message}`, 'error');
    }
  };

  // ========== RENDER ==========
  return (
    <div className="h-full flex flex-col bg-dark-950">
      {/* Header */}
      <header className="flex-shrink-0 p-6 md:p-8 border-b border-dark-800 bg-dark-900/50">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
            Content Discovery
          </h1>
          <p className="text-gray-500 text-sm">
            Scan your sitemap to find monetization opportunities
          </p>
          
          {/* Search Form */}
          <form onSubmit={handleFetch} className="mt-6 flex gap-3 flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <input
                type="text"
                value={sitemapUrl}
                onChange={e => setSitemapUrl(e.target.value)}
                placeholder="Enter domain (e.g., example.com) or sitemap URL"
                className="w-full bg-dark-800 border border-dark-700 rounded-2xl px-6 py-4 text-white placeholder-gray-500 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                disabled={status === 'scanning' || status === 'auditing'}
              />
            </div>
            
            <button
              type="submit"
              disabled={status === 'scanning' || status === 'auditing' || !sitemapUrl.trim()}
              className="px-8 py-4 bg-gradient-to-r from-brand-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-black rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-xl"
            >
              {status === 'scanning' ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" />
                  Scanning...
                </>
              ) : status === 'auditing' ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin" />
                  Auditing {auditProgress.current}/{auditProgress.total}
                </>
              ) : (
                <>
                  <i className="fa-solid fa-radar" />
                  Discover
                </>
              )}
            </button>

            {/* Alternative buttons */}
            <button
              type="button"
              onClick={tryWordPressAPI}
              disabled={status === 'scanning' || status === 'auditing'}
              className="px-6 py-4 bg-dark-800 hover:bg-dark-700 text-white font-bold rounded-2xl transition-all border border-dark-700 disabled:opacity-50 flex items-center gap-2"
              title="Fetch posts directly from WordPress API"
            >
              <i className="fa-brands fa-wordpress" />
              <span className="hidden md:inline">WP API</span>
            </button>

            <button
              type="button"
              onClick={() => setShowManualAdd(true)}
              disabled={status === 'scanning' || status === 'auditing'}
              className="px-6 py-4 bg-dark-800 hover:bg-dark-700 text-white font-bold rounded-2xl transition-all border border-dark-700 disabled:opacity-50 flex items-center gap-2"
            >
              <i className="fa-solid fa-plus" />
              <span className="hidden md:inline">Add URL</span>
            </button>
          </form>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <p className="text-sm text-red-400 flex items-start gap-2">
                <i className="fa-solid fa-exclamation-circle mt-0.5" />
                <span>{errorMessage}</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">
                <strong>Tip:</strong> Try the "WP API" button to fetch posts directly, or use "Add URL" to add pages manually.
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Filter Tabs */}
      {posts.length > 0 && (
        <div className="flex-shrink-0 border-b border-dark-800 bg-dark-900/30">
          <div className="max-w-6xl mx-auto px-6 md:px-8">
            <div className="flex gap-1 overflow-x-auto py-4 scrollbar-hide">
              {[
                { id: 'all' as FilterTab, label: 'All', count: stats.total, color: 'gray' },
                { id: 'critical' as FilterTab, label: 'Critical', count: stats.critical, color: 'red' },
                { id: 'high' as FilterTab, label: 'High', count: stats.high, color: 'orange' },
                { id: 'medium' as FilterTab, label: 'Medium', count: stats.medium, color: 'yellow' },
                { id: 'low' as FilterTab, label: 'Low', count: stats.low, color: 'green' },
                { id: 'monetized' as FilterTab, label: 'Monetized', count: stats.monetized, color: 'purple' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilterTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap ${
                    filterTab === tab.id
                      ? 'bg-brand-500 text-white'
                      : 'bg-dark-800 text-gray-400 hover:bg-dark-700 hover:text-white'
                  }`}
                >
                  {tab.label}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                    filterTab === tab.id ? 'bg-white/20' : 'bg-dark-700'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Post List */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 md:p-8">
          {posts.length === 0 ? (
            <div className="py-20 text-center">
              <div className="text-8xl text-dark-800 mb-6">
                <i className="fa-solid fa-map" />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">No Posts Yet</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Enter your domain or sitemap URL above and click "Discover" to find content.
                Alternatively, use "WP API" to fetch directly from WordPress.
              </p>
            </div>
          ) : (
            <>
              {/* Search & Batch Actions */}
              <div className="flex gap-4 mb-6 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search posts..."
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:border-brand-500 outline-none"
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => setShowBatchProcessor(true)}
                  disabled={filteredPosts.length === 0}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  <i className="fa-solid fa-bolt" />
                  Batch Process ({filteredPosts.length})
                </button>
              </div>

              {/* Posts Grid */}
              <div className="space-y-3">
                {filteredPosts.map(post => (
                  <div
                    key={post.id}
                    onClick={() => onPostSelect(post)}
                    className="p-4 md:p-5 bg-dark-800 hover:bg-dark-750 border border-dark-700 hover:border-brand-500/50 rounded-2xl cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Priority Badge */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        post.monetizationStatus === 'monetized' 
                          ? 'bg-purple-500/20 text-purple-400'
                          : post.priority === 'critical'
                          ? 'bg-red-500/20 text-red-400'
                          : post.priority === 'high'
                          ? 'bg-orange-500/20 text-orange-400'
                          : post.priority === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}>
                        <i className={`fa-solid ${
                          post.monetizationStatus === 'monetized' ? 'fa-check' : 'fa-dollar-sign'
                        } text-lg`} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white group-hover:text-brand-400 transition-colors truncate">
                          {post.title}
                        </h3>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {post.url}
                        </p>
                      </div>

                      {/* Type Badge */}
                      <div className="hidden md:block px-3 py-1 bg-dark-700 rounded-lg text-xs font-bold text-gray-400 uppercase">
                        {post.postType}
                      </div>

                      {/* Arrow */}
                      <div className="text-gray-600 group-hover:text-brand-400 transition-colors">
                        <i className="fa-solid fa-chevron-right" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Manual Add Modal */}
      {showManualAdd && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-dark-700 rounded-3xl p-8 max-w-lg w-full">
            <h2 className="text-2xl font-black text-white mb-4">Add URL Manually</h2>
            <input
              type="text"
              value={manualUrl}
              onChange={e => setManualUrl(e.target.value)}
              placeholder="https://example.com/blog-post"
              className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:border-brand-500 outline-none mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowManualAdd(false)}
                className="flex-1 px-6 py-3 bg-dark-800 text-white font-bold rounded-xl hover:bg-dark-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleManualAdd}
                className="flex-1 px-6 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-500 transition-all"
              >
                Add URL
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch Processor Modal */}
      {showBatchProcessor && (
        <BatchProcessor
          posts={filteredPosts}
          config={config}
          onComplete={(results) => {
            console.log('[BatchProcessor] Complete:', results);
            setShowBatchProcessor(false);
          }}
          onClose={() => setShowBatchProcessor(false)}
        />
      )}
    </div>
  );
};

export default SitemapScanner;
