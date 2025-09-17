'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { toast } from '@/components/ui/Toast';

interface Backup {
  filename: string;
  size: string;
  created_at: string;
  download_url: string;
}

export default function BackupManagement() {
  const { user } = useAuth();
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; filename: string }>({
    show: false,
    filename: ''
  });
  const [restoreModal, setRestoreModal] = useState<{ 
    show: boolean; 
    filename: string; 
    type: 'full' | 'code' | 'database' | null;
  }>({
    show: false,
    filename: '',
    type: null
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchBackups();
    }
  }, [user]);

  const showToast = (message: string, type: 'success' | 'error') => {
    if (type === 'success') {
      toast.success(message);
    } else {
      toast.error(message);
    }
  };

  const fetchBackups = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/backups', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setBackups(data.backups);
      } else {
        showToast('Failed to fetch backups', 'error');
      }
    } catch (error) {
      console.error('Error fetching backups:', error);
      showToast('Failed to fetch backups', 'error');
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    setCreating(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/admin/backups', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        showToast(`Backup created successfully: ${data.filename}`, 'success');
        fetchBackups(); // Refresh the list
      } else {
        showToast(data.message || 'Failed to create backup', 'error');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      showToast('Failed to create backup', 'error');
    } finally {
      setCreating(false);
    }
  };

  const downloadBackup = async (filename: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/admin/backups/${filename}/download`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showToast('Download started', 'success');
      } else {
        showToast('Failed to download backup', 'error');
      }
    } catch (error) {
      console.error('Error downloading backup:', error);
      showToast('Failed to download backup', 'error');
    }
  };

  const deleteBackup = async (filename: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`/api/admin/backups/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        showToast('Backup deleted successfully', 'success');
        fetchBackups(); // Refresh the list
        setDeleteModal({ show: false, filename: '' });
      } else {
        showToast(data.message || 'Failed to delete backup', 'error');
      }
    } catch (error) {
      console.error('Error deleting backup:', error);
      showToast('Failed to delete backup', 'error');
    }
  };

  const restoreBackup = async (filename: string, type: 'full' | 'code' | 'database') => {
    setRestoring(filename);
    try {
      const token = localStorage.getItem('auth_token');
      let endpoint = '';
      
      switch (type) {
        case 'full':
          endpoint = `/api/admin/backups/${filename}/restore`;
          break;
        case 'code':
          endpoint = `/api/admin/backups/${filename}/restore-code`;
          break;
        case 'database':
          endpoint = `/api/admin/backups/${filename}/restore-database`;
          break;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        const typeLabel = type === 'full' ? 'Full' : type === 'code' ? 'Code' : 'Database';
        showToast(`${typeLabel} restore completed successfully!`, 'success');
        setRestoreModal({ show: false, filename: '', type: null });
      } else {
        showToast(data.message || `Failed to restore ${type}`, 'error');
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      showToast('Error restoring backup', 'error');
    } finally {
      setRestoring(null);
    }
  };

  const confirmRestore = (filename: string, type: 'full' | 'code' | 'database') => {
    setRestoreModal({ show: true, filename, type });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (user?.role !== 'admin') {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                You need admin privileges to access backup management.
              </p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Backup Management
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Create, download, and manage website backups
                </p>
              </div>
              <Button
                onClick={createBackup}
                disabled={creating}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {creating ? 'Creating...' : 'Create Backup'}
              </Button>
            </div>
          </div>

          {/* Backup List */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Available Backups
            </h2>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600 dark:text-gray-400">Loading backups...</p>
              </div>
            ) : backups.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">No backups found</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                  Create your first backup to get started
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Filename
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {backups.map((backup) => (
                      <tr key={backup.filename} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {backup.filename}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {backup.size}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(backup.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex flex-col space-y-2 justify-end">
                            <div className="flex space-x-2 justify-end">
                              <Button
                                onClick={() => confirmRestore(backup.filename, 'full')}
                                disabled={restoring === backup.filename}
                                variant="secondary"
                                size="sm"
                                className="bg-green-50 text-green-700 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400"
                              >
                                {restoring === backup.filename ? 'Restoring...' : 'Full Restore'}
                              </Button>
                              <Button
                                onClick={() => confirmRestore(backup.filename, 'code')}
                                disabled={restoring === backup.filename}
                                variant="secondary"
                                size="sm"
                                className="bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400"
                              >
                                Code Only
                              </Button>
                              <Button
                                onClick={() => confirmRestore(backup.filename, 'database')}
                                disabled={restoring === backup.filename}
                                variant="secondary"
                                size="sm"
                                className="bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400"
                              >
                                DB Only
                              </Button>
                            </div>
                            <div className="flex space-x-2 justify-end">
                              <Button
                                onClick={() => downloadBackup(backup.filename)}
                                variant="secondary"
                                size="sm"
                              >
                                Download
                              </Button>
                              <Button
                                onClick={() => setDeleteModal({ show: true, filename: backup.filename })}
                                variant="secondary"
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Info Card */}
          <Card className="p-6 mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Backup & Restore Information
            </h3>
            <div className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
              <p>• <strong>Full Restore:</strong> Restores both code and database completely</p>
              <p>• <strong>Code Only:</strong> Restores application files while preserving current database</p>
              <p>• <strong>Database Only:</strong> Restores database while keeping current code intact</p>
              <p>• Backups include the complete website source code and database</p>
              <p>• Large directories like node_modules and vendor are excluded to reduce size</p>
              <p>• Backups are stored securely and can be downloaded anytime</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, filename: '' })}
        title="Delete Backup"
      >
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete the backup "{deleteModal.filename}"? This action cannot be undone.
          </p>
          <div className="flex space-x-4 justify-end">
            <Button
              onClick={() => setDeleteModal({ show: false, filename: '' })}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => deleteBackup(deleteModal.filename)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Restore Confirmation Modal */}
      <Modal
        isOpen={restoreModal.show}
        onClose={() => setRestoreModal({ show: false, filename: '', type: null })}
        title="Confirm Restore"
      >
        <div className="p-6">
          <div className="mb-4">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              {restoreModal.type === 'full' && 'Full System Restore'}
              {restoreModal.type === 'code' && 'Code-Only Restore'}
              {restoreModal.type === 'database' && 'Database-Only Restore'}
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              {restoreModal.type === 'full' && 'This will restore the entire application (code + database). All current data and code changes will be lost.'}
              {restoreModal.type === 'code' && 'This will restore only the code files. Database changes will be preserved.'}
              {restoreModal.type === 'database' && 'This will restore only the database. Code changes will be preserved.'}
            </p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Warning
                </h3>
                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                  <p>This action cannot be undone. Please ensure you understand the implications before proceeding.</p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to restore from backup "{restoreModal.filename}"?
          </p>
          <div className="flex space-x-4 justify-end">
            <Button
              onClick={() => setRestoreModal({ show: false, filename: '', type: null })}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => restoreModal.type && restoreBackup(restoreModal.filename, restoreModal.type)}
              className="bg-orange-600 hover:bg-orange-700 text-white"
              disabled={restoring === restoreModal.filename}
            >
              {restoring === restoreModal.filename ? 'Restoring...' : 'Confirm Restore'}
            </Button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
}