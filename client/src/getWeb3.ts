import detectProvider from '@metamask/detect-provider';
import { message } from 'antd';
import { ethers } from 'ethers';
import {
  ERC20,
  ERC20__factory,
  TokenSender,
  TokenSender__factory,
} from '../../typechain';
import config from './config';

export type Web3State = {
  networkName: string;
  provider: ethers.providers.Web3Provider;
  tokenSender: TokenSender;
  token: ERC20;
};

export async function getWeb3(): Promise<Web3State | undefined> {
  const p = (await detectProvider()) as any;
  if (!p) {
    message.error('Wallet not detected');
    return;
  }
  const provider = new ethers.providers.Web3Provider(p);

  try {
    await provider.provider.request!({
      method: 'eth_requestAccounts',
    });
  } catch (e) {
    message.error('Failed to connect to a wallet');
    return;
  }

  // TODO: don't require page reload when changing networks
  p.on('chainChanged', () => window.location.reload());

  const signer = provider.getSigner();
  const chainId = (await signer.getChainId()) as keyof typeof config.networks;
  if (!config.networks[chainId]) {
    message.error('Unsupported network');
    return;
  }
  const network = config.networks[chainId];
  return {
    networkName: network.networkName,
    provider,
    tokenSender: TokenSender__factory.connect(
      network.addresses.TokenSender,
      signer,
    ),
    token: ERC20__factory.connect(network.addresses.Token, signer),
  };
}
