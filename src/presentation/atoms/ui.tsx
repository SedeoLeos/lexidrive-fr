import React from "react";
import {
  Text,
  View,
  Pressable,
  TextInput,
  Platform,
  type TextInputProps,
} from "react-native";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  BookOpen,
  House,
  ChartNoAxesColumnIncreasing,
  PenLine,
  Settings,
  Headphones,
  Mic,
  Play,
  Pause,
  Square,
  Volume2,
  RotateCcw,
  ChevronRight,
  Flame,
  Target,
  WifiOff,
  Download,
  Upload,
  Clock,
  GraduationCap,
  Search,
  X,
  NotebookPen,
  CheckCheck,
  CalendarDays,
  Lightbulb,
  type LucideIcon,
} from "lucide-react-native";
export const icons = {
  ArrowRight,
  ArrowLeft,
  Check,
  BookOpen,
  House,
  ChartNoAxesColumnIncreasing,
  PenLine,
  Settings,
  Headphones,
  Mic,
  Play,
  Pause,
  Square,
  Volume2,
  RotateCcw,
  ChevronRight,
  Flame,
  Target,
  WifiOff,
  Download,
  Upload,
  Clock,
  GraduationCap,
  Search,
  X,
  NotebookPen,
  CheckCheck,
  CalendarDays,
  Lightbulb,
};
export function Icon({
  name,
  size = 20,
  color = "#842E1B",
}: {
  name: keyof typeof icons;
  size?: number;
  color?: string;
}) {
  const I: LucideIcon = icons[name];
  return <I size={size} color={color} strokeWidth={1.7} />;
}
export function T({
  children,
  muted = false,
  className = "",
  style,
  ...props
}: React.ComponentProps<typeof Text> & { muted?: boolean }) {
  return (
    <Text
      {...props}
      className={`${/text-(brand|white|sage|ink|muted|\[#[0-9a-fA-F])/.test(className) ? "" : muted ? "text-muted" : "text-ink"} text-sm leading-6 ${className}`}
      style={[{ fontFamily: "Inter" }, style]}
    >
      {children}
    </Text>
  );
}
export function Heading({
  children,
  small = false,
}: {
  children: React.ReactNode;
  small?: boolean;
}) {
  return (
    <Text
      accessibilityRole="header"
      className={`text-ink ${small ? "text-2xl" : "text-4xl"} leading-tight`}
      style={{
        fontFamily:
          Platform.OS === "ios"
            ? "Georgia"
            : Platform.OS === "web"
              ? "Georgia"
              : "serif",
      }}
    >
      {children}
    </Text>
  );
}
export function Label({ children }: { children: React.ReactNode }) {
  return (
    <T
      className="uppercase text-xs tracking-widest text-brand"
      style={{ fontFamily: "InterSemi" }}
    >
      {children}
    </T>
  );
}
export function Button({
  children,
  onPress,
  secondary = false,
  disabled = false,
  icon,
}: {
  children: React.ReactNode;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  icon?: keyof typeof icons;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`min-h-12 rounded-2xl px-5 py-3 flex-row items-center justify-center gap-3 ${secondary ? "bg-white border border-line" : "bg-brand"} ${disabled ? "opacity-40" : "active:opacity-70"}`}
    >
      <T
        className={secondary ? "text-ink" : "text-white"}
        style={{ fontFamily: "InterSemi" }}
      >
        {children}
      </T>
      {icon && (
        <Icon name={icon} color={secondary ? "#842E1B" : "#FFFFFF"} size={18} />
      )}
    </Pressable>
  );
}
export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <View
      className={`bg-white border border-line rounded-3xl p-5 ${className}`}
    >
      {children}
    </View>
  );
}
export function Badge({
  children,
  green = false,
}: {
  children: React.ReactNode;
  green?: boolean;
}) {
  return (
    <View
      className={`self-start rounded-full px-3 py-1 ${green ? "bg-[#E9F0E8]" : "bg-blush"}`}
    >
      <T className={`text-xs ${green ? "text-sage" : "text-brand"}`}>
        {children}
      </T>
    </View>
  );
}
export function Bar({ value }: { value: number }) {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(value) }}
      className="h-2 bg-line rounded-full overflow-hidden"
    >
      <View
        className="h-full bg-brand rounded-full"
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </View>
  );
}
export function Input({
  className = "",
  ...props
}: TextInputProps & { className?: string }) {
  return (
    <TextInput
      placeholderTextColor="#827970"
      {...props}
      className={`bg-white border border-line rounded-2xl px-4 py-3 text-base text-ink min-h-12 ${className}`}
      style={[{ fontFamily: "Inter", textAlignVertical: "top" }, props.style]}
    />
  );
}
export function Back({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Retour"
      onPress={onPress}
      className="flex-row items-center gap-2 py-2 self-start"
    >
      <Icon name="ArrowLeft" size={18} />
      <T className="text-brand">Retour</T>
    </Pressable>
  );
}
export function Empty({ title, body }: { title: string; body: string }) {
  return (
    <Card>
      <Heading small>{title}</Heading>
      <T muted className="mt-3">
        {body}
      </T>
    </Card>
  );
}
