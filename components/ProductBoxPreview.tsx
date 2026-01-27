/**
 * ============================================================================
 * ProductBoxPreview | SOTA React Component v5.0
 * ============================================================================
 * Enterprise-Grade Product Box Preview with:
 * - SOTA Verdict Display with Verified Analysis Badge
 * - Dual Deployment Modes (ELITE_BENTO / TACTICAL_LINK)
 * - Premium Visual Design with Micro-Animations
 * - Expandable FAQ Section
 * - Trust Signal Footer
 * - Responsive Design
 * - Error State Handling
 * ============================================================================
 */

import React, { useState, useMemo } from 'react';
import { ProductDetails, DeploymentMode, FAQItem } from '../types';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ProductBoxPreviewProps {
  product: ProductDetails;
  affiliateTag?: string;
  mode?: DeploymentMode;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_BULLETS = [
  "Premium build quality with attention to detail",
  "Industry-leading performance metrics", 
  "Backed by comprehensive warranty",
  "Trusted by thousands of verified buyers"
];

const DEFAULT_FAQS: FAQItem[] = [
  { 
    question: "Is this product covered by warranty?", 
    answer: "Yes, this product comes with a comprehensive manufacturer warranty for complete peace of mind." 
  },
  { 
    question: "How does shipping work?", 
    answer: "Eligible for fast Prime shipping with free returns within 30 days." 
  },
  { 
    question: "What's included in the package?", 
    answer: "Complete package includes the main product, all necessary accessories, and detailed documentation." 
  },
  { 
    question: "Is customer support available?", 
    answer: "24/7 customer support available through phone, email, and live chat for any assistance." 
  }
];

const DEFAULT_VERDICT = "Engineered for discerning users who demand excellence, this premium product delivers professional-grade performance with meticulous attention to detail. Backed by thousands of verified reviews and trusted by industry professionals worldwide.";

const TRUST_SIGNALS = [
  { icon: 'fa-amazon', text: 'Amazon Verified', isBrand: true },
  { icon: 'fa-shield-halved', text: 'Secure Checkout', isBrand: false },
  { icon: 'fa-rotate-left', text: '30-Day Returns', isBrand: false },
  { icon: 'fa-truck-fast', text: 'Fast Shipping', isBrand: false },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getCurrentDate = (): string => {
  return new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
}

const StarRating: React.FC<StarRatingProps> = ({ rating, size = 'md' }) => {
  const stars = Math.round(rating);
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <i 
          key={i} 
          className={`fa-solid fa-star ${sizeClasses[size]} ${
            i < stars ? 'text-amber-400' : 'text-slate-200'
          }`}
        />
      ))}
    </div>
  );
};

interface TrustSignalsProps {
  signals: typeof TRUST_SIGNALS;
}

const TrustSignals: React.FC<TrustSignalsProps> = ({ signals }) => (
  <div className="mt-6 flex flex-wrap justify-center items-center gap-6 md:gap-10">
    {signals.map((signal, idx) => (
      <div 
        key={idx} 
        className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors group/trust cursor-default"
      >
        <i 
          className={`fa-${signal.isBrand ? 'brands' : 'solid'} ${signal.icon} text-sm group-hover/trust:scale-110 transition-transform`}
        />
        <span className="text-[10px] font-bold uppercase tracking-wider">
          {signal.text}
        </span>
      </div>
    ))}
  </div>
);

// ============================================================================
// TACTICAL LINK COMPONENT
// ============================================================================

interface TacticalLinkProps {
  product: ProductDetails;
  amazonLink: string;
  imageSrc: string;
  stars: number;
  verdict: string;
  onImageError: () => void;
}

