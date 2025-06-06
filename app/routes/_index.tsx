import { redirect } from '@remix-run/node';

export async function loader() {
  return redirect('/organizations');
}

export default function Index() {
  return null;
}
