import { FC, ReactElement } from 'react';
import { Dialog, DialogActions, DialogContent, DialogProps, DialogTitle, styled } from '@mui/material';

interface TaskModalProps {
  open: boolean;
  onClose: DialogProps['onClose'];
  header: ReactElement;
  content: ReactElement;
  footer?: ReactElement;
}

const TaskDialog = styled(Dialog)`
  & .MuiDialog-paper {
    min-width: 500px;
  }
`;

export const TaskModal: FC<TaskModalProps> = ({ open, onClose, header, content, footer }) => {
  return (
    <TaskDialog open={open} onClose={onClose}>
      <DialogTitle>{header}</DialogTitle>
      <DialogContent>{content}</DialogContent>
      <DialogActions>{footer}</DialogActions>
    </TaskDialog>
  );
};
