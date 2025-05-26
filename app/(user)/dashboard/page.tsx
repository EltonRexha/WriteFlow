import { redirect } from 'next/navigation';

const page = () => {
  redirect('/dashboard/stats');
}

export default page
