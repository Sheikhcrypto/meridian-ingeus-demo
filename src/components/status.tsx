import { Badge } from "@/components/ui/badge";
import { riskTone, stageLabel } from "@/lib/meridian/format";
import type { JourneyStage, RiskLevel } from "@/lib/meridian/types";

export function StageBadge({ stage }: { stage: JourneyStage }) {
  const employed = stage === "employed" || stage === "sustainment" || stage === "completed";
  return <Badge tone={employed ? "good" : "accent"}>{stageLabel(stage)}</Badge>;
}

export function RiskBadge({ risk }: { risk: RiskLevel }) {
  return (
    <Badge tone={riskTone(risk)}>
      {risk === "high" ? "High risk" : risk === "medium" ? "Watch" : "Steady"}
    </Badge>
  );
}