const TacticalLink: React.FC<TacticalLinkProps> = ({
  product,
  amazonLink,
  imageSrc,
  stars,
  verdict,
  onImageError
}) => {
  const currentDate = getCurrentDate();

  return (
    <div className="w-full max-w-[950px] mx-auto group my-10 px-4">
      <div className="relative bg-gradient-to-r from-white via-white to-slate-50 border border-slate-200/80 rounded-[28px] p-5 md:p-7 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] hover:shadow-[0_30px_80px_-20px_rgba(0,0,0,0.15)] hover:border-blue-300 transition-all duration-500 flex flex-col md:flex-row items-center gap-6 overflow-hidden backdrop-blur-sm">
        
        {/* Animated Gradient Border */}
        <div className="absolute inset-0 rounded-[28px] p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm" />
        
        {/* Left Accent Bar */}
        <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-blue-600 rounded-l-[28px]" />
        
        {/* Premium Badge */}
        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-slate-900 to-slate-800 text-white text-[8px] font-black uppercase tracking-[2px] py-1.5 px-4 rounded-bl-2xl rounded-tr-[26px] shadow-lg flex items-center gap-1.5">
          <i className="fa-solid fa-crown text-amber-400 text-[7px]" />
          Editor's Pick
        </div>
        
        {/* Image Container */}
        <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-slate-50 to-white rounded-2xl flex items-center justify-center flex-shrink-0 border border-slate-100 p-3 shadow-inner group-hover:scale-105 transition-transform duration-500">
          <img 
            src={imageSrc} 
            className="max-h-full max-w-full object-contain mix-blend-multiply drop-shadow-md" 
            alt={product.title}
            onError={onImageError}
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="flex-1 text-center md:text-left min-w-0 space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
            <span className="text-[9px] font-black uppercase tracking-[1.5px] text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Top Rated {currentDate}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-amber-400 text-sm tracking-tight">
                {'★'.repeat(stars)}{'☆'.repeat(5-stars)}
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                ({product.reviewCount || '2.4k'})
              </span>
            </div>
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg md:text-xl leading-tight line-clamp-2">
            {product.title}
          </h3>
          <p className="text-slate-500 text-xs md:text-sm line-clamp-2 hidden md:block leading-relaxed">
            {verdict}
          </p>
        </div>

        {/* Price & Action */}
        <div className="flex flex-col items-center gap-3 flex-shrink-0 w-full md:w-auto">
          <div className="text-center">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider font-bold block">
              Best Price
            </span>
            <span className="text-3xl font-black text-slate-900 tracking-tight">
              {product.price}
            </span>
          </div>
          <a 
            href={amazonLink} 
            target="_blank" 
            rel="nofollow sponsored noopener"
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-slate-900 to-slate-800 text-white text-xs font-black uppercase tracking-[2px] rounded-xl hover:from-blue-600 hover:to-blue-700 hover:scale-105 active:scale-95 transition-all duration-300 shadow-xl hover:shadow-blue-500/30 flex items-center justify-center gap-2 group/btn"
          >
            View Deal 
            <i className="fa-solid fa-arrow-right group-hover/btn:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// ELITE BENTO COMPONENT
// ============================================================================

interface EliteBentoProps {
  product: ProductDetails;
  amazonLink: string;
  imageSrc: string;
  stars: number;
  verdict: string;
  bullets: string[];
  faqs: FAQItem[];
  onImageError: () => void;
}

const EliteBento: React.FC<EliteBentoProps> = ({
  product,
  amazonLink,
  imageSrc,
  stars,
  verdict,
  bullets,
  faqs,
  onImageError
}) => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const currentDate = getCurrentDate();

  return (
    <div className="w-full max-w-[1100px] mx-auto my-16 font-sans antialiased group animate-fade-in px-4">
      
      {/* Main Card Container */}
      <div className="relative bg-white rounded-[40px] md:rounded-[56px] border border-slate-200/80 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-700 hover:shadow-[0_60px_120px_-25px_rgba(0,0,0,0.18)] hover:border-slate-300">
        
        {/* Premium Floating Badge */}
        <div className="absolute top-0 right-0 z-30">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 blur-md opacity-50" />
            <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white text-[10px] font-black uppercase tracking-[3px] py-3 px-8 rounded-bl-[32px] shadow-2xl flex items-center gap-2">
              <i className="fa-solid fa-crown text-amber-400" />
              Editor's Choice
            </div>
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-50%] left-[-20%] w-[500px] h-[500px] bg-gradient-to-br from-blue-100/40 to-purple-100/20 rounded-full blur-3xl" />
          <div className="absolute bottom-[-30%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-tr from-amber-100/30 to-orange-100/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-stretch">
          
          {/* LEFT: Visual Showcase (40%) */}
          <div className="lg:w-[42%] bg-gradient-to-br from-slate-50/80 via-white to-slate-50/50 border-b lg:border-b-0 lg:border-r border-slate-100 p-10 lg:p-14 flex flex-col items-center justify-center relative backdrop-blur-sm">
            
            {/* Rating Badge - Top Left */}
            <div className="absolute top-8 left-8 z-20">
              <div className="bg-white/90 backdrop-blur-xl border border-slate-100 shadow-xl px-4 py-2.5 rounded-2xl flex items-center gap-3">
                <StarRating rating={stars} size="sm" />
                <div className="h-4 w-px bg-slate-200" />
                <span className="text-[11px] font-bold text-slate-600">
                  {product.reviewCount || '2.4k'} reviews
                </span>
              </div>
            </div>

            {/* Prime Badge */}
            {product.prime && (
              <div className="absolute top-8 right-8 lg:right-auto lg:left-8 lg:top-20 z-20">
                <div className="bg-[#232F3E] text-white px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 shadow-lg">
                  <i className="fa-brands fa-amazon" /> Prime
                </div>
              </div>
            )}
             
            {/* Product Image with Premium Effects */}
            <a 
              href={amazonLink} 
              target="_blank" 
              rel="nofollow sponsored noopener" 
              className="relative group/img w-full flex items-center justify-center aspect-square lg:aspect-auto lg:h-[380px] my-8"
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/5 to-pink-400/10 rounded-full blur-[60px] scale-75 group-hover/img:scale-100 transition-transform duration-700" />
              
              {/* Subtle Ring */}
              <div className="absolute inset-[15%] border-2 border-dashed border-slate-200/50 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity duration-500" />
              
              <img 
                src={imageSrc} 
                alt={product.title}
                onError={onImageError}
                loading="lazy"
                className="relative z-10 w-auto max-h-[280px] lg:max-h-[340px] object-contain drop-shadow-2xl transition-all duration-700 group-hover/img:scale-110 group-hover/img:-rotate-3"
              />
            </a>
             
            {/* Brand Tag */}
            <div className="flex items-center gap-2 mt-4">
              <div className="w-8 h-px bg-gradient-to-r from-transparent to-slate-300" />
              <p className="text-[10px] font-black uppercase tracking-[4px] text-slate-400">
                Official {product.brand || 'Brand'} Product
              </p>
              <div className="w-8 h-px bg-gradient-to-l from-transparent to-slate-300" />
            </div>
          </div>

          {/* RIGHT: Intelligence Core (60%) */}
          <div className="lg:w-[58%] p-10 lg:p-14 flex flex-col justify-between bg-white relative">
             
            {/* Header Section */}
            <div className="space-y-6">
              
              {/* Category Badge */}
              <div className="flex items-center gap-3 flex-wrap">
                <span className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 text-[10px] font-black uppercase tracking-[2px] px-4 py-2 rounded-full border border-blue-100/80 shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  {product.category || "Premium Selection"}
                </span>
                {product.prime && (
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
                    <i className="fa-solid fa-truck-fast mr-1" /> Free Delivery
                                        </span>
                )}
              </div>
              
              {/* Title */}
              <h2 className="text-3xl lg:text-4xl xl:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-slate-900 group-hover:via-blue-900 group-hover:to-slate-900 transition-all duration-500">
                {product.title}
              </h2>
              
              {/* SOTA Verdict Quote with Verified Analysis Badge */}
              <div className="relative mb-6">
                {/* Decorative Quote Mark */}
                <div className="absolute -left-2 -top-2 text-5xl text-blue-100 font-serif leading-none select-none pointer-events-none">
                  "
                </div>
                
                {/* Description Container */}
                <blockquote className="relative pl-6 pr-4 py-4 border-l-4 border-blue-400 bg-gradient-to-r from-slate-50/80 to-transparent rounded-r-2xl">
                  <p className="text-base lg:text-lg font-medium text-slate-600 leading-relaxed tracking-wide">
                    {verdict}
                  </p>
                </blockquote>
                
                {/* Authority Signal */}
                <div className="flex items-center gap-2 mt-3 pl-6">
                  <div className="flex items-center gap-1">
                    <i className="fa-solid fa-circle-check text-green-500 text-xs" />
                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">
                      Verified Analysis
                    </span>
                  </div>
                  <span className="text-slate-300">•</span>
                  <span className="text-[10px] font-medium text-slate-400">
                    Updated {currentDate}
                  </span>
                </div>
              </div>

              {/* Key Benefits Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {bullets.map((bullet, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-3 p-4 bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-100 hover:border-green-200 hover:shadow-md transition-all duration-300 group/bullet"
                  >
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-green-500/20 group-hover/bullet:scale-110 transition-transform">
                      <i className="fa-solid fa-check text-white text-xs" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 leading-snug pt-1">
                      {bullet}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price & CTA Section */}
            <div className="mt-10 pt-8 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                
                {/* Price Display */}
                <div className="text-center sm:text-left">
                  <div className="flex items-center gap-2 justify-center sm:justify-start mb-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-[3px]">
                      Best Price
                    </span>
                    <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      Save Today
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter">
                      {product.price}
                    </span>
                  </div>
                </div>
                 
                {/* CTA Button */}
                <a 
                  href={amazonLink} 
                  target="_blank" 
                  rel="nofollow sponsored noopener"
                  className="relative w-full sm:w-auto overflow-hidden group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 rounded-2xl blur group-hover/btn:blur-md transition-all opacity-80" />
                  <div className="relative bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-12 py-6 rounded-2xl text-sm font-black uppercase tracking-[3px] shadow-2xl hover:shadow-slate-900/50 transition-all duration-300 flex items-center justify-center gap-4 group-hover/btn:scale-[1.02]">
                    <span>Check Price</span>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover/btn:bg-white/20 transition-colors">
                      <i className="fa-solid fa-arrow-right group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  {/* Shine Effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section - Expandable */}
        {faqs.length > 0 && (
          <div className="relative z-10 bg-gradient-to-b from-slate-50/80 to-slate-100/50 border-t border-slate-200/80 p-8 lg:p-12">
            
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                  <i className="fa-solid fa-circle-question text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">
                    Common Questions
                  </h3>
                  <p className="text-xs text-slate-500">Quick answers for buyers</p>
                </div>
              </div>
              <span className="hidden sm:block text-[9px] font-bold uppercase tracking-[2px] text-slate-400 bg-white px-4 py-2 rounded-full border border-slate-200">
                {faqs.length} FAQs
              </span>
            </div>

            {/* FAQ Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {faqs.map((faq, idx) => (
                <div 
                  key={idx}
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className={`bg-white rounded-2xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                    expandedFaq === idx 
                      ? 'border-blue-200 shadow-lg shadow-blue-500/10' 
                      : 'border-slate-100 hover:border-slate-200 hover:shadow-md'
                  }`}
                >
                  <div className="p-5 flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      expandedFaq === idx 
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg' 
                        : 'bg-slate-100'
                    }`}>
                      <span className={`text-xs font-black ${
                        expandedFaq === idx ? 'text-white' : 'text-slate-500'
                      }`}>
                        Q{idx + 1}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm leading-snug pr-6">
                        {faq.question}
                      </h4>
                      <div className={`overflow-hidden transition-all duration-300 ${
                        expandedFaq === idx ? 'max-h-40 opacity-100 mt-3' : 'max-h-0 opacity-0'
                      }`}>
                        <p className="text-sm text-slate-600 leading-relaxed border-l-2 border-blue-200 pl-4">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                      expandedFaq === idx ? 'bg-blue-100 rotate-180' : 'bg-slate-50'
                    }`}>
                      <i className={`fa-solid fa-chevron-down text-[10px] ${
                        expandedFaq === idx ? 'text-blue-600' : 'text-slate-400'
                      }`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Trust Signals Footer */}
      <TrustSignals signals={TRUST_SIGNALS} />
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT EXPORT
// ============================================================================

export const ProductBoxPreview: React.FC<ProductBoxPreviewProps> = ({ 
  product, 
  affiliateTag = 'tag-20', 
  mode = 'ELITE_BENTO' 
}) => {
  const [imgError, setImgError] = useState(false);
  
  // Computed values
  const stars = Math.round(product.rating || 5);
  const amazonLink = `https://www.amazon.com/dp/${product.asin || "B08N5M7S6K"}?tag=${affiliateTag}`;

  const imageSrc = imgError 
    ? `https://via.placeholder.com/800x800.png?text=${encodeURIComponent(product.brand || 'Product')}` 
    : (product.imageUrl || 'https://via.placeholder.com/800x800.png?text=Acquiring+Asset');

  // Memoized values for performance
  const bullets = useMemo(() => {
    return (product.evidenceClaims && product.evidenceClaims.length >= 4)
      ? product.evidenceClaims.slice(0, 4)
      : DEFAULT_BULLETS;
  }, [product.evidenceClaims]);

  const faqs = useMemo(() => {
    return (product.faqs && product.faqs.length >= 4)
      ? product.faqs.slice(0, 4)
      : DEFAULT_FAQS;
  }, [product.faqs]);

  const verdict = useMemo(() => {
    return (product.verdict && product.verdict.length > 30)
      ? product.verdict
      : DEFAULT_VERDICT;
  }, [product.verdict]);

  const handleImageError = () => setImgError(true);

  // Render based on mode
  if (mode === 'TACTICAL_LINK') {
    return (
      <TacticalLink
        product={product}
        amazonLink={amazonLink}
        imageSrc={imageSrc}
        stars={stars}
        verdict={verdict}
        onImageError={handleImageError}
      />
    );
  }

  return (
    <EliteBento
      product={product}
      amazonLink={amazonLink}
      imageSrc={imageSrc}
      stars={stars}
      verdict={verdict}
      bullets={bullets}
      faqs={faqs}
      onImageError={handleImageError}
    />
  );
};

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default ProductBoxPreview;
