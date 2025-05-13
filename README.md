# Odia speech-to-speech demo
This is a proof of concept for the Speec-to-Speech app created with React + Vite

## HOW TO RUN THE DEMO

> [!NOTE]
> Pre-requisite : you will need a subscription/api key from [sarvam.ai](https://dashboard.sarvam.ai/)


- Step-1: Clone the repo (or in how ever way get it) and cd into it

```sh
git clone https://github.com/taufique-0105/sarvam-AI-Demo.git
cd sarvam-AI-Demo
```

- Step-2: rename the .env.example to .env
- Step-3: put your api key at the appropriate place like shown below

```js
VITE_SARVAM_API_KEY=<YOUR KEYS GOES HERE>
```

- Step-4: start dev sever
```sh
npm install --frozen-lockfile

# with out host option like this you will get CORS error
npm run dev -- --host
```

- Step-5: for preview and deployment

```sh
npm install --frozen-lockfile
npm run build
# this will put the output in the dist dir
# which can be used by other programs like nginx to serve the build

# to preview build
npm run preview -- --host
```

## React + Vite docs

This React template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## 