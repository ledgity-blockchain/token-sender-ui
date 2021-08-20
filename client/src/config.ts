import deployments from './deployments.json';

const ROPSTEN_ID = 3;
const config = {
  networks: {
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
