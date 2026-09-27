import EventPicker from "./EventPicker";
import { IconList } from "../icons/Icons";

export default function RegistrationsPicker() {
  return (
    <EventPicker
      title="Registrations"
      subtitle="Pick an event to see who's registered"
      icon={IconList}
      destination={(id) => `/dashboard/events/${id}/registrations`}
    />
  );
}
