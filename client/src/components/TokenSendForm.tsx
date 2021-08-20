import { MaxUint256 } from '@ethersproject/constants';
import { message, Modal, Space, Table, Typography } from 'antd';
import { BigNumber, ContractTransaction, ethers } from 'ethers';
import { Formik } from 'formik';
import { Form, Input, SubmitButton } from 'formik-antd';
import Papa from 'papaparse';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Web3State } from '../getWeb3';
import { formatRPCError } from '../utils';
import { BrandButton } from './BrandButton';
import { TransactionButton } from './TransactionButton';

type Props = {
  web3: Web3State;
  decimals: number;
};

export const TokenSendForm: FC<Props> = ({
  web3: { networkName, provider, tokenSender, token },
  decimals,
}) => {
  const signer = provider.getSigner();
  const [needsApproval, setNeedsApproval] = useState(true);
  const [amountsSum, setAmountsSum] = useState(BigNumber.from(0));
  const [tokenInfo, setTokenInfo] =
    useState<{ name: string; symbol: string }>();
  useEffect(() => {
    (async () => {
      try {
        const [name, symbol] = await Promise.all([
          token.name(),
          token.symbol(),
        ]);
        setTokenInfo({ name, symbol });
      } catch (e) {
        message.error(formatRPCError(e));
      }
    })();
  }, [token]);
  const [allowance, setAllowance] = useState<BigNumber>();
  const checkAllowance = useCallback(async () => {
    try {
      const allowance = await token.allowance(
        await signer.getAddress(),
        tokenSender.address,
      );
      setAllowance(allowance);
      setNeedsApproval(allowance.lt(amountsSum));
    } catch (e) {
      message.error(formatRPCError(e));
    }
  }, [amountsSum, signer, token, tokenSender.address]);
  useEffect(() => {
    checkAllowance();
  }, [checkAllowance]);
  const [tx, setTx] = useState<ContractTransaction>();
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Typography.Title>Token Sender</Typography.Title>
      <Typography.Text>Network: {networkName}</Typography.Text>
      <Typography.Text>Name: {tokenInfo?.name}</Typography.Text>
      <Typography.Text>Symbol: {tokenInfo?.symbol}</Typography.Text>
      <Typography.Text>Decimals: {decimals}</Typography.Text>
      <Typography.Text>Contract address: {token.address}</Typography.Text>
      <Formik
        initialValues={{ data: '' }}
        isInitialValid={false}
        onSubmit={async ({ data }) => {
          try {
            const [addresses, amounts] = parseAddressesAmounts(data, decimals);
            await new Promise<void>((resolve, reject) =>
              Modal.confirm({
                width: 'auto',
                centered: true,
                onOk: () => {
                  resolve();
                },
                onCancel: () => {
                  reject();
                },
                title:
                  'Are you sure you want to send tokens to these addresses with these amounts?',
                content: (
                  <Table
                    columns={[
                      {
                        title: 'Address',
                        dataIndex: 'address',
                        key: 'address',
                      },
                      {
                        title: `Amount ${tokenInfo?.symbol ?? ''}`,
                        dataIndex: 'amount',
                        key: 'amount',
                      },
                    ]}
                    dataSource={addresses.map((address, i) => ({
                      key: `${address}-${i}`,
                      i,
                      address,
                      amount: ethers.utils.formatUnits(amounts[i], decimals),
                    }))}
                  />
                ),
              }),
            );
            const tx = await tokenSender.bulkSend(
              token.address,
              addresses,
              amounts,
            );
            setTx(tx);
            await tx.wait();
          } catch (e) {
            message.error(formatRPCError(e));
          }
        }}
      >
        {({ errors, isSubmitting, isValid }) => (
          <Form>
            <p>
              <label>
                Addresses and amounts separated with TAB or space characters
              </label>
              <Input.TextArea
                name="data"
                rows={10}
                placeholder="address1	amount1
address2	amount2
address3	amount3
..."
                validate={(data) => {
                  try {
                    parseAddressesAmounts(data, decimals);
                  } catch (e) {
                    return e.message;
                  }
                }}
                onInput={(e) => {
                  try {
                    const [, amounts] = parseAddressesAmounts(
                      e.currentTarget.value,
                      decimals,
                    );
                    setAmountsSum(
                      amounts.reduce((s, x) => s.add(x), BigNumber.from(0)),
                    );
                  } catch {}
                }}
              />
              {errors.data && (
                <Typography.Text type="danger">{errors.data}</Typography.Text>
              )}
            </p>
            <Space direction="vertical">
              {needsApproval && (
                <p>
                  Current approval:{' '}
                  {!allowance
                    ? 'Loading...'
                    : ethers.utils.formatUnits(allowance, decimals)}
                  , needed: {ethers.utils.formatUnits(amountsSum, decimals)}
                </p>
              )}
              <TransactionButton
                disabled={!isValid || isSubmitting || !needsApproval}
                onClick={async () => {
                  const spender = tokenSender.address;
                  const useExact = await token.estimateGas
                    .approve(spender, MaxUint256)
                    .then(() => false)
                    .catch(() => true);
                  return await token.approve(
                    spender,
                    useExact ? amountsSum : MaxUint256,
                  );
                }}
              >
                Approve {tokenInfo?.symbol}
              </TransactionButton>
              <BrandButton onClick={checkAllowance}>
                Check approval (click after you've approved{' '}
                {tokenInfo?.symbol ?? 'tokens'})
              </BrandButton>
              <Space direction="vertical">
                <SubmitButton
                  disabled={!isValid || isSubmitting || needsApproval}
                >
                  Send tokens
                </SubmitButton>
                {tx && <p>Transaction: {tx.hash}</p>}
              </Space>
            </Space>
          </Form>
        )}
      </Formik>
    </Space>
  );
};

const parseAddressesAmounts = (s: string, decimals: number) => {
  s = s
    .trim()
    .split('\n')
    .map((row) => row.replaceAll(/[\s\t]+/g, '\t'))
    .join('\n');
  const csv = Papa.parse<[string, string]>(s, { delimiter: '\t' });
  const error = csv.errors[0];
  if (error) {
    throw new Error(`Error on row ${error.row} ${error.message}`);
  }
  const addresses = [];
  const amounts = [];
  for (let [address = '', amount = ''] of csv.data) {
    address = address.trim();
    if (!ethers.utils.isAddress(address)) {
      throw new Error(`Invalid address "${address}"`);
    }
    addresses.push(address);

    amount = amount.trim().replaceAll(',', '');
    try {
      amounts.push(ethers.utils.parseUnits(amount, decimals));
    } catch (e) {
      throw new Error(`Invalid amount "${amount}"`);
    }
  }
  if (addresses.length === 0) {
    throw Error('Enter at least one address');
  }
  return [addresses, amounts] as const;
};
