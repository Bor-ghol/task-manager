import React, { useState } from 'react';
import styled from 'styled-components';
import { TaskFormData } from '@/types/task';

const FormContainer = styled.form<{ $isVisible: boolean }>`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(-10px)'};
  opacity: ${props => props.$isVisible ? '1' : '0.8'};
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    align-items: start;
  }
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  padding: 0.75rem;
  border: 2px solid ${props => props.$hasError ? '#ef4444' : '#e5e7eb'};
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#ef4444' : '#3b82f6'};
  }
`;

const TextArea = styled.textarea<{ $hasError?: boolean }>`
  padding: 0.75rem;
  border: 2px solid ${props => props.$hasError ? '#ef4444' : '#e5e7eb'};
  border-radius: 8px;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  font-family: inherit;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#ef4444' : '#3b82f6'};
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }
`;

const SubmitButton = styled.button<{ $priority: string }>`
  padding: 0.75rem 2rem;
  background: ${props => {
    switch (props.$priority) {
      case 'high': return 'linear-gradient(135deg, #ef4444, #dc2626)';
      case 'medium': return 'linear-gradient(135deg, #f59e0b, #d97706)';
      default: return 'linear-gradient(135deg, #10b981, #059669)';
    }
  }};
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  justify-self: start;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    width: 100%;
    justify-self: stretch;
  }
`;

const ErrorText = styled.span`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

interface TaskFormProps {
  onSubmit: (task: TaskFormData) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    priority: 'medium'
  });
  const [errors, setErrors] = useState<Partial<TaskFormData>>({});
  const [isVisible, setIsVisible] = useState(true);

  const validateForm = (): boolean => {
    const newErrors: Partial<TaskFormData> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      setFormData({ title: '', description: '', priority: 'medium' });
      setErrors({});
      
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 100);
    }
  };

  const handleChange = (field: keyof TaskFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit} $isVisible={isVisible}>
      <FormGrid>
        <InputGroup>
          <Label htmlFor="title">Task Title</Label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter task title..."
            $hasError={!!errors.title}
          />
          {errors.title && <ErrorText>{errors.title}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <Label htmlFor="priority">Priority</Label>
          <Select
            id="priority"
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value as TaskFormData['priority'])}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </Select>
        </InputGroup>

        <InputGroup style={{ gridColumn: '1 / -1' }}>
          <Label htmlFor="description">Description</Label>
          <TextArea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe your task..."
            $hasError={!!errors.description}
          />
          {errors.description && <ErrorText>{errors.description}</ErrorText>}
        </InputGroup>

        <SubmitButton type="submit" $priority={formData.priority}>
          Add Task
        </SubmitButton>
      </FormGrid>
    </FormContainer>
  );
};
