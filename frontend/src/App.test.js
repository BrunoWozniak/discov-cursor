import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
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
    window.fetch.mockRejectedValueOnce(new Error('Network error'));
    render(<App />);
    expect(await screen.findByText(/network error/i)).toBeInTheDocument();
  });

  test('can add a todo', async () => {
    window.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] }) // initial fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 2, title: 'New Todo', completed: false }) }) // add
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 2, title: 'New Todo', completed: false }] }); // fetch after add
    render(<App />);
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/add a new todo/i), { target: { value: 'New Todo' } });
      fireEvent.click(screen.getByText(/add/i));
    });
    expect(await screen.findByText('New Todo')).toBeInTheDocument();
  });

  test('can toggle dark mode', async () => {
    render(<App />);
    const toggle = screen.getByRole('button', { name: /toggle dark mode/i });
    await act(async () => {
      fireEvent.click(toggle);
    });
    expect(document.body.className).toMatch(/dark-mode/);
    await act(async () => {
      fireEvent.click(toggle);
    });
    expect(document.body.className).toMatch(/light-mode/);
  });

  test('can start and cancel editing a todo', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, title: 'Edit Me', completed: false }],
    });
    render(<App />);
    expect(await screen.findByText('Edit Me')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByText('Edit Me'));
    });
    expect(screen.getByDisplayValue('Edit Me')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    });
    expect(screen.queryByDisplayValue('Edit Me')).not.toBeInTheDocument();
  });

  test('can delete a todo', async () => {
    window.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1, title: 'Delete Me', completed: false }] }) // initial fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Todo deleted' }) }) // delete
      .mockResolvedValueOnce({ ok: true, json: async () => [] }); // fetch after delete
    render(<App />);
    expect(await screen.findByText('Delete Me')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    });
    // Wait for modal to appear and click confirm
    await act(async () => {
      const confirmButton = await screen.findByRole('button', { name: /confirm/i });
      fireEvent.click(confirmButton);
    });
    await waitFor(() => expect(screen.queryByText('Delete Me')).not.toBeInTheDocument());
  });
}); 