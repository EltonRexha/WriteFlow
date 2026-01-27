import DefaultLoader from "@/components/DefaultLoader";

const loadingMessages = [
  "Fetching blog data",
  "Setting things up",
  "Getting everything ready",
];

export default function Loading() {
  return <DefaultLoader loadingMessages={loadingMessages} />;
}
