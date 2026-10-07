import { Siren, Plus, LogOut, MapPin } from "lucide-react";

import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";
import Spinner from "../../components/ui/Spinner";
import PageHeader from "../../components/layout/PageHeader.jsx";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select.jsx";
import Input from "../../components/ui/Input.jsx";
import Textarea from "../../components/ui/Textarea.jsx";


const BUTTON_VARIANTS = [
  "primary",
  "accent",
  "secondary",
  "ghost",
  "danger",
  "alert",
];
const BUTTON_SIZES = ["sm", "md", "lg", "xl"];

const BADGE_TONES = ["neutral", "pine", "ember", "alert", "sky", "amber"];

export default function UiGalleryPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Galeria UI"
        description="Wszystkie wspólne komponenty i ich warianty."
      />

      <div className="space-y-4">
        <div className="flex flex-wrap gap-3">
          {BUTTON_VARIANTS.map((variant) => (
            <Button key={variant} variant={variant}>
              {variant}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {BUTTON_SIZES.map((size) => (
            <Button key={size} size={size} icon={Plus}>
              Rozmiar {size}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button to="/" variant="secondary">
            Link (prop „to”)
          </Button>
          <Button disabled>Wyłączony</Button>
          <Button variant="danger" icon={LogOut}>
            Wyloguj się
          </Button>
        </div>
        <div className="max-w-md">
          <Button variant="alert" size="xl" icon={MapPin} fullWidth>
            Wyślij moją lokalizację
          </Button>
        </div>
      </div>

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

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Imię zwierzęcia"
          placeholder="np. Luna"
          hint="Tak zobaczy je znalazca."
        />
        <Input
          label="Adres e-mail"
          type="email"
          defaultValue="maciej@"
          error="Wpisz poprawny adres e-mail."
        />
        <Select label="Gatunek" defaultValue="dog">
          <option value="dog">Pies</option>
          <option value="cat">Kot</option>
          <option value="other">Inne</option>
        </Select>
        <Input label="Wyłączone" defaultValue="LUNA-7K2Q" disabled />
        <Textarea
          label="Komunikat dla znalazców"
          placeholder="np. Jest płochliwa, nie goń jej."
          className="sm:col-span-2"
        />
      </div>
    </div>
  );
}
