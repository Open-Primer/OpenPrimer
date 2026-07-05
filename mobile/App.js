import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  StatusBar, 
  Platform, 
  BackHandler, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WifiOff, GraduationCap, ChevronRight, RotateCw } from 'lucide-react-native';
import config from './config.json';

const BASE_URL = config.BASE_URL || 'https://openprimer.vercel.app';
const { width } = Dimensions.get('window');

const CUSTOM_USER_AGENT = Platform.OS === 'android'
  ? 'Mozilla/5.0 (Linux; Android 13; Pixel 7a) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'
  : 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1';

// Multilingual Dictionaries for the Offline Screen (9 standard supported languages)
const LOCALIZED_STRINGS = {
  FR: {
    offline_title: "Vous êtes hors-ligne",
    offline_subtitle: "Vérifiez votre connexion internet pour accéder à l'intégralité d'OpenPrimer.",
    section_title: "VOS COURS EN PROGRESSION (CACHE)",
    empty_title: "Aucun cours en cache pour le moment.",
    empty_subtitle: "Connectez-vous à internet et visitez votre tableau de bord Curriculum pour synchroniser vos cours automatiquement.",
    retry_button: "RÉESSAYER LA CONNEXION",
    progress_completed: "complété",
    course: "COURS",
    academic: "ACADÉMIQUE",
    loading_cache: "Chargement du cache..."
  },
  EN: {
    offline_title: "You are offline",
    offline_subtitle: "Check your internet connection to access the entirety of OpenPrimer.",
    section_title: "YOUR IN-PROGRESS COURSES (CACHED)",
    empty_title: "No cached courses at the moment.",
    empty_subtitle: "Connect to the internet and visit your Curriculum dashboard to sync your courses automatically.",
    retry_button: "RETRY CONNECTION",
    progress_completed: "completed",
    course: "COURSE",
    academic: "ACADEMIC",
    loading_cache: "Loading cache..."
  },
  ES: {
    offline_title: "Estás desconectado",
    offline_subtitle: "Verifica tu conexão a internet para acessar todo OpenPrimer.",
    section_title: "TUS CURSOS EN PROGRESO (EN CACHÉ)",
    empty_title: "No hay cursos en caché por el momento.",
    empty_subtitle: "Conéctate a internet y visita tu panel de Curriculum para sincronizar tus cursos automáticamente.",
    retry_button: "REINTENTAR CONEXIÓN",
    progress_completed: "completado",
    course: "CURSO",
    academic: "ACADÉMICO",
    loading_cache: "Cargando caché..."
  },
  DE: {
    offline_title: "Sie sind offline",
    offline_subtitle: "Überprüfen Sie Ihre Internetverbindung, um auf ganz OpenPrimer zuzugreifen.",
    section_title: "IHRE LAUFENDEN KURSE (GECACHED)",
    empty_title: "Derzeit keine gecoachten Kurse.",
    empty_subtitle: "Verbinden Sie sich mit dem Internet und besuchen Sie Ihr Curriculum-Dashboard, um Ihre Kurse automatisch zu synchronisieren.",
    retry_button: "VERBINDUNG ERNEUT VERSUCHEN",
    progress_completed: "abgeschlossen",
    course: "KURS",
    academic: "AKADEMISCH",
    loading_cache: "Cache wird geladen..."
  },
  ZH: {
    offline_title: "您已离线",
    offline_subtitle: "检查您的互联网连接以访问 OpenPrimer 的全部内容。",
    section_title: "您的在学课程（已缓存）",
    empty_title: "目前没有缓存的课程。",
    empty_subtitle: "连接到互联网并访问您的课程仪表板以自动同步您的课程。",
    retry_button: "重试连接",
    progress_completed: "已完成",
    course: "课程",
    academic: "学术",
    loading_cache: "正在加载缓存..."
  },
  PT: {
    offline_title: "Você está offline",
    offline_subtitle: "Verifique sua conexão com a internet para acessar todo o OpenPrimer.",
    section_title: "SEUS CURSOS EM PROGRESSO (SALVOS)",
    empty_title: "Nenhum curso em cache no momento.",
    empty_subtitle: "Conecte-se à internet e visite o seu painel de Currículo para sincronizar seus cursos automaticamente.",
    retry_button: "TENTAR NOVAMENTE",
    progress_completed: "concluído",
    course: "CURSO",
    academic: "ACADÊMICO",
    loading_cache: "Carregando cache..."
  },
  AR: {
    offline_title: "أنت غير متصل بالإنترنت",
    offline_subtitle: "تحقق من اتصالك بالإنترنت للوصول إلى OpenPrimer بالكامل.",
    section_title: "دوراتك قيد التقدم (المخزنة مؤقتًا)",
    empty_title: "لا توجد دورات مخزنة مؤقتًا في الوقت الحالي.",
    empty_subtitle: "اتصل بالإنترنت وزر لوحة تحكم المنهج الدراسي لمزامنة دوراتك تلقائيًا.",
    retry_button: "إعادة محاولة الاتصال",
    progress_completed: "مكتمل",
    course: "دورة",
    academic: "أكاديمي",
    loading_cache: "جاري تحميل التخزين المؤقت..."
  },
  HI: {
    offline_title: "आप ऑफ़लाइन हैं",
    offline_subtitle: "OpenPrimer की संपूर्णता तक पहुँचने के लिए अपना इंटरनेट कनेक्शन जाँचें।",
    section_title: "आपके प्रगतिरत पाठ्यक्रम (कैश किए गए)",
    empty_title: "इस समय कोई कैश किया गया पाठ्यक्रम नहीं है।",
    empty_subtitle: "अपने पाठ्यक्रमों को स्वचालित रूप से सिंक करने के लिए इंटरनेट से कनेक्ट करें और अपने पाठ्यचर्या डैशबोर्ड पर जाएं।",
    retry_button: "कनेक्शन पुनः प्रयास करें",
    progress_completed: "पूरा हुआ",
    course: "कोर्स",
    academic: "अकादमिक",
    loading_cache: "कैश लोड हो रहा है..."
  },
  UR: {
    offline_title: "آپ آف لائن ہیں",
    offline_subtitle: "OpenPrimer تک رسائی حاصل کرنے کے لیے اپنا انٹرنیٹ کنکشن چیک کریں۔",
    section_title: "آپ کے جاری کورسز (کیش شدہ)",
    empty_title: "اس وقت کوئی کیش شدہ کورس نہیں ہے۔",
    empty_subtitle: "اپنے کورسز کو خودکار طور پر مطابقت پذیر کرنے کے لیے انٹرنیٹ سے جڑیں اور اپنے نصابی ڈیش بورڈ पर जाएं।",
    retry_button: "دوبارہ کنکشن کی کوشش کریں",
    progress_completed: "مکمل",
    course: "کورس",
    academic: "تعلیمی",
    loading_cache: "کیش لوڈ ہو رہا ہے..."
  }
};

