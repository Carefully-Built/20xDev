import { redirect } from 'next/navigation';

export default function ItemsPage(): never {
  redirect('/dashboard/people');
}
