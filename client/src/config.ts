import deployments from './deployments.json';

const MAINNET_ID = 1;
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
