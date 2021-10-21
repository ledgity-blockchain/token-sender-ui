import deployments from './deployments.json';

const MAINNET_ID = 1;
const BSC_MAINNET_ID = 56;
const ROPSTEN_ID = 3;
const config = {
  networks: {
    [MAINNET_ID]: {
      networkName: 'Mainnet',
      addresses: {
        TokenSender: deployments[1].main.contracts.TokenSender.address,
        Token: '0x85Ffb35957203dfD12061eAeCD708dB623Bd567C',
      },
    },
    [BSC_MAINNET_ID]: {
      networkName: 'Binance Smart Chain Mainnet',
      addresses: {
        TokenSender: deployments[56].bscmainnet.contracts.TokenSender.address,
        Token: '0x0cBE5C4F318035b866AAcFaf7D018FB4C5F920F3',
      },
    },
    [ROPSTEN_ID]: {
      networkName: 'Ropsten',
      addresses: {
        TokenSender: deployments[3].ropsten.contracts.TokenSender.address,
        Token: '0x828C3d46D494bA4b8fB854BfE0fe4C83f314a845',
      },
    },
  },
};
export default config;
