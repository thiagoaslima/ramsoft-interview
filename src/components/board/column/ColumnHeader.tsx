import { FC, ReactNode } from 'react';
import { Typography } from '@mui/material';
import styled from '@emotion/styled';

const Header = styled.header`
  padding: 10px 20px 0;
`;

interface ColumnHeaderProps {
  children: ReactNode;
}

export const ColumnHeader: FC<ColumnHeaderProps> = ({ children }) => {
  return (
    <Header>
      <Typography align="center" variant="h6" gutterBottom>
        <strong>{children}</strong>
      </Typography>
    </Header>
  );
};
