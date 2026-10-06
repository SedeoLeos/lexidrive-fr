import { useState } from "react";
import { View, Pressable } from "react-native";
import { useProgress } from "../../application/ProgressProvider";
import {
  Badge,
  Button,
  Card,
  Heading,
  Icon,
  Input,
  Label,
  T,
} from "../atoms/ui";
export function Onboarding() {
  const { update } = useProgress();
  const [name, setName] = useState("");
  const [goal, setGoal] = useState(10);
  return (
    <View className="max-w-xl w-full self-center gap-6 py-8">
      <Badge>LE FRANÇAIS, À TON RYTHME</Badge>
      <Heading>{"Les bons mots.\nLa confiance en plus."}</Heading>
      <T muted className="text-base">
        Orthographe, grammaire, rédaction et lecture à voix haute : avance un
        peu chaque jour, même sans Internet.
      </T>
      <Card>
        <Label>Comment t’appeler ?</Label>
        <Input
          accessibilityLabel="Ton prénom"
          placeholder="Prénom ou pseudonyme (facultatif)"
          value={name}
          onChangeText={setName}
          maxLength={80}
          className="mt-3"
        />
        <Label>Ton objectif quotidien</Label>
        <T muted className="mt-2">
          Choisis un nombre de questions. Tu pourras le modifier.
        </T>
        <View className="flex-row gap-2 mt-4">
          {[5, 10, 15, 20].map((n) => (
            <Pressable
              key={n}
              accessibilityRole="button"
              accessibilityLabel={`${n} questions par jour`}
              onPress={() => setGoal(n)}
              className={`flex-1 items-center p-3 rounded-xl ${goal === n ? "bg-brand" : "bg-paper"}`}
            >
              <T className={goal === n ? "text-white" : "text-ink"}>{n}</T>
            </Pressable>
          ))}
        </View>
      </Card>
      <Button
        onPress={() =>
          update((p) => ({ ...p, name: name.trim(), goal, onboarded: true }))
        }
        icon="ArrowRight"
      >
        Entrer dans LexiDrive
      </Button>
      <View className="flex-row justify-center items-center gap-2">
        <Icon name="WifiOff" size={16} />
        <T muted className="text-xs">
          Pas de compte. Tes données restent sur l’appareil.
        </T>
      </View>
    </View>
  );
}
