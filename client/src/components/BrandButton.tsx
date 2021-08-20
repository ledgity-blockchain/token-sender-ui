import { Button, ButtonProps } from 'antd';
import React, { FC, useState } from 'react';

type Props = Omit<ButtonProps, 'onClick'> & {
  onClick?: () => Promise<unknown> | unknown;
};

export const BrandButton: FC<Props> = ({ onClick, children, ...props }) => {
  const [loading, setLoading] = useState(false);
  return (
    <Button
      {...props}
      loading={props.loading || loading}
      onClick={async () => {
        if (!onClick) {
          return;
        }
        setLoading(true);
        try {
          await onClick();
        } finally {
          setLoading(false);
        }
      }}
    >
      {children}
    </Button>
  );
};
