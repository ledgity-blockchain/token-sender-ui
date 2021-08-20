import { ButtonProps, message, Space, Typography } from 'antd';
import { ContractTransaction } from 'ethers';
import React, { FC, useState } from 'react';
import { formatRPCError } from '../utils';
import { BrandButton } from './BrandButton';

type Props = Omit<ButtonProps, 'onClick'> & {
  onClick: () => Promise<ContractTransaction>;
};

export const TransactionButton: FC<Props> = ({ onClick, ...props }) => {
  const [tx, setTx] = useState<ContractTransaction>();
  return (
    <Space direction="vertical">
      <BrandButton
        {...props}
        onClick={async () => {
          try {
            const tx = await onClick();
            setTx(tx);
            await tx.wait();
          } catch (e) {
            message.error(formatRPCError(e));
          }
        }}
      />
      {tx && <Typography.Text>Transaction: {tx.hash}</Typography.Text>}
    </Space>
  );
};
