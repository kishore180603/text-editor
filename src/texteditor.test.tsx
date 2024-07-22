// src/TextEditor.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TextEditor from './texteditor';

// Mock fonts data
jest.mock('./fonts.json', () => ({
  'ABeeZee': {
    '400': 'link-to-400-font',
    '700': 'link-to-700-font',
    '400italic': 'link-to-400-italic-font',
  },
  // Add other fonts if needed
}));

describe('TextEditor Component', () => {
  test('renders without crashing', () => {
    render(<TextEditor />);
    expect(screen.getByText(/Text Editor/i)).toBeInTheDocument();
  });

  test('changes font family correctly', () => {
    render(<TextEditor />);
    const fontFamilySelect = screen.getByLabelText(/Font Family/i);
    fireEvent.change(fontFamilySelect, { target: { value: 'ABeeZee' } });
    expect(fontFamilySelect.value).toBe('ABeeZee');
  });

  test('changes font weight correctly', () => {
    render(<TextEditor />);
    const fontWeightSelect = screen.getByLabelText(/Font Weight/i);
    fireEvent.change(fontWeightSelect, { target: { value: '700' } });
    expect(fontWeightSelect.value).toBe('700');
  });

  test('toggles italic style correctly', () => {
    render(<TextEditor />);
    const italicSelect = screen.getByLabelText(/Italic/i);
    fireEvent.change(italicSelect, { target: { value: 'italic' } });
    expect(italicSelect.value).toBe('italic');
  });

  test('updates textarea value correctly', () => {
    render(<TextEditor />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Hello World' } });
    expect(textarea.value).toBe('Hello World');
  });
});
