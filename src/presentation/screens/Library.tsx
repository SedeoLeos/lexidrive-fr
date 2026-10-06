import { useState } from "react";
import { View, Pressable } from "react-native";
import { lessons, questions } from "../../content";
import { lexicon } from "../../content/lexicon";
import { skills, type Skill } from "../../domain/models";
import { useProgress } from "../../application/ProgressProvider";
import { training } from "../../domain/learning";
import {
  Back,
  Badge,
  Button,
  Card,
  Heading,
  Icon,
  Input,
  Label,
  T,
} from "../atoms/ui";
import type { Navigate } from "../navigation";
export function Library({ navigate }: { navigate: Navigate }) {
  const [search, setSearch] = useState("");
  const [lexique, setLexique] = useState(false);
  const [filter, setFilter] = useState<Skill | null>(null);
  const { progress } = useProgress();
  const list = lessons.filter(
    (l) =>
      (!filter || l.skill === filter) &&
      `${l.title} ${l.rule}`
        .toLocaleLowerCase("fr")
        .includes(search.toLocaleLowerCase("fr")),
  );
  return (
    <View className="gap-5">
      <Label>Les repères essentiels</Label>
      <Heading>Comprendre avant de retenir.</Heading>
      <T muted>
        22 leçons et 20 fiches de vocabulaire à consulter, à pratiquer et à
        retrouver.
      </T>
      <View className="flex-row gap-3">
        <Button
          secondary={lexique}
          onPress={() => {
            setLexique(false);
            setSearch("");
          }}
        >
          Les leçons
        </Button>
        <Button
          secondary={!lexique}
          onPress={() => {
            setLexique(true);
            setSearch("");
          }}
        >
          Le lexique
        </Button>
      </View>
      <Input
        accessibilityLabel={
          lexique ? "Rechercher un mot" : "Rechercher une leçon"
        }
        value={search}
        onChangeText={setSearch}
        placeholder="Rechercher : accords, ces, accents…"
      />
      <View className="flex-row flex-wrap gap-2">
        {!lexique &&
          [null, ...(Object.keys(skills) as Skill[])].map((s) => (
            <Pressable
              key={s ?? "all"}
              accessibilityRole="button"
              onPress={() => setFilter(s)}
              className={`px-3 py-2 rounded-full ${filter === s ? "bg-brand" : "bg-white border border-line"}`}
            >
              <T className={filter === s ? "text-white" : "text-muted"}>
                {s ? skills[s].title : "Tout"}
              </T>
            </Pressable>
          ))}
      </View>
      {!lexique && !list.length && (
        <T>Aucune leçon trouvée. Essaie un autre mot.</T>
      )}
      <View className="gap-3">
        {!lexique &&
          list.map((l) => (
            <Pressable
              key={l.id}
              accessibilityRole="button"
              onPress={() => navigate({ kind: "lesson", id: l.id })}
              className="bg-white rounded-2xl border border-line p-5 flex-row items-center gap-4"
            >
              <View className="bg-paper p-3 rounded-xl">
                <Icon
                  name={
                    progress.learned.includes(l.id) ? "CheckCheck" : "BookOpen"
                  }
                  color={
                    progress.learned.includes(l.id) ? "#426C52" : "#842E1B"
                  }
                />
              </View>
              <View className="flex-1">
                <Label>{skills[l.skill].title}</Label>
                <T className="text-lg mt-1" style={{ fontFamily: "InterSemi" }}>
                  {l.title}
                </T>
                <T muted>{l.subtitle}</T>
              </View>
              <Icon name="ChevronRight" />
            </Pressable>
          ))}
      </View>
      {lexique && (
        <View className="gap-4">
          {lexicon
            .filter((w) =>
              `${w.word} ${w.meaning}`
                .toLocaleLowerCase("fr")
                .includes(search.toLocaleLowerCase("fr")),
            )
            .map((w) => (
              <Card key={w.word}>
                <Heading small>{w.word}</Heading>
                <T className="mt-3">{w.meaning}</T>
                <View className="bg-paper p-3 rounded-xl mt-3">
                  <T>{w.example}</T>
                </View>
                <T muted className="text-xs mt-3">
                  À rapprocher de : {w.family}
                </T>
                <T className="text-brand mt-2">{w.trap}</T>
              </Card>
            ))}
        </View>
      )}
    </View>
  );
}
export function LessonScreen({
  id,
  navigate,
}: {
  id: string;
  navigate: Navigate;
}) {
  const { progress, update } = useProgress();
  const lesson = lessons.find((l) => l.id === id);
  if (!lesson) return null;
  return (
    <View className="max-w-2xl w-full self-center gap-5">
      <Back onPress={() => navigate({ kind: "tab", tab: "library" })} />
      <Badge>{skills[lesson.skill].title}</Badge>
      <Heading>{lesson.title}</Heading>
      <T muted>{lesson.subtitle}</T>
      <Card>
        <Label>La règle</Label>
        <T className="mt-3 text-base leading-7">{lesson.rule}</T>
      </Card>
      <Card>
        <Label>En situation</Label>
        {lesson.examples.map((e, i) => (
          <View key={i} className="flex-row items-start gap-3 mt-3">
            <T className="text-brand">{String(i + 1).padStart(2, "0")}</T>
            <T className="flex-1 text-base">{e}</T>
          </View>
        ))}
      </Card>
      <View className="bg-blush rounded-3xl p-5">
        <Icon name="Lightbulb" />
        <Label>Le bon réflexe</Label>
        <T className="mt-2">{lesson.tip}</T>
      </View>
      <Button
        secondary
        onPress={() =>
          update((p) => ({
            ...p,
            learned: p.learned.includes(id)
              ? p.learned.filter((x) => x !== id)
              : [...p.learned, id],
          }))
        }
        icon="Check"
      >
        {progress.learned.includes(id)
          ? "Leçon lue · retirer le repère"
          : "Marquer comme lue"}
      </Button>
      <Button
        icon="ArrowRight"
        onPress={() =>
          navigate({
            kind: "quiz",
            questions: training(
              progress,
              questions.filter((q) => q.lessonId === id),
              undefined,
              false,
              10,
            ),
            mode: "lesson",
            title: lesson.title,
          })
        }
      >
        Mettre en pratique
      </Button>
    </View>
  );
}
