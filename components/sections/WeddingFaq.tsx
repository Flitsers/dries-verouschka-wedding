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
    answer: "Er is ruime gratis parking voorzien aan de locatie.",
  },
  {
    question: "Mogen kinderen meekomen?",
    answer: "Onze trouw is een feest voor volwassenen. We vragen daarom vriendelijk om geen kinderen mee te brengen.",
  },
  {
    question: "Is er een dresscode?",
    answer: `${wedding.dresscode}. Warme kleuren, elegante outfits en een feestelijke winterse sfeer.`,
  },
  {
    question: "Kunnen we blijven overnachten?",
    answer: "Voor wie graag in de buurt overnacht, zijn er verschillende mogelijkheden in en rond Dilbeek.",
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
