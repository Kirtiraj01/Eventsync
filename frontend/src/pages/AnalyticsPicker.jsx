import EventPicker from "./EventPicker";
import { IconBarChart } from "../icons/Icons";

export default function AnalyticsPicker() {
  return (
    <EventPicker
      title="Analytics"
      subtitle="Pick an event to see its analytics"
      icon={IconBarChart}
      destination={(id) => `/dashboard/events/${id}/analytics`}
    />
  );
}
