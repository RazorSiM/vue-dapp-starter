/// <reference types="vue/macros-global" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_ALCHEMY_KEY: string;
  VITE_INFURA_KEY: string;

  VITE_ETHERSCAN_KEY: string;

  VITE_PROVIDER_NETWORK: string;
}
