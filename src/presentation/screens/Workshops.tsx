import { useEffect, useRef, useState } from "react";
import { View, Pressable } from "react-native";
import {
  useAudioPlayer,
  useAudioPlayerStatus,
  useAudioRecorder,
  useAudioRecorderState,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
} from "expo-audio";
import { useProgress } from "../../application/ProgressProvider";
import {
  writingPrompts,
  checklist,
  readings,
  dictations,
} from "../../content/workshops";
import { compareDictation, words } from "../../domain/learning";
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
export function WritingScreen({
  id,
  navigate,
}: {
  id: string;
  navigate: Navigate;
}) {
  const prompt = writingPrompts.find((w) => w.id === id)!;
  const { progress, update } = useProgress();
  const stored = progress.writings.find((w) => w.promptId === id);
  const [text, setText] = useState(stored?.text ?? "");
  const [checked, setChecked] = useState<string[]>(stored?.checked ?? []);
  const [model, setModel] = useState(false);
  const [saved, setSaved] = useState(false);
  function save(value = text, items = checked) {
    update((p) => ({
      ...p,
      writings: [
        ...p.writings.filter((w) => w.promptId !== id),
        {
          id: stored?.id ?? `writing-${id}`,
          promptId: id,
          text: value,
          checked: items,
          updatedAt: new Date().toISOString(),
        },
      ],
    }));
    setSaved(true);
  }

  return (
    <View className="max-w-3xl w-full self-center gap-5">
      <Back
        onPress={() => {
          save();
          navigate(
            id.startsWith("cert-")
              ? {
                  kind: "certification",
                  level: id.slice(5) as import("../../domain/models").CefrLevel,
                }
              : { kind: "tab", tab: "practice" },
          );
        }}
      />
      <Badge>
        {prompt.level} · {prompt.duration} MIN
      </Badge>
      <Heading>{prompt.title}</Heading>
      <Card>
        <Label>Ton sujet</Label>
        <T className="mt-3 text-base">{prompt.instruction}</T>
      </Card>
      <Card>
        <Label>Préparer ton plan</Label>
        {prompt.plan.map((p, i) => (
          <T key={p} className="mt-2">
            {i + 1}. {p}
          </T>
        ))}
      </Card>
      <View className="flex-row items-center justify-between">
        <Label>Ton brouillon</Label>
        <T muted className="text-xs">
          {words(text).length} mots · repère : {prompt.min} mots
        </T>
      </View>
      <Input
        accessibilityLabel="Ma rédaction"
        multiline
        value={text}
        onChangeText={(value) => {
          setText(value);
          save(value, checked);
        }}
        onBlur={() => save()}
        placeholder="Commence ici. Tu peux revenir sur ce brouillon plus tard…"
        className="min-h-64"
        maxLength={30000}
      />
      <T muted className="text-xs">
        {saved
          ? "Brouillon enregistré sur cet appareil."
          : "Le brouillon est enregistré après une courte pause."}
      </T>
      <Card>
        <Label>Relire avec méthode</Label>
        {checklist.map((item) => (
          <Pressable
            key={item}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: checked.includes(item) }}
            onPress={() => {
              const next = checked.includes(item)
                ? checked.filter((x) => x !== item)
                : [...checked, item];
              setChecked(next);
              save(text, next);
            }}
            className="flex-row items-start gap-3 py-3"
          >
            <View
              className={`w-6 h-6 rounded-md border items-center justify-center ${checked.includes(item) ? "bg-brand border-brand" : "border-line"}`}
            >
              {checked.includes(item) && (
                <Icon name="Check" size={15} color="white" />
              )}
            </View>
            <T className="flex-1">{item}</T>
          </Pressable>
        ))}
      </Card>
      <Button
        secondary
        onPress={() => {
          save();
          setModel(!model);
        }}
        icon="BookOpen"
      >
        {model ? "Masquer le modèle" : "Découvrir un modèle commenté"}
      </Button>
      {model && (
        <Card>
          <Label>Une proposition, parmi d’autres</Label>
          <T className="mt-3 text-base leading-7">{prompt.model}</T>
          <View className="bg-paper rounded-2xl p-4 mt-4">
            <Label>Pourquoi cela fonctionne</Label>
            <T className="mt-2">{prompt.notes}</T>
          </View>
        </Card>
      )}
      <T muted className="text-xs">
        Ton texte libre n’est pas analysé automatiquement. Le modèle et la
        grille t’aident à le relire et à l’améliorer.
      </T>
    </View>
  );
}
function time(n: number) {
  return `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, "0")}`;
}
export function ReadingScreen({
  id,
  navigate,
}: {
  id: string;
  navigate: Navigate;
}) {
  const reading = readings.find((r) => r.id === id)!;
  const [size, setSize] = useState(20);
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [recordingUri, setRecordingUri] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const state = useAudioRecorderState(recorder);
  const player = useAudioPlayer(recordingUri);
  const playback = useAudioPlayerStatus(player);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [running]);
  async function record() {
    setError("");
    setBusy(true);
    try {
      if (state.isRecording) {
        await recorder.stop();
        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
        });
        setRecordingUri(recorder.uri);
        setRunning(false);
      } else {
        player.pause();
        const permission = await requestRecordingPermissionsAsync();
        if (!permission.granted) {
          setError(
            "Microphone non autorisé. Tu peux quand même lire et utiliser le chronomètre.",
          );
          return;
        }
        await setAudioModeAsync({
          allowsRecording: true,
          playsInSilentMode: true,
        });
        await recorder.prepareToRecordAsync();
        recorder.record();
        setRunning(true);
      }
    } catch {
      setError(
        "L’enregistrement n’est pas disponible ici. La lecture reste accessible.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <View className="max-w-3xl w-full self-center gap-5">
      <Back
        onPress={() =>
          navigate(
            id.startsWith("cert-")
              ? {
                  kind: "certification",
                  level: id.slice(5) as import("../../domain/models").CefrLevel,
                }
              : { kind: "tab", tab: "practice" },
          )
        }
      />
      <Badge>LECTURE À VOIX HAUTE · {reading.level}</Badge>
      <Heading>{reading.title}</Heading>
      <T muted>{reading.focus}</T>
      <View className="flex-row flex-wrap items-center gap-3">
        <Button
          secondary
          onPress={() => setRunning(!running)}
          icon={running ? "Pause" : "Play"}
        >
          {running ? "Pause" : "Chronométrer"}
        </Button>
        <T className="text-xl">{time(seconds)}</T>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Réinitialiser le chronomètre"
          onPress={() => {
            setSeconds(0);
            setRunning(false);
          }}
          className="p-3"
        >
          <Icon name="RotateCcw" />
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Agrandir le texte"
          onPress={() => setSize((s) => (s >= 28 ? 18 : s + 2))}
          className="p-3 rounded-xl bg-white border border-line"
        >
          <T>Aa +</T>
        </Pressable>
      </View>
      <Card>
        <T style={{ fontSize: size, lineHeight: size * 1.8 }}>{reading.text}</T>
      </Card>
      <Card>
        <Label>Pour cette lecture</Label>
        {reading.advice.map((a, i) => (
          <T key={a} className="mt-3">
            {i + 1}. {a}
          </T>
        ))}
      </Card>
      <Card>
        <Label>Écouter ta propre voix</Label>
        <T muted className="my-3">
          Enregistrement facultatif, sans analyse ni note. La prise est
          temporaire : elle n’est pas conservée dans ton profil.
        </T>
        <View className="gap-3">
          <Button
            disabled={busy}
            onPress={record}
            icon={state.isRecording ? "Square" : "Mic"}
          >
            {state.isRecording
              ? `Arrêter · ${time(state.durationMillis / 1000)}`
              : "M’enregistrer"}
          </Button>
          {recordingUri && !state.isRecording && (
            <Button
              secondary
              onPress={async () => {
                try {
                  if (playback.playing) player.pause();
                  else {
                    await player.seekTo(0);
                    player.play();
                  }
                } catch {
                  setError(
                    "Impossible de lire cette prise. Essaie un nouvel enregistrement.",
                  );
                }
              }}
              icon={playback.playing ? "Pause" : "Play"}
            >
              {playback.playing ? "Mettre en pause" : "Réécouter ma lecture"}
            </Button>
          )}
        </View>
        {error && <T className="text-brand mt-3">{error}</T>}
      </Card>
      <T muted className="text-xs">
        Aucun objectif de vitesse. Essaie surtout de lire avec clarté, confort
        et naturel.
      </T>
    </View>
  );
}
export function DictationScreen({
  id,
  navigate,
}: {
  id: string;
  navigate: Navigate;
}) {
  const d = dictations.find((d) => d.id === id)!;
  const { update } = useProgress();
  const [text, setText] = useState("");
  const [result, setResult] = useState<ReturnType<
    typeof compareDictation
  > | null>(null);
  const [error, setError] = useState("");
  const player = useAudioPlayer(d.audio);
  const status = useAudioPlayerStatus(player);
  function submit() {
    const value = compareDictation(d.text, text);
    setResult(value);
    player.pause();
    update((p) => ({
      ...p,
      dictations: [
        ...p.dictations,
        { id, score: value.score, at: new Date().toISOString() },
      ].slice(-1000),
    }));
  }
  async function listen(restart = false) {
    try {
      setError("");
      await setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: false,
      });
      if (restart) await player.seekTo(0);
      if (status.playing && !restart) player.pause();
      else player.play();
    } catch {
      setError(
        "Impossible de lire l’audio sur cet appareil. Réessaie ou vérifie le volume.",
      );
    }
  }
  return (
    <View className="max-w-3xl w-full self-center gap-5">
      <Back onPress={() => navigate({ kind: "tab", tab: "practice" })} />
      <Badge>DICTÉE · {d.level}</Badge>
      <Heading>{d.title}</Heading>
      <T muted>
        Écoute une première fois, puis écris. Mets l’audio en pause aussi
        souvent que nécessaire.
      </T>
      <Card>
        <View className="flex-row gap-2 items-center mb-4">
          <Icon name="Headphones" />
          <Label>Audio intégré · voix de synthèse</Label>
        </View>
        <View className="gap-3">
          <Button
            onPress={() => listen()}
            icon={status.playing ? "Pause" : "Play"}
          >
            {status.playing ? "Mettre en pause" : "Écouter la dictée"}
          </Button>
          <Button secondary onPress={() => listen(true)} icon="RotateCcw">
            Réécouter depuis le début
          </Button>
        </View>
        <T muted className="text-center mt-3">
          {time(status.currentTime)} / {time(status.duration)}
        </T>
        {error && <T className="text-brand">{error}</T>}
      </Card>
      <Input
        accessibilityLabel="Ma dictée"
        value={text}
        onChangeText={setText}
        multiline
        editable={!result}
        autoCorrect={false}
        spellCheck={false}
        autoCapitalize="sentences"
        placeholder="Écris ce que tu entends…"
        className="min-h-48"
        maxLength={5000}
      />
      {!result ? (
        <Button disabled={!text.trim()} onPress={submit} icon="Check">
          Comparer ma dictée
        </Button>
      ) : (
        <View className="gap-4">
          <Card>
            <Label>Correspondance des mots</Label>
            <T className="text-4xl leading-[56px] text-brand">
              {result.score} %
            </T>
            <T muted className="text-xs">
              Comparaison des mots et des accents. La ponctuation et les
              majuscules ne sont pas notées.
            </T>
          </Card>
          <Card>
            <Label>Le texte de référence</Label>
            <T className="mt-3 text-base leading-7">{d.text}</T>
            <T className="mt-4 text-brand">{d.tip}</T>
          </Card>
          {result.differences.length > 0 && (
            <Card>
              <Label>Les différences à observer</Label>
              {result.differences.map((diff, i) => (
                <View key={i} className="flex-row flex-wrap gap-2 mt-3">
                  <T muted>
                    {diff.actual === "∅" ? "Mot manquant" : diff.actual}
                  </T>
                  <T>→</T>
                  <T className="text-brand">
                    {diff.expected === "∅" ? "Mot ajouté" : diff.expected}
                  </T>
                </View>
              ))}
            </Card>
          )}
          <Button
            secondary
            onPress={() => {
              setResult(null);
              setText("");
              player.seekTo(0);
            }}
          >
            Refaire cette dictée
          </Button>
        </View>
      )}
    </View>
  );
}
