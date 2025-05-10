import PlanExpo from "@/features/jurado/views/PlanExpo";

export default async function Page({
  params,
}: {
  params: { exposicion_id: string };
}) {
  const exposicionId = parseInt(params.exposicion_id, 10);
  return <PlanExpo etapaFormativaId={exposicionId} />;
}
