# consumer-template
an opinionated template for creating consumer apps on solana with ease

## what's included?
- [Cloudflare Pages](https://pages.cloudflare.com/) for the frontend w/ React
- [Cloudflare D1](https://www.cloudflare.com/products/d1/) as a user DB
- [Moonpay](https://www.moonpay.com/en-gb) for on-ramping
- [Magic.link](https://magic.link/) for auth and wallets
- [AWS SES](https://aws.amazon.com/ses/) for email delivery

## other options
embedded wallets:
- https://usecapsule.com/ - need to request access, rn + expo sdk
- https://web3auth.io/docs/connect-blockchain/solana - no react native sdk, has web docs
- https://docs.reown.com/appkit/features/solana - no react native solana docs, decent react docs
- https://www.privy.io/ - has expo SDK, solana in beta: no onramps, no automatic wallet gen, no user recovery
- https://stytch.com/docs/guides/web3/api - no managed wallets lol
- 
- 


## setup

### magic.link
- [sign up to magic.link](https://dashboard.magic.link/login?startWith=developer)
- create new app
- network: solana mainnet
- copy the publishable api key

### SES
set up your domain with SES, create new SMTP creds, copy over keys

update .dev.vars with:
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY

update wrangler.toml with:
- AWS_REGION
- FROM_EMAIL
bunx make-magic \
    --template nextjs-solana-dedicated-wallet \
    --network solana-testnet \
    --publishable-api-key pk_live_8D60742D1796CE10 \
    --login-methods EmailOTP

# current subfolders
- awesome-magic-app: uses evm utils, only for version reference
- cloudflare-template: bun create cloudflare@latest 
- create-magic-app: git clone of bunx create-magic
- solana-template-magic-link: yarn dev-template from create-magic-app
