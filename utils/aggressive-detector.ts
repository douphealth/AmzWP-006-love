import { AppConfig, ProductDetails, DeploymentMode, FAQItem } from '../types';
import { hashString } from '../utils';

interface Phase1Product {
  name: string;
  asin?: string;
  sourceType: string;
  confidence: number;
}

export async function detectProductsAggressively(
  title: string,
  content: string,
  extractProductsPhase1: (html: string, cleanText: string) => Phase1Product[],
  searchAmazonProduct: (query: string, apiKey: string) => Promise<Partial<ProductDetails>>,
  fetchProductByASIN: (asin: string, apiKey: string) => Promise<ProductDetails | null>,
  generateDefaultVerdict: (title: string) => string,
  generateDefaultClaims: () => string[],
  generateDefaultFaqs: (title: string) => FAQItem[],
  sleep: (ms: number) => Promise<void>,
  config: AppConfig
): Promise<ProductDetails[]> {
  const cleanContent = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

  // Phase 1: Pattern detection
  const phase1Products = extractProductsPhase1(content, cleanContent);

  if (!config.serpApiKey) {
    return [];
  }

  const products: ProductDetails[] = [];
  const maxProducts = 10;

  for (let i = 0; i < Math.min(phase1Products.length, maxProducts); i++) {
    const p1 = phase1Products[i];

    try {
      let productData: Partial<ProductDetails> = {};

      // Try ASIN first if available
      if (p1.asin) {
        try {
          const result = await fetchProductByASIN(p1.asin, config.serpApiKey);
          if (result) {
            productData = result;
          }
        } catch (err: unknown) {
          // ASIN fetch failed, will try search next
        }
      }

      // Try search if no ASIN or ASIN failed
      if (!productData.asin) {
        try {
          productData = await searchAmazonProduct(p1.name, config.serpApiKey);
        } catch (err: unknown) {
          // Search failed
        }
      }

      const hasAsin = !!productData.asin;
      const hasImage = !!productData.imageUrl;
      const hasPrice = productData.price && productData.price !== '$XX.XX';

      if (hasAsin) {
        const productTitle = productData.title || p1.name;
        products.push({
          id: `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: productTitle,
          asin: productData.asin || '',
          price: hasPrice ? productData.price! : 'See Price',
          imageUrl: hasImage ? productData.imageUrl! : `https://images-na.ssl-images-amazon.com/images/P/${productData.asin}.01._SCLZZZZZZZ_.jpg`,
          rating: productData.rating || 4.5,
          reviewCount: productData.reviewCount || 0,
          verdict: generateDefaultVerdict(productTitle),
          evidenceClaims: generateDefaultClaims(),
          brand: productData.brand || '',
          category: 'General',
          prime: productData.prime ?? true,
          insertionIndex: 0,
          deploymentMode: 'ELITE_BENTO' as DeploymentMode,
          faqs: generateDefaultFaqs(productTitle),
          specs: {},
          confidence: p1.confidence,
        });
      }

      // Rate limiting
      if (i < Math.min(phase1Products.length, maxProducts) - 1) {
        await sleep(200);
      }
    } catch (err: unknown) {
      // Error processing product, continue to next
    }
  }

  return products;
}
