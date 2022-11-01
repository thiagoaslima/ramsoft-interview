import { FC, useCallback, FormEvent, useRef } from 'react';
import styled from '@emotion/styled';
import { Button, ClickAwayListener, Grid, IconButton, Paper, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { isString } from '@lib/is';

import { useToggle } from '@hooks/useToggle';
import { useTasks } from '@providers/TaskProvider';

const Container = styled.div`
  padding: 10px 20px;
`;

const useTaskComposer = () => {
  const { createTask } = useTasks();
  const [isOpen, { open, close }] = useToggle();

  const submit = useCallback(
    (formData: { title: string }, event: FormEvent<HTMLFormElement>) => {
      const result = createTask(formData);

      if (result.success) {
        event.currentTarget.reset();
      }
    },
    [createTask],
  );

  return [
    isOpen,
    {
      open,
      close,
      submit,
    },
  ] as const;
};

interface OpenTaskComposerProps {
  close: VoidFunction;
  submit: (formData: { title: string }, event: FormEvent<HTMLFormElement>) => void;
}

const OpenTaskComposer: FC<OpenTaskComposerProps> = ({ close, submit }) => {
  const submitRef = useRef(submit);

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get('title');
    if (isString(title)) {
      submitRef.current({ title }, event);
    }
  }, []);

  return (
    <ClickAwayListener onClickAway={close}>
      <Container>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Paper>
              <form id="task-composer" noValidate onSubmit={handleSubmit}>
                <TextField fullWidth type="text" id="title" name="title" />
              </form>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Button type="submit" form="task-composer" variant="contained">
              Add task
            </Button>
          </Grid>
          <Grid item xs={2}>
            <IconButton onClick={close}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Container>
    </ClickAwayListener>
  );
};

export const TaskComposer: FC = () => {
  const [isOpen, { open, close, submit }] = useTaskComposer();

  if (isOpen) {
    return <OpenTaskComposer close={close} submit={submit} />;
  }

  return (
    <Button fullWidth startIcon={<AddIcon />} onClick={open}>
      Add task
    </Button>
  );
};
