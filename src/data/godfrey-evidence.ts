/**
 * Exhibition evidence for Captain Godfrey.
 * Values are taken from the Captain Godfrey Installation Visitor Engagement
 * Report for 12–27 September 2026. They are not recomputed from raw logs.
 */
export type EvidenceMetric = {
  id: string;
  value: string;
  unit: string;
  displayLabel: string;
  period: string;
  population: string;
  method: string;
  caveat: string;
  sourceTitle: string;
  publicationStatus: "public";
  group: "primary" | "secondary";
};

const sourceTitle =
  "Captain Godfrey Installation Visitor Engagement Report, Georgette 150th Exhibition, 12–27 September 2026.";

const period = "15 gallery days within 12–27 September 2026";

export const godfreyEvidence = {
  period,
  sourceTitle,
  sourceLabel: `Source: ${sourceTitle}`,
  homeNote:
    "Recorded during 15 gallery days within 12–27 September 2026. Visits and estimated conversations are not counts of unique people. Encounter duration uses a merging method; see the case study for definitions and limitations.",
  methodology:
    "The report records 207 spoken visits split by Welcome events and 990 visitor questions. A Welcome is an arrival-card event, not proof of a new person. Merging likely post-goodbye re-greets within four minutes produces an estimate of 159 conversations, with an average duration of 9.7 minutes and a median of 7.8 minutes. Rapid succession can merge different visitors. These figures describe recorded interactions, not unique visitors or gallery-wide dwell time.",
  limitation:
    "The results show sustained questioning during this exhibition. They do not establish an increase in museum attendance, a learning outcome, or a comparison with other displays.",
  metrics: [
    {
      id: "visitor-questions",
      value: "990",
      unit: "questions",
      displayLabel: "visitor questions",
      period,
      population: "Visitor questions across the complete exhibition",
      method: "Counted in the exhibition report",
      caveat: "Questions, not visitors and not API calls.",
      sourceTitle,
      publicationStatus: "public",
      group: "primary",
    },
    {
      id: "average-merged-encounter",
      value: "9.7 min",
      unit: "minutes",
      displayLabel: "average merged encounter",
      period,
      population: "Estimated merged conversations",
      method: "Mean duration after merging likely post-goodbye re-greets within four minutes",
      caveat: "Merged encounter duration, not gallery dwell time.",
      sourceTitle,
      publicationStatus: "public",
      group: "primary",
    },
    {
      id: "spoken-visit-records",
      value: "207",
      unit: "records",
      displayLabel: "spoken-visit records",
      period,
      population: "Welcome-split spoken-visit records",
      method: "Spoken visits split by Welcome events",
      caveat: "A Welcome is not a count of separate people.",
      sourceTitle,
      publicationStatus: "public",
      group: "primary",
    },
    {
      id: "merged-conversations",
      value: "159",
      unit: "conversations",
      displayLabel: "estimated merged conversations",
      period,
      population: "Estimated conversations after merging",
      method: "Likely post-goodbye re-greets within four minutes are merged",
      caveat: "An estimate. Different visitors can be merged.",
      sourceTitle,
      publicationStatus: "public",
      group: "secondary",
    },
    {
      id: "median-merged-encounter",
      value: "7.8 min",
      unit: "minutes",
      displayLabel: "median merged encounter",
      period,
      population: "Estimated merged conversations",
      method: "Median duration after the same four-minute merge",
      caveat: "Merged encounter duration, not a Welcome-clock duration.",
      sourceTitle,
      publicationStatus: "public",
      group: "secondary",
    },
    {
      id: "questions-per-record",
      value: "4.8",
      unit: "questions per record",
      displayLabel: "questions per spoken-visit record",
      period,
      population: "990 questions across 207 spoken-visit records",
      method: "Rounded. The denominator is 207 records, not 159 conversations.",
      caveat: "Per spoken-visit record, not per estimated conversation.",
      sourceTitle,
      publicationStatus: "public",
      group: "secondary",
    },
  ] satisfies EvidenceMetric[],
};

export function godfreyMetrics(group: EvidenceMetric["group"]) {
  return godfreyEvidence.metrics.filter((metric) => metric.group === group);
}
