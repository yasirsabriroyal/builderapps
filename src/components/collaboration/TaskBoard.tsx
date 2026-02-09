import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import {
  DndContext,
  type DragEndEvent,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Add as AddIcon } from '@mui/icons-material';
import { TaskCard } from './TaskCard';
import type { Task, TaskStatus } from '../../types';

interface TaskBoardProps {
  tasks: Task[];
  onTaskMove: (taskId: string, newStatus: TaskStatus) => void;
  onAddTask: (status: TaskStatus) => void;
}

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in-progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onTaskMove, onAddTask }) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const task = tasks.find((t) => t.id === taskId);

    if (!task) return;

    // Check if dropped over a column
    const targetColumn = COLUMNS.find((col) => over.id === col.id);
    if (targetColumn && task.status !== targetColumn.id) {
      onTaskMove(taskId, targetColumn.id);
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Task Board
      </Typography>
      <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
        <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
          {COLUMNS.map((column) => {
            const columnTasks = getTasksByStatus(column.id);
            return (
              <Box
                key={column.id}
                id={column.id}
                sx={{
                  minWidth: 280,
                  flex: 1,
                  backgroundColor: 'background.default',
                  borderRadius: 1,
                  p: 2,
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle2">
                    {column.title} ({columnTasks.length})
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => onAddTask(column.id)}
                  >
                    Add
                  </Button>
                </Box>
                <SortableContext
                  items={columnTasks.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                  id={column.id}
                >
                  <Box sx={{ minHeight: 200 }}>
                    {columnTasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </Box>
                </SortableContext>
              </Box>
            );
          })}
        </Box>
        <DragOverlay>
          {null}
        </DragOverlay>
      </DndContext>
    </Paper>
  );
};
