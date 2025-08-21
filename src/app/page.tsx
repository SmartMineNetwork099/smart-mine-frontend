import { redirect } from 'next/navigation';

export default function Home() {
    redirect('/stacking/dashboard');
    // return null;
}
