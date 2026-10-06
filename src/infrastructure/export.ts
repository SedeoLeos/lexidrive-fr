import { Platform } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
export async function exportFile(
  name: string,
  contents: string,
  mimeType: string,
) {
  if (Platform.OS === "web") {
    const url = URL.createObjectURL(new Blob([contents], { type: mimeType }));
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return;
  }
  if (!FileSystem.documentDirectory || !(await Sharing.isAvailableAsync()))
    throw Error("Le partage de fichiers est indisponible.");
  const path = FileSystem.documentDirectory + name;
  await FileSystem.writeAsStringAsync(path, contents);
  await Sharing.shareAsync(path, {
    mimeType,
    dialogTitle: "Exporter depuis LexiDrive-fr",
  });
}
export { reminderCalendar } from "./calendar";
