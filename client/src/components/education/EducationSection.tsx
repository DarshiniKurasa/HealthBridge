import { Card } from "@/components/ui/card";
import { Link } from "wouter";

type Article = {
  id: string;
  title: string;
  summary: string;
  readingTime: string;
  image: string;
};

type Video = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  duration: string;
};

const EducationSection = () => {
  const articles: Article[] = [
    {
      id: '1',
      title: 'Nutrition Basics for Diabetes Management',
      summary: 'Understanding carbohydrates, proteins, and how they affect blood sugar levels.',
      readingTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1505576399279-565b52d4ac71?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: '2',
      title: 'Signs of Depression You Should Not Ignore',
      summary: 'Early detection and intervention can significantly improve outcomes.',
      readingTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80'
    },
    {
      id: '3',
      title: 'Preventive Care Checklist by Age Group',
      summary: 'Essential screenings and vaccinations recommended for each age bracket.',
      readingTime: '12 min read',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80'
    }
  ];

  const videos: Video[] = [
    {
      id: '1',
      title: 'Understanding Your Blood Pressure Readings',
      description: 'Dr. Lisa Chen explains what blood pressure numbers mean and when to be concerned.',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      duration: '8:42'
    },
    {
      id: '2',
      title: '5-Minute Meditation for Anxiety Relief',
      description: 'A guided meditation you can do anywhere to quickly reduce stress and anxiety.',
      thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/maxresdefault.jpg',
      duration: '12:15'
    }
  ];

  return (
    <section className="bg-white py-10">
      <div className="container mx-auto px-4">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-2">Health Education</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Stay informed with the latest health tips, articles, and educational videos.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="material-icons text-primary mr-2">article</span>
              Latest Articles
            </h3>
            <div className="space-y-4">
              {articles.map((article, index) => (
                <Link key={article.id} href={`/article/${article.id}`}>
                  <div className={`flex cursor-pointer ${
                    index < articles.length - 1 ? 'border-b border-neutral-200 pb-4' : ''
                  }`}>
                    <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 mr-4">
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">{article.title}</h4>
                      <p className="text-sm text-neutral-600 mb-2">{article.summary}</p>
                      <div className="flex items-center text-sm text-neutral-500">
                        <span className="material-icons text-xs mr-1">schedule</span>
                        {article.readingTime}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="md:w-1/2 mt-6 md:mt-0">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="material-icons text-primary mr-2">video_library</span>
              Educational Videos
            </h3>
            <div className="space-y-4">
              {videos.map((video) => (
                <Card key={video.id} className="bg-neutral-100 rounded-lg overflow-hidden">
                  <div className="relative">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title} 
                      className="w-full h-48 object-cover" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="w-16 h-16 rounded-full bg-primary/90 text-white flex items-center justify-center">
                        <span className="material-icons">play_arrow</span>
                      </button>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-medium mb-1">{video.title}</h4>
                    <p className="text-sm text-neutral-600">{video.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
