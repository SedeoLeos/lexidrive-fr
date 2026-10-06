import AsyncStorage from "@react-native-async-storage/async-storage";
import { initialProgress, parseBackup } from "../domain/learning";
import type { Progress, ProgressRepository } from "../domain/models";
const KEY = "lexidrive.progress.v1";
export const progressRepository: ProgressRepository = {
  async load() {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? parseBackup(raw) : initialProgress();
  },
  async save(progress: Progress) {
    await AsyncStorage.setItem(KEY, JSON.stringify(progress));
  },
};
