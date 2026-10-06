import { useState } from "react";
import { View, Pressable } from "react-native";
import { useProgress } from "../../application/ProgressProvider";
import { initialProgress, parseBackup } from "../../domain/learning";
import { exportFile, reminderCalendar } from "../../infrastructure/export";
import { Back, Button, Card, Heading, Input, Label, T } from "../atoms/ui";
import type { Navigate } from "../navigation";
export function SettingsScreen({ navigate }: { navigate: Navigate }) {
  const { progress, update } = useProgress();
  const [backup, setBackup] = useState("");
  const [message, setMessage] = useState("");
  const [confirm, setConfirm] = useState<"import" | "reset" | null>(null);
  const [hour, setHour] = useState(String(progress.reminderHour ?? 18));
  const [busy, setBusy] = useState(false);
  async function exportBackup() {
    setBusy(true);
    try {
      await exportFile(
        "lexidrive-sauvegarde.json",
        JSON.stringify(progress, null, 2),
        "application/json",
      );
      setMessage(
        "La sauvegarde a été préparée. Conserve le fichier dans un endroit accessible.",
      );
    } catch {
      setMessage(
        "Export indisponible ici. Tu peux afficher le texte de la sauvegarde et le copier.",
      );
      setBackup(JSON.stringify(progress));
    } finally {
      setBusy(false);
    }
  }
  async function calendar() {
    const h = Number(hour);
    if (!Number.isInteger(h) || h < 0 || h > 23) {
      setMessage("Choisis une heure entière entre 0 et 23.");
      return;
    }
    setBusy(true);
    try {
      await exportFile(
        "lexidrive-rappel.ics",
        reminderCalendar(h),
        "text/calendar",
      );
      update((p) => ({ ...p, reminderHour: h }));
      setMessage(
        "Ouvre le fichier .ics dans ton calendrier pour activer le rappel quotidien. Il fonctionne ensuite sans serveur.",
      );
    } catch {
      setMessage("Le calendrier n’a pas pu être exporté sur cet appareil.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <View className="max-w-2xl w-full self-center gap-5">
      <Back onPress={() => navigate({ kind: "tab", tab: "home" })} />
      <Label>Un espace à toi</Label>
      <Heading>Préférences et sauvegarde.</Heading>
      <Card>
        <Label>Ton prénom ou pseudonyme</Label>
        <Input
          accessibilityLabel="Prénom"
          value={progress.name}
          onChangeText={(name) => update((p) => ({ ...p, name }))}
          maxLength={80}
          className="mt-3"
        />
        <T muted className="mt-4">
          Objectif quotidien en questions
        </T>
        <View className="flex-row gap-2 mt-3">
          {[5, 10, 15, 20].map((goal) => (
            <Pressable
              key={goal}
              accessibilityRole="button"
              onPress={() => update((p) => ({ ...p, goal }))}
              className={`rounded-xl py-3 px-5 ${progress.goal === goal ? "bg-brand" : "bg-paper"}`}
            >
              <T className={progress.goal === goal ? "text-white" : "text-ink"}>
                {goal}
              </T>
            </Pressable>
          ))}
        </View>
      </Card>
      <Card>
        <Label>Ton rappel quotidien</Label>
        <T muted className="mt-3 mb-4">
          Ajoute un rendez-vous récurrent à ton calendrier. Les alertes
          dépendent des réglages de ton calendrier ; l’application n’envoie pas
          de notification native.
        </T>
        <View className="flex-row items-center gap-3 mb-3">
          <Input
            accessibilityLabel="Heure du rappel"
            value={hour}
            onChangeText={setHour}
            keyboardType="number-pad"
            maxLength={2}
            className="w-20"
          />
          <T>heures, heure locale</T>
        </View>
        <Button
          secondary
          disabled={busy}
          icon="CalendarDays"
          onPress={calendar}
        >
          Exporter le rappel calendrier
        </Button>
      </Card>
      <Card>
        <Label>Préserver ta progression</Label>
        <T muted className="my-3">
          Sans compte ni serveur, tes données sont sur cet appareil. Une
          sauvegarde permet de les transférer ou de les restaurer.
        </T>
        <Button
          secondary
          icon="Download"
          disabled={busy}
          onPress={exportBackup}
        >
          Exporter ma sauvegarde
        </Button>
        <T className="mt-5 mb-2">
          Restaurer depuis le contenu d’un fichier JSON
        </T>
        <Input
          accessibilityLabel="Contenu de la sauvegarde"
          value={backup}
          onChangeText={setBackup}
          multiline
          maxLength={2000000}
          className="min-h-32"
          placeholder="Colle ici le contenu de ta sauvegarde…"
        />
        <View className="mt-3">
          <Button
            secondary
            disabled={!backup.trim()}
            onPress={() => {
              try {
                parseBackup(backup);
                setConfirm("import");
                setMessage("");
              } catch (e) {
                setMessage(
                  e instanceof Error ? e.message : "Fichier non reconnu.",
                );
              }
            }}
            icon="Upload"
          >
            Vérifier et restaurer
          </Button>
        </View>
      </Card>
      {message && (
        <View accessibilityRole="alert" className="bg-blush rounded-xl p-4">
          <T>{message}</T>
        </View>
      )}
      {confirm && (
        <Card>
          <Heading small>
            {confirm === "reset"
              ? "Effacer la progression ?"
              : "Remplacer la progression ?"}
          </Heading>
          <T className="my-3">
            {confirm === "reset"
              ? "Cette action supprime les résultats et les brouillons sur cet appareil. Exporte une sauvegarde si tu veux les conserver."
              : "La sauvegarde remplacera les résultats et les brouillons actuels. Exporte-les d’abord si tu veux les conserver."}
          </T>
          <View className="gap-3">
            <Button
              onPress={() => {
                try {
                  update(() =>
                    confirm === "reset"
                      ? { ...initialProgress(), onboarded: true }
                      : parseBackup(backup),
                  );
                  setConfirm(null);
                  setMessage("Progression mise à jour.");
                } catch {
                  setMessage("Restauration impossible : données invalides.");
                }
              }}
            >
              Confirmer le remplacement
            </Button>
            <Button secondary onPress={() => setConfirm(null)}>
              Annuler
            </Button>
          </View>
        </Card>
      )}
      <Card>
        <Label>À propos</Label>
        <T className="mt-3">LexiDrive-fr · version 1.1.0</T>
        <T muted className="mt-2">
          Contenus originaux pour les francophones. Sans IA, sans publicité et
          sans serveur. Les paliers sont des repères pédagogiques internes, pas
          une certification.
        </T>
        <View className="mt-4">
          <Button secondary onPress={() => setConfirm("reset")}>
            Effacer ma progression
          </Button>
        </View>
      </Card>
    </View>
  );
}
