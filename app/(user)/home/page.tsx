import { redirect } from 'next/navigation';

export default function Page() {
  redirect('/home/for-you');
  return null;
}
