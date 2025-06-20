import React from 'react';
import styled from 'styled-components';
import { Task } from '@/types/task';

const ListContainer = styled.div`
  display: grid;
  gap: 1rem;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
`;

const TaskCard = styled.div<{ $priority: string; $completed: boolean }>`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => {
    if (props.$completed) return '#6b7280';
    switch (props.$priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      default: return '#10b981';
    }
  }};
  opacity: ${props => props.$completed ? '0.7' : '1'};
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  }

  @media (max-width: 768px) {
    margin: 0 1rem;
  }
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
`;

const TaskTitle = styled.h3<{ $completed: boolean }>`
  margin: 0;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
  word-break: break-word;
`;

const PriorityBadge = styled.span<{ $priority: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
  background: ${props => {
    switch (props.$priority) {
      case 'high': return '#fee2e2';
      case 'medium': return '#fef3c7';
      default: return '#d1fae5';
    }
  }};
  color: ${props => {
    switch (props.$priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#d97706';
      default: return '#059669';
    }
  }};
`;

const TaskDescription = styled.p<{ $completed: boolean }>`
  color: #6b7280;
  margin: 0 0 1rem 0;
  line-height: 1.5;
  text-decoration: ${props => props.$completed ? 'line-through' : 'none'};
`;

const TaskFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const TaskDate = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button<{ $variant: 'complete' | 'delete' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${props => props.$variant === 'complete' ? `
    background: #10b981;
    color: white;
    
    &:hover {
      background: #059669;
    }
  ` : `
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
    }
  `}

  &:active {
    transform: scale(0.95);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: #6b7280;
  grid-column: 1 / -1;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onToggleComplete, 
  onDeleteTask 
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (tasks.length === 0) {
    return (
      <EmptyState>
        <EmptyIcon>📝</EmptyIcon>
        <h3>No tasks yet</h3>
        <p>Create your first task to get started!</p>
      </EmptyState>
    );
  }

  return (
    <ListContainer>
      {tasks.map((task) => (
        <TaskCard 
          key={task.id} 
          $priority={task.priority} 
          $completed={task.completed}
        >
          <TaskHeader>
            <TaskTitle $completed={task.completed}>
              {task.title}
            </TaskTitle>
            <PriorityBadge $priority={task.priority}>
              {task.priority}
            </PriorityBadge>
          </TaskHeader>
          
          <TaskDescription $completed={task.completed}>
            {task.description}
          </TaskDescription>
          
          <TaskFooter>
            <TaskDate>
              {formatDate(task.createdAt)}
            </TaskDate>
            <ButtonGroup>
              <ActionButton 
                $variant="complete"
                onClick={() => onToggleComplete(task.id)}
              >
                {task.completed ? 'Undo' : 'Complete'}
              </ActionButton>
              <ActionButton 
                $variant="delete"
                onClick={() => onDeleteTask(task.id)}
              >
                Delete
              </ActionButton>
            </ButtonGroup>
          </TaskFooter>
        </TaskCard>
      ))}
    </ListContainer>
  );
};
