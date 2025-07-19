import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  jest.spyOn(window, 'fetch').mockImplementation(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
    })
  );
});
afterEach(() => {
  window.fetch.mockRestore();
});

describe('App', () => {
  test('renders main heading', () => {
    render(<App />);
    const heading = screen.getByRole('heading', { name: /todo/i });
    expect(heading).toBeInTheDocument();
  });

  test('shows loading state and fetches todos', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, title: 'Test Todo', completed: false }],
    });
    render(<App />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    expect(await screen.findByText('Test Todo')).toBeInTheDocument();
  });

  test('handles fetch error', async () => {
    window.fetch.mockResolvedValueOnce({ ok: false, json: async () => ({ error: 'fail' }) });
    render(<App />);
    expect(await screen.findByText(/fail/)).toBeInTheDocument();
  });

  test('can add a todo', async () => {
    window.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] }) // initial fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 2, title: 'New Todo', completed: false }) }) // add
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 2, title: 'New Todo', completed: false }] }); // fetch after add
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText(/add a new todo/i), { target: { value: 'New Todo' } });
    fireEvent.click(screen.getByText(/add/i));
    expect(await screen.findByText('New Todo')).toBeInTheDocument();
  });

  test('can toggle dark mode', () => {
    render(<App />);
    const toggle = screen.getByRole('button', { name: /toggle dark mode/i });
    fireEvent.click(toggle);
    expect(document.body.className).toMatch(/dark-mode/);
    fireEvent.click(toggle);
    expect(document.body.className).toMatch(/light-mode/);
  });

  test('can start and cancel editing a todo', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, title: 'Edit Me', completed: false }],
    });
    render(<App />);
    expect(await screen.findByText('Edit Me')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Edit Me'));
    expect(screen.getByDisplayValue('Edit Me')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(screen.queryByDisplayValue('Edit Me')).not.toBeInTheDocument();
  });

  test('can delete a todo', async () => {
    window.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1, title: 'Delete Me', completed: false }] }) // initial fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Todo deleted' }) }) // delete
      .mockResolvedValueOnce({ ok: true, json: async () => [] }); // fetch after delete
    render(<App />);
    expect(await screen.findByText('Delete Me')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    fireEvent.click(screen.getByRole('button', { name: /confirm/i }));
    await waitFor(() => expect(screen.queryByText('Delete Me')).not.toBeInTheDocument());
  });

  test('input does not accept more than 80 characters', () => {
    render(<App />);
    const input = screen.getByPlaceholderText(/add a new todo/i);
    // Simulate typing character by character to respect maxLength
    for (let i = 0; i < 100; i++) {
      fireEvent.change(input, { target: { value: input.value + 'x' } });
    }
    expect(input.value.length).toBe(80);
  });
}); 