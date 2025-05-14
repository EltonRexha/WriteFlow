import { getCategories } from '@/server-actions/categories/action';
import { redirect } from 'next/navigation';
import clsx from 'clsx';
import Link from 'next/link';

const TopicBar = async ({ topic }: { topic: string }) => {
  const topics = [
    { name: 'For-You' },
    { name: 'Following' },
    ...(await getCategories()),
  ];

  if (
    !topics.find(
      (item) => item.name.toLowerCase() === topic.toLocaleLowerCase()
    )
  ) {
    redirect('/home');
  }

  return (
    <div className="w-full border-b border-base-content/10">
      <div className="mx-auto overflow-x-auto no-scrollbar">
        <div
          role="tablist"
          className="tabs tabs-bordered whitespace-nowrap inline-block min-w-full"
        >
          {topics.map((item) => (
            <Link
              role="tab"
              className={clsx(
                'tab capitalize',
                item.name.toLowerCase() === topic.toLowerCase()
                  ? 'tab-active'
                  : ''
              )}
              key={item.name}
              href={`/home/${item.name}`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopicBar;
