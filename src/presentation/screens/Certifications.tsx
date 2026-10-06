import { View, Pressable, Linking, useWindowDimensions } from "react-native";
import exams from "../../content/certifications.json";
import { assessmentQuestions, allQuestions } from "../../content";
import { cefrLevels, type CefrLevel } from "../../domain/models";
import { diagnostic, placementReport, words } from "../../domain/learning";
import { useProgress } from "../../application/ProgressProvider";
import { exportFile } from "../../infrastructure/export";
import {
  Back,
  Badge,
  Button,
  Card,
  Heading,
  Icon,
  Label,
  T,
} from "../atoms/ui";
import type { Navigate } from "../navigation";
import { useState } from "react";
const official =
  "https://www.france-education-international.fr/hub/diplomes-tests?langue=fr";
export function CertificationsScreen({ navigate }: { navigate: Navigate }) {
  const { progress } = useProgress();
  const wide = useWindowDimensions().width > 700;
  const report = placementReport(progress, allQuestions);
  return (
    <View className="gap-5">
      <Back onPress={() => navigate({ kind: "tab", tab: "practice" })} />
      <Label>Niveaux et préparation aux certifications</Label>
      <Heading>De A1 à C2, des objectifs concrets.</Heading>
      <T muted>
        Le DELF correspond aux niveaux A1 à B2 ; le DALF aux niveaux C1 et C2.
        Ici, les sujets sont originaux et les examens blancs sont adaptés à un
        entraînement autonome.
      </T>
      <Card>
        <Label>Ton point de départ</Label>
        <Heading small>
          {report?.level
            ? `${report.level} · repère écrit provisoire`
            : "Niveau à préciser"}
        </Heading>
        <T muted className="my-3">
          Une bonne reconnaissance de règles ne garantit pas une rédaction
          aisée. Situe tes points de langue et ta compréhension, puis pratique
          la production libre.
        </T>
        <Button
          onPress={() =>
            navigate({
              kind: "quiz",
              questions: diagnostic(allQuestions),
              mode: "placement-v2",
              title: "Diagnostic approfondi A1–C2",
            })
          }
        >
          Faire le diagnostic · 42 questions
        </Button>
      </Card>
      <View className="flex-row flex-wrap gap-4">
        {exams.map((exam) => {
          const history = progress.sessions.filter(
            (s) => s.mode === `mock:${exam.level}`,
          );
          return (
            <View key={exam.level} style={{ width: wide ? "48%" : "100%" }}>
              <Card>
                <Badge>
                  {exam.certification} · {exam.level}
                </Badge>
                <Heading small>{exam.title}</Heading>
                <T className="my-3">{exam.objective}</T>
                <T muted className="text-xs mb-4">
                  Questions de langue et de lecture · écoute · rédaction ·
                  expression orale
                  {history.length ? ` · ${history.length} passage(s)` : ""}
                </T>
                <Button
                  secondary
                  icon="ArrowRight"
                  onPress={() =>
                    navigate({
                      kind: "certification",
                      level: exam.level as CefrLevel,
                    })
                  }
                >
                  Préparer ce niveau
                </Button>
              </Card>
            </View>
          );
        })}
      </View>
      <Card>
        <Label>Ce que l’application peut attester</Label>
        <T className="mt-3">
          Un bilan personnel d’entraînement : sujets travaillés, score des
          questions corrigibles, brouillon et activités déclarées. Elle ne
          délivre pas de diplôme DELF/DALF ni de certification officielle. La
          production libre exige une appréciation humaine pour attribuer une
          note fiable.
        </T>
        <View className="mt-3">
          <Button
            secondary
            onPress={() => Linking.openURL(official).catch(() => {})}
          >
            Voir les certifications officielles · Internet
          </Button>
        </View>
      </Card>
    </View>
  );
}
export function CertificationScreen({
  level,
  navigate,
}: {
  level: CefrLevel;
  navigate: Navigate;
}) {
  const exam = exams.find((e) => e.level === level)!;
  const { progress, update } = useProgress();
  const [notice, setNotice] = useState("");
  const questions = assessmentQuestions.filter((q) => q.cefr === level);
  const result = [...progress.sessions]
    .reverse()
    .find(
      (s) =>
        s.mode === `mock:${level}` && s.responses?.length === questions.length,
    );
  const writing = progress.writings.find((w) => w.promptId === exam.writing.id);
  const oralDone = progress.learned.includes(`oral-cert-${level}`);
  async function exportReport() {
    try {
      const text = [
        `LexiDrive-fr — bilan personnel d’entraînement ${level}`,
        `Utilisateur : ${progress.name || "Anonyme"}`,
        `Date : ${new Date().toLocaleDateString("fr-FR")}`,
        `Questions corrigibles : ${result?.correct ?? 0} / ${questions.length}`,
        `Rédaction : ${words(writing?.text ?? "").length} mots ; ${writing?.checked.length ?? 0} repères de relecture cochés`,
        `Expression orale : ${oralDone ? "pratique déclarée par l’utilisateur" : "à pratiquer"}`,
        "",
        "Ce document n’est pas une certification officielle. Aucun niveau global CECRL ni diplôme DELF/DALF n’est validé. La rédaction et l’expression orale ne sont pas notées automatiquement.",
        "",
        "Rédaction personnelle :",
        writing?.text ?? "",
      ].join("\n");
      await exportFile(`lexidrive-bilan-${level}.txt`, text, "text/plain");
      setNotice(
        "Bilan préparé : conserve-le avec tes textes pour suivre ton travail.",
      );
    } catch {
      setNotice("Le fichier n’a pas pu être exporté sur cet appareil.");
    }
  }
  return (
    <View className="max-w-3xl w-full self-center gap-5">
      <Back onPress={() => navigate({ kind: "certifications" })} />
      <Badge>
        {exam.certification} · ENTRAÎNEMENT {level}
      </Badge>
      <Heading>{exam.title}</Heading>
      <T muted>{exam.objective}</T>
      <Card>
        <Label>Les règles de cette simulation</Label>
        <T className="mt-3">
          Les corrections des questions apparaissent à la fin, sans aide pendant
          le test. Les réponses de langue, de lecture et d’écoute sont corrigées
          ; la rédaction et l’expression orale sont travaillées puis relues par
          toi. Ce format autonome ne reproduit pas intégralement une session
          officielle et ne donne pas de note de certification.
        </T>
      </Card>
      <Card>
        <Label>01 · Langue, lecture et écoute</Label>
        <Heading small>{questions.length} questions corrigibles</Heading>
        <T muted className="my-3">
          Un document écrit et un audio français embarqué. Réécoute autorisée
          dans cet entraînement. Prévois environ{" "}
          {level[0] === "A" ? "15" : level[0] === "B" ? "25" : "35"} minutes.
        </T>
        {result && (
          <T className="text-brand mb-3">
            Dernier passage : {result.correct} / {result.total} ·{" "}
            {new Date(result.at).toLocaleDateString("fr-FR")}
          </T>
        )}
        <Button
          icon="Headphones"
          onPress={() =>
            navigate({
              kind: "quiz",
              questions,
              mode: `mock:${level}`,
              title: `Examen blanc ${level}`,
            })
          }
        >
          {result ? "Refaire les questions" : "Commencer les questions"}
        </Button>
      </Card>
      <Card>
        <Label>02 · Production écrite</Label>
        <Heading small>{exam.writing.title}</Heading>
        <T muted className="my-3">
          Objectif de cet atelier : {exam.writing.min} mots ou plus
          {level === "C1" ? " (synthèse de 200 à 240 mots)" : ""}. Prévois{" "}
          {exam.writing.duration} minutes. Plan, grille de relecture et modèle
          commenté disponibles.
        </T>
        {writing && (
          <T className="text-brand mb-3">
            Brouillon : {words(writing.text).length} mots ·{" "}
            {writing.checked.length} / 8 repères relus
          </T>
        )}
        <Button
          secondary
          icon="PenLine"
          onPress={() => navigate({ kind: "writing", id: exam.writing.id })}
        >
          Rédiger et relire
        </Button>
      </Card>
      <Card>
        <Label>03 · Expression orale</Label>
        <Heading small>Parler avec clarté</Heading>
        <T className="my-3">{exam.oral.focus}</T>
        <T muted className="mb-3">
          Enregistrement et réécoute facultatifs. Aucun score ni analyse de ta
          voix.
        </T>
        <View className="gap-3">
          <Button
            secondary
            icon="Mic"
            onPress={() => navigate({ kind: "reading", id: exam.oral.id })}
          >
            Ouvrir l’atelier oral
          </Button>
          <Button
            secondary
            icon="Check"
            onPress={() =>
              update((p) => ({
                ...p,
                learned: oralDone
                  ? p.learned.filter((x) => x !== `oral-cert-${level}`)
                  : [...p.learned, `oral-cert-${level}`],
              }))
            }
          >
            {oralDone
              ? "Pratique déclarée · annuler"
              : "J’ai pratiqué cette tâche orale"}
          </Button>
        </View>
      </Card>
      <Card>
        <Label>04 · Ton bilan personnel</Label>
        <T muted className="my-3">
          Le bilan rassemble le score corrigible et tes activités. Une rédaction
          enregistrée ou une case cochée ne prouve pas un niveau de production.
        </T>
        <Button
          secondary
          disabled={!result || !writing?.text.trim() || !oralDone}
          icon="Download"
          onPress={exportReport}
        >
          Exporter mon bilan d’entraînement
        </Button>
        {notice && <T className="text-brand mt-3">{notice}</T>}
      </Card>
    </View>
  );
}
