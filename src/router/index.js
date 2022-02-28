import DefaultLayout from '@/layouts/DefaultLayout';

export function renderByDefaultLayout(Com) {
  return (
    <DefaultLayout>
      <Com />
    </DefaultLayout>
  );
}
