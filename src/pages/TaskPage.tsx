import { FC, useMemo, useCallback } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { Button, TextField } from '@mui/material';

import { isUUID } from '@domain/primitives/uuid';
import { useTasks } from '@providers/TaskProvider';
import { TaskForm } from '@components/task/TaskForm';
import { TaskModal } from '@components/task/TaskModal';
import { TASK_FORM_ID } from '../components/task/TaskForm';

const Footer = styled.footer`
  width: 100%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
`;

const useTaskPage = () => {
  const navigate = useNavigate();
  const { taskId } = useParams<{ taskId: string }>();
  const { getTask, updateTaskContent, removeTask } = useTasks();

  const task = useMemo(() => {
    if (isUUID(taskId)) {
      return getTask(taskId);
    }
    return null;
  }, [getTask, taskId]);

  const onClose = useCallback(() => {
    navigate('..', { relative: 'route' });
  }, [navigate]);

  const onSubmit = useCallback(
    (formData: { title: string; description?: string }) => {
      if (task) {
        updateTaskContent(task.id, formData);
        onClose();
      }
    },
    [onClose, task, updateTaskContent],
  );

  const onDelete = useCallback(() => {
    if (task) {
      removeTask(task.id);
      onClose();
    }
  }, [onClose, removeTask, task]);

  return {
    task,
    onClose,
    onSubmit,
    onDelete,
  };
};

export const TaskPage: FC = () => {
  const { task, onClose, onSubmit, onDelete } = useTaskPage();

  // This should present some error, but I have no time to do it :)
  if (!task) {
    return <Navigate to=".." relative="route" />;
  }
  return (
    <section data-testid="task-page">
      <TaskModal
        open={true}
        onClose={onClose}
        header={
          <TextField
            fullWidth
            label="Title"
            id="title"
            name="title"
            variant="standard"
            inputProps={{ form: TASK_FORM_ID }}
            defaultValue={task.title}
          />
        }
        content={<TaskForm task={task} onSubmit={onSubmit} />}
        footer={
          <Footer>
            <Button variant="text" type="button" onClick={onDelete}>
              Delete
            </Button>
            <Button variant="contained" type="submit" form={TASK_FORM_ID}>
              Save
            </Button>
          </Footer>
        }
      ></TaskModal>
    </section>
  );
};
