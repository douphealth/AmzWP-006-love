
import React from 'react';
import { ComparisonData, ProductDetails } from '../types';

interface ComparisonTablePreviewProps {
  data: ComparisonData;
  products: ProductDetails[];
  affiliateTag: string;
}

export const ComparisonTablePreview: React.FC<ComparisonTablePreviewProps> = ({ data, products, affiliateTag }) => {
  const finalTag = (affiliateTag || "tag-20").trim();
  const sortedProducts = data.productIds
    .map(id => products.find(p => p.id === id))
    .filter(Boolean) as ProductDetails[];

  if (sortedProducts.length === 0) return null;

  return (
    <div className="w-full max-w-[1000px] mx-auto bg-white border border-slate-100 rounded-[32px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] overflow-hidden animate-fade-in my-10 font-sans">
      
      {/* Table Header */}
      <div className="bg-slate-900 px-8 py-5 flex items-center justify-between">
         <h3 className="text-white font-black uppercase tracking-[3px] text-xs md:text-sm">{data.title}</h3>
         <div className="flex gap-2">
             <span className="w-2 h-2 rounded-full bg-red-500"></span>
             <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
             <span className="w-2 h-2 rounded-full bg-green-500"></span>
         </div>
      </div>

      <div className="overflow-x-auto">
          <div className="min-w-[600px]">
              {/* Product Row */}
              <div className="grid grid-cols-3 divide-x divide-slate-100">
                  {sortedProducts.map((p, idx) => (
                      <div key={p.id} className="p-6 md:p-8 flex flex-col items-center text-center relative hover:bg-slate-50 transition-colors group">
                          {idx === 0 && (
                              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg z-10">
                                  Top Pick
                              </div>
                          )}
                          <div className="h-32 md:h-40 w-full flex items-center justify-center mb-6">
                              <img src={p.imageUrl} className="max-h-full max-w-full object-contain drop-shadow-lg group-hover:scale-110 transition-transform duration-300" alt={p.title} />
                          </div>
                          <h4 className="text-sm md:text-base font-black text-slate-900 leading-tight mb-2 line-clamp-2 min-h-[40px]">{p.title}</h4>
                          <div className="text-yellow-400 text-xs md:text-sm mb-4">{'★'.repeat(Math.round(p.rating))}</div>
                          <div className="text-2xl font-black text-slate-900 mb-4 tracking-tighter">{p.price}</div>
                          <a 
                            href={`https://www.amazon.com/dp/${p.asin}?tag=${finalTag}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-lg"
                          >
                            Check Price
                          </a>
                      </div>
                  ))}
              </div>

              {/* Specs Rows */}
              <div className="bg-slate-50/50">
                  {data.specs.map((specKey, sIdx) => (
                      <div key={specKey} className={`grid grid-cols-3 divide-x divide-slate-100 border-t border-slate-100 ${sIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                          {sortedProducts.map(p => (
                              <div key={p.id} className="p-4 text-center">
                                  <div className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">{specKey}</div>
                                  <div className="text-xs md:text-sm font-bold text-slate-700">{p.specs?.[specKey] || '-'}</div>
                              </div>
                          ))}
                      </div>
                  ))}
              </div>
          </div>
      </div>
    </div>
  );
};
