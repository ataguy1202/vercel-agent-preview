import { getAllPreviews } from '@/lib/mock-data';
import { PreviewDetail } from '@/components/preview/preview-detail';

export function generateStaticParams() {
  return getAllPreviews().map((preview) => ({
    id: preview.id,
  }));
}

export default async function PreviewDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PreviewDetail id={id} />;
}
