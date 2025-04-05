import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { MessageCircle as ChatBubbleOutline, Heart as FavoriteBorder, ArrowRight as ArrowForward } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';

interface ForumPost {
  id: number;
  userId: number;
  title: string;
  content: string;
  category: string;
  createdAt: string;
  commentCount: number;
  likeCount: number;
  user: {
    name: string;
    avatarUrl?: string;
  };
}

interface ForumComment {
  id: number;
  postId: number;
  userId: number;
  content: string;
  createdAt: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
}

// Sample posts if API doesn't return data yet
const samplePosts: ForumPost[] = [
  {
    id: 1,
    userId: 101,
    title: 'Living with Type 2 Diabetes',
    content: 'Has anyone found effective ways to manage blood sugar spikes after meals? I have been struggling despite following my diet plan...',
    category: 'Chronic Conditions',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    commentCount: 24,
    likeCount: 38,
    user: {
      name: 'Sarah J.',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
    }
  },
  {
    id: 2,
    userId: 102,
    title: 'Anxiety Management Techniques',
    content: 'I wanted to share some breathing techniques that have really helped me manage panic attacks. First, find a quiet place...',
    category: 'Mental Health',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    commentCount: 47,
    likeCount: 92,
    user: {
      name: 'Michael T.',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
    }
  },
  {
    id: 3,
    userId: 103,
    title: 'Resources in Rural Areas',
    content: 'I live 40 miles from the nearest hospital. Has anyone found good telehealth services that accept Medicare? Looking for...',
    category: 'Healthcare Access',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    commentCount: 16,
    likeCount: 12,
    user: {
      name: 'Elena K.',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena'
    }
  }
];

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
};

const PostItem: React.FC<{ post: ForumPost }> = ({ post }) => {
  return (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={post.user.avatarUrl} alt={post.user.name} />
              <AvatarFallback>{post.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{post.user.name}</h4>
              <p className="text-sm text-muted-foreground">Posted {formatTimeAgo(post.createdAt)}</p>
            </div>
          </div>
          <span className="text-xs px-2 py-1 bg-primary/10 rounded-full">{post.category}</span>
        </div>
        <CardTitle className="text-lg mt-2">{post.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm">{post.content}</p>
      </CardContent>
      <CardFooter className="pt-1 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <ChatBubbleOutline className="h-4 w-4" />
            <span className="text-sm">{post.commentCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <FavoriteBorder className="h-4 w-4" />
            <span className="text-sm">{post.likeCount}</span>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="text-primary">
          Read more
          <ArrowForward className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

const NewPostForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          category,
          userId: 1, // This would be the logged-in user's ID
        }),
      });
      
      if (response.ok) {
        toast({
          title: 'Post Created',
          description: 'Your post has been published to the community.',
        });
        setTitle('');
        setContent('');
        setCategory('General');
        
        // Invalidate the posts query to refetch
        queryClient.invalidateQueries({ queryKey: ['/api/forum/posts'] });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create post');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create post',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Post</CardTitle>
        <CardDescription>Share your experiences or ask questions</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
            />
          </div>
          <div className="space-y-2">
            <select
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="General">General Discussion</option>
              <option value="Mental Health">Mental Health</option>
              <option value="Chronic Conditions">Chronic Conditions</option>
              <option value="Healthcare Access">Healthcare Access</option>
              <option value="Prevention">Prevention & Wellness</option>
              <option value="Caregiving">Caregiving</option>
            </select>
          </div>
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting || !title || !content}
          >
            {isSubmitting ? 'Posting...' : 'Post to Community'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

const CommunityForum: React.FC = () => {
  const [activeTab, setActiveTab] = useState('recent');

  // Fetch posts from API
  const { data: posts, isLoading, isError } = useQuery({
    queryKey: ['/api/forum/posts'],
    queryFn: async () => {
      try {
        const response = await fetch('/api/forum/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        return await response.json();
      } catch (error) {
        console.error('Error fetching posts:', error);
        // Return sample data if API fails
        return samplePosts;
      }
    }
  });

  const sortedPosts = React.useMemo(() => {
    if (!posts) return [];
    
    const postsCopy = [...posts];
    
    if (activeTab === 'recent') {
      return postsCopy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (activeTab === 'popular') {
      return postsCopy.sort((a, b) => b.likeCount - a.likeCount);
    }
    
    return postsCopy;
  }, [posts, activeTab]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Community Support</h1>
            <p className="text-muted-foreground">
              Connect with others, share experiences, and find support from people going through similar health journeys.
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid grid-cols-2 w-full max-w-xs">
              <TabsTrigger value="recent">Recent Posts</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {isLoading ? (
            <div className="text-center py-8">Loading posts...</div>
          ) : isError ? (
            <div className="text-center py-8 text-destructive">
              Failed to load posts. Please try again later.
            </div>
          ) : (
            <ScrollArea className="h-[600px] pr-4">
              {sortedPosts.map((post) => (
                <PostItem key={post.id} post={post} />
              ))}
            </ScrollArea>
          )}
        </div>
        
        <div>
          <NewPostForm />
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>Be respectful and supportive of others</li>
                <li>Do not share medical advice as a professional unless verified</li>
                <li>Respect privacy and confidentiality</li>
                <li>Focus on experiences rather than specific medical recommendations</li>
                <li>Report any concerning content to moderators</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Join the Community
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CommunityForum;