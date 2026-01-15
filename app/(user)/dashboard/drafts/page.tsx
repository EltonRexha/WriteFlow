import { getServerSession } from 'next-auth';
import DraftList from './_components/DraftList';
import { Edit3, Clock, ShieldCheck } from 'lucide-react';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

const DraftsPage = async () => {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-base-200/30">
      <div className="bg-base-100 border-b border-base-content/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-warning/10 p-3 rounded-xl">
                <Edit3 className="h-8 w-8 text-warning" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">Your Drafts</h1>
                <p className="text-base-content/60">
                  Work in progress - manage your draft articles
                </p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-warning" />
                <span className="text-base-content/60">Editing</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-info" />
                <span className="text-base-content/60">Auto-saved</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-success" />
                <span className="text-base-content/60">Private</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {session?.user ? (
            <DraftList user={session.user} />
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-base-300 rounded-full mb-6">
                <Edit3 className="h-10 w-10 text-base-content/40" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Authentication Required</h3>
              <p className="text-base-content/60 max-w-md mx-auto">
                Please sign in to view and manage your draft articles.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DraftsPage;
