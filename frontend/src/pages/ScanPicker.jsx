import EventPicker from "./EventPicker";
import { IconScan } from "../icons/Icons";

export default function ScanPicker() {
  return (
    <EventPicker
      title="Scan check-in"
      subtitle="Pick an event to start scanning tickets"
      icon={IconScan}
      destination={(id) => `/dashboard/events/${id}/scan`}
    />
  );
}
