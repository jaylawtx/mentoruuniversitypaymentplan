const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  // Handle subscription events
  switch (stripeEvent.type) {
    case 'invoice.payment_succeeded':
      console.log('Payment for subscription succeeded.');
      break;
    case 'invoice.payment_failed':
      console.log('Payment for subscription failed.');
      break;
    case 'customer.subscription.created':
      console.log('Subscription created successfully.');
      break;
    case 'customer.subscription.deleted':
      console.log('Subscription canceled or expired.');
      break;
    default:
      console.log(`Unhandled event type ${stripeEvent.type}`);
  }

  return { statusCode: 200, body: 'Event received' };
};
