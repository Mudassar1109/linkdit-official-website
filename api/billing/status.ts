import { json, handleError, requireMethod } from '../_lib/http';
import { getPaymentProvider } from '../_lib/payments';

export const config = { runtime: 'edge' };

export default async function handler(request: Request): Promise<Response> {
  try {
    requireMethod(request, 'GET');
    const provider = getPaymentProvider();
    return json({
      provider: provider.key,
      configured: provider.isConfigured(),
      checkoutAvailable: provider.isConfigured(),
      testMode: provider.testMode,
      currency: 'usd',
      plans: {
        monthly: { amount_cents: 599, display: '$5.99' },
        yearly: { amount_cents: 4799, display: '$47.99', savings_cents: 2389 },
      },
    });
  } catch (error) {
    return handleError(error);
  }
}
