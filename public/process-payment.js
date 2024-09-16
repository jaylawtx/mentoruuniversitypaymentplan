{\rtf1\ansi\ansicpg1252\cocoartf2761
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);\
\
exports.handler = async (event) => \{\
  const \{ email, paymentMethodId, depositAmount, totalAmount \} = JSON.parse(event.body);\
\
  try \{\
    // Create customer if it doesn't exist\
    const customer = await stripe.customers.create(\{\
      email: email,\
      payment_method: paymentMethodId,\
      invoice_settings: \{\
        default_payment_method: paymentMethodId\
      \}\
    \});\
\
    // Step 1: Charge the deposit\
    const depositPayment = await stripe.paymentIntents.create(\{\
      amount: depositAmount, // in cents, so $500 deposit would be 50000\
      currency: 'usd',\
      customer: customer.id,\
      payment_method: paymentMethodId,\
      confirm: true\
    \});\
\
    // Step 2: Calculate the remaining balance and set up a subscription\
    const remainingBalance = totalAmount - depositAmount; // Example: total $2080 - $500 deposit = $1580\
\
    // Create subscription\
    const subscription = await stripe.subscriptions.create(\{\
      customer: customer.id,\
      items: [\
        \{\
          price_data: \{\
            currency: 'usd',\
            product: process.env.STRIPE_PRODUCT_ID, // Same product ID for the full amount\
            recurring: \{\
              interval: 'month', // Adjust the subscription interval as needed\
            \},\
            unit_amount: remainingBalance / 6, // Divide remaining balance over 6 months or adjust as needed\
          \},\
        \},\
      ],\
      expand: ['latest_invoice.payment_intent'],\
    \});\
\
    return \{\
      statusCode: 200,\
      body: JSON.stringify(\{ subscriptionId: subscription.id, depositPayment \}),\
    \};\
  \} catch (error) \{\
    return \{\
      statusCode: 400,\
      body: JSON.stringify(\{ error: error.message \}),\
    \};\
  \}\
\};\
}