// PremiumProductBox.tsx - COMPLETE REDESIGN

import React, { useState, useRef, useEffect } from 'react';
import { ProductDetails, DeploymentMode } from '../types';

interface PremiumProductBoxProps {
  product: ProductDetails;
  affiliateTag?: string;
  mode?: DeploymentMode;
}

export const PremiumProductBox: React.FC<PremiumProductBoxProps> = ({
  product,
  affiliateTag = 'amzwp-20',
  mode = 'ELITE_BENTO'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showConfetti, setShowConfetti] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const amazonLink = `https://www.amazon.com/dp/${product.asin}?tag=${affiliateTag}`;
  const stars = Math.min(5, Math.max(0, Math.round(product.rating || 4.5)));

  // 3D Tilt Effect Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  const handleCTAClick = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  return (
    <div className="amz-hyperbox-wrapper">
      {/* Animated Background Mesh */}
      <div className="amz-mesh-gradient" />

      {/* Floating Particles */}
      <div className="amz-particles">
        {[...Array(20)].map((_, i) => (
          <span key={i} className="particle" style={{ '--i': i } as React.CSSProperties} />
        ))}
      </div>

      {/* Main Card with 3D Tilt */}
      <div
        ref={cardRef}
        className="amz-hypercard"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => { setIsHovered(false); setMousePosition({ x: 0, y: 0 }); }}
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateY(${mousePosition.x * 10}deg) rotateX(${-mousePosition.y * 10}deg) scale(1.02)`
            : 'perspective(1000px) rotateY(0) rotateX(0) scale(1)',
        }}
      >
        {/* Holographic Shine Effect */}
        <div 
          className="amz-holographic"
          style={{
            background: `radial-gradient(circle at ${50 + mousePosition.x * 100}% ${50 + mousePosition.y * 100}%, rgba(255,255,255,0.3) 0%, transparent 50%)`,
          }}
        />

        {/* Animated Border Gradient */}
        <div className="amz-border-glow" />

        {/* Top Badge with Pulse Animation */}
        <div className="amz-floating-badge">
          <div className="badge-pulse" />
          <span className="badge-icon">👑</span>
          <span className="badge-text">EDITOR'S CHOICE 2026</span>
          <span className="badge-live">● LIVE</span>
        </div>

        {/* Bento Grid Layout */}
        <div className="amz-bento-grid">

          {/* Image Section with Magnetic Effect */}
          <div className="amz-image-cell">
            <div className="image-glow" />
            <div className="image-ring" />
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="product-image"
                style={{
                  transform: isHovered
                    ? `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px) scale(1.1) rotate(${mousePosition.x * 5}deg)`
                    : 'translate(0, 0) scale(1) rotate(0deg)',
                }}
                onError={(e) => {
                  void 0;
                  e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23f0f0f0" width="400" height="400"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle" fill="%23666" font-family="Arial" font-size="16"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
            ) : (
              <div className="product-image flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
                No Image Available
              </div>
            )}

            {/* Floating Stats Orbs */}
            <div className="floating-orb orb-rating">
              <div className="orb-content">
                <span className="orb-value">{product.rating?.toFixed(1)}</span>
                <span className="orb-label">Rating</span>
              </div>
            </div>
            <div className="floating-orb orb-reviews">
              <div className="orb-content">
                <span className="orb-value">{(product.reviewCount || 0).toLocaleString()}</span>
                <span className="orb-label">Reviews</span>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="amz-content-cell">
            {/* Animated Category Pills */}
            <div className="category-pills">
              <span className="pill pill-category">{product.category || 'Premium'}</span>
              {product.prime && <span className="pill pill-prime">⚡ PRIME</span>}
              <span className="pill pill-verified">✓ VERIFIED</span>
            </div>

            {/* Title with Gradient Animation */}
            <h2 className="product-title">
              <span className="title-text">{product.title}</span>
            </h2>

            {/* AI-Generated Verdict Box */}
            <div className="verdict-box">
              <div className="verdict-header">
                <span className="verdict-icon">🧠</span>
                <span className="verdict-label">AI Analysis</span>
                <span className="verdict-badge">GPT-4 Verified</span>
              </div>
              <p className="verdict-text">{product.verdict}</p>
            </div>

            {/* Animated Benefits Marquee */}
            <div className="benefits-marquee">
              <div className="marquee-track">
                {[...(product.evidenceClaims || []), ...(product.evidenceClaims || [])].map((claim, i) => (
                  <span key={i} className="benefit-item">
                    <span className="benefit-check">✓</span>
                    {claim}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Price & CTA Section */}
          <div className="amz-action-cell">
            {/* Price Display with Counter Animation */}
            <div className="price-display">
              <span className="price-label">BEST PRICE TODAY</span>
              <div className="price-value">
                <span className="price-currency">$</span>
                <span className="price-amount">{product.price?.replace(/[^0-9.]/g, '')}</span>
              </div>
              <div className="price-savings">
                <span className="savings-badge">🔥 Limited Time</span>
              </div>
            </div>

            {/* Ultra CTA Button */}
            <a 
              href={amazonLink}
              target="_blank"
              rel="nofollow sponsored noopener"
              className="hyper-cta"
              onClick={handleCTAClick}
            >
              <span className="cta-bg" />
              <span className="cta-glow" />
              <span className="cta-text">
                <span>View on Amazon</span>
                <span className="cta-arrow">→</span>
              </span>
              <span className="cta-shine" />
            </a>

            {/* Trust Micro-Badges */}
            <div className="trust-row">
              <span className="trust-item">🔒 Secure</span>
              <span className="trust-item">🚚 Free Ship</span>
              <span className="trust-item">↩️ Returns</span>
            </div>
          </div>
        </div>

        {/* Confetti Effect on CTA Click */}
        {showConfetti && (
          <div className="confetti-container">
            {[...Array(50)].map((_, i) => (
              <span key={i} className="confetti" style={{ '--i': i } as React.CSSProperties} />
            ))}
          </div>
        )}
      </div>

      <style>{`
        /* ═══════════════════════════════════════════════════════════════
           HYPER-PREMIUM PRODUCT BOX - 2026 EDITION
           ═══════════════════════════════════════════════════════════════ */

        .amz-hyperbox-wrapper {
          --accent-1: #2563eb;
          --accent-2: #0ea5e9;
          --accent-3: #f59e0b;
          --dark: #0a0a0f;
          --glass: rgba(255, 255, 255, 0.03);

          position: relative;
          max-width: 1200px;
          margin: 5rem auto;
          padding: 2rem;
          font-family: 'Inter', -apple-system, sans-serif;
        }

        /* Animated Mesh Gradient Background */
        .amz-mesh-gradient {
          position: absolute;
          inset: -50%;
          background: 
            radial-gradient(ellipse at 20% 30%, rgba(37, 99, 235, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(245, 158, 11, 0.1) 0%, transparent 50%);
          filter: blur(60px);
          animation: meshFloat 20s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes meshFloat {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(5deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
        }

        /* Floating Particles */
        .amz-particles {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: var(--accent-1);
          border-radius: 50%;
          opacity: 0.3;
          animation: particleFloat 15s linear infinite;
          left: calc(var(--i) * 5%);
          animation-delay: calc(var(--i) * -0.5s);
        }

        @keyframes particleFloat {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.6; }
          100% { transform: translateY(-100vh) scale(1); opacity: 0; }
        }

        /* Main Card */
        .amz-hypercard {
          position: relative;
          background: linear-gradient(135deg, rgba(15, 15, 25, 0.95), rgba(20, 20, 35, 0.9));
          border-radius: 32px;
          overflow: hidden;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          transform-style: preserve-3d;
        }

        /* Holographic Shine */
        .amz-holographic {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 10;
          opacity: 0;
          transition: opacity 0.3s;
        }

        .amz-hypercard:hover .amz-holographic {
          opacity: 1;
        }

        /* Animated Border Glow */
        .amz-border-glow {
          position: absolute;
          inset: 0;
          border-radius: 32px;
          padding: 2px;
          background: linear-gradient(135deg, var(--accent-1), var(--accent-2), var(--accent-3), var(--accent-1));
          background-size: 400% 400%;
          animation: borderGlow 8s linear infinite;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.5;
        }

        .amz-hypercard:hover .amz-border-glow {
          opacity: 1;
          animation-duration: 3s;
        }

        @keyframes borderGlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Floating Badge */
        .amz-floating-badge {
          position: absolute;
          top: -1px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          display: flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #1a1a2e, #16162a);
          padding: 12px 24px;
          border-radius: 0 0 20px 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-top: none;
        }

        .badge-pulse {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
          border-radius: inherit;
          opacity: 0;
          animation: badgePulse 2s ease-out infinite;
        }

        @keyframes badgePulse {
          0% { transform: scale(1); opacity: 0.5; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        .badge-icon {
          font-size: 18px;
          animation: badgeIconBounce 2s ease-in-out infinite;
        }

        @keyframes badgeIconBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .badge-text {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 2px;
          background: linear-gradient(90deg, #fff, #93c5fd);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .badge-live {
          font-size: 9px;
          font-weight: 700;
          color: #22c55e;
          animation: livePulse 1.5s ease-in-out infinite;
        }

        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Bento Grid */
        .amz-bento-grid {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          grid-template-rows: auto auto;
          gap: 0;
          padding: 3rem;
        }

        @media (max-width: 900px) {
          .amz-bento-grid {
            grid-template-columns: 1fr;
            padding: 2rem;
          }
        }

        /* Image Cell */
        .amz-image-cell {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          min-height: 400px;
        }

        .image-glow {
          position: absolute;
          width: 60%;
          height: 60%;
          background: radial-gradient(circle, var(--accent-1) 0%, transparent 70%);
          opacity: 0.2;
          filter: blur(40px);
          animation: glowPulse 4s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.2); opacity: 0.3; }
        }

        .image-ring {
          position: absolute;
          width: 80%;
          height: 80%;
          border: 2px dashed rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: ringRotate 30s linear infinite;
        }

        @keyframes ringRotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .product-image {
          position: relative;
          z-index: 5;
          max-width: 80%;
          max-height: 350px;
          object-fit: contain;
          filter: drop-shadow(0 30px 60px rgba(0, 0, 0, 0.5));
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }

        /* Floating Orbs */
        .floating-orb {
          position: absolute;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, rgba(30, 30, 50, 0.9), rgba(20, 20, 40, 0.9));
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          animation: orbFloat 6s ease-in-out infinite;
          z-index: 10;
        }

        .orb-rating { top: 10%; right: 10%; animation-delay: 0s; }
        .orb-reviews { bottom: 10%; left: 10%; animation-delay: -3s; }

        @keyframes orbFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .orb-content {
          text-align: center;
        }

        .orb-value {
          display: block;
          font-size: 20px;
          font-weight: 900;
          background: linear-gradient(135deg, var(--accent-3), var(--accent-2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .orb-label {
          font-size: 9px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        /* Content Cell */
        .amz-content-cell {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Category Pills */
        .category-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .pill {
          padding: 8px 16px;
          border-radius: 100px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .pill-category {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.2), rgba(14, 165, 233, 0.2));
          color: #93c5fd;
          border: 1px solid rgba(37, 99, 235, 0.3);
        }

        .pill-prime {
          background: linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(249, 115, 22, 0.2));
          color: #fcd34d;
          border: 1px solid rgba(245, 158, 11, 0.3);
          animation: primeGlow 2s ease-in-out infinite;
        }

        @keyframes primeGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(245, 158, 11, 0); }
          50% { box-shadow: 0 0 20px 0 rgba(245, 158, 11, 0.3); }
        }

        .pill-verified {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(22, 163, 74, 0.2));
          color: #86efac;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        /* Product Title */
        .product-title {
          font-size: 2.5rem;
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -1px;
          margin: 0;
        }

        .title-text {
          background: linear-gradient(135deg, #fff 0%, #e2e8f0 50%, #fff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: titleShine 3s linear infinite;
        }

        @keyframes titleShine {
          to { background-position: 200% center; }
        }

        /* Verdict Box */
        .verdict-box {
          background: linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(14, 165, 233, 0.05));
          border: 1px solid rgba(37, 99, 235, 0.2);
          border-radius: 20px;
          padding: 1.5rem;
        }

        .verdict-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 12px;
        }

        .verdict-icon {
          font-size: 20px;
          animation: brainPulse 2s ease-in-out infinite;
        }

        @keyframes brainPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .verdict-label {
          font-size: 12px;
          font-weight: 700;
          color: #93c5fd;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .verdict-badge {
          margin-left: auto;
          font-size: 9px;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.5);
          background: rgba(255, 255, 255, 0.05);
          padding: 4px 10px;
          border-radius: 100px;
        }

        .verdict-text {
          font-size: 15px;
          line-height: 1.7;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        /* Benefits Marquee */
        .benefits-marquee {
          overflow: hidden;
          mask-image: linear-gradient(90deg, transparent, white 10%, white 90%, transparent);
        }

        .marquee-track {
          display: flex;
          gap: 2rem;
          animation: marquee 20s linear infinite;
        }

        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        .benefit-item {
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
        }

        .benefit-check {
          color: #22c55e;
          font-weight: bold;
        }

        /* Action Cell */
        .amz-action-cell {
          grid-column: 1 / -1;
          padding: 2rem 3rem;
          background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.3));
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
        }

        /* Price Display */
        .price-display {
          text-align: left;
        }

        .price-label {
          font-size: 10px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .price-value {
          display: flex;
          align-items: flex-start;
          gap: 4px;
        }

        .price-currency {
          font-size: 24px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 8px;
        }

        .price-amount {
          font-size: 56px;
          font-weight: 900;
          background: linear-gradient(135deg, #fff, #fcd34d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1;
        }

        .savings-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 700;
          color: #fcd34d;
          margin-top: 8px;
          animation: savingsPulse 1.5s ease-in-out infinite;
        }

        @keyframes savingsPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }

        /* Hyper CTA Button */
        .hyper-cta {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 24px 48px;
          border-radius: 16px;
          text-decoration: none;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.3s;
        }

        .hyper-cta:hover {
          transform: scale(1.05);
        }

        .hyper-cta:active {
          transform: scale(0.98);
        }

        .cta-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #2563eb, #0ea5e9);
          transition: opacity 0.3s;
        }

        .cta-glow {
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #2563eb, #0ea5e9, #f59e0b, #2563eb);
          background-size: 300% 300%;
          animation: ctaGlow 4s linear infinite;
          filter: blur(15px);
          opacity: 0.5;
          z-index: -1;
        }

        .hyper-cta:hover .cta-glow {
          opacity: 0.8;
        }

        @keyframes ctaGlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .cta-text {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 16px;
          font-weight: 800;
          color: white;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .cta-arrow {
          display: inline-block;
          transition: transform 0.3s;
        }

        .hyper-cta:hover .cta-arrow {
          transform: translateX(5px);
        }

        .cta-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s;
        }

        .hyper-cta:hover .cta-shine {
          left: 100%;
        }

        /* Trust Row */
        .trust-row {
          display: flex;
          gap: 1.5rem;
        }

        .trust-item {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.5);
          transition: color 0.3s;
        }

        .trust-item:hover {
          color: rgba(255, 255, 255, 0.8);
        }

        /* Confetti */
        .confetti-container {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
          z-index: 100;
        }

        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          background: linear-gradient(135deg, var(--accent-1), var(--accent-2));
          top: 50%;
          left: 50%;
          animation: confettiBurst 1s ease-out forwards;
          animation-delay: calc(var(--i) * 0.02s);
        }

        @keyframes confettiBurst {
          0% {
            transform: translate(0, 0) rotate(0deg) scale(0);
            opacity: 1;
          }
          100% {
            transform: 
              translate(
                calc((var(--i) - 25) * 20px), 
                calc((var(--i) - 25) * -20px + 200px)
              ) 
              rotate(720deg) 
              scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default PremiumProductBox;
