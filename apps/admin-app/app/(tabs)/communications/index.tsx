import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

const COLORS = { temple: "#8B4513", saffron: "#F97316", templeBg: "#FFF8F0", white: "#FFFFFF", gray: "#666", border: "#E8C9A0", green: "#16A34A" };

export default function AdminCommunications() {
  const [message, setMessage] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["push"]);

  function toggleChannel(ch: string) {
    setSelectedChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch]
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Communications</Text>
      </View>

      {/* Quick Message Composer */}
      <View style={styles.composerCard}>
        <Text style={styles.composerTitle}>Quick Announcement</Text>
        <TextInput
          style={styles.messageInput}
          placeholder="Type your announcement..."
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
          placeholderTextColor="#999"
        />

        <Text style={styles.channelLabel}>Channels:</Text>
        <View style={styles.channelRow}>
          {[
            { key: "push", label: "Push", icon: "notifications" as const },
            { key: "email", label: "Email", icon: "mail" as const },
            { key: "sms", label: "SMS", icon: "chatbubble" as const },
          ].map((ch) => (
            <TouchableOpacity
              key={ch.key}
              style={[styles.channelButton, selectedChannels.includes(ch.key) && styles.channelButtonActive]}
              onPress={() => toggleChannel(ch.key)}
            >
              <Ionicons name={ch.icon} size={16} color={selectedChannels.includes(ch.key) ? COLORS.white : COLORS.temple} />
              <Text style={[styles.channelText, selectedChannels.includes(ch.key) && styles.channelTextActive]}>
                {ch.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={[styles.sendButton, !message && styles.sendButtonDisabled]} disabled={!message}>
          <Ionicons name="send" size={18} color={COLORS.white} />
          <Text style={styles.sendText}>Send Now</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Announcements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent</Text>
        {[
          { title: "Ram Navami Schedule", time: "Yesterday", channels: ["email", "push"], delivered: 892 },
          { title: "Weekly Newsletter", time: "2 days ago", channels: ["email"], delivered: 1024 },
          { title: "Parking Update", time: "5 days ago", channels: ["push", "sms"], delivered: 456 },
        ].map((ann, idx) => (
          <View key={idx} style={styles.announcementCard}>
            <Text style={styles.annTitle}>{ann.title}</Text>
            <View style={styles.annMeta}>
              <Text style={styles.annTime}>{ann.time}</Text>
              <View style={styles.annChannels}>
                {ann.channels.map((ch) => (
                  <View key={ch} style={styles.channelTag}>
                    <Text style={styles.channelTagText}>{ch}</Text>
                  </View>
                ))}
              </View>
              <Text style={styles.annDelivered}>{ann.delivered} delivered</Text>
            </View>
          </View>
        ))}
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.templeBg },
  header: { padding: 20, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: COLORS.temple },
  composerCard: { margin: 16, padding: 16, backgroundColor: COLORS.white, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
  composerTitle: { fontSize: 16, fontWeight: "bold", color: COLORS.temple, marginBottom: 12 },
  messageInput: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 12, fontSize: 15, color: "#333", minHeight: 100, textAlignVertical: "top" },
  channelLabel: { fontSize: 14, fontWeight: "600", color: COLORS.temple, marginTop: 12, marginBottom: 8 },
  channelRow: { flexDirection: "row", gap: 8 },
  channelButton: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.white },
  channelButtonActive: { backgroundColor: COLORS.temple, borderColor: COLORS.temple },
  channelText: { fontSize: 13, fontWeight: "600", color: COLORS.temple },
  channelTextActive: { color: COLORS.white },
  sendButton: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: COLORS.saffron, paddingVertical: 14, borderRadius: 10, marginTop: 16 },
  sendButtonDisabled: { opacity: 0.5 },
  sendText: { color: COLORS.white, fontSize: 16, fontWeight: "bold" },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.temple, marginBottom: 12 },
  announcementCard: { backgroundColor: COLORS.white, padding: 14, borderRadius: 10, borderWidth: 1, borderColor: COLORS.border, marginBottom: 8 },
  annTitle: { fontSize: 15, fontWeight: "600", color: "#333" },
  annMeta: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" },
  annTime: { fontSize: 12, color: COLORS.gray },
  annChannels: { flexDirection: "row", gap: 4 },
  channelTag: { backgroundColor: COLORS.temple + "15", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  channelTagText: { fontSize: 10, color: COLORS.temple, fontWeight: "600" },
  annDelivered: { fontSize: 12, color: COLORS.green, fontWeight: "500" },
});
