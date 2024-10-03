# consumer-template
an opinionated template for creating consumer apps on solana with ease

## what's included?
- [Moonpay](https://www.moonpay.com/en-gb) for on-ramping
- [Magic.link](https://magic.link/) for auth and wallets
- [AWS SES](https://aws.amazon.com/ses/) for email delivery
- [Cloudflare D1](https://www.cloudflare.com/products/d1/) as a user DB
- [Cloudflare Pages](https://pages.cloudflare.com/) for the frontend

## setup
### SES
set up your domain with SES, create new SMTP creds, copy over keys

update .dev.vars with:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY

update wrangler.toml with:
- AWS_REGION
- FROM_EMAIL