{\rtf1\ansi\ansicpg1252\cocoartf2761
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Load environment variables from .env file\
require('dotenv').config();\
\
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);\
const express = require('express');\
const app = express();\
\
// Use environment variable for the Stripe webhook secret\
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;\
\
app.post('/webhook', express.raw(\{ type: 'application/json' \}), (request, response) => \{\
  const sig = request.headers['stripe-signature'];\
\
  let event;\
\
  try \{\
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);\
  \} catch (err) \{\
    response.status(400).send(`Webhook Error: $\{err.message\}`);\
    return;\
  \}\
\
  // Handle the event\
  switch (event.type) \{\
    case 'payment_intent.succeeded':\
      const paymentIntentSucceeded = event.data.object;\
      console.log('PaymentIntent was successful!', paymentIntentSucceeded);\
      // Handle payment intent success here\
      break;\
\
    case 'invoice.created':\
      const invoiceCreated = event.data.object;\
      console.log('Invoice was created!', invoiceCreated);\
      // Handle invoice creation here\
      break;\
\
    case 'invoice.payment_succeeded':\
      const invoicePaymentSucceeded = event.data.object;\
      console.log('Invoice payment succeeded!', invoicePaymentSucceeded);\
      // Handle successful invoice payment here\
      break;\
\
    case 'customer.subscription.created':\
      const subscriptionCreated = event.data.object;\
      console.log('Subscription was created!', subscriptionCreated);\
      // Handle subscription creation here\
      break;\
\
    default:\
      console.log(`Unhandled event type $\{event.type\}`);\
  \}\
\
  // Return a 200 response to acknowledge receipt of the event\
  response.send();\
\});\
\
app.listen(4242, () => console.log('Running on port 4242'));\
}