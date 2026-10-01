import type { Metadata } from "next";
import { PolicyPage } from "@/components/site/policy";
import { privacy } from "@content/policies";

export const metadata: Metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return <PolicyPage eyebrow="Privacy" title="How we look after your data" sections={privacy} />;
}
