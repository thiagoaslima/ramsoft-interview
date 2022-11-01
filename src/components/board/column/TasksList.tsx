import { FC } from 'react';
import { List, ListItem, Paper, Typography } from '@mui/material';
import { Task } from '@domain/entities/Task';
import { generatePath, Link } from 'react-router-dom';

interface TaskListItemProps {
  task: Task;
}

const TaskListItem: FC<TaskListItemProps> = ({ task }) => {
  return (
    <Paper sx={{ width: '100%', padding: '10px' }}>
      <Link style={{ width: '100%' }} to={generatePath(':taskId', { taskId: task.id })}>
        <Typography variant="body1">{task.title}</Typography>
      </Link>
    </Paper>
  );
};

interface TasksListProps {
  tasks: Task[];
}

export const TasksList: FC<TasksListProps> = ({ tasks }) => {
  return (
    <List data-testid="tasks-list">
      {tasks.map((task) => (
        <ListItem key={task.id}>
          <TaskListItem task={task} />
        </ListItem>
      ))}
    </List>
  );
};
