import { View, Pressable, useWindowDimensions } from "react-native";
import { useProgress } from "../../application/ProgressProvider";
import { questions, allQuestions } from "../../content";
import {
  profile,
  stage,
  streak,
  todayCount,
  training,
  diagnostic,
  placementReport,
} from "../../domain/learning";
import { skills } from "../../domain/models";
import { Badge, Bar, Button, Card, Heading, Icon, Label, T } from "../atoms/ui";
import { Section } from "../molecules/Section";
import type { Navigate } from "../navigation";
export function Home({ navigate }: { navigate: Navigate }) {
  const { progress } = useProgress();
  const wide = useWindowDimensions().width > 800;
  const count = todayCount(progress);
  const level = stage(progress, allQuestions);
  const hasPlacement = !!placementReport(progress, allQuestions);
  const weak = profile(progress, allQuestions).sort(
    (a, b) => (a.score ?? -1) - (b.score ?? -1),
  )[0]!;
  const due = training(progress, questions, undefined, true, 125).length;
  function start() {
    navigate({
      kind: "quiz",
      questions: hasPlacement
        ? training(progress, questions)
        : diagnostic(allQuestions),
      mode: hasPlacement ? "daily" : "placement-v2",
      title: hasPlacement ? "Mon entraînement du jour" : "Mon diagnostic",
    });
  }
  return (
    <View className="gap-7">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <Label>Un peu chaque jour, beaucoup demain</Label>
          <Heading>Bonjour{progress.name ? `, ${progress.name}` : ""}.</Heading>
          <T muted className="mt-2">
            Fais grandir tes idées. Trouve les mots pour les exprimer.
          </T>
        </View>
        <View className="bg-white border border-line p-3 rounded-2xl flex-row gap-2 items-center">
          <Icon name="Flame" />
          <T>
            {streak(progress)} jour{streak(progress) > 1 ? "s" : ""}
          </T>
        </View>
      </View>
      <View className={`gap-5 ${wide ? "flex-row" : ""}`}>
        <View
          className="bg-[#F0E4D9] rounded-[32px] p-6 overflow-hidden flex-1"
          style={{ minHeight: 310 }}
        >
          <View className="flex-row justify-between">
            <Badge>
              {hasPlacement
                ? "TON RENDEZ-VOUS QUOTIDIEN"
                : "LE DÉBUT DE TON PARCOURS"}
            </Badge>
            <Icon name="GraduationCap" size={28} />
          </View>
          <View style={{ maxWidth: wide ? 400 : undefined }} className="mt-7">
            <Heading>
              {hasPlacement
                ? "Un pas de plus vers\nun français précis."
                : "Ton français,\nun nouveau départ."}
            </Heading>
            <T className="mt-4 mb-6">
              {hasPlacement
                ? "Des questions choisies selon tes besoins, des explications pour comprendre et des révisions pour retenir."
                : "42 questions pour repérer tes points forts et savoir par où commencer. Sans pression, sans jugement."}
            </T>
            <View className="self-start">
              <Button onPress={start} icon="ArrowRight">
                {hasPlacement ? "Commencer ma séance" : "Découvrir mon niveau"}
              </Button>
            </View>
          </View>
          <T muted className="text-xs mt-5">
            {hasPlacement
              ? "10 questions · environ 5 minutes"
              : "7 compétences · 6 niveaux · environ 30 minutes"}
          </T>
        </View>
        <Card className={wide ? "w-72" : "w-full"}>
          <View className="flex-row gap-2 items-center mb-4">
            <Icon name="Target" />
            <Label>Mon rythme</Label>
          </View>
          <TextStat
            n={`${Math.min(count, progress.goal)}`}
            tail={` / ${progress.goal}`}
          />
          <T muted className="mb-5">
            questions aujourd’hui
          </T>
          <Bar value={(count / progress.goal) * 100} />
          <T className="mt-4 mb-6">
            {count >= progress.goal
              ? "Objectif atteint. Prends le temps de savourer ton progrès."
              : "Quelques minutes suffisent pour entretenir une bonne habitude."}
          </T>
          <View className="border-t border-line pt-4 flex-row gap-3 items-center">
            <View className="bg-blush rounded-xl p-3">
              <T className="text-brand text-xl">{level.letter}</T>
            </View>
            <View className="flex-1">
              <T style={{ fontFamily: "InterSemi" }}>{level.name}</T>
              <T muted className="text-xs">
                Repère écrit provisoire
              </T>
            </View>
          </View>
        </Card>
      </View>
      <View>
        <Section
          title="À ton rythme"
          action="Tout explorer"
          onPress={() => navigate({ kind: "tab", tab: "practice" })}
        />
        <View className={`gap-4 ${wide ? "flex-row" : ""}`}>
          <Action
            title="Les mots qui se ressemblent"
            body="On ou ont ? Ces ou ses ? Apprends à choisir avec confiance."
            badge="HOMOPHONES"
            icon="BookOpen"
            onPress={() =>
              navigate({
                kind: "quiz",
                questions: training(progress, questions, "homophones"),
                mode: "training",
                title: "Homophones",
              })
            }
          />
          <Action
            title="Une voix plus assurée"
            body="Un texte, quelques pauses et le plaisir de lire à voix haute."
            badge="LECTURE À VOIX HAUTE"
            icon="Mic"
            onPress={() => navigate({ kind: "reading", id: "r1" })}
          />
          <Action
            title="Des idées bien écrites"
            body="Construis un texte clair, avec un plan et une relecture guidée."
            badge="ATELIER DE RÉDACTION"
            icon="PenLine"
            onPress={() => navigate({ kind: "writing", id: "mail" })}
          />
        </View>
      </View>
      <View className={`gap-4 ${wide ? "flex-row" : ""}`}>
        <Card className="flex-1">
          <Label>Ta prochaine priorité</Label>
          <Heading small>{skills[weak.skill].title}</Heading>
          <T muted className="mt-2 mb-4">
            {weak.score === null
              ? "Explore cette compétence pour enrichir ton profil."
              : `Ton dernier score par question est de ${weak.score} %. Un entraînement ciblé t’aidera à consolider tes acquis.`}
          </T>
          <Button
            secondary
            onPress={() =>
              navigate({
                kind: "quiz",
                questions: training(progress, questions, weak.skill),
                mode: "training",
                title: skills[weak.skill].title,
              })
            }
            icon="ArrowRight"
          >
            Travailler cette compétence
          </Button>
        </Card>
        <Card className="flex-1">
          <Label>Réviser pour retenir</Label>
          <Heading small>
            {due
              ? `${due} question${due > 1 ? "s" : ""} à revoir`
              : "Laisse les acquis mûrir"}
          </Heading>
          <T muted className="mt-2 mb-4">
            Les questions reviennent après un délai adapté à tes réponses. Une
            erreur est une piste de travail.
          </T>
          <Button
            secondary
            disabled={!due}
            onPress={() =>
              navigate({
                kind: "quiz",
                questions: training(progress, questions, undefined, true),
                mode: "review",
                title: "Mes révisions",
              })
            }
          >
            Revoir mes questions
          </Button>
        </Card>
      </View>
      <View className="flex-row gap-2 items-center justify-center">
        <Icon name="WifiOff" size={15} color="#756C65" />
        <T muted className="text-xs">
          Ton apprentissage et tes données restent sur cet appareil.
        </T>
      </View>
    </View>
  );
}
function TextStat({ n, tail }: { n: string; tail: string }) {
  return (
    <T className="text-5xl leading-[60px]" style={{ fontFamily: "InterSemi" }}>
      {n}
      <T muted className="text-xl">
        {tail}
      </T>
    </T>
  );
}
function Action({
  title,
  body,
  badge,
  icon,
  onPress,
}: {
  title: string;
  body: string;
  badge: string;
  icon: Parameters<typeof Icon>[0]["name"];
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="flex-1 bg-white border border-line rounded-3xl p-5 active:bg-blush"
    >
      <View className="flex-row items-center justify-between mb-5">
        <View className="bg-paper p-3 rounded-2xl">
          <Icon name={icon} />
        </View>
        <Icon name="ArrowRight" size={18} />
      </View>
      <Label>{badge}</Label>
      <T className="text-lg mt-2" style={{ fontFamily: "InterSemi" }}>
        {title}
      </T>
      <T muted className="mt-2">
        {body}
      </T>
    </Pressable>
  );
}
