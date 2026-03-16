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
};

const events = [
  { id: "1", title: "Ram Navami Celebrations", type: "festival", date: "Apr 14, 2026", time: "8:00 AM - 8:00 PM", rsvps: 245, spotsLeft: 255, registered: true },
  { id: "2", title: "Youth Sanskrit Workshop", type: "educational", date: "Mar 22, 2026", time: "10:00 AM - 1:00 PM", rsvps: 18, spotsLeft: 12, registered: false },
  { id: "3", title: "Weekly Satsang", type: "weekly_puja", date: "Every Saturday", time: "6:00 PM - 8:00 PM", rsvps: 42, spotsLeft: null, registered: false },
  { id: "4", title: "Hanuman Jayanti", type: "festival", date: "Apr 22, 2026", time: "6:00 AM - 9:00 PM", rsvps: 0, spotsLeft: 300, registered: false },
  { id: "5", title: "Community Volunteer Day", type: "volunteer", date: "Mar 29, 2026", time: "9:00 AM - 3:00 PM", rsvps: 28, spotsLeft: 22, registered: false },
];

const typeColors: Record<string, string> = {
  festival: "#DC2626",
  educational: "#2563EB",
  weekly_puja: "#8B4513",
  volunteer: "#16A34A",
  community: "#7C3AED",
};

export default function EventsScreen() {
  const { t } = useTranslation();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t("event.upcomingEvents")}</Text>
      </View>

      {events.map((event) => (
        <TouchableOpacity key={event.id} style={styles.eventCard}>
          <View style={styles.eventTop}>
            <View style={[styles.typeBadge, { backgroundColor: typeColors[event.type] + "20" }]}>
              <Text style={[styles.typeText, { color: typeColors[event.type] }]}>
                {event.type.replace(/_/g, " ").toUpperCase()}
              </Text>
            </View>
            {event.registered && (
              <View style={styles.registeredBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
                <Text style={styles.registeredText}>{t("event.attending")}</Text>
              </View>
            )}
          </View>

          <Text style={styles.eventTitle}>{event.title}</Text>

          <View style={styles.eventDetails}>
            <View style={styles.detailRow}>
              <Ionicons name="calendar-outline" size={16} color={COLORS.gray} />
              <Text style={styles.detailText}>{event.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Ionicons name="time-outline" size={16} color={COLORS.gray} />
              <Text style={styles.detailText}>{event.time}</Text>
            </View>
          </View>

          <View style={styles.eventFooter}>
            <Text style={styles.attendeesText}>
              {event.rsvps} {t("event.attending").toLowerCase()}
            </Text>
            {event.spotsLeft !== null && (
              <Text style={styles.spotsText}>
                {t("event.spotsLeft", { count: event.spotsLeft })}
              </Text>
            )}
          </View>

          {!event.registered && (
            <TouchableOpacity style={styles.rsvpButton}>
              <Text style={styles.rsvpButtonText}>{t("event.rsvp")}</Text>
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.templeBg },
  header: { padding: 20, paddingBottom: 8 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: COLORS.temple },
  eventCard: { backgroundColor: COLORS.white, marginHorizontal: 16, marginBottom: 12, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  eventTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  typeText: { fontSize: 10, fontWeight: "bold", letterSpacing: 0.5 },
  registeredBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  registeredText: { fontSize: 12, color: "#16A34A", fontWeight: "600" },
  eventTitle: { fontSize: 17, fontWeight: "bold", color: "#333", marginBottom: 8 },
  eventDetails: { gap: 4, marginBottom: 12 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  detailText: { fontSize: 14, color: COLORS.gray },
  eventFooter: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  attendeesText: { fontSize: 13, color: COLORS.gray },
  spotsText: { fontSize: 13, color: COLORS.saffron, fontWeight: "500" },
  rsvpButton: { backgroundColor: COLORS.temple, paddingVertical: 12, borderRadius: 8, alignItems: "center" },
  rsvpButtonText: { color: COLORS.white, fontSize: 15, fontWeight: "bold" },
});
