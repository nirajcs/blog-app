'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

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
  updatedAt: string;
}

export default function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const getParams = async () => {
      const { id } = await params;
      fetchPost(id);
    };
    getParams();
  }, [params]);

  const fetchPost = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${id}`);
      if (response.ok) {
        const data = await response.json();
        setPost(data.post);
      } else {
        setError('Post not found');
      }
    } catch (error) {
      setError('Error loading post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      setDeleting(true);
      const token = getCookie('token');
      const { id } = await params;
      
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        router.push('/posts');
      } else {
        const error = await response.json();
        setError(error.error || 'Failed to delete post');
      }
    } catch (error) {
      setError('Error deleting post');
    } finally {
      setDeleting(false);
    }
  };

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canEdit = isAuthenticated && (user?.role === 'admin' || user?.id === post?.author._id);
  const canDelete = isAuthenticated && (user?.role === 'admin' || user?.id === post?.author._id);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading post...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-6">{error || 'The post you are looking for does not exist.'}</p>
        <Link
          href="/posts"
          className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Back to Posts
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Post Header */}
        <div className="p-8 border-b border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-4xl font-bold text-gray-800">{post.title}</h1>
            
            {/* Action Buttons */}
            {(canEdit || canDelete) && (
              <div className="flex space-x-2">
                {canEdit && (
                  <Link
                    href={`/posts/edit/${post._id}`}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Edit
                  </Link>
                )}
                
                {canDelete && (
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                )}
              </div>
            )}
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <span>By <span className="font-medium">{post.author.name}</span></span>
            <span className="mx-2">•</span>
            <span>Published {formatDate(post.createdAt)}</span>
            {post.updatedAt !== post.createdAt && (
              <>
                <span className="mx-2">•</span>
                <span>Updated {formatDate(post.updatedAt)}</span>
              </>
            )}
          </div>
        </div>

        {/* Post Content */}
        <div className="p-8">
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
              {post.content}
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-8 text-center">
        <Link
          href="/posts"
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          ← Back to Posts
        </Link>
      </div>
    </div>
  );
} 