import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  saffron: "#F97316",
  temple: "#8B4513",
  templeBg: "#FFF8F0",
  white: "#FFFFFF",
  gray: "#666666",
  border: "#E8C9A0",
  red: "#DC2626",
};

export default function LiveScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("livestream.title")}</Text>
      </View>

      {/* Active Live Stream */}
      <TouchableOpacity style={styles.liveCard}>
        <View style={styles.videoPlaceholder}>
          <View style={styles.playButton}>
            <Ionicons name="play" size={40} color={COLORS.white} />
          </View>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>{t("livestream.liveNow")}</Text>
          </View>
          <View style={styles.viewersBadge}>
            <Ionicons name="eye" size={14} color={COLORS.white} />
            <Text style={styles.viewersText}>142</Text>
          </View>
        </View>
        <View style={styles.liveInfo}>
          <Text style={styles.liveTitle}>Evening Sandhya Aarti</Text>
          <Text style={styles.liveSubtitle}>Sri Venkateswara Temple</Text>
        </View>
      </TouchableOpacity>

      {/* Upcoming Streams */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("livestream.upcoming")}</Text>
        {[
          { title: "Morning Abhishekam", time: "Tomorrow, 7:00 AM" },
          { title: "Saturday Hanuman Chalisa", time: "Sat, 6:00 PM" },
          { title: "Ram Navami Special Puja", time: "Apr 14, 6:00 AM" },
        ].map((stream, idx) => (
          <View key={idx} style={styles.upcomingCard}>
            <View style={styles.upcomingIcon}>
              <Ionicons name="calendar-outline" size={24} color={COLORS.saffron} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.upcomingTitle}>{stream.title}</Text>
              <Text style={styles.upcomingTime}>{stream.time}</Text>
            </View>
            <TouchableOpacity style={styles.remindButton}>
              <Ionicons name="notifications-outline" size={18} color={COLORS.temple} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Past Recordings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("livestream.past")}</Text>
        {[
          { title: "Shivratri Special Abhishekam", date: "Mar 10, 2026", viewers: 523, duration: "3h 45m" },
          { title: "Holi Celebration", date: "Mar 7, 2026", viewers: 312, duration: "2h 15m" },
          { title: "Weekly Satsang", date: "Mar 6, 2026", viewers: 87, duration: "1h 30m" },
        ].map((recording, idx) => (
          <TouchableOpacity key={idx} style={styles.recordingCard}>
            <View style={styles.recordingThumbnail}>
              <Ionicons name="play-circle" size={32} color={COLORS.white} />
              <Text style={styles.durationBadge}>{recording.duration}</Text>
            </View>
            <View style={styles.recordingInfo}>
              <Text style={styles.recordingTitle}>{recording.title}</Text>
              <Text style={styles.recordingMeta}>
                {recording.date} | {recording.viewers} views
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.templeBg },
  header: { padding: 20, paddingBottom: 8 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: COLORS.temple },
  liveCard: { marginHorizontal: 16, borderRadius: 12, overflow: "hidden", backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border },
  videoPlaceholder: { height: 200, backgroundColor: "#1A1A2E", justifyContent: "center", alignItems: "center" },
  playButton: { width: 60, height: 60, borderRadius: 30, backgroundColor: "rgba(255,255,255,0.3)", justifyContent: "center", alignItems: "center" },
  liveBadge: { position: "absolute", top: 12, left: 12, flexDirection: "row", alignItems: "center", backgroundColor: COLORS.red, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, gap: 6 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.white },
  liveText: { color: COLORS.white, fontSize: 12, fontWeight: "bold" },
  viewersBadge: { position: "absolute", top: 12, right: 12, flexDirection: "row", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, gap: 4 },
  viewersText: { color: COLORS.white, fontSize: 12, fontWeight: "600" },
  liveInfo: { padding: 16 },
  liveTitle: { fontSize: 17, fontWeight: "bold", color: "#333" },
  liveSubtitle: { fontSize: 13, color: COLORS.gray, marginTop: 2 },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.temple, marginBottom: 12 },
  upcomingCard: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.white, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, marginBottom: 8, gap: 12 },
  upcomingIcon: { width: 44, height: 44, borderRadius: 10, backgroundColor: COLORS.saffron + "15", justifyContent: "center", alignItems: "center" },
  upcomingTitle: { fontSize: 15, fontWeight: "600", color: "#333" },
  upcomingTime: { fontSize: 13, color: COLORS.gray, marginTop: 2 },
  remindButton: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: COLORS.border, justifyContent: "center", alignItems: "center" },
  recordingCard: { flexDirection: "row", backgroundColor: COLORS.white, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, marginBottom: 8, overflow: "hidden" },
  recordingThumbnail: { width: 120, height: 80, backgroundColor: "#1A1A2E", justifyContent: "center", alignItems: "center" },
  durationBadge: { position: "absolute", bottom: 4, right: 4, backgroundColor: "rgba(0,0,0,0.7)", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, color: COLORS.white, fontSize: 10, fontWeight: "600", overflow: "hidden" },
  recordingInfo: { flex: 1, padding: 12, justifyContent: "center" },
  recordingTitle: { fontSize: 14, fontWeight: "600", color: "#333" },
  recordingMeta: { fontSize: 12, color: COLORS.gray, marginTop: 4 },
});
