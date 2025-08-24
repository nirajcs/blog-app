'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Post {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface UserPagination {
  currentPage: number;
  totalPages: number;
  totalUsers: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface PostPagination {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [userPagination, setUserPagination] = useState<UserPagination | null>(null);
  const [postPagination, setPostPagination] = useState<PostPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'users' | 'posts'>('users');
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [currentPostPage, setCurrentPostPage] = useState(1);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<string | null>(null);
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'user', password: '' });
  const [postForm, setPostForm] = useState({ title: '', content: '' });
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [createUserForm, setCreateUserForm] = useState({ name: '', email: '', role: 'user', password: '' });
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchUsers();
      fetchPosts();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    } else {
      fetchPosts();
    }
  }, [activeTab, currentUserPage, currentPostPage]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        page: currentUserPage.toString(),
        limit: '10',
      });

      const response = await fetch(`/api/admin/users?${params}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setUserPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPostPage.toString(),
        limit: '10',
      });

      const response = await fetch(`/api/admin/posts?${params}`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
        setPostPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserEdit = (user: User) => {
    setEditingUser(user._id);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: ''
    });
  };

  const handleUserUpdate = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/admin/users/${editingUser}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(userForm),
      });

      if (response.ok) {
        setEditingUser(null);
        setUserForm({ name: '', email: '', role: 'user', password: '' });
        fetchUsers();
      } else {
        const error = await response.json();
        setError(error.error || 'Failed to update user');
      }
    } catch (error) {
      setError('Failed to update user');
    }
  };

  const handleUserDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? Posts under this user will also be deleted.')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        fetchUsers();
      } else {
        const error = await response.json();
        setError(error.error || 'Failed to delete user');
      }
    } catch (error) {
      setError('Failed to delete user');
    }
  };

  const handlePostEdit = (post: Post) => {
    setEditingPost(post._id);
    setPostForm({
      title: post.title,
      content: post.content
    });
  };

  const handlePostUpdate = async () => {
    if (!editingPost) return;

    try {
      const response = await fetch(`/api/admin/posts/${editingPost}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(postForm),
      });

      if (response.ok) {
        setEditingPost(null);
        setPostForm({ title: '', content: '' });
        fetchPosts();
      } else {
        const error = await response.json();
        setError(error.error || 'Failed to update post');
      }
    } catch (error) {
      setError('Failed to update post');
    }
  };

  const handlePostDelete = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        fetchPosts();
      } else {
        const error = await response.json();
        setError(error.error || 'Failed to delete post');
      }
    } catch (error) {
      setError('Failed to delete post');
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(createUserForm),
      });

      if (response.ok) {
        setShowCreateUser(false);
        setCreateUserForm({ name: '', email: '', role: 'user', password: '' });
        fetchUsers();
      } else {
        const error = await response.json();
        setError(error.error || 'Failed to create user');
      }
    } catch (error) {
      setError('Failed to create user');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const truncateContent = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">Admin access required.</p>
        <Link
          href="/dashboard"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-8 rounded-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
            <p className="text-xl text-purple-100">
              Manage users, posts, and platform settings
            </p>
          </div>
          <Link
            href="/dashboard"
            className="bg-white text-purple-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button
            onClick={() => setError('')}
            className="float-right font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('users')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'users'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Users ({userPagination?.totalUsers || 0})
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'posts'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Posts ({postPagination?.totalPosts || 0})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'users' ? (
            <div>
              {/* Create User Button */}
              <div className="mb-6">
                <button
                  onClick={() => setShowCreateUser(!showCreateUser)}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  {showCreateUser ? 'Cancel' : 'Create New User'}
                </button>
              </div>

              {/* Create User Form */}
              {showCreateUser && (
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h3 className="text-lg text-black font-semibold mb-4">Create New User</h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      value={createUserForm.name}
                      onChange={(e) => setCreateUserForm({ ...createUserForm, name: e.target.value })}
                      placeholder="Name"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    />
                    <input
                      type="email"
                      value={createUserForm.email}
                      onChange={(e) => setCreateUserForm({ ...createUserForm, email: e.target.value })}
                      placeholder="Email"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <select
                      value={createUserForm.role}
                      onChange={(e) => setCreateUserForm({ ...createUserForm, role: e.target.value })}
                      className="px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option className='text-black' value="user">User</option>
                      <option className='text-black' value="admin">Admin</option>
                    </select>
                    <input
                      type="password"
                      value={createUserForm.password}
                      onChange={(e) => setCreateUserForm({ ...createUserForm, password: e.target.value })}
                      placeholder="Password"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                    />
                  </div>
                  <button
                    onClick={handleCreateUser}
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                  >
                    Create User
                  </button>
                </div>
              )}

              {/* Users List */}
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user._id} className="bg-gray-50 p-4 rounded-lg">
                    {editingUser === user._id ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={userForm.name}
                            onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                            placeholder="Name"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                          />
                          <input
                            type="email"
                            value={userForm.email}
                            onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                            placeholder="Email"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <select
                            value={userForm.role}
                            onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                            className="px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            <option className='text-black' value="user">User</option>
                            <option className='text-black' value="admin">Admin</option>
                          </select>
                          <input
                            type="password"
                            value={userForm.password}
                            onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                            placeholder="New password (optional)"
                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                          />
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={handleUserUpdate}
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingUser(null);
                              setUserForm({ name: '', email: '', role: 'user', password: '' });
                            }}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800">{user.name}</h3>
                          <p className="text-gray-600">{user.email}</p>
                          <p className="text-sm text-gray-500">
                            Role: <span className="capitalize">{user.role}</span> • 
                            Joined: {formatDate(user.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                          {
                            user.role !== 'admin' ? (
                            <>
                              <button
                                onClick={() => handleUserEdit(user)}
                                className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleUserDelete(user._id)}
                                className="text-red-500 hover:text-red-600 text-sm font-medium"
                              >
                                Delete
                              </button>
                            </>
                            ):null
                          }
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Users Pagination */}
              {userPagination && userPagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                  <button
                    onClick={() => setCurrentUserPage(currentUserPage - 1)}
                    disabled={!userPagination.hasPrevPage}
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  <span className="px-4 py-2 text-gray-600">
                    Page {userPagination.currentPage} of {userPagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentUserPage(currentUserPage + 1)}
                    disabled={!userPagination.hasNextPage}
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Posts List */}
              <div className="space-y-4">
                {posts.map((post) => (
                  <div key={post._id} className="bg-gray-50 p-4 rounded-lg">
                    {editingPost === post._id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={postForm.title}
                          onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                          placeholder="Title"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                        />
                        <textarea
                          value={postForm.content}
                          onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                          placeholder="Content"
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-black"
                        />
                        <div className="flex space-x-2">
                          <button
                            onClick={handlePostUpdate}
                            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingPost(null);
                              setPostForm({ title: '', content: '' });
                            }}
                            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-2">
                            <Link href={`/posts/${post._id}`} className="hover:text-purple-600">
                              {post.title}
                            </Link>
                          </h3>
                          <p className="text-gray-600 mb-2">
                            {truncateContent(post.content)}
                          </p>
                          <p className="text-sm text-gray-500">
                            By {post.author.name} • Published: {formatDate(post.createdAt)}
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handlePostEdit(post)}
                            className="text-blue-500 hover:text-blue-600 text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handlePostDelete(post._id)}
                            className="text-red-500 hover:text-red-600 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Posts Pagination */}
              {postPagination && postPagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                  <button
                    onClick={() => setCurrentPostPage(currentPostPage - 1)}
                    disabled={!postPagination.hasPrevPage}
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  <span className="px-4 py-2 text-gray-600">
                    Page {postPagination.currentPage} of {postPagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => setCurrentPostPage(currentPostPage + 1)}
                    disabled={!postPagination.hasNextPage}
                    className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 