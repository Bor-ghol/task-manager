'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { Task, TaskFormData } from '@/types/task';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 1rem;

  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
  }
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);

  @media (max-width: 768px) {
    padding: 1.5rem;
    border-radius: 15px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 0.75rem;
  }
`;

const StatCard = styled.div<{ $color: string }>`
  background: ${props => props.$color};
  color: white;
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
  font-weight: 500;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
    : '#f8f9fa'};
  color: ${props => props.$active ? 'white' : '#666'};
  box-shadow: ${props => props.$active 
    ? '0 4px 15px rgba(102, 126, 234, 0.4)' 
    : '0 2px 8px rgba(0, 0, 0, 0.1)'};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.$active 
      ? '0 6px 20px rgba(102, 126, 234, 0.4)' 
      : '0 4px 12px rgba(0, 0, 0, 0.15)'};
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`;

type FilterType = 'all' | 'active' | 'completed';

export default function Home() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [filter, setFilter] = useState<FilterType>('all');

  const addTask = (taskData: TaskFormData) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const editTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
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
    completed: tasks.filter(task => task.completed).length,
    active: tasks.filter(task => !task.completed).length,
    high: tasks.filter(task => task.priority === 'high' && !task.completed).length,
  };

  return (
    <AppContainer>
      <MainContent>
        <Header>
          <Title>Task Manager</Title>
          <Subtitle>Organize your tasks efficiently and boost your productivity</Subtitle>
        </Header>

        <StatsContainer>
          <StatCard $color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
            <StatNumber>{stats.total}</StatNumber>
            <StatLabel>Total Tasks</StatLabel>
          </StatCard>
          <StatCard $color="linear-gradient(135deg, #56ab2f 0%, #a8e6cf 100%)">
            <StatNumber>{stats.completed}</StatNumber>
            <StatLabel>Completed</StatLabel>
          </StatCard>
          <StatCard $color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
            <StatNumber>{stats.active}</StatNumber>
            <StatLabel>Active</StatLabel>
          </StatCard>
          <StatCard $color="linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)">
            <StatNumber>{stats.high}</StatNumber>
            <StatLabel>High Priority</StatLabel>
          </StatCard>
        </StatsContainer>

        <FilterContainer>
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
        </FilterContainer>

        <TaskForm onSubmit={addTask} />
        <TaskList 
          tasks={filteredTasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={editTask}
        />
      </MainContent>
    </AppContainer>
  );
}
