import {
  CHAPTERS,
  PRACTICE_QUESTIONS,
  SIMULATIONS,
  SUBJECTS,
  TOPICS,
} from '../../content/registry';
import type { SearchResultItem } from '../../types/physics';

export function searchPhysicsContent(rawQuery: string, limit = 16): SearchResultItem[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const tokens = query.split(/\s+/).filter(Boolean);
  const scored: { score: number; item: SearchResultItem }[] = [];

  const scoreText = (haystack: string, boost = 1): number => {
    const lower = haystack.toLowerCase();
    let score = 0;
    if (lower === query) score += 100 * boost;
    else if (lower.startsWith(query)) score += 60 * boost;
    else if (lower.includes(query)) score += 35 * boost;

    let allTokensMatch = true;
    for (const token of tokens) {
      if (lower.includes(token)) {
        score += 12 * boost;
      } else {
        allTokensMatch = false;
      }
    }
    if (allTokensMatch && tokens.length > 1) {
      score += 20 * boost;
    }
    return score;
  };

  for (const subject of SUBJECTS) {
    const s = scoreText(`${subject.title} ${subject.subtitle} ${subject.description}`, 1.2);
    if (s > 0) {
      scored.push({
        score: s,
        item: {
          id: `sub-${subject.id}`,
          category: 'Subject',
          title: subject.title,
          subtitle: subject.status === 'available' ? subject.subtitle : `${subject.subtitle} (Coming soon)`,
          route: subject.status === 'available' ? 'subject' : 'explore',
          params: { subjectId: subject.id },
        },
      });
    }
  }

  for (const chapter of CHAPTERS) {
    const s = scoreText(`${chapter.title} ${chapter.summary} ${chapter.learningObjectives.join(' ')}`, 1.3);
    if (s > 0) {
      scored.push({
        score: s,
        item: {
          id: `chap-${chapter.id}`,
          category: 'Chapter',
          title: `Chapter ${chapter.number}: ${chapter.title}`,
          subtitle: chapter.summary,
          route: chapter.status === 'available' ? 'chapter' : 'subject',
          params: { chapterId: chapter.id, subjectId: chapter.subjectId },
        },
      });
    }

    for (const eq of chapter.keyEquations) {
      const eqScore = scoreText(`${eq.label} ${eq.meaning} ${eq.latex}`, 0.9);
      if (eqScore > 0) {
        scored.push({
          score: eqScore,
          item: {
            id: `eq-${chapter.id}-${eq.label}`,
            category: 'Equation',
            title: eq.label,
            subtitle: `${eq.meaning} (${chapter.title})`,
            route: 'chapter',
            params: { chapterId: chapter.id },
          },
        });
      }
    }
  }

  for (const topic of TOPICS) {
    const s = scoreText(
      `${topic.sectionNumber ?? ''} ${topic.title} ${topic.shortDescription} ${topic.keywords.join(' ')} ${topic.workedExample.title}`,
      1.4,
    );
    if (s > 0) {
      scored.push({
        score: s,
        item: {
          id: `top-${topic.id}`,
          category: 'Topic',
          title: topic.sectionNumber ? `${topic.sectionNumber} ${topic.title}` : topic.title,
          subtitle: `${topic.shortDescription} · Worked Example: ${topic.workedExample.title}`,
          route: 'chapter',
          params: { chapterId: topic.chapterId, topicId: topic.id },
        },
      });
    }
  }

  for (const sim of SIMULATIONS) {
    const s = scoreText(`${sim.title} ${sim.summary} ${sim.relatedTopics.join(' ')}`, 1.5);
    if (s > 0) {
      scored.push({
        score: s,
        item: {
          id: `sim-${sim.id}`,
          category: 'Simulation',
          title: `${sim.title} (${sim.dimension})`,
          subtitle: sim.summary,
          route: 'simulations',
          params: { simId: sim.id },
        },
      });
    }
  }

  for (const q of PRACTICE_QUESTIONS) {
    const s = scoreText(`${q.prompt} ${q.topicId} ${q.explanation}`, 0.85);
    if (s > 0) {
      const chTitle = CHAPTERS.find((c) => c.id === q.chapterId)?.title ?? 'Physics';
      scored.push({
        score: s,
        item: {
          id: `prac-${q.id}`,
          category: 'Practice',
          title: `Practice (${q.difficulty}): ${q.prompt.slice(0, 72)}${q.prompt.length > 72 ? '…' : ''}`,
          subtitle: `${chTitle} · ${q.type.replace('-', ' ')}`,
          route: 'practice',
          params: { questionId: q.id, chapterId: q.chapterId },
        },
      });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}
