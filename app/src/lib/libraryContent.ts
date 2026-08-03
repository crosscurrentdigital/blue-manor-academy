// Public-domain texts — Aesop's Fables — used deliberately instead of any of
// Blue Manor Academy's actual e-book curriculum, which is their paid,
// copyrighted product and not something to reproduce without a license.
// Three lessons (not one) specifically so "resume where you left off"
// across multiple books is something you can actually see working, not
// just a single-item toggle. Shared between Library.tsx (the full reading
// view) and Home.tsx (the "continue reading" nudge), so both read from one
// source of truth.
export interface Lesson {
  id: string;
  title: string;
  source: string;
  paragraphs: string[];
  moral: string;
}

export const SAMPLE_LESSONS: Lesson[] = [
  {
    id: "tortoise-and-hare",
    title: "The Tortoise and the Hare",
    source: "Aesop's Fables (public domain)",
    paragraphs: [
      "A Hare was making fun of the Tortoise one day for being so slow.",
      '"Do you ever get anywhere?" he asked with a mocking laugh.',
      '"Yes," replied the Tortoise, "and I get there sooner than you think. I\'ll run you a race and prove it."',
      "The Hare, was much amused at the idea of running a race with the Tortoise, but for the fun of the thing he agreed. So the Fox, who had consented to act as judge, marked the distance and started the runners off.",
      "The Hare was soon far out of sight, and to make the Tortoise feel very deeply how ridiculous it was for him to try a race with a Hare, he lay down beside the course to take a nap until the Tortoise should catch up.",
      "The Tortoise meanwhile kept going slowly but steadily, and, after a time, passed the place where the Hare was sleeping. But the Hare slept on very peacefully; and when at last he did wake up, the Tortoise was near the goal. The Hare now ran his swiftest, but he could not overtake the Tortoise in time.",
    ],
    moral: "The race is not always to the swift.",
  },
  {
    id: "boy-who-cried-wolf",
    title: "The Shepherd Boy and the Wolf",
    source: "Aesop's Fables (public domain)",
    paragraphs: [
      "A Shepherd Boy tended his master's Sheep near a dark forest not far from the village. Soon he found life in the pasture very dull.",
      'He thought it would be great fun to fool the villagers by crying "Wolf! Wolf!" even though no wolf was in sight.',
      "The villagers came running, only to find the Boy laughing at the trick he had played on them.",
      '"Wolf! Wolf!" he cried again, and again the villagers ran to help, only to be laughed at once more.',
      "Then one day a Wolf did truly come. The Boy cried out in earnest, but the villagers, thinking it was another trick, did not come to help, and the Wolf had a good meal.",
    ],
    moral: "Nobody believes a liar, even when he is telling the truth.",
  },
  {
    id: "ant-and-grasshopper",
    title: "The Ant and the Grasshopper",
    source: "Aesop's Fables (public domain)",
    paragraphs: [
      "In a field one summer's day a Grasshopper was hopping about, chirping and singing to its heart's content.",
      "An Ant passed by, bearing along with great effort an ear of corn he was taking to the nest.",
      '"Why not come and chat with me," said the Grasshopper, "instead of toiling and moiling in that way?"',
      '"I am helping to lay up food for the winter," said the Ant, "and recommend you to do the same."',
      "When the winter came the Grasshopper had no food and found itself dying of hunger, while it saw the ants distributing every day corn from the stores they had collected in the summer.",
    ],
    moral: "It is best to prepare for the days of necessity.",
  },
];
