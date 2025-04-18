import { Link } from 'wouter';

type QuickAccessItem = {
  icon: string;
  label: string;
  href: string;
  bgColor: string;
  textColor: string;
};

const QuickAccess = () => {
  const quickAccessItems: QuickAccessItem[] = [
    {
      icon: 'video_call',
      label: 'Telemedicine',
      href: '/telemedicine',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      icon: 'health_and_safety',
      label: 'AI Diagnosis',
      href: '/symptom-checker',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      icon: 'location_on',
      label: 'Find Care',
      href: '/healthcare-locator',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600'
    },
    {
      icon: 'emergency',
      label: 'SOS',
      href: '/emergency',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600'
    },
    {
      icon: 'medication',
      label: 'Reminders',
      href: '/reminders',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      icon: 'forum',
      label: 'Community',
      href: '/community',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-600'
    }
  ];

  return (
    <section className="py-8 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto pb-4 space-x-4">
          {quickAccessItems.map((item) => (
            <Link key={item.label} href={item.href}>
              <div className="flex-none w-32 text-center cursor-pointer">
                <div className={`w-16 h-16 mx-auto ${item.bgColor} rounded-full flex items-center justify-center ${item.textColor}`}>
                  <span className="material-icons">{item.icon}</span>
                </div>
                <p className="mt-2 text-sm font-medium">{item.label}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickAccess;
