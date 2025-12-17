import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useDeferredValue, useMemo, useCallback } from 'react';
import { usersService } from '../../../services/users.service';
import { AdminModal } from '../../../components/AdminModal/AdminModal';
import type { UserRole } from 'skill-stream-backend/shared/types';
import '../admin-common.scss';

export const Users = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', page, limit, deferredSearch],
    queryFn: () => usersService.findMany({ page, limit, search: deferredSearch, order: 'asc', sortBy: 'id' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => usersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newUser, setNewUser] = useState<{ email: string; name: string; password: string; role: UserRole }>({ email: '', name: '', password: '', role: 'USER' });
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editUser, setEditUser] = useState<{ email: string; name: string; password: string; role: UserRole }>({ email: '', name: '', password: '', role: 'USER' });

  const createMutation = useMutation({
    mutationFn: (userData: { email: string; name: string; password: string; role?: string }) =>
      usersService.create(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setShowCreateForm(false);
      setNewUser({ email: '', name: '', password: '', role: 'USER' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, userData }: { id: number; userData: Partial<{ email: string; name: string; password: string; role: string }> }) =>
      usersService.update(id, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditingUserId(null);
      setEditUser({ email: '', name: '', password: '', role: 'USER' });
    },
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(newUser);
  };

  const handleEdit = (user: { id: number; email: string; name: string; role: UserRole }) => {
    setEditingUserId(user.id);
    setEditUser({ email: user.email, name: user.name, password: '', role: user.role });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUserId) {
      const updateData: Partial<{ email: string; name: string; password: string; role: string }> = {
        email: editUser.email,
        name: editUser.name,
        role: editUser.role,
      };
      if (editUser.password) {
        updateData.password = editUser.password;
      }
      updateMutation.mutate({ id: editingUserId, userData: updateData });
    }
  };

  const handleDelete = useCallback((id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      deleteMutation.mutate(id);
    }
  }, [deleteMutation]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const tableContent = useMemo(() => {
    if (isLoading) return <div className="admin-page__loading">Loading...</div>;
    if (error) return <div className="admin-page__error">Error loading users</div>;
    
    return (
      <>
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
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="admin-page__button admin-page__button--primary"
                    onClick={() => handleEdit(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="admin-page__button admin-page__button--danger"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {data?.meta && (
          <div className="admin-page__pagination">
            <button
              className="admin-page__pagination-button"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </button>
            <span className="admin-page__pagination-info">
              Page {data.meta.page} of {data.meta.totalPages}
            </span>
            <button
              className="admin-page__pagination-button"
              disabled={page >= data.meta.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        )}
      </>
    );
  }, [isLoading, error, data, page, handleDelete]);

  if (isLoading && !data) return <div className="admin-page__loading">Loading...</div>;
  if (error && !data) return <div className="admin-page__error">Error loading users</div>;

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">User Management</h1>
        <div className="admin-page__actions">
          <button
            className="admin-page__button admin-page__button--secondary"
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : 'Create New User'}
          </button>
        </div>
      </div>
      <AdminModal
        isOpen={showCreateForm}
        onClose={() => {
          setShowCreateForm(false);
          setNewUser({ email: '', name: '', password: '', role: 'USER' });
        }}
        title="Create New User"
      >
        <form className="admin-page__form" onSubmit={handleCreate}>
          <div className="admin-page__form-group">
            <label className="admin-page__form-label">
              Email:
              <input
                className="admin-page__form-input"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
            </label>
          </div>
          <div className="admin-page__form-group">
            <label className="admin-page__form-label">
              Name:
              <input
                className="admin-page__form-input"
                type="text"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
              />
            </label>
          </div>
          <div className="admin-page__form-group">
            <label className="admin-page__form-label">
              Password:
              <input
                className="admin-page__form-input"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
              />
            </label>
          </div>
          <div className="admin-page__form-group">
            <label className="admin-page__form-label">
              Role:
              <select
                className="admin-page__form-input"
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value as UserRole })}
                required
              >
                <option value="USER">USER</option>
                <option value="SUPPORT">SUPPORT</option>
                <option value="MANAGER">MANAGER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </label>
          </div>
          <div className="admin-page__form-actions">
            <button
              className="admin-page__button admin-page__button--primary"
              type="submit"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </AdminModal>

      <AdminModal
        isOpen={editingUserId !== null}
        onClose={() => {
          setEditingUserId(null);
          setEditUser({ email: '', name: '', password: '', role: 'USER' });
        }}
        title="Edit User"
      >
        <form className="admin-page__form" onSubmit={handleUpdate}>
          <div className="admin-page__form-group">
            <label className="admin-page__form-label">
              Email:
              <input
                className="admin-page__form-input"
                type="email"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                required
              />
            </label>
          </div>
          <div className="admin-page__form-group">
            <label className="admin-page__form-label">
              Name:
              <input
                className="admin-page__form-input"
                type="text"
                value={editUser.name}
                onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                required
              />
            </label>
          </div>
          <div className="admin-page__form-group">
            <label className="admin-page__form-label">
              Role:
              <select
                className="admin-page__form-input"
                value={editUser.role}
                onChange={(e) => setEditUser({ ...editUser, role: e.target.value as UserRole })}
                required
              >
                <option value="USER">USER</option>
                <option value="SUPPORT">SUPPORT</option>
                <option value="MANAGER">MANAGER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </label>
          </div>
          <div className="admin-page__form-group">
            <label className="admin-page__form-label">
              New Password (leave empty to keep current):
              <input
                className="admin-page__form-input"
                type="password"
                value={editUser.password}
                onChange={(e) => setEditUser({ ...editUser, password: e.target.value })}
              />
            </label>
          </div>
          <div className="admin-page__form-actions">
            <button
              className="admin-page__button admin-page__button--success"
              type="submit"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              className="admin-page__button admin-page__button--secondary"
              type="button"
              onClick={() => {
                setEditingUserId(null);
                setEditUser({ email: '', name: '', password: '', role: 'USER' });
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </AdminModal>
      <div className="admin-page__search">
        <input
          className="admin-page__search-input"
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={handleSearchChange}
        />
      </div>
      {tableContent}
    </div>
  );
};

