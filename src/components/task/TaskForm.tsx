import { FC, FormEvent, useCallback, useRef } from 'react';
import { TextField } from '@mui/material';
import { Task } from '@domain/entities/Task';
import { isString } from '@lib/is';

interface TaskFormProps {
  task: Task;
  onSubmit: (formData: { title: string; description?: string }, event: FormEvent<HTMLFormElement>) => void;
}

export const TASK_FORM_ID = 'task-form';

export const TaskForm: FC<TaskFormProps> = ({ task, onSubmit }) => {
  const submitRef = useRef(onSubmit);

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const title = formData.get('title')?.toString();
    const description = formData.get('description')?.toString() || undefined;

    if (isString(title)) {
      submitRef.current({ title, description }, event);
    }
  }, []);

  return (
    <form id={TASK_FORM_ID} noValidate onSubmit={handleSubmit}>
      <TextField
        fullWidth
        label="Description"
        id="description"
        name="description"
        multiline
        minRows={3}
        defaultValue={task.description}
      />
    </form>
  );
};