export default function App() {
  const webviewRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [cachedCourses, setCachedCourses] = useState([]);
  const [cachedLanguage, setCachedLanguage] = useState('FR');
  const [cachedLabels, setCachedLabels] = useState(null);
  const [loadingCache, setLoadingCached] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  // Load cached courses, language and dynamic labels from AsyncStorage on startup
  useEffect(() => {
    async function loadCachedData() {
      try {
        const [coursesData, langData, labelsData] = await Promise.all([
          AsyncStorage.getItem('cached_active_courses'),
          AsyncStorage.getItem('cached_language'),
          AsyncStorage.getItem('cached_labels')
        ]);
        
        if (coursesData) {
          setCachedCourses(JSON.parse(coursesData));
        }
        if (langData) {
          setCachedLanguage(langData);
        }
        if (labelsData) {
          setCachedLabels(JSON.parse(labelsData));
        }
      } catch (err) {
        console.warn("[Cache] Failed to load cached active courses/language/labels:", err);
      } finally {
        setLoadingCached(false);
      }
    }
    loadCachedData();
  }, [reloadKey]);

  // Intercept hardware Back Button on Android
  useEffect(() => {
    const handleBackButton = () => {
      if (canGoBack && webviewRef.current) {
        webviewRef.current.goBack();
        return true; // Prevent default action (exiting the app)
      }
      return false; // Let the system exit the app if no history
    };

    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    }

    return () => {
      if (Platform.OS === 'android') {
        BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
      }
    };
  }, [canGoBack]);

  // Sync data received from Web app (Curriculum, active language and translated labels)
  const handleMessage = async (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.type === 'SYNC_CURRICULUM') {
        console.log("[Mobile App] Synchronizing curriculum and language:", message.payload, message.lang);
        setCachedCourses(message.payload);
        
        const storagePromises = [
          AsyncStorage.setItem('cached_active_courses', JSON.stringify(message.payload))
        ];
        
        if (message.lang) {
          const upperLang = message.lang.toUpperCase();
          if (LOCALIZED_STRINGS[upperLang]) {
            setCachedLanguage(upperLang);
            storagePromises.push(AsyncStorage.setItem('cached_language', upperLang));
          }
        }
        
        if (message.labels) {
          setCachedLabels(message.labels);
          storagePromises.push(AsyncStorage.setItem('cached_labels', JSON.stringify(message.labels)));
        }
        
        await Promise.all(storagePromises);
      }
    } catch (err) {
      console.warn("[Mobile App] Error parsing WebView message:", err);
    }
  };

  // Attempt to reconnect / reload WebView
  const handleRetry = () => {
    setIsOffline(false);
    setReloadKey(prev => prev + 1);
  };

  // Active localized strings (Dynamic labels override static fallback)
  const ls = cachedLabels || LOCALIZED_STRINGS[cachedLanguage] || LOCALIZED_STRINGS.FR;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#020617" />
      
      {!isOffline ? (
        <View style={styles.webviewWrapper}>
          <WebView 
            key={reloadKey}
            ref={webviewRef}
            source={{ uri: BASE_URL }}
            style={styles.webview}
            userAgent={CUSTOM_USER_AGENT}
            allowsBackForwardNavigationGestures={true}
            domStorageEnabled={true}
            javaScriptEnabled={true}
            scalesPageToFit={true}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b82f6" />
              </View>
            )}
            onNavigationStateChange={(navState) => {
              setCanGoBack(navState.canGoBack);
            }}
            onMessage={handleMessage}
            onError={() => {
              console.log("[WebView] Load error detected. Switching to offline UI.");
              setIsOffline(true);
            }}
            onHttpError={() => {
              // Also catch HTTP server errors as offline indicators
              console.log("[WebView] HTTP Error detected. Switching to offline UI.");
              setIsOffline(true);
            }}
          />
        </View>
      ) : (
        /* PREMIUM NATIVE OFFLINE SCREEN */
        <View style={styles.offlineContainer}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Header / Network Status */}
            <View style={styles.offlineHeader}>
              <View style={styles.wifiIconContainer}>
                <WifiOff size={32} color="#f59e0b" />
              </View>
              <Text style={styles.offlineTitle}>{ls.offline_title}</Text>
              <Text style={styles.offlineSubtitle}>{ls.offline_subtitle}</Text>
            </View>

            {/* Cached Courses Checklist */}
            <View style={styles.sectionHeader}>
              <GraduationCap size={16} color="#64748b" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>{ls.section_title}</Text>
            </View>

            {loadingCache ? (
              <View style={styles.loadingCacheContainer}>
                <ActivityIndicator size="small" color="#64748b" style={{ marginRight: 10 }} />
                <Text style={styles.loadingCacheText}>{ls.loading_cache}</Text>
              </View>
            ) : cachedCourses.length > 0 ? (
              cachedCourses.map((course) => (
                <View key={course.id || course.slug} style={styles.courseCard}>
                  <View style={styles.courseInfo}>
                    <Text style={styles.courseLevelSubject}>
                      {course.level ? course.level.toUpperCase() : ls.course} • {course.subject ? course.subject.toUpperCase() : ls.academic}
                    </Text>
                    <Text style={styles.courseName}>{course.title || 'Module d\'apprentissage'}</Text>
                    
                    {/* Progress Bar */}
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBg}>
                        <View style={[styles.progressFill, { width: `${course.progress || 0}%` }]} />
                      </View>
                      <Text style={styles.progressText}>{course.progress || 0}% {ls.progress_completed}</Text>
                    </View>
                  </View>
                  <ChevronRight size={18} color="#334155" style={styles.cardArrow} />
                </View>
              ))
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{ls.empty_title}</Text>
                <Text style={styles.emptySubtext}>{ls.empty_subtitle}</Text>
              </View>
            )}

            {/* Action buttons */}
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry} activeOpacity={0.8}>
              <RotateCw size={16} color="#ffffff" style={styles.retryIcon} />
              <Text style={styles.retryButtonText}>{ls.retry_button}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617', // Slate-950
  },
  webviewWrapper: {
    flex: 1,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  webview: {
    flex: 1,
    backgroundColor: '#020617',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  /* OFFLINE SCREEN STYLES (PREMIUM DARK THEME) */
  offlineContainer: {
    flex: 1,
    backgroundColor: '#020617',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
  },
  offlineHeader: {
    alignItems: 'center',
    marginBottom: 40,
    width: '100%',
  },
  wifiIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: 'rgba(245, 158, 11, 0.1)', // Amber color with 10% opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  offlineTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#f8fafc', // Slate-50
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  offlineSubtitle: {
    fontSize: 13,
    color: '#64748b', // Slate-500
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 16,
    width: '100%',
    paddingLeft: 4,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: '#64748b',
    letterSpacing: 1.5,
  },
  courseCard: {
    width: '100%',
    backgroundColor: 'rgba(15, 23, 42, 0.6)', // Slate-900 with opacity
    borderWidth: 1,
    borderColor: '#1e293b', // Slate-800
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  courseInfo: {
    flex: 1,
    paddingRight: 12,
  },
  courseLevelSubject: {
    fontSize: 9,
    fontWeight: '900',
    color: '#3b82f6', // Blue-500
    letterSpacing: 1,
    marginBottom: 6,
  },
  courseName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#e2e8f0', // Slate-200
    marginBottom: 14,
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#0f172a', // Slate-900
    overflow: 'hidden',
    marginRight: 10,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: '#10b981', // Emerald-500 (matching Elite aesthetic)
  },
  progressText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569', // Slate-600
  },
  cardArrow: {
    marginLeft: 4,
  },
  emptyContainer: {
    width: '100%',
    padding: 30,
    borderRadius: 24,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#1e293b',
    alignItems: 'center',
    marginBottom: 30,
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 11,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 16,
  },
  retryButton: {
    width: '100%',
    height: 52,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  retryIcon: {
    marginRight: 10,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  loadingCacheContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 20,
  },
  loadingCacheText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600'
  }
});
