{\rtf1\ansi\ansicpg1252\cocoartf2761
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 require('dotenv').config();\
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);\
\
exports.handler = async (event, context) => \{\
  try \{\
    const \{ amount \} = JSON.parse(event.body);\
\
    // Create a PaymentIntent with the specified amount\
    const paymentIntent = await stripe.paymentIntents.create(\{\
      amount: amount,\
      currency: 'usd',\
    \});\
\
    return \{\
      statusCode: 200,\
      body: JSON.stringify(\{\
        clientSecret: paymentIntent.client_secret,\
      \}),\
    \};\
  \} catch (error) \{\
    return \{\
      statusCode: 500,\
      body: JSON.stringify(\{ error: error.message \}),\
    \};\
  \}\
\};\
}