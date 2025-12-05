import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          {t("welcome")}
        </h1>
        <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
          {t("subtitle")}
        </p>
      </div>
    </div>
  );
}

