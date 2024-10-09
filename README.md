# consumer-template
A React Native Expo template for creating consumer apps on solana with ease.

## what's included?
With a simple git clone, you're ready to go with:  
- simple signups with email OTPs via [Magic.link](https://magic.link/)  
- invisible non-custodial wallets  
- secure private key exports  
- web3.js setup for onchain actions  
- onboarding that handles notifications and invites  
- snappy UI with native apps for iOS and Android  

- [Moonpay](https://www.moonpay.com/en-gb) for on-ramping is in the works

## setup

### magic.link
- [sign up to magic.link](https://dashboard.magic.link/login?startWith=developer)
- create new app
- network: solana mainnet/devnet
- copy the publishable api key

### Solana RPCs
I recommend https://helius.dev/ 

## Config
Rename .env.example to .env and fill in the values

## Running locally
```bash
bun install
bun start
```
Scan the QR code printed in the console with [Expo Go](https://expo.dev/go) (Android) or the Camera app (iOS) (you need to have expo go installed). 

#### Project Structure
I use this for telling LLMs how stuff is structured so they can be more accurate in their responses. You can regenerate this on Windows with this command:
```bash
# delete node_modules and .expo
bun nuke
tree /F
```

magic-link-template
│   .env
│   .env.example
│   .gitignore
│   app.json
│   babel.config.js
│   bun.lockb
│   expo-env.d.ts
│   metro.config.js
│   package-lock.json
│   package.json
│   README.md
│   tsconfig.json
├───app
│   │   +not-found.tsx
│   │   index.tsx
│   │   onboarding.tsx
│   │   polyfills.js
│   │   _layout.tsx
│   ├───(auth)
│   │       login.tsx
│   └───(tabs)
│           index.tsx
│           wallet.tsx
│           _layout.tsx
├───assets
│   ├───fonts
│   │       SpaceMono-Regular.ttf
│   │
│   └───images
│           adaptive-icon.png
│           favicon.png
│           icon.png
│           partial-react-logo.png
│           react-logo.png
│           react-logo@2x.png
│           react-logo@3x.png
│           splash.png
│
├───components
│     Collapsible.tsx
│     ExternalLink.tsx
│     HelloWave.tsx
│     ParallaxScrollView.tsx
│     Splash.tsx
│     ThemedText.tsx
│     ThemedView.tsx
├───config
│       magic.ts
│
├───constants
│       Colors.ts
│
├───contexts
│       UserContext.tsx
│
├───hooks
│       useColorScheme.ts
│       useColorScheme.web.ts
│       useThemeColor.ts
│
└───utils
        network.ts
        resetState.ts
        signAndSendTx.ts
        storage.ts

