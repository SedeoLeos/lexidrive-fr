import { useState } from "react";
import { View, Pressable } from "react-native";
import {
  useAudioPlayer,
  useAudioPlayerStatus,
  setAudioModeAsync,
} from "expo-audio";
import { useProgress } from "../../application/ProgressProvider";
import { questions } from "../../content";
import { training } from "../../domain/learning";
import { Back, Badge, Button, Card, Heading, Label, T } from "../atoms/ui";
import type { Navigate } from "../navigation";
const replacements = [
  {
    word: "ont",
    replace: "avaient",
    before: "Ils ont compris.",
    after: "Ils avaient compris.",
    why: "Ont est le verbe avoir. Si « avaient » convient, écris ont.",
    trap: "Le sujet est souvent ils, elles ou un groupe au pluriel.",
  },
  {
    word: "on",
    replace: "il ou elle",
    before: "On apprend une règle.",
    after: "Il apprend une règle.",
    why: "On est un pronom sujet. Il commande un verbe au singulier.",
    trap: "On peut représenter plusieurs personnes, mais le verbe reste au singulier : on travaille.",
  },
  {
    word: "en",
    replace: "le complément désigné",
    before: "Tu veux du pain ? J’en veux.",
    after: "Je veux du pain.",
    why: "En peut remplacer un complément, notamment en de. Il n’a pas un mot de remplacement universel.",
    trap: "Dans « en train », en est une préposition. L’astuce du complément concerne le pronom en.",
  },
  {
    word: "a / à",
    replace: "a → avait",
    before: "Elle a un livre à lire.",
    after: "Elle avait un livre à lire.",
    why: "A est un verbe ; à introduit ici un infinitif. Seul le premier mot se remplace par avait.",
    trap: "La préposition à garde son accent, même en majuscule : À bientôt.",
  },
  {
    word: "est / et",
    replace: "est → était ; et → et puis",
    before: "Il est calme et attentif.",
    after: "Il était calme et attentif.",
    why: "Est est le verbe être. Et relie deux éléments. « Et puis » aide surtout lorsqu’on relie deux actions.",
    trap: "Ne remplace pas mécaniquement tous les et par et puis : vérifie aussi le sens.",
  },
  {
    word: "son / sont",
    replace: "sont → étaient ; son → mon",
    before: "Son cahier et ses livres sont ici.",
    after: "Mon cahier et ses livres étaient ici.",
    why: "Sont est un verbe au pluriel. Son est un déterminant possessif devant un nom.",
    trap: "Son peut aussi accompagner un nom féminin devant une voyelle : son amie.",
  },
  {
    word: "ces / ses",
    replace: "au singulier : ce/cette ou son/sa",
    before: "Ces livres-là. Ses livres à lui.",
    after: "Ce livre-là. Son livre à lui.",
    why: "Ces montre ; ses indique une possession. Le passage au singulier aide à distinguer les deux intentions.",
    trap: "Le contexte décide : les deux graphies peuvent être grammaticales dans une phrase sans indication de sens.",
  },
  {
    word: "c’est / s’est",
    replace: "c’est → cela est ; s’est → me suis avec je",
    before: "C’est utile. Il s’est levé.",
    after: "Cela est utile. Je me suis levé.",
    why: "C’est présente une chose. S’est fait partie d’un verbe pronominal au passé composé.",
    trap: "Pour la deuxième astuce, change aussi le sujet : on ne remplace pas seulement s’est.",
  },
  {
    word: "leur / leurs",
    replace: "pronom leur → lui ; déterminant leurs → ses",
    before: "Je leur parle. Ils rangent leurs livres.",
    after: "Je lui parle. Il range ses livres.",
    why: "Devant le verbe, le pronom leur est invariable. Devant le nom, le déterminant s’accorde avec ce nom.",
    trap: "Le nombre de propriétaires ne suffit pas : leur livre, leurs livres.",
  },
  {
    word: "ce / cet / cette / ces",
    replace: "vérifier genre, nombre et début du mot suivant",
    before: "Ce livre. Cet arbre. Cette maison. Ces livres.",
    after: "Masculin ; masculin devant voyelle ; féminin ; pluriel.",
    why: "Ce et cet sont masculins singuliers. Cette est féminin singulier. Ces est pluriel.",
    trap: "Cet devant un h muet : cet homme. Ce devant un h aspiré : ce héros.",
  },
];
export function TipsScreen({ navigate }: { navigate: Navigate }) {
  const { progress } = useProgress();
  const [tab, setTab] = useState<"replace" | "sounds">("replace");
  const [active, setActive] = useState(0);
  const [error, setError] = useState("");
  const player = useAudioPlayer(
    require("../../../assets/audio/tips-nasals.wav"),
  );
  const status = useAudioPlayerStatus(player);
  const tip = replacements[active]!;
  async function listen() {
    try {
      await setAudioModeAsync({
        allowsRecording: false,
        playsInSilentMode: true,
      });
      if (status.playing) player.pause();
      else {
        await player.seekTo(0);
        player.play();
      }
    } catch {
      setError("Audio indisponible ici : les exemples restent lisibles.");
    }
  }
  return (
    <View className="max-w-3xl w-full self-center gap-5">
      <Back onPress={() => navigate({ kind: "tab", tab: "practice" })} />
      <Label>Des réflexes simples, des choix plus sûrs</Label>
      <Heading>Remplacer, écouter, vérifier.</Heading>
      <View className="flex-row gap-3">
        <Button secondary={tab !== "replace"} onPress={() => setTab("replace")}>
          Les mots de remplacement
        </Button>
        <Button secondary={tab !== "sounds"} onPress={() => setTab("sounds")}>
          Les sons on, an, en
        </Button>
      </View>
      {tab === "replace" ? (
        <>
          <T muted>
            Choisis une confusion. Essaie l’astuce dans la phrase complète : un
            remplacement doit garder une construction correcte.
          </T>
          <View className="flex-row flex-wrap gap-2">
            {replacements.map((r, i) => (
              <Pressable
                key={r.word}
                accessibilityRole="button"
                accessibilityState={{ selected: active === i }}
                onPress={() => setActive(i)}
                className={`px-4 py-3 rounded-full ${active === i ? "bg-brand" : "bg-white border border-line"}`}
              >
                <T className={active === i ? "text-white" : "text-ink"}>
                  {r.word}
                </T>
              </Pressable>
            ))}
          </View>
          <Card>
            <Badge>{tip.word}</Badge>
            <Heading small>{tip.replace}</Heading>
            <View className="bg-paper rounded-2xl p-4 my-4">
              <T>{tip.before}</T>
              <T className="text-brand mt-2">→ {tip.after}</T>
            </View>
            <T>{tip.why}</T>
            <T muted className="mt-3">
              À vérifier : {tip.trap}
            </T>
          </Card>
          <Button
            onPress={() =>
              navigate({
                kind: "quiz",
                questions: training(progress, questions, "homophones"),
                mode: "training",
                title: "Les bons mots de remplacement",
              })
            }
          >
            Essayer dans des phrases
          </Button>
        </>
      ) : (
        <>
          <Card>
            <Badge>DEUX SONS NASAUX COURANTS</Badge>
            <Heading small>« on » et « an/en »</Heading>
            <T className="mt-3">
              En français standard, on représente souvent le son /ɔ̃/ : bon, nom,
              pont. An et en représentent souvent le son /ɑ̃/ : dans, blanc,
              enfant, vent. La distinction peut varier avec les accents :
              l’orthographe ne se déduit pas toujours de ta prononciation.
            </T>
            <View className="mt-4">
              <Button
                secondary
                onPress={listen}
                icon={status.playing ? "Pause" : "Volume2"}
              >
                {status.playing ? "Pause" : "Écouter les exemples français"}
              </Button>
            </View>
            {error && <T className="text-brand mt-3">{error}</T>}
          </Card>
          <Card>
            <Label>Pourquoi « conjugaison » ?</Label>
            <T className="mt-3">
              Découpe le mot : con · ju · gai · son. La fin est -aison, avec le
              son nasal de on, comme dans comparaison et terminaison. Le s entre
              les voyelles se prononce ici /z/. Le début con contient aussi ce
              son. On écrit conjugaison, pas conjugaisan ni conjuguaison.
            </T>
            <T muted className="mt-3">
              La famille conjuguer aide à retrouver le sens, mais ne permet pas
              de deviner chaque lettre. Observe la graphie exacte, cache-la,
              écris de mémoire puis vérifie.
            </T>
          </Card>
          <Card>
            <Label>Pour choisir entre an et en</Label>
            <T className="mt-3">
              Le même son peut avoir plusieurs écritures : chant, champ, vent,
              temps. Il faut souvent connaître le mot, utiliser sa famille et
              vérifier sa graphie. Par exemple, chanter aide à retenir chant ;
              vente aide à retenir vendre.
            </T>
            <T className="mt-3">
              Devant b, p ou m, le n d’une voyelle nasale devient généralement m
              : chambre, lampe, emporter, emmener. Il existe des exceptions,
              comme bonbon. Cette règle ne décide pas, à elle seule, entre a et
              e.
            </T>
          </Card>
          <Card>
            <Label>Un petit rituel</Label>
            <T className="mt-3">
              1. Écoute et repère le son.{"\n"}2. Cherche une famille ou un mot
              connu.{"\n"}3. Vérifie les lettres du mot.{"\n"}4. Écris une
              phrase et relis-la demain.
            </T>
          </Card>
          <Button
            onPress={() =>
              navigate({
                kind: "quiz",
                questions: training(
                  progress,
                  questions.filter((q) => q.lessonId === "nasals"),
                  undefined,
                  false,
                  10,
                ),
                mode: "training",
                title: "Les sons nasaux et leur écriture",
              })
            }
          >
            Choisir la bonne graphie
          </Button>
        </>
      )}
    </View>
  );
}
