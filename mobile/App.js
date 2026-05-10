import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { BookOpen, Star, User, ChevronRight } from 'lucide-react-native';

const COLORS = {
  bg: '#020617',
  card: '#0f172a',
  blue: '#2563eb',
  text: '#f8fafc',
  subtext: '#64748b'
};

const CourseCard = ({ title, level }) => (
  <TouchableOpacity style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.iconBox}>
        <BookOpen color={COLORS.blue} size={20} />
      </div>
      <Text style={styles.levelText}>{level}</Text>
    </View>
    <Text style={styles.cardTitle}>{title}</Text>
    <View style={styles.cardFooter}>
      <Text style={styles.footerText}>Continue Reading</Text>
      <ChevronRight color={COLORS.subtext} size={16} />
    </View>
  </TouchableOpacity>
);

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View className="p-6">
        <View style={styles.header}>
          <Text style={styles.logo}>OpenPrimer</Text>
          <TouchableOpacity style={styles.profileBtn}>
            <User color={COLORS.text} size={20} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
          <View style={styles.hero}>
            <Text style={styles.heroTitle}>Your Academic Cockpit</Text>
            <View style={styles.aiCoach}>
              <Text style={styles.coachText}>"Welcome back! You're 3 chapters away from validating Biology L1."</Text>
            </motion.div>
          </View>

          <Text style={styles.sectionTitle}>Active Curricula</Text>
          <CourseCard title="Biology L1: Cell Biology" level="L1" />
          <CourseCard title="Physics L1: Mechanics" level="L1" />
          <CourseCard title="CS L1: Python Master" level="L1" />

          <View style={styles.spacer} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  logo: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -1,
  },
  profileBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  scroll: {
    marginTop: 10,
  },
  hero: {
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 15,
  },
  aiCoach: {
    backgroundColor: COLORS.blue,
    padding: 20,
    borderRadius: 24,
    shadowColor: COLORS.blue,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  coachText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 24,
  },
  sectionTitle: {
    color: COLORS.subtext,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelText: {
    color: COLORS.subtext,
    fontSize: 10,
    fontWeight: '800',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
  },
  footerText: {
    color: COLORS.subtext,
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  spacer: {
    height: 100,
  }
});
