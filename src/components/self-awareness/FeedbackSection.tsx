import { SeekingFeedbackSection } from "@/components/seeking-feedback/SeekingFeedback";
import { GivingFeedbackSection } from "@/components/self-awareness/GivingFeedbackSection";

type Props = { headingId: string };

export function FeedbackSection({ headingId }: Props) {
  return (
    <div className="mx-auto max-w-[40rem] px-5 pb-16 pt-8 sm:max-w-[42rem] sm:px-8 sm:pb-20 sm:pt-10">
      <div className="space-y-8">
        <SeekingFeedbackSection headingId={`${headingId}-seeking`} embedded />
        <GivingFeedbackSection headingId={`${headingId}-giving`} embedded />
      </div>
    </div>
  );
}
