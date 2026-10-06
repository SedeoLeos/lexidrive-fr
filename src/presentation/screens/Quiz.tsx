import { useState } from "react";
import {
  useAudioPlayer,
  useAudioPlayerStatus,
  setAudioModeAsync,
} from "expo-audio";
import { examAudio } from "../../content/examAudio";
import { View, Pressable } from "react-native";
import { useProgress } from "../../application/ProgressProvider";
import { recordSession, stage, profile } from "../../domain/learning";
import { skills, type Question } from "../../domain/models";
import { allQuestions as bank } from "../../content";
import {
  Back,
  Badge,
  Bar,
  Button,
  Card,
  Heading,
  Icon,
  Label,
  T,
} from "../atoms/ui";
import type { Navigate } from "../navigation";
export function Quiz({
  items,
  mode,
  title,
  navigate,
}: {
  items: Question[];
  mode: string;
  title: string;
  navigate: Navigate;
}) {
  const { progress, update } = useProgress();
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [answers, setAnswers] = useState<
    { question: Question; correct: boolean }[]
  >([]);
  const [done, setDone] = useState(false);
  const [showCorrections, setShowCorrections] = useState(false);
  const [audioError, setAudioError] = useState("");
  const isAssessment =
    mode === "placement-v2" || mode.startsWith("mock:") || mode === "exam";
  const question = items[index];
  const player = useAudioPlayer(
    question?.audioKey ? examAudio[question.audioKey] : null,
  );
  const audioStatus = useAudioPlayerStatus(player);
  async function listen() {
    try {
      setAudioError("");
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });
      if (audioStatus.playing) player.pause();
      else {
        await player.seekTo(0);
        player.play();
      }
    } catch {
      setAudioError(
        "Impossible de lire cet audio. Vérifie le volume et réessaie.",
      );
    }
  }

  function next() {
    if (!question || choice === null) return;
    if (question.audioKey) player.pause();
    const result = [
      ...answers,
      { question, correct: choice === question.answer },
    ];
    setAnswers(result);
    if (index === items.length - 1) {
      update((p) => recordSession(p, result, mode));
      setDone(true);
    } else {
      setIndex(index + 1);
      setChoice(null);
      setChecked(false);
      setAudioError("");
    }
  }
  if (done) {
    const correct = answers.filter((a) => a.correct).length;
    const weak = profile(progress, bank)
      .filter((p) => p.score !== null)
      .sort((a, b) => a.score! - b.score!)[0];
    return (
      <View className="gap-5 max-w-2xl w-full self-center">
        <Badge green>SÉANCE TERMINÉE ET SAUVEGARDÉE</Badge>
        <Heading>
          {mode === "placement-v2"
            ? "Ton point de départ."
            : "Chaque essai compte."}
        </Heading>
        <Card>
          <T className="text-5xl leading-[64px] text-brand">
            {correct}
            <T muted className="text-xl">
              {" "}
              / {items.length}
            </T>
          </T>
          <T muted>réponses correctes</T>
          <T className="mt-4">
            {mode === "placement-v2"
              ? `Ton repère : ${stage(progress, bank).name}. Ce repère est limité aux questions écrites. Il ne certifie pas ton niveau global.`
              : "Reviens sur les explications : comprendre une erreur est déjà un progrès."}
          </T>
        </Card>
        {weak && (
          <Card>
            <Label>Une piste pour la suite</Label>
            <Heading small>{skills[weak.skill].title}</Heading>
            <T muted className="mt-2">
              Travaille cette compétence dans l’espace Entraînement.
            </T>
          </Card>
        )}
        <T muted className="text-xs">
          Un score élevé sur des questions simples ne prouve pas une maîtrise
          avancée. Les repères A1–C2 sont provisoires : la rédaction libre et
          l’expression orale restent à apprécier séparément.
        </T>
        {mode.startsWith("mock:") && (
          <Button
            onPress={() =>
              navigate({
                kind: "certification",
                level: mode.slice(5) as import("../../domain/models").CefrLevel,
              })
            }
          >
            Poursuivre : rédaction et expression orale
          </Button>
        )}
        {isAssessment && (
          <>
            <Button
              secondary
              onPress={() => setShowCorrections(!showCorrections)}
            >
              {showCorrections
                ? "Masquer les corrections"
                : "Voir les corrections du test"}
            </Button>
            {showCorrections &&
              answers.map((a, i) => (
                <Card key={a.question.id}>
                  <Badge green={a.correct}>
                    {a.correct ? "Correct" : "À revoir"} ·{" "}
                    {a.question.cefr ?? "Bilan"}
                  </Badge>
                  <T className="mt-3">
                    {i + 1}. {a.question.prompt}
                  </T>
                  <T className="text-sage mt-2">
                    {a.question.choices[a.question.answer]}
                  </T>
                  <T className="mt-2">{a.question.explanation}</T>
                </Card>
              ))}
          </>
        )}
        <Button
          onPress={() => navigate({ kind: "tab", tab: "progress" })}
          icon="ArrowRight"
        >
          Voir ma progression
        </Button>
        <Button
          secondary
          onPress={() => navigate({ kind: "tab", tab: "home" })}
        >
          Revenir à l’accueil
        </Button>
      </View>
    );
  }
  if (!question)
    return (
      <View>
        <Heading small>Aucune question à revoir pour le moment.</Heading>
        <Back onPress={() => navigate({ kind: "tab", tab: "practice" })} />
      </View>
    );
  return (
    <View className="max-w-2xl w-full self-center gap-5">
      <Back onPress={() => navigate({ kind: "tab", tab: "practice" })} />
      <View className="flex-row justify-between items-center">
        <Label>{title}</Label>
        <T muted>
          {index + 1} / {items.length}
        </T>
      </View>
      <Bar value={(index / items.length) * 100} />
      <View className="flex-row gap-2">
        <Badge>{skills[question.skill].title}</Badge>
        <Badge>
          {question.cefr ??
            ["Fondations", "Consolidation", "Maîtrise"][question.level - 1]}
        </Badge>
      </View>
      {question.context && (
        <Card>
          <Label>Document à lire</Label>
          <T className="mt-3 text-base leading-7">{question.context}</T>
        </Card>
      )}
      {question.audioKey && (
        <Card>
          <Label>Compréhension orale · audio local</Label>
          <T muted className="mt-3 mb-3">
            Écoute le document puis réponds. Tu peux le réécouter.
          </T>
          <Button
            secondary
            onPress={listen}
            icon={audioStatus.playing ? "Pause" : "Play"}
          >
            {audioStatus.playing ? "Pause" : "Écouter le document"}
          </Button>
          {audioError && <T className="text-brand mt-3">{audioError}</T>}
        </Card>
      )}
      <Heading small>{question.prompt}</Heading>
      <View className="gap-3">
        {question.choices.map((option, i) => {
          const right = checked && i === question.answer;
          const wrong = checked && i === choice && i !== question.answer;
          return (
            <Pressable
              key={i}
              accessibilityRole="radio"
              accessibilityState={{ selected: choice === i, disabled: checked }}
              disabled={checked}
              onPress={() => setChoice(i)}
              className={`rounded-2xl border p-4 flex-row items-center gap-3 ${right ? "bg-[#E9F0E8] border-sage" : wrong ? "bg-blush border-brand" : choice === i ? "bg-blush border-brand" : "bg-white border-line"}`}
            >
              <View
                className={`h-7 w-7 rounded-full border items-center justify-center ${choice === i || right ? "border-brand" : "border-line"}`}
              >
                <T className="text-xs">{String.fromCharCode(65 + i)}</T>
              </View>
              <T className="flex-1">{option}</T>
              {right && <Icon name="Check" color="#426C52" />}
            </Pressable>
          );
        })}
      </View>
      {checked && (
        <Card>
          <View className="flex-row gap-2 items-center mb-3">
            <Icon
              name={choice === question.answer ? "Check" : "Lightbulb"}
              color={choice === question.answer ? "#426C52" : "#842E1B"}
            />
            <T style={{ fontFamily: "InterSemi" }}>
              {choice === question.answer
                ? "Bien vu !"
                : "Comprenons cette erreur."}
            </T>
          </View>
          <T>{question.explanation}</T>
          <View className="bg-paper rounded-xl p-3 mt-4">
            <Label>Le réflexe à retenir</Label>
            <T className="mt-1">{question.tip}</T>
          </View>
        </Card>
      )}
      <Button
        disabled={choice === null}
        onPress={isAssessment ? next : checked ? next : () => setChecked(true)}
        icon="ArrowRight"
      >
        {isAssessment
          ? index === items.length - 1
            ? "Terminer l’évaluation"
            : "Valider et continuer"
          : checked
            ? index === items.length - 1
              ? "Terminer la séance"
              : "Question suivante"
            : "Vérifier ma réponse"}
      </Button>
      {!checked && (
        <T muted className="text-center text-xs">
          {isAssessment
            ? "Les corrections apparaîtront à la fin du test. Les réponses sont enregistrées lorsque tu le termines."
            : "Prends ton temps. Les résultats seront enregistrés à la fin de la séance."}
        </T>
      )}
    </View>
  );
}
