import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type CommunityPost = {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  timeAgo: string;
  title: string;
  content: string;
  comments: number;
  likes: number;
};

const CommunitySection = () => {
  const communityPosts: CommunityPost[] = [
    {
      id: '1',
      author: {
        name: 'Sarah J.',
        avatar: 'https://randomuser.me/api/portraits/women/23.jpg'
      },
      timeAgo: '2 hours ago',
      title: 'Living with Type 2 Diabetes',
      content: 'Has anyone found effective ways to manage blood sugar spikes after meals? I have been struggling despite following my diet plan...',
      comments: 24,
      likes: 38
    },
    {
      id: '2',
      author: {
        name: 'Michael T.',
        avatar: 'https://randomuser.me/api/portraits/men/54.jpg'
      },
      timeAgo: 'yesterday',
      title: 'Anxiety Management Techniques',
      content: 'I wanted to share some breathing techniques that have really helped me manage panic attacks. First, find a quiet place...',
      comments: 47,
      likes: 92
    },
    {
      id: '3',
      author: {
        name: 'Elena K.',
        avatar: 'https://randomuser.me/api/portraits/women/72.jpg'
      },
      timeAgo: '3 days ago',
      title: 'Resources in Rural Areas',
      content: 'I live 40 miles from the nearest hospital. Has anyone found good telehealth services that accept Medicare? Looking for...',
      comments: 16,
      likes: 12
    }
  ];

  return (
    <section className="bg-neutral-100 py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Community Support</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Connect with others, share experiences, and find support from people going through similar health journeys.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {communityPosts.map((post) => (
            <Card key={post.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img 
                    src={post.author.avatar} 
                    alt={`${post.author.name} avatar`} 
                    className="w-10 h-10 rounded-full mr-3" 
                  />
                  <div>
                    <p className="font-medium">{post.author.name}</p>
                    <p className="text-sm text-neutral-500">Posted {post.timeAgo}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="font-medium mb-2">{post.title}</h3>
                  <p className="text-neutral-600 text-sm">{post.content}</p>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-3">
                    <button className="text-neutral-500 flex items-center text-sm">
                      <span className="material-icons text-sm mr-1">chat_bubble_outline</span>
                      {post.comments}
                    </button>
                    <button className="text-neutral-500 flex items-center text-sm">
                      <span className="material-icons text-sm mr-1">favorite_border</span>
                      {post.likes}
                    </button>
                  </div>
                  <Button variant="link" className="text-primary text-sm font-medium p-0">
                    Read more
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <Button className="bg-primary text-white px-6 py-3 rounded-full hover:bg-primary/90 transition-colors">
            <span className="material-icons text-sm mr-2">forum</span>
            Join the Community
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
