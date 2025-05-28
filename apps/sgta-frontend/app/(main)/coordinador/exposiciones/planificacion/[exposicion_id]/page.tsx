import PlanExpo from "@/features/jurado/views/plan-expo";

export default async function Page({
  params,
}: {
  params: Promise<{ exposicion_id: string }>;
}) {
  const resolvedParams = await params;

  const exposicionId = parseInt(resolvedParams.exposicion_id, 10);

  return <PlanExpo exposicionId={exposicionId} />;
}
