'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Task, TaskFormData } from '@/types/task';
import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  color: white;
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.25rem;
  margin: 0;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div<{ $color: string }>`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-top: 4px solid ${props => props.$color};
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  color: #6b7280;
  font-weight: 500;
`;

const FilterContainer = styled.div`
  background: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    margin: 0 1rem 2rem 1rem;
    padding: 1rem;
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 0.5rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: ${props => props.$active ? '#3b82f6' : 'white'};
  color: ${props => props.$active ? 'white' : '#374151'};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    ${props => !props.$active && 'background: #f3f4f6;'}
  }
`;

type FilterType = 'all' | 'active' | 'completed';

export default function Home() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [filter, setFilter] = useState<FilterType>('all');

  const addTask = (taskData: TaskFormData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTaskComplete = (id: string) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'active':
        return !task.completed;
      case 'completed':
        return task.completed;
      default:
        return true;
    }
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
    highPriority: tasks.filter(t => t.priority === 'high' && !t.completed).length,
  };

  return (
    <AppContainer>
      <Container>
        <Header>
          <Title>Task Manager</Title>
          <Subtitle>Stay organized and productive</Subtitle>
        </Header>

        <StatsContainer>
          <StatCard $color="#3b82f6">
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Total Tasks</StatLabel>
          </StatCard>
          <StatCard $color="#10b981">
            <StatNumber>{stats.completed}</StatNumber>
            <StatLabel>Completed</StatLabel>
          </StatCard>
          <StatCard $color="#f59e0b">
            <StatNumber>{stats.active}</StatNumber>
            <StatLabel>Active</StatLabel>
          </StatCard>
          <StatCard $color="#ef4444">
            <StatNumber>{stats.highPriority}</StatNumber>
            <StatLabel>High Priority</StatLabel>
          </StatCard>
        </StatsContainer>

        <TaskForm onSubmit={addTask} />

        <FilterContainer>
          <FilterButtons>
            <FilterButton 
              $active={filter === 'all'} 
              onClick={() => setFilter('all')}
            >
              All Tasks ({stats.total})
            </FilterButton>
            <FilterButton 
              $active={filter === 'active'} 
              onClick={() => setFilter('active')}
            >
              Active ({stats.active})
            </FilterButton>
            <FilterButton 
              $active={filter === 'completed'} 
              onClick={() => setFilter('completed')}
            >
              Completed ({stats.completed})
            </FilterButton>
          </FilterButtons>
        </FilterContainer>

        <TaskList 
          tasks={filteredTasks}
          onToggleComplete={toggleTaskComplete}
          onDeleteTask={deleteTask}
        />
      </Container>
    </AppContainer>
  );
}
