'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useUser, useUpdateUser } from '@/hooks/useUsers';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ArrowLeft, Save, UserCog } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface UpdateUserForm {
  name: string;
  username: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  role: string;
  is_active: boolean;
}

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const userId = params.id as string;
  
  const { data: user, isLoading, error } = useUser(userId);
  const updateUserMutation = useUpdateUser();
  
  const [formData, setFormData] = useState<UpdateUserForm>({
    name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'brand',
    is_active: true
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [changePassword, setChangePassword] = useState(false);

  // Populate form when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        role: user.role || 'brand',
        is_active: user.is_active ?? true
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (changePassword) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        newErrors.password = 'Password must be at least 8 characters';
      }
      
      if (formData.password !== formData.password_confirmation) {
        newErrors.password_confirmation = 'Passwords do not match';
      }
    }
    
    if (!formData.role) {
      newErrors.role = 'Role is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const updateData: any = {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        role: formData.role,
        is_active: formData.is_active
      };
      
      // Only include password if changing it
      if (changePassword && formData.password) {
        updateData.password = formData.password;
        updateData.password_confirmation = formData.password_confirmation;
      }
      
      await updateUserMutation.mutateAsync({ id: userId, data: updateData });
      toast.success('User updated successfully');
      router.push('/users');
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || 'Failed to update user');
      }
    }
  };

  const getAvailableRoles = () => {
    if (currentUser?.role === 'admin') {
      return [
        { value: 'admin', label: 'Admin' },
        { value: 'agency', label: 'Agency' },
        { value: 'brand', label: 'Brand' }
      ];
    } else if (currentUser?.role === 'agency') {
      return [
        { value: 'brand', label: 'Brand' }
      ];
    }
    return [];
  };

  const canEditUser = () => {
    if (!user || !currentUser) return false;
    
    // Admins can edit anyone except they can't change their own role
    if (currentUser.role === 'admin') return true;
    
    // Agencies can edit brand users
    if (currentUser.role === 'agency' && user.role === 'brand') return true;
    
    // Users can edit their own profile (but not role)
    if (currentUser.id === user.id) return true;
    
    return false;
  };

  const canChangeRole = () => {
    if (!user || !currentUser) return false;
    
    // Admins can change anyone's role except their own
    if (currentUser.role === 'admin' && currentUser.id !== user.id) return true;
    
    // Agencies can change brand users' roles (but only to brand)
    if (currentUser.role === 'agency' && user.role === 'brand') return true;
    
    return false;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !user) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">User Not Found</h1>
          <p className="text-gray-600 mb-4">The user you're looking for doesn't exist or you don't have permission to view it.</p>
          <Link href="/users">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (!canEditUser()) {
    return (
      <Layout>
        <div className="text-center py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have permission to edit this user.</p>
          <Link href="/users">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Users
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/users">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <UserCog className="h-6 w-6" />
              Edit User
            </h1>
            <p className="text-gray-600">Update user information and permissions</p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                  required
                  placeholder="Enter full name"
                />
                
                <Input
                  label="Username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={errors.username}
                  required
                  placeholder="Enter username"
                />
              </div>
              
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                placeholder="Enter email address"
              />
              
              {canChangeRole() && (
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none">
                    Role *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    required
                  >
                    {getAvailableRoles().map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  {errors.role && (
                    <p className="text-sm text-red-600">{errors.role}</p>
                  )}
                </div>
              )}
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="changePassword"
                    checked={changePassword}
                    onChange={(e) => setChangePassword(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="changePassword" className="text-sm font-medium text-gray-700">
                    Change Password
                  </label>
                </div>
                
                {changePassword && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="New Password"
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      error={errors.password}
                      placeholder="Enter new password (min. 8 characters)"
                    />
                    
                    <Input
                      label="Confirm New Password"
                      type="password"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      error={errors.password_confirmation}
                      placeholder="Confirm new password"
                    />
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                  Active User
                </label>
              </div>
              
              <div className="flex justify-end space-x-4 pt-6">
                <Link href="/users">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={updateUserMutation.isPending}
                >
                  {updateUserMutation.isPending ? (
                    'Updating...'
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Update User
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}