import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";

const COLORS = {
  saffron: "#F97316",
  temple: "#8B4513",
  templeBg: "#FFF8F0",
  white: "#FFFFFF",
  gray: "#666666",
  lightGray: "#F5F5F5",
  border: "#E8C9A0",
};

interface ScheduleItem {
  time: string;
  name: string;
  type: "daily" | "special";
}

const todaySchedule: ScheduleItem[] = [
  { time: "06:00 AM", name: "Suprabhatam", type: "daily" },
  { time: "07:00 AM", name: "Ganapathi Homam", type: "special" },
  { time: "09:00 AM", name: "Abhishekam - Lord Shiva", type: "daily" },
  { time: "12:00 PM", name: "Madhyana Aarti", type: "daily" },
  { time: "06:30 PM", name: "Sandhya Aarti", type: "daily" },
  { time: "08:00 PM", name: "Shayan Aarti", type: "daily" },
];

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container}>
      {/* Temple Header */}
      <View style={styles.templeHeader}>
        <Text style={styles.templeName}>Sri Venkateswara Temple</Text>
        <Text style={styles.templeAddress}>123 Temple Street, City, ST 12345</Text>
        <View style={styles.statusRow}>
          <View style={styles.statusBadge}>
            <View style={styles.greenDot} />
            <Text style={styles.statusText}>Open Now</Text>
          </View>
          <Text style={styles.timingText}>6:00 AM - 9:00 PM</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart" size={24} color={COLORS.saffron} />
          <Text style={styles.actionText}>{t("donation.quickDonate")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="book" size={24} color={COLORS.saffron} />
          <Text style={styles.actionText}>{t("puja.bookPuja")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="radio" size={24} color={COLORS.saffron} />
          <Text style={styles.actionText}>{t("livestream.watchLive")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="calendar" size={24} color={COLORS.saffron} />
          <Text style={styles.actionText}>{t("event.events")}</Text>
        </TouchableOpacity>
      </View>

      {/* Live Now Banner */}
      <TouchableOpacity style={styles.liveBanner}>
        <View style={styles.liveIndicator}>
          <View style={styles.redDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.liveTitle}>Evening Sandhya Aarti</Text>
          <Text style={styles.liveViewers}>142 viewers</Text>
        </View>
        <Ionicons name="play-circle" size={32} color={COLORS.white} />
      </TouchableOpacity>

      {/* Today's Schedule */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("temple.todaySchedule")}</Text>
        {todaySchedule.map((item, idx) => (
          <View key={idx} style={styles.scheduleItem}>
            <Text style={styles.scheduleTime}>{item.time}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.scheduleName}>{item.name}</Text>
            </View>
            {item.type === "special" && (
              <View style={styles.specialBadge}>
                <Text style={styles.specialText}>Special</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Upcoming Events */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t("event.upcomingEvents")}</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>{t("common.viewAll")}</Text>
          </TouchableOpacity>
        </View>
        {[
          { name: "Ram Navami Celebrations", date: "Apr 14", rsvps: 245 },
          { name: "Youth Sanskrit Workshop", date: "Mar 22", rsvps: 18 },
        ].map((event, idx) => (
          <TouchableOpacity key={idx} style={styles.eventCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.eventName}>{event.name}</Text>
              <Text style={styles.eventDate}>{event.date}</Text>
            </View>
            <View style={styles.rsvpBadge}>
              <Text style={styles.rsvpText}>{event.rsvps} attending</Text>
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
  templeHeader: { padding: 20, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  templeName: { fontSize: 22, fontWeight: "bold", color: COLORS.temple },
  templeAddress: { fontSize: 14, color: COLORS.gray, marginTop: 4 },
  statusRow: { flexDirection: "row", alignItems: "center", marginTop: 8, gap: 12 },
  statusBadge: { flexDirection: "row", alignItems: "center", backgroundColor: "#ECFDF5", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#22C55E", marginRight: 6 },
  statusText: { fontSize: 12, color: "#16A34A", fontWeight: "600" },
  timingText: { fontSize: 12, color: COLORS.gray },
  quickActions: { flexDirection: "row", padding: 16, gap: 12 },
  actionButton: { flex: 1, alignItems: "center", backgroundColor: COLORS.white, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  actionText: { fontSize: 11, color: COLORS.temple, marginTop: 8, textAlign: "center", fontWeight: "500" },
  liveBanner: { flexDirection: "row", alignItems: "center", backgroundColor: "#DC2626", marginHorizontal: 16, padding: 16, borderRadius: 12, gap: 12 },
  liveIndicator: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  redDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.white, marginRight: 6 },
  liveText: { color: COLORS.white, fontSize: 12, fontWeight: "bold" },
  liveTitle: { color: COLORS.white, fontSize: 16, fontWeight: "600" },
  liveViewers: { color: "rgba(255,255,255,0.8)", fontSize: 12 },
  section: { padding: 16 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.temple, marginBottom: 12 },
  viewAllText: { fontSize: 14, color: COLORS.saffron, fontWeight: "600" },
  scheduleItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 12 },
  scheduleTime: { width: 80, fontSize: 13, color: COLORS.gray, fontWeight: "500" },
  scheduleName: { fontSize: 15, color: "#333" },
  specialBadge: { backgroundColor: "#FFF7ED", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  specialText: { fontSize: 11, color: COLORS.saffron, fontWeight: "600" },
  eventCard: { flexDirection: "row", alignItems: "center", backgroundColor: COLORS.white, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, marginBottom: 8 },
  eventName: { fontSize: 15, fontWeight: "600", color: "#333" },
  eventDate: { fontSize: 13, color: COLORS.gray, marginTop: 2 },
  rsvpBadge: { backgroundColor: "#F0FDF4", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  rsvpText: { fontSize: 12, color: "#16A34A", fontWeight: "500" },
});
