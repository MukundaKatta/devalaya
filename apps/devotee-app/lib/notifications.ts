import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { supabase } from "./supabase";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log("Push notifications require a physical device");
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Push notification permission not granted");
    return null;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#8B4513",
    });
  }

  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: "your-project-id",
    })
  ).data;

  return token;
}

export async function savePushToken(userId: string, token: string) {
  const platform = Platform.OS === "ios" ? "ios" : "android";

  await supabase.from("push_tokens").upsert(
    {
      user_id: userId,
      token,
      platform,
      is_active: true,
    },
    {
      onConflict: "user_id,token",
    }
  );
}

export async function removePushToken(userId: string) {
  await supabase
    .from("push_tokens")
    .update({ is_active: false })
    .eq("user_id", userId);
}
