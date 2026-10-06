import "./global.css";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Pressable,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import {
  ProgressProvider,
  useProgress,
} from "./src/application/ProgressProvider";
import { progressRepository } from "./src/infrastructure/storage";
import { Home } from "./src/presentation/screens/Home";
import { Practice } from "./src/presentation/screens/Practice";
import { Library, LessonScreen } from "./src/presentation/screens/Library";
import { ProgressScreen } from "./src/presentation/screens/Progress";
import { Quiz } from "./src/presentation/screens/Quiz";
import {
  WritingScreen,
  ReadingScreen,
  DictationScreen,
} from "./src/presentation/screens/Workshops";
import {
  CertificationsScreen,
  CertificationScreen,
} from "./src/presentation/screens/Certifications";
import { TipsScreen } from "./src/presentation/screens/Tips";
import { SettingsScreen } from "./src/presentation/screens/Settings";
import { Onboarding } from "./src/presentation/screens/Onboarding";
import {
  Button,
  Icon,
  T,
  Heading,
  type icons,
} from "./src/presentation/atoms/ui";
import type { Route, Tab } from "./src/presentation/navigation";
const tabs: { id: Tab; title: string; icon: keyof typeof icons }[] = [
  { id: "home", title: "Accueil", icon: "House" },
  { id: "practice", title: "Entraînement", icon: "PenLine" },
  { id: "library", title: "Leçons", icon: "BookOpen" },
  { id: "progress", title: "Progression", icon: "ChartNoAxesColumnIncreasing" },
];
function Shell() {
  const { progress, ready, error, retry } = useProgress();
  const [route, setRoute] = useState<Route>({ kind: "tab", tab: "home" });
  const [active, setActive] = useState<Tab>("home");
  const scroll = useRef<ScrollView>(null);
  const wide = useWindowDimensions().width >= 900;
  const insets = useSafeAreaInsets();
  function navigate(next: Route) {
    setRoute(next);
    if (next.kind === "tab") setActive(next.tab);
    scroll.current?.scrollTo({ y: 0, animated: false });
  }
  useEffect(() => {
    const listener = BackHandler.addEventListener("hardwareBackPress", () => {
      if (route.kind !== "tab") {
        navigate({ kind: "tab", tab: active });
        return true;
      }
      if (route.tab !== "home") {
        navigate({ kind: "tab", tab: "home" });
        return true;
      }
      return false;
    });
    return () => listener.remove();
  }, [route, active]);
  let page: React.ReactNode;
  if (!ready)
    page = (
      <View className="py-20 gap-5 items-center">
        {error ? (
          <>
            <Heading small>Le stockage a besoin d’attention.</Heading>
            <Button onPress={retry}>Réessayer le chargement</Button>
          </>
        ) : (
          <>
            <ActivityIndicator color="#842E1B" />
            <T>Préparation de ton espace…</T>
          </>
        )}
      </View>
    );
  else if (!progress.onboarded) page = <Onboarding />;
  else if (route.kind === "tab")
    page =
      route.tab === "home" ? (
        <Home navigate={navigate} />
      ) : route.tab === "practice" ? (
        <Practice navigate={navigate} />
      ) : route.tab === "library" ? (
        <Library navigate={navigate} />
      ) : (
        <ProgressScreen navigate={navigate} />
      );
  else if (route.kind === "quiz")
    page = (
      <Quiz
        items={route.questions}
        mode={route.mode}
        title={route.title}
        navigate={navigate}
      />
    );
  else if (route.kind === "lesson")
    page = <LessonScreen id={route.id} navigate={navigate} />;
  else if (route.kind === "writing")
    page = <WritingScreen id={route.id} navigate={navigate} />;
  else if (route.kind === "reading")
    page = <ReadingScreen id={route.id} navigate={navigate} />;
  else if (route.kind === "dictation")
    page = <DictationScreen id={route.id} navigate={navigate} />;
  else if (route.kind === "certifications")
    page = <CertificationsScreen navigate={navigate} />;
  else if (route.kind === "certification")
    page = <CertificationScreen level={route.level} navigate={navigate} />;
  else if (route.kind === "tips") page = <TipsScreen navigate={navigate} />;
  else page = <SettingsScreen navigate={navigate} />;
  return (
    <SafeAreaView className="flex-1 bg-paper" edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
      <View className="bg-paper border-b border-line">
        <View className="w-full max-w-6xl self-center flex-row items-center justify-between px-5 py-4">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="LexiDrive, accueil"
            onPress={() => navigate({ kind: "tab", tab: "home" })}
            className="flex-row items-center gap-3"
          >
            <View className="w-10 h-10 bg-brand rounded-xl justify-center items-center">
              <T
                className="text-white text-2xl"
                style={{ fontFamily: "Georgia" }}
              >
                L.
              </T>
            </View>
            <T className="text-lg" style={{ fontFamily: "InterSemi" }}>
              lexiDrive<T className="text-brand text-xs"> — fr</T>
            </T>
          </Pressable>
          {wide && progress.onboarded && (
            <View className="flex-row gap-2">
              {tabs.map((tab) => (
                <Nav
                  key={tab.id}
                  tab={tab}
                  selected={route.kind === "tab" && active === tab.id}
                  onPress={() => navigate({ kind: "tab", tab: tab.id })}
                />
              ))}
            </View>
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Préférences"
            onPress={() => navigate({ kind: "settings" })}
            className="w-11 h-11 rounded-full bg-white border border-line items-center justify-center"
          >
            <Icon name="Settings" color="#756C65" />
          </Pressable>
        </View>
      </View>
      {error && (
        <View
          accessibilityRole="alert"
          className="bg-blush px-5 py-3 flex-row items-center gap-3"
        >
          <T className="flex-1 text-brand">{error}</T>
          <Button secondary onPress={retry}>
            Réessayer
          </Button>
        </View>
      )}
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scroll}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View
            key={
              route.kind === "tab"
                ? route.tab
                : route.kind === "settings" ||
                    route.kind === "certifications" ||
                    route.kind === "tips"
                  ? route.kind
                  : route.kind === "certification"
                    ? `certification-${route.level}`
                    : route.kind === "quiz"
                      ? `${route.title}-${route.mode}`
                      : `${route.kind}-${route.id}`
            }
            className="w-full max-w-6xl self-center px-5 py-7 md:px-8 md:py-10"
          >
            {page}
          </View>
          <View className="py-6 items-center">
            <T muted className="text-xs">
              LexiDrive-fr · Cultive les mots, à ton rythme.
            </T>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      {!wide && progress.onboarded && (
        <View
          className="bg-white border-t border-line flex-row w-full"
          style={{ paddingBottom: insets.bottom }}
        >
          {tabs.map((tab) => (
            <Nav
              key={tab.id}
              tab={tab}
              compact
              selected={active === tab.id && route.kind !== "settings"}
              onPress={() => navigate({ kind: "tab", tab: tab.id })}
            />
          ))}
        </View>
      )}
    </SafeAreaView>
  );
}
function Nav({
  tab,
  selected,
  compact = false,
  onPress,
}: {
  tab: (typeof tabs)[number];
  selected: boolean;
  compact?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      className={`${compact ? `flex-1 flex-col gap-1 px-0 rounded-none border-t-2 ${selected ? "border-brand" : "border-transparent"}` : `flex-row gap-2 px-4 rounded-xl ${selected ? "bg-blush" : ""}`} items-center justify-center py-3`}
    >
      <Icon
        name={tab.icon}
        size={compact ? 20 : 17}
        color={selected ? "#842E1B" : "#756C65"}
      />
      <T
        className={`${compact ? "text-xs" : "text-xs"} ${selected ? "text-brand" : "text-muted"}`}
      >
        {tab.title}
      </T>
    </Pressable>
  );
}
export default function App() {
  const [loaded, fontError] = useFonts({
    Inter: require("./assets/fonts/Inter_400Regular.ttf"),
    InterSemi: require("./assets/fonts/Inter_600SemiBold.ttf"),
  });
  if (!loaded && !fontError)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#FAF7F2",
          justifyContent: "center",
        }}
      >
        <ActivityIndicator color="#842E1B" />
      </View>
    );
  return (
    <SafeAreaProvider>
      <ProgressProvider repository={progressRepository}>
        <Shell />
      </ProgressProvider>
    </SafeAreaProvider>
  );
}
