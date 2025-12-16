import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { usersService } from '../../../services/users.service';

export const Users = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', page, limit, search],
    queryFn: () => usersService.findMany({ page, limit, search, order: 'asc', sortBy: 'id' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => usersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState({ email: '', name: '', password: '' });
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editUser, setEditUser] = useState({ email: '', name: '', password: '' });

  const createMutation = useMutation({
    mutationFn: (userData: { email: string; name: string; password: string }) =>
      usersService.create(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowCreateForm(false);
      setNewUser({ email: '', name: '', password: '' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: Partial<{ email: string; name: string; password: string }> }) =>
      usersService.update(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditingUserId(null);
      setEditUser({ email: '', name: '', password: '' });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newUser);
  };

  const handleEdit = (user: { id: number; email: string; name: string }) => {
    setEditingUserId(user.id);
    setEditUser({ email: user.email, name: user.name, password: '' });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUserId) {
      const updateData: Partial<{ email: string; name: string; password: string }> = {
        email: editUser.email,
        name: editUser.name,
      };
      if (editUser.password) {
        updateData.password = editUser.password;
      }
      updateMutation.mutate({ id: editingUserId, userData: updateData });
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading users</div>;

  return (
    <div>
      <h1>User Management</h1>
      <button onClick={() => setShowCreateForm(!showCreateForm)}>
        {showCreateForm ? 'Cancel' : 'Create New User'}
      </button>
      {showCreateForm && (
        <form onSubmit={handleCreate}>
          <div>
            <label>
              Email:
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Name:
              <input
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Password:
              <input
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
              />
            </label>
          </div>
          <button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Creating...' : 'Create User'}
          </button>
        </form>
      )}
      <div>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <button onClick={() => setPage(1)}>Search</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((user) => (
            <tr key={user.id}>
              {editingUserId === user.id ? (
                <>
                  <td>{user.id}</td>
                  <td>
                    <input
                      type="text"
                      value={editUser.name}
                      onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="email"
                      value={editUser.email}
                      onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                      required
                    />
                  </td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={handleUpdate} disabled={updateMutation.isPending}>
                      {updateMutation.isPending ? 'Saving...' : 'Save'}
                    </button>
                    <button onClick={() => {
                      setEditingUserId(null);
                      setEditUser({ email: '', name: '', password: '' });
                    }}>
                      Cancel
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user.id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {data?.meta && (
        <div>
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span>
            Page {data.meta.page} of {data.meta.totalPages}
          </span>
          <button
            disabled={page >= data.meta.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

