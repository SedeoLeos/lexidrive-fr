import { View, Pressable } from "react-native";
import { Heading, T, Icon } from "../atoms/ui";
export function Section({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) {
  return (
    <View className="flex-row justify-between items-center gap-3 mb-4 mt-2">
      <Heading small>{title}</Heading>
      {action && (
        <Pressable
          accessibilityRole="button"
          onPress={onPress}
          className="flex-row items-center gap-1 py-2"
        >
          <T className="text-brand text-xs">{action}</T>
          <Icon name="ChevronRight" size={15} />
        </Pressable>
      )}
    </View>
  );
}
