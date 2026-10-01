import { Siren } from 'lucide-react'

import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/layout/PageHeader.jsx";

const BADGE_TONES = ["neutral", "pine", "ember", "alert", "sky", "amber"];

export default function UiGalleryPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Galeria UI"
        description="Wszystkie wspólne komponenty i ich warianty."
      />

      <div className="flex flex-wrap items-center gap-2">
        {BADGE_TONES.map((tone) => (
          <Badge key={tone} tone={tone}>
            {tone}
          </Badge>
        ))}
        <Badge tone="alert" icon={Siren}>
          Zaginiony
        </Badge>
        <Badge tone="pine" size="md">
          Rozmiar md
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="font-semibold">padding „md” (domyślny)</p>
          <p className="text-sm text-ink-muted">
            Biała karta z ciepłym cieniem.
          </p>
        </Card>
        <Card padding="sm">
          <p className="font-semibold">padding „sm”</p>
          <p className="text-sm text-ink-muted">Ciaśniejsza, np. na kafelki.</p>
        </Card>
        <Card as="article" padding="none" className="overflow-hidden">
          <div className="h-16 bg-pine-soft" />
          <p className="p-4 font-semibold">padding „none” + as=„article”</p>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <Spinner size="sm" />
        <Spinner />
        <Spinner size="lg" />
        <Spinner showLabel label="Wczytuję spacery…" />
      </div>
    </div>
  );
}
