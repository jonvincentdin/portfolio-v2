"use client";

import Image from "next/image";
import { motion, type PanInfo, type Variants } from "framer-motion";
import { AngularPanel } from "@/components/ui/AngularPanel";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ProgressIndicator } from "@/components/ui/ProgressIndicator";
import { getProjectMediaUrl, type LoadedProject } from "@/lib/content/media";
import { usePrefersReducedMotion } from "@/lib/motion/usePrefersReducedMotion";
import { DURATION, EASE_MECHANICAL, EASE_STANDARD } from "@/lib/motion/tokens";
import { ProjectSpecs } from "./ProjectSpecs";

type ProjectViewerProps = {
  project: LoadedProject;
  index: number;
  total: number;
  direction: 1 | -1;
  navigation: React.ReactNode;
  onSwipeNext: () => void;
  onSwipePrevious: () => void;
  swipeEnabled: boolean;
};

const SWIPE_OFFSET_THRESHOLD = 80;
const SWIPE_VELOCITY_THRESHOLD = 500;

/**
 * Displays the current project as a single animated card (spec §32):
 * image, title, metadata, and spec rows move together as one directional
 * group on enter/exit, with a short internal stagger on entry. Also the
 * swipeable surface for touch gestures (spec's Milestone 05 "Touch:
 * swipe support").
 *
 * Layout follows RESPONSIVE.md: mobile is a single deliberate stack
 * (number → name → image → summary → specifications → controls); desktop
 * (lg+) rearranges into a metadata/spec column beside a dominant image,
 * with controls directly under the image.
 */
export function ProjectViewer({
  project,
  index,
  total,
  direction,
  navigation,
  onSwipeNext,
  onSwipePrevious,
  swipeEnabled,
}: ProjectViewerProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const cardVariants: Variants = prefersReducedMotion
    ? {
        enter: { opacity: 0 },
        center: { opacity: 1, transition: { duration: 0.01 } },
        exit: { opacity: 0, transition: { duration: 0.01 } },
      }
    : {
        enter: (dir: 1 | -1) => ({ x: dir >= 0 ? 80 : -80, opacity: 0 }),
        center: {
          x: 0,
          opacity: 1,
          transition: {
            duration: DURATION.cinematic,
            ease: EASE_MECHANICAL,
            staggerChildren: 0.06,
            delayChildren: 0.05,
          },
        },
        exit: (dir: 1 | -1) => ({
          x: dir >= 0 ? -80 : 80,
          opacity: 0,
          transition: { duration: DURATION.cinematic, ease: EASE_MECHANICAL },
        }),
      };

  const itemVariants: Variants = prefersReducedMotion
    ? { enter: { opacity: 0 }, center: { opacity: 1, transition: { duration: 0.01 } } }
    : {
        enter: { opacity: 0, y: 10 },
        center: { opacity: 1, y: 0, transition: { duration: DURATION.normal, ease: EASE_STANDARD } },
      };

  function handleDragEnd(_event: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) {
    const { offset, velocity } = info;
    if (offset.x <= -SWIPE_OFFSET_THRESHOLD || velocity.x <= -SWIPE_VELOCITY_THRESHOLD) {
      onSwipeNext();
    } else if (offset.x >= SWIPE_OFFSET_THRESHOLD || velocity.x >= SWIPE_VELOCITY_THRESHOLD) {
      onSwipePrevious();
    }
  }

  return (
    <motion.div
      custom={direction}
      variants={cardVariants}
      initial="enter"
      animate="center"
      exit="exit"
      drag={swipeEnabled && !prefersReducedMotion ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.12}
      onDragEnd={handleDragEnd}
      className="touch-pan-y lg:grid lg:grid-cols-[380px_1fr] lg:gap-x-14"
    >
      <motion.div variants={itemVariants} className="lg:[grid-column:1] lg:[grid-row:1]">
        <ProgressIndicator current={index + 1} total={total} direction={direction} />
      </motion.div>

      <motion.div variants={itemVariants} className="mt-3 lg:mt-0 lg:[grid-column:1] lg:[grid-row:2]">
        <h1 className="font-heading text-heading-lg uppercase tracking-tight break-words sm:text-display-lg">
          {project.name}
        </h1>
        <p className="mt-2 font-body text-body-lg text-foreground-muted">{project.tagline}</p>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-6 lg:mt-0 lg:[grid-column:2] lg:[grid-row:1/5]"
      >
        <AngularPanel className="relative aspect-[16/10] overflow-hidden lg:aspect-auto lg:h-full lg:min-h-[420px]">
          <Image
            src={getProjectMediaUrl(project, project.media.hero)}
            alt={`${project.name} — ${project.tagline}`}
            fill
            sizes="(min-width: 1024px) 62vw, 100vw"
            className="pointer-events-none object-cover"
            priority={index === 0}
            draggable={false}
          />
        </AngularPanel>
      </motion.div>

      <motion.p
        variants={itemVariants}
        className="mt-6 max-w-2xl font-body text-body-md text-foreground-muted lg:mt-6 lg:[grid-column:1] lg:[grid-row:3]"
      >
        {project.description}
      </motion.p>

      <motion.div variants={itemVariants} className="mt-8 lg:mt-6 lg:[grid-column:1] lg:[grid-row:4]">
        <ProjectSpecs project={project} />
        <ArrowLink href={`/projects/${project.slug}`} variant="primary" className="mt-6">
          View Case Study
        </ArrowLink>
      </motion.div>

      <motion.div
        variants={itemVariants}
        className="mt-8 border-t border-border pt-6 lg:mt-6 lg:border-t-0 lg:pt-0 lg:[grid-column:2] lg:[grid-row:5]"
      >
        {navigation}
      </motion.div>
    </motion.div>
  );
}
