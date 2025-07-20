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
  test('renders main heading', async () => {
    await act(async () => { render(<App />); });
    const heading = screen.getByRole('heading', { name: /todo/i });
    expect(heading).toBeInTheDocument();
  });

  test('shows loading state and fetches todos', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => {
        await new Promise(res => setTimeout(res, 10));
        return [{ id: 1, title: 'Test Todo', completed: false }];
      },
    });
    await act(async () => { render(<App />); });
    expect(screen.queryByText(/loading/i)).toBeInTheDocument();
    expect(await screen.findByText('Test Todo')).toBeInTheDocument();
  });

  test('handles fetch error', async () => {
    window.fetch.mockRejectedValueOnce(new Error('Network error'));
    await act(async () => { render(<App />); });
    expect(await screen.findByText(/network error/i)).toBeInTheDocument();
  });

  test('can add a todo', async () => {
    window.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [] }) // initial fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 2, title: 'New Todo', completed: false }) }) // add
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 2, title: 'New Todo', completed: false }] }); // fetch after add
    await act(async () => { render(<App />); });
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/add a new todo/i), { target: { value: 'New Todo' } });
      fireEvent.click(screen.getByRole('button', { name: /add/i }));
    });
    expect(await screen.findByText('New Todo')).toBeInTheDocument();
  });

  test('can toggle dark mode', async () => {
    await act(async () => { render(<App />); });
    const toggle = screen.getByLabelText(/mode/i);
    await act(async () => {
      fireEvent.click(toggle);
    });
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    await act(async () => {
      fireEvent.click(toggle);
    });
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  test('can start and cancel editing a todo', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1, title: 'Edit Me', completed: false }],
    });
    await act(async () => { render(<App />); });
    expect(await screen.findByText('Edit Me')).toBeInTheDocument();
    await act(async () => {
      fireEvent.doubleClick(screen.getByText('Edit Me'));
    });
    expect(screen.getByDisplayValue('Edit Me')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    });
    expect(screen.queryByDisplayValue('Edit Me')).not.toBeInTheDocument();
  });

  test('can save an edited todo', async () => {
    window.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1, title: 'Edit Me', completed: false }] }) // initial fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 1, title: 'Edited Todo', completed: false }) }) // save
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1, title: 'Edited Todo', completed: false }] }); // fetch after save
    await act(async () => { render(<App />); });
    expect(await screen.findByText('Edit Me')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    });
    const textareas = screen.getAllByRole('textbox');
    const editBox = textareas.find(el => el.value === 'Edit Me');
    expect(editBox).toBeInTheDocument();
    await act(async () => {
      fireEvent.change(editBox, { target: { value: 'Edited Todo' } });
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
    });
    expect(await screen.findByText('Edited Todo')).toBeInTheDocument();
  });

  test('can delete a todo', async () => {
    window.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => [{ id: 1, title: 'Delete Me', completed: false }] }) // initial fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ message: 'Todo deleted' }) }) // delete
      .mockResolvedValueOnce({ ok: true, json: async () => [] }); // fetch after delete
    await act(async () => { render(<App />); });
    expect(await screen.findByText('Delete Me')).toBeInTheDocument();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    });
    await act(async () => {
      const confirmButton = await screen.findAllByRole('button', { name: /delete/i });
      fireEvent.click(confirmButton[confirmButton.length - 1]);
    });
    await waitFor(() => expect(screen.queryByText('Delete Me')).not.toBeInTheDocument());
  });

  test('can filter todos', async () => {
    window.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        { id: 1, title: 'Active Todo', completed: false },
        { id: 2, title: 'Completed Todo', completed: true },
      ],
    });
    await act(async () => { render(<App />); });
    expect(await screen.findByText('Active Todo')).toBeInTheDocument();
    expect(await screen.findByText('Completed Todo')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /active/i }));
    expect(screen.getByText('Active Todo')).toBeInTheDocument();
    expect(screen.queryByText('Completed Todo')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /completed/i }));
    expect(screen.getByText('Completed Todo')).toBeInTheDocument();
    expect(screen.queryByText('Active Todo')).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /^all$/i }));
    expect(screen.getByText('Active Todo')).toBeInTheDocument();
    expect(screen.getByText('Completed Todo')).toBeInTheDocument();
  });
}); 