import { Heading } from "@astryxdesign/core/Heading";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import { useEffect, useState } from "react";

/**
 * The three answers the claim turns through. The stage under the sentence takes
 * its content from the one in the middle, so this list is the second screen's
 * index too.
 */
const answers = ["Open Format", "Extension Ecosystem", "Standard Library"] as const;

/** How long one answer holds before the next takes its place. */
const beatMs = 2600;

// The name a reader is given. The words the window shows come and go, so the
// name has to say all three.
const claim = `TRAJS is ${answers[0]}, ${answers[1]} and ${answers[2]} for Agent Trajectory`;

/**
 * Where an answer sits in the window: in the middle, arriving from below, or
 * leaving upward. The list is exactly the three answers, so one step fills all
 * three places and the answer at each end is the one that crosses to the other.
 */
function placeOf(answer: number, active: number) {
  const step = (answer - active + answers.length) % answers.length;

  if (step === 0) return "middle";

  if (step === 1) return "below";

  return "above";
}

/**
 * The second screen: the sentence naming what TRAJS is for agent trajectory,
 * whose object turns through the three answers, over the stage the answer's
 * content will fill.
 */
export function LandingPitch({ reducesMotion }: { reducesMotion: boolean }) {
  // The stage reads this same index, so the sentence and the content answering it
  // cannot disagree.
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reducesMotion) return;

    const beat = window.setInterval(() => {
      setActive((answer) => (answer + 1) % answers.length);
    }, beatMs);

    return () => window.clearInterval(beat);
  }, [reducesMotion]);

  return (
    <VStack as="section" className="landing-screen landing-pitch">
      {/* The name carries the whole sentence: the window is a moving picture of
          its object, so a reader without the motion still reads all three. */}
      <Heading level={2} className="landing-claim" aria-label={claim}>
        <Text as="span" display="block" type="inherit" className="landing-claim-line">
          TRAJS is
        </Text>
        <VStack as="span" className="landing-claim-window" aria-hidden="true">
          {answers.map((answer, index) => (
            <Text
              key={answer}
              as="span"
              display="block"
              type="inherit"
              className={`landing-claim-row landing-claim-row--${placeOf(index, active)}`}
            >
              {answer}
            </Text>
          ))}
        </VStack>
        <Text as="span" display="block" type="inherit" className="landing-claim-line">
          for Agent Trajectory
        </Text>
      </Heading>
      {/* The claim's other half. It is empty until the content answering the answer
          in the middle lands here, and it holds the rest of the screen, so that
          content arrives without moving the sentence above it. */}
      <VStack className="landing-pitch-stage" />
    </VStack>
  );
}
