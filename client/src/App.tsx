import { Alert, message, Spin } from 'antd';
import React, { FC, useEffect, useState } from 'react';
import { TokenSendForm } from './components/TokenSendForm';
import { getWeb3, Web3State } from './getWeb3';
import { formatRPCError } from './utils';

export const App: FC = () => {
  const [web3, setWeb3] = useState<Web3State>();
  useEffect(() => {
    if (web3) {
      return;
    }
    (async () => {
      try {
        setWeb3(await getWeb3());
      } catch (e) {
        formatRPCError(e);
        return;
      }
    })();
  }, [web3]);
  const [decimals, setDecimals] = useState<number>();
  useEffect(() => {
    (async () => {
      if (!web3) {
        return;
      }
      try {
        setDecimals(await web3.token.decimals());
      } catch (e) {
        message.error(formatRPCError(e));
      }
    })();
  }, [web3]);
  if (!web3) {
    return <Alert type="error" message="Please, install metamask" />;
  }
  if (!decimals) {
    return <Spin>Fetching token decimals</Spin>;
  }
  return <TokenSendForm web3={web3} decimals={decimals} />;
};
