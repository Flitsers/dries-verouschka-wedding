import WeddingFaqAccordion, {
  type FaqItem,
} from "@/components/sections/WeddingFaqAccordion";
import { getRsvpDeadlineText } from "@/lib/wedding";

type Props = {
  includesStadhuis?: boolean;
};

const generalFaqItems: FaqItem[] = [
  {
    question: "Tegen wanneer moeten we antwoorden?",
    answer: `Gelieve ten laatste op ${getRsvpDeadlineText()} te antwoorden.`,
  },
  {
    question: "Kan ik mijn RSVP later nog aanpassen?",
    answer: "Ja. Je kunt je antwoord later opnieuw openen en aanpassen via je persoonlijke uitnodiging.",
  },
  {
    question: "Kan ik dieetwensen of allergieën doorgeven?",
    answer: "Ja. Per aanwezige persoon kun je aangeven of die vegetarisch of vegan eet. Allergieën of andere aandachtspunten kun je in het opmerkingenveld vermelden.",
  },
  {
    question: "Kan ik een verzoeknummer doorgeven?",
    answer: "Ja. Iedere aanwezige kan optioneel één nummer doorgeven dat hij of zij graag op het avondfeest wil horen.",
  },
  {
    question: "Mag ik iemand meenemen?",
    answer: "Je kunt enkel antwoorden voor het aantal personen dat op je persoonlijke uitnodiging voorzien is. De uitnodigingen zijn voorzien voor maximaal één of twee volwassenen.",
  },
];

const stadhuisFaq: FaqItem = {
  question:
    "Ik ben uitgenodigd voor het stadhuis, maar kan daar niet bij zijn. Kan ik wel naar de rest komen?",
  answer:
    "Ja. Als het stadhuis deel uitmaakt van je uitnodiging, kun je in je RSVP apart aangeven of je daar aanwezig bent. Dat staat los van je aanwezigheid op de rest van de trouw.",
};

export default function WeddingFaq({ includesStadhuis = false }: Props) {
  const items = includesStadhuis
    ? [...generalFaqItems, stadhuisFaq]
    : generalFaqItems;

  return <WeddingFaqAccordion items={items} />;
}
