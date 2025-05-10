import { Language } from '../contexts/LanguageContext';

type TranslationKey = string;
type TranslationValue = string;
type LanguageTranslations = Record<TranslationKey, TranslationValue>;
type Translations = Record<string, LanguageTranslations>;

export const translations: Translations = {
  en: {
    // Common
    'app.welcome': 'Welcome to SafeGround Connect',
    'app.description': 'Your platform for legal support and safety resources',
    'app.loading': 'Loading...',
    'app.error': 'An error occurred',
    
    // Navigation
    'nav.home': 'Home',
    'nav.legal_help': 'Legal Help',
    'nav.safe_spaces': 'Safe Spaces',
    'nav.resources': 'Resources',
    'nav.account': 'Account',
    
    // Legal Help
    'legal.title': 'Legal Assistance',
    'legal.description': 'Get the legal help you need',
    'legal.chat_placeholder': 'Describe your legal situation...',
    'legal.connect_lawyer': 'Connect with a Lawyer',
    'legal.free_consultation': 'Free Consultation',
    
    // Safe Spaces
    'spaces.title': 'Safe Spaces Near You',
    'spaces.search_placeholder': 'Search for safe spaces...',
    'spaces.filter': 'Filter Spaces',
    'spaces.report': 'Report an Incident',
    
    // Account
    'account.settings': 'Account Settings',
    'account.language': 'Language',
    'account.notifications': 'Notifications',
    'account.privacy': 'Privacy',
    'account.help': 'Help & Support',
    'account.logout': 'Log Out',
    
    // Accessibility
    'accessibility.high_contrast': 'High Contrast Mode',
    'accessibility.large_text': 'Large Text Mode',
    'accessibility.screen_reader': 'Screen Reader Support',
    
    // Privacy
    'privacy.location_sharing': 'Location Sharing',
    'privacy.activity_history': 'Activity History',
    'privacy.data_usage': 'Data Usage',
    
    // Buttons
    'button.save': 'Save',
    'button.cancel': 'Cancel',
    'button.next': 'Next',
    'button.back': 'Back',
    'button.submit': 'Submit',
    'button.learn_more': 'Learn More'
  },
  
  es: {
    // Common
    'app.welcome': 'Bienvenido a SafeGround Connect',
    'app.description': 'Tu plataforma para apoyo legal y recursos de seguridad',
    'app.loading': 'Cargando...',
    'app.error': 'Ocurrió un error',
    
    // Navigation
    'nav.home': 'Inicio',
    'nav.legal_help': 'Ayuda Legal',
    'nav.safe_spaces': 'Espacios Seguros',
    'nav.resources': 'Recursos',
    'nav.account': 'Cuenta',
    
    // Legal Help
    'legal.title': 'Asistencia Legal',
    'legal.description': 'Obtén la ayuda legal que necesitas',
    'legal.chat_placeholder': 'Describe tu situación legal...',
    'legal.connect_lawyer': 'Conectar con un Abogado',
    'legal.free_consultation': 'Consulta Gratuita',
    
    // Safe Spaces
    'spaces.title': 'Espacios Seguros Cerca de Ti',
    'spaces.search_placeholder': 'Buscar espacios seguros...',
    'spaces.filter': 'Filtrar Espacios',
    'spaces.report': 'Reportar un Incidente',
    
    // Account
    'account.settings': 'Configuración de Cuenta',
    'account.language': 'Idioma',
    'account.notifications': 'Notificaciones',
    'account.privacy': 'Privacidad',
    'account.help': 'Ayuda y Soporte',
    'account.logout': 'Cerrar Sesión',
    
    // Accessibility
    'accessibility.high_contrast': 'Modo de Alto Contraste',
    'accessibility.large_text': 'Modo de Texto Grande',
    'accessibility.screen_reader': 'Soporte para Lector de Pantalla',
    
    // Privacy
    'privacy.location_sharing': 'Compartir Ubicación',
    'privacy.activity_history': 'Historial de Actividad',
    'privacy.data_usage': 'Uso de Datos',
    
    // Buttons
    'button.save': 'Guardar',
    'button.cancel': 'Cancelar',
    'button.next': 'Siguiente',
    'button.back': 'Atrás',
    'button.submit': 'Enviar',
    'button.learn_more': 'Más Información'
  },
  
  ar: {
    // Common
    'app.welcome': 'مرحباً بك في SafeGround Connect',
    'app.description': 'منصتك للدعم القانوني وموارد السلامة',
    'app.loading': 'جاري التحميل...',
    'app.error': 'حدث خطأ',
    
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.legal_help': 'المساعدة القانونية',
    'nav.safe_spaces': 'الأماكن الآمنة',
    'nav.resources': 'الموارد',
    'nav.account': 'الحساب',
    
    // Legal Help
    'legal.title': 'المساعدة القانونية',
    'legal.description': 'احصل على المساعدة القانونية التي تحتاجها',
    'legal.chat_placeholder': 'صف وضعك القانوني...',
    'legal.connect_lawyer': 'تواصل مع محامٍ',
    'legal.free_consultation': 'استشارة مجانية',
    
    // Safe Spaces
    'spaces.title': 'الأماكن الآمنة بالقرب منك',
    'spaces.search_placeholder': 'البحث عن أماكن آمنة...',
    'spaces.filter': 'تصفية الأماكن',
    'spaces.report': 'الإبلاغ عن حادث',
    
    // Account
    'account.settings': 'إعدادات الحساب',
    'account.language': 'اللغة',
    'account.notifications': 'الإشعارات',
    'account.privacy': 'الخصوصية',
    'account.help': 'المساعدة والدعم',
    'account.logout': 'تسجيل الخروج',
    
    // Accessibility
    'accessibility.high_contrast': 'وضع التباين العالي',
    'accessibility.large_text': 'وضع النص الكبير',
    'accessibility.screen_reader': 'دعم قارئ الشاشة',
    
    // Privacy
    'privacy.location_sharing': 'مشاركة الموقع',
    'privacy.activity_history': 'سجل النشاط',
    'privacy.data_usage': 'استخدام البيانات',
    
    // Buttons
    'button.save': 'حفظ',
    'button.cancel': 'إلغاء',
    'button.next': 'التالي',
    'button.back': 'رجوع',
    'button.submit': 'إرسال',
    'button.learn_more': 'معرفة المزيد'
  }
  // Additional languages can be added here following the same structure
}; 