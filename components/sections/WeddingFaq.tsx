import WeddingFaqAccordion, {
  type FaqItem,
} from "@/components/sections/WeddingFaqAccordion";
import { getWeddingScheduleTime, wedding } from "@/lib/wedding";

type Props = {
  includeCeremonyDetails?: boolean;
};

const ceremonyFaq: FaqItem = {
  question: "Hoe laat worden we verwacht?",
  answer: `De ceremonie start om ${getWeddingScheduleTime("Ceremonie")}. We vragen onze gasten tijdig aanwezig te zijn.`,
};

const generalFaqItems: FaqItem[] = [
  {
    question: "Waar kunnen we parkeren?",
    answer: "Er is parking voorzien bij de locatie. Meer praktische informatie volgt binnenkort.",
  },
  {
    question: "Is er een dresscode?",
    answer: `${wedding.dresscode}. Warme kleuren, elegante outfits en een feestelijke winterse sfeer.`,
  },
  {
    question: "Kunnen we blijven overnachten?",
    answer: `${wedding.hotels[0].name} ligt op ongeveer ${wedding.hotels[0].distance} van ${wedding.venue.name}.`,
  },
  {
    question: "Wat kunnen we cadeau doen?",
    answer: wedding.gift,
  },
];

export default function WeddingFaq({ includeCeremonyDetails = true }: Props) {
  const items = includeCeremonyDetails
    ? [ceremonyFaq, ...generalFaqItems]
    : generalFaqItems;

  return <WeddingFaqAccordion items={items} />;
}
