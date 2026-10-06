import { useState } from "react";
import { View, Pressable, useWindowDimensions } from "react-native";
import { useProgress } from "../../application/ProgressProvider";
import { questions } from "../../content";
import { dictations, readings, writingPrompts } from "../../content/workshops";
import { training } from "../../domain/learning";
import { skills, type Skill } from "../../domain/models";
import { Badge, Button, Card, Heading, Icon, Label, T } from "../atoms/ui";
import { Section } from "../molecules/Section";
import type { Navigate } from "../navigation";
type Filter = "quiz" | "dictation" | "reading" | "writing" | "exam";
export function Practice({ navigate }: { navigate: Navigate }) {
  const { progress } = useProgress();
  const [filter, setFilter] = useState<Filter>("quiz");
  const wide = useWindowDimensions().width > 700;
  const filters: { id: Filter; name: string }[] = [
    { id: "quiz", name: "Quiz ciblés" },
    { id: "dictation", name: "Dictées" },
    { id: "reading", name: "Lecture orale" },
    { id: "writing", name: "Rédaction" },
    { id: "exam", name: "Niveaux et certifications" },
  ];
  return (
    <View className="gap-6">
      <Label>L’atelier des progrès</Label>
      <Heading>S’entraîner, comprendre, retenir.</Heading>
      <T muted>
        Choisis une compétence ou une façon d’apprendre. Tout est disponible
        hors ligne.
      </T>
      <Button
        secondary
        icon="Lightbulb"
        onPress={() => navigate({ kind: "tips" })}
      >
        Les astuces de remplacement et les sons
      </Button>
      <View className="flex-row flex-wrap gap-2">
        {filters.map((f) => (
          <Pressable
            key={f.id}
            accessibilityRole="button"
            accessibilityState={{ selected: filter === f.id }}
            onPress={() => setFilter(f.id)}
            className={`px-4 py-3 rounded-full border ${filter === f.id ? "bg-brand border-brand" : "bg-white border-line"}`}
          >
            <T className={filter === f.id ? "text-white" : "text-muted"}>
              {f.name}
            </T>
          </Pressable>
        ))}
      </View>
      {filter === "quiz" && (
        <View className="flex-row flex-wrap gap-4">
          {(Object.keys(skills) as Skill[]).map((skill) => (
            <View key={skill} style={{ width: wide ? "48%" : "100%" }}>
              <Card>
                <View className="flex-row gap-4 items-center">
                  <View className="bg-blush w-12 h-12 rounded-2xl items-center justify-center">
                    <T className="text-brand text-xl">{skills[skill].symbol}</T>
                  </View>
                  <View className="flex-1">
                    <Heading small>{skills[skill].title}</Heading>
                    <T muted className="text-xs">
                      {questions.filter((q) => q.skill === skill).length}{" "}
                      questions expliquées
                    </T>
                  </View>
                </View>
                <T muted className="mt-3 mb-5">
                  {skills[skill].description}
                </T>
                <Button
                  secondary
                  icon="ArrowRight"
                  onPress={() =>
                    navigate({
                      kind: "quiz",
                      questions: training(progress, questions, skill),
                      mode: "training",
                      title: skills[skill].title,
                    })
                  }
                >
                  M’entraîner
                </Button>
              </Card>
            </View>
          ))}
        </View>
      )}
      {filter === "dictation" && (
        <View className="gap-3">
          <T muted>
            Écoute, mets en pause, écris puis compare. Les voix de synthèse sont
            intégrées à l’application.
          </T>
          {dictations.map((d) => (
            <Row
              key={d.id}
              title={d.title}
              badge={d.level}
              body={
                progress.dictations.find((x) => x.id === d.id)
                  ? "Déjà pratiquée · tu peux recommencer"
                  : "Audio local · correction mot à mot"
              }
              icon="Headphones"
              onPress={() => navigate({ kind: "dictation", id: d.id })}
            />
          ))}
        </View>
      )}
      {filter === "reading" && (
        <View className="gap-3">
          <T muted>
            Lis à voix haute pour travailler ton articulation et ton aisance.
            Enregistre-toi si tu le souhaites : aucune analyse automatique.
          </T>
          {readings.map((r) => (
            <Row
              key={r.id}
              title={r.title}
              badge={r.level}
              body={`${r.duration} à ${r.duration + 1} min · ${r.focus}`}
              icon="Mic"
              onPress={() => navigate({ kind: "reading", id: r.id })}
            />
          ))}
        </View>
      )}
      {filter === "writing" && (
        <View className="gap-3">
          <T muted>
            Un sujet, un plan et un modèle commenté. Tes brouillons restent sur
            cet appareil.
          </T>
          {writingPrompts.map((w) => (
            <Row
              key={w.id}
              title={w.title}
              badge={w.level}
              body={`${w.duration} min · ${progress.writings.some((x) => x.promptId === w.id) ? "Brouillon enregistré" : "Rédaction guidée"}`}
              icon="PenLine"
              onPress={() => navigate({ kind: "writing", id: w.id })}
            />
          ))}
        </View>
      )}
      {filter === "exam" && (
        <View className="gap-4">
          <Card>
            <Badge>A1 · A2 · B1 · B2 · C1 · C2</Badge>
            <Heading small>Niveaux et examens blancs</Heading>
            <T muted className="my-4">
              Un diagnostic approfondi et six parcours de préparation DELF/DALF
              avec lecture, écoute, rédaction et expression orale.
            </T>
            <Button
              icon="GraduationCap"
              onPress={() => navigate({ kind: "certifications" })}
            >
              Explorer les niveaux et certifications
            </Button>
          </Card>
          <Card>
            <Badge>28 QUESTIONS · ENVIRON 20 MINUTES</Badge>
            <Heading small>Le bilan transversal</Heading>
            <T muted className="my-4">
              Grammaire, orthographe, vocabulaire et compréhension. Un bilan
              sans chronomètre pour vérifier ce que tu maîtrises.
            </T>
            <Button
              onPress={() => {
                const items = (Object.keys(skills) as Skill[]).flatMap((s) =>
                  training(progress, questions, s, false, 4),
                );
                navigate({
                  kind: "quiz",
                  questions: items,
                  mode: "exam",
                  title: "Bilan transversal",
                });
              }}
            >
              Commencer le bilan
            </Button>
          </Card>
          <Card>
            <Badge>REGISTRE SOUTENU</Badge>
            <Heading small>Précision et nuances</Heading>
            <T muted className="my-4">
              20 questions de niveau avancé sur les accords, les modes, le
              vocabulaire et la construction du texte.
            </T>
            <Button
              secondary
              onPress={() =>
                navigate({
                  kind: "quiz",
                  questions: training(
                    progress,
                    questions.filter((q) => q.level === 3),
                    undefined,
                    false,
                    20,
                  ),
                  mode: "exam",
                  title: "Précision et nuances",
                })
              }
            >
              Évaluer mes acquis
            </Button>
          </Card>
          <T muted className="text-xs">
            Contenus originaux d’entraînement. Ces bilans ne délivrent aucune
            certification officielle.
          </T>
        </View>
      )}
    </View>
  );
}
function Row({
  title,
  badge,
  body,
  icon,
  onPress,
}: {
  title: string;
  badge: string;
  body: string;
  icon: Parameters<typeof Icon>[0]["name"];
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="bg-white border border-line rounded-2xl p-5 flex-row gap-4 items-center active:bg-blush"
    >
      <View className="bg-paper p-3 rounded-2xl">
        <Icon name={icon} />
      </View>
      <View className="flex-1">
        <View className="flex-row flex-wrap gap-2 items-center">
          <T className="text-lg" style={{ fontFamily: "InterSemi" }}>
            {title}
          </T>
          <Badge>{badge}</Badge>
        </View>
        <T muted className="mt-1">
          {body}
        </T>
      </View>
      <Icon name="ChevronRight" />
    </Pressable>
  );
}
