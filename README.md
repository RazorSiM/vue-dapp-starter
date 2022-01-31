![Alt](https://repobeats.axiom.co/api/embed/be2d70a00d8f7df298a81e40b64bd8da7abb8458.svg "Repobeats analytics image")

# Vue3 dapp starter

My Vite starter template for fast prototyping on web3. If you want to try it:

`degit RazorSiM/vue-dapp-starter` 👽

`pnpm install`

# Included

Example of how to work on an Ethereum dApp on Vue3 by fetching some basic data.
**Metamask** implementation is partial but works fine with a global router guard.

Todo:

- [x] Better README
- [x] Implement event listener for account change
- [x] Implement event listener for network change
- [ ] Implement WalletConnect support
- [x] Basic smart contract interaction example

## Grapqhl integrations
This starter includes an automated codegen for grapqhl via `graphql-codegen` + `urql` to generate Typescript classes/interfaces and typed operations (queries, subscriptions etcetera);
this is expecially useful if your project needs to interact with a grapqhl endpoint like the ones provided by [The Graph Project](https://thegraph.com).

to use it you just need to:
- Add your grapqhl endpoint in the `.env` file via the `VITE_GRAPHQL_ENDPOINT`
- Write some grapqhl operations in the `src/graphql` folder
- Run `pnpm generate-graphql`

As this is generated code it isn't advised to put it in your github repository, instead it is better to run the codegen as part of the build process.

## Scaffolding

I've added an example on how you could use a multi layout approach for your project. There's also a "dark mode" toggler example using Tailwind features.
The project has the `refSugar` enabled by default, so you can use `$ref` and `$computed` inside your components. Remember to declare $ref and $computed as `variables` and not `constants`.

## Packages

- Windi CSS
- Vue Router because eventually you'll need it
- Pinia as a composable store
- Vueuse because it's super usefull
- Typescript, Code Style and Linters:
  - _eslint_ and _typescript-eslint_ **only** for linting and Typescript support. No formatting style crap;
  - _stylelyng_ used to check css styles;
  - _prettier_ is used to format the code. Much more faster than using prettier through eslint;

I tried to configure everything to work with:

- `Eslint` for linting errors in TS/Vue
- `Stylelint` for styles
- `Prettier` for code formatting
- `LeftHook` and Husky for pre-commit linting. You can extend the hook to do wathever you want.

## VSCode Integration

Clone the repo and install the recommended packages. Check the .vscode folder to know more about the settings. By default, when saving it will run Prettier format, Eslint and Stylelint.

## How to run it

First of all, install the dependencies: `npm install` or `yarn` or my latest preference: `pnpm install`.
Run `npm run dev` or `yarn dev` or `pnpm run dev` to start hacking.

In your `./package.json` `Script` section there are some useful commands configured, so check it out.

TODO:

- [x] Add ~~Vuex or~~ Pinia as store manager
- [ ] Optimize stylelint
