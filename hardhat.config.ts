import '@nomiclabs/hardhat-ethers';
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import 'hardhat-deploy';
import { HardhatUserConfig } from 'hardhat/config';
import 'solidity-coverage';
import { ROPSTEN_PROVIDER_URL, TEST_PRIVATE_KEY } from './env';

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
  },
  namedAccounts: typedNamedAccounts({
    deployer: {
      localhost: 0,
      ropsten: 0,
    },
  }),
};

export default config;
