import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-deploy';
import { HardhatUserConfig } from 'hardhat/config';
import 'solidity-coverage';
import {
  BSC_PRIVATE_KEY,
  MAINNET_PRIVATE_KEY,
  MAINNET_PROVIDER_URL,
  ROPSTEN_PROVIDER_URL,
  TEST_PRIVATE_KEY,
} from './env';

function typedNamedAccounts<T>(namedAccounts: { [key in string]: T }) {
  return namedAccounts;
}

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localhost: {
      accounts: [TEST_PRIVATE_KEY],
      gasPrice: 34 * 1000000000,
    },
    ropsten: {
      url: ROPSTEN_PROVIDER_URL,
      chainId: 3,
      accounts: [TEST_PRIVATE_KEY],
      gasPrice: 34 * 1000000000,
    },
    main: {
      url: MAINNET_PROVIDER_URL,
      chainId: 1,
      accounts: [MAINNET_PRIVATE_KEY],
      gasPrice: 30000000000,
    },
    bscmainnet: {
      url: 'https://bsc-dataseed.binance.org/',
      chainId: 56,
      accounts: [BSC_PRIVATE_KEY],
      gasPrice: 5000000000,
    },
    bsctestnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: 97,
      accounts: [TEST_PRIVATE_KEY],
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: 'TVHC8TX5TTYPBQFQ5E9GWT8QN74CSK5T3H',
  },
  namedAccounts: typedNamedAccounts({
    deployer: 0,
  }),
};

export default config;
