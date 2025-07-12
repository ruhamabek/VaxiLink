import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useEffect, useState } from "react";

export type Language = "en" | "am" | "or";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Auth
    "login.title": "Login",
    "login.email": "Email",
    "login.password": "Password",
    "login.button": "Login",
    "login.role": "Select Role",
    "login.caregiver": "Caregiver",
    "login.hew": "Health Extension Worker",
    "login.admin": "Administrator",
    
    // Caregiver
    "caregiver.home": "Home",
    "caregiver.children": "My Children",
    "caregiver.schedule": "Vaccination Schedule",
    "caregiver.clinics": "Find Clinics",
    "caregiver.messages": "Messages",
    "caregiver.education": "Education",
    "caregiver.feedback": "Feedback",
    "caregiver.addChild": "Add Child",
    "caregiver.childName": "Child's Name",
    "caregiver.birthdate": "Date of Birth",
    "caregiver.gender": "Gender",
    "caregiver.male": "Male",
    "caregiver.female": "Female",
    "caregiver.save": "Save",
    "caregiver.vaccinesDue": "Vaccines Due",
    "caregiver.vaccinesCompleted": "Vaccines Completed",
    "caregiver.nextAppointment": "Next Appointment",
    "caregiver.viewCard": "View Digital Card",
    "caregiver.findClinic": "Find Nearest Clinic",
    "caregiver.reminder": "Reminder: {{vaccine}} vaccine is due on {{date}}",
    
    // HEW
    "hew.home": "Dashboard",
    "hew.children": "Children",
    "hew.visits": "Home Visits",
    "hew.defaulters": "Defaulters",
    "hew.sync": "Sync Data",
    "hew.register": "Register Child",
    "hew.schedule": "Schedule Visit",
    "hew.record": "Record Vaccination",
    "hew.followUp": "Follow Up",
    
    // Admin
    "admin.dashboard": "Dashboard",
    "admin.heatmap": "Zero-Dose Heatmap",
    "admin.performance": "HEW Performance",
    "admin.reports": "Reports",
    "admin.settings": "Settings",
    "admin.users": "Manage Users",
    "admin.export": "Export Data",
    "admin.coverage": "Coverage Rate",
    "admin.defaulters": "Defaulter Rate",
    
    // Common
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.retry": "Retry",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.logout": "Logout",
    "common.profile": "Profile",
    "common.settings": "Settings",
    "common.language": "Language",
    "common.notifications": "Notifications",
    "common.help": "Help",
    "common.about": "About",
    "common.version": "Version",
    "common.yes": "Yes",
    "common.no": "No",
    "common.ok": "OK",
  },
  am: {
    // Auth
    "login.title": "ግባ",
    "login.email": "ኢሜይል",
    "login.password": "የይለፍ ቃል",
    "login.button": "ግባ",
    "login.role": "ሚና ይምረጡ",
    "login.caregiver": "አሳዳጊ",
    "login.hew": "የጤና ኤክስቴንሽን ሰራተኛ",
    "login.admin": "አስተዳዳሪ",
    
    // Caregiver
    "caregiver.home": "መነሻ",
    "caregiver.children": "ልጆቼ",
    "caregiver.schedule": "የክትባት መርሃግብር",
    "caregiver.clinics": "ክሊኒኮችን ፈልግ",
    "caregiver.messages": "መልዕክቶች",
    "caregiver.education": "ትምህርት",
    "caregiver.feedback": "አስተያየት",
    "caregiver.addChild": "ልጅ ጨምር",
    "caregiver.childName": "የልጁ ስም",
    "caregiver.birthdate": "የትውልድ ቀን",
    "caregiver.gender": "ፆታ",
    "caregiver.male": "ወንድ",
    "caregiver.female": "ሴት",
    "caregiver.save": "አስቀምጥ",
    "caregiver.vaccinesDue": "የሚገቡ ክትባቶች",
    "caregiver.vaccinesCompleted": "የተጠናቀቁ ክትባቶች",
    "caregiver.nextAppointment": "ቀጣይ ቀጠሮ",
    "caregiver.viewCard": "ዲጂታል ካርድ አሳይ",
    "caregiver.findClinic": "አቅራቢያ ያለ ክሊኒክ ፈልግ",
    "caregiver.reminder": "ማስታወሻ: {{vaccine}} ክትባት በ {{date}} ይገባል",
    
    // HEW
    "hew.home": "ዳሽቦርድ",
    "hew.children": "ልጆች",
    "hew.visits": "የቤት ጉብኝቶች",
    "hew.defaulters": "ያልመጡ",
    "hew.sync": "ዳታ አስመጣ",
    "hew.register": "ልጅ መዝግብ",
    "hew.schedule": "ጉብኝት መርሃግብር",
    "hew.record": "ክትባት መዝግብ",
    "hew.followUp": "ክትትል አድርግ",
    
    // Admin
    "admin.dashboard": "ዳሽቦርድ",
    "admin.heatmap": "ዜሮ-ዶዝ ሂትማፕ",
    "admin.performance": "የጤና ኤክስቴንሽን ሰራተኞች አፈጻጸም",
    "admin.reports": "ሪፖርቶች",
    "admin.settings": "ቅንብሮች",
    "admin.users": "ተጠቃሚዎችን አስተዳድር",
    "admin.export": "ዳታ አውጣ",
    "admin.coverage": "የሽፋን መጠን",
    "admin.defaulters": "የማይመጡ መጠን",
    
    // Common
    "common.loading": "በመጫን ላይ...",
    "common.error": "ስህተት ተከስቷል",
    "common.retry": "እንደገና ሞክር",
    "common.cancel": "ሰርዝ",
    "common.save": "አስቀምጥ",
    "common.delete": "አጥፋ",
    "common.edit": "አስተካክል",
    "common.search": "ፈልግ",
    "common.filter": "አጣራ",
    "common.logout": "ውጣ",
    "common.profile": "መገለጫ",
    "common.settings": "ቅንብሮች",
    "common.language": "ቋንቋ",
    "common.notifications": "ማሳወቂያዎች",
    "common.help": "እገዛ",
    "common.about": "ስለ",
    "common.version": "ቅጂ",
    "common.yes": "አዎ",
    "common.no": "አይ",
    "common.ok": "እሺ",
  },
  or: {
    // Auth
    "login.title": "Seeni",
    "login.email": "Imeelii",
    "login.password": "Jecha Iccitii",
    "login.button": "Seeni",
    "login.role": "Gahee Filadhu",
    "login.caregiver": "Kunuunsa",
    "login.hew": "Hojjataa Eksteenshinii Fayyaa",
    "login.admin": "Bulchaa",
    
    // Caregiver
    "caregiver.home": "Mana",
    "caregiver.children": "Daa'imman Koo",
    "caregiver.schedule": "Sagantaa Talaalaa",
    "caregiver.clinics": "Kilinika Barbaadi",
    "caregiver.messages": "Ergaawwan",
    "caregiver.education": "Barnoota",
    "caregiver.feedback": "Yaada",
    "caregiver.addChild": "Daa'ima Dabaluu",
    "caregiver.childName": "Maqaa Daa'imaa",
    "caregiver.birthdate": "Guyyaa Dhalootaa",
    "caregiver.gender": "Saala",
    "caregiver.male": "Dhiira",
    "caregiver.female": "Dhalaa",
    "caregiver.save": "Olkaa'i",
    "caregiver.vaccinesDue": "Talaalota Barbaachisan",
    "caregiver.vaccinesCompleted": "Talaalota Xumuramanii",
    "caregiver.nextAppointment": "Beellama Itti Aanu",
    "caregiver.viewCard": "Kaardii Dijitaalaa Ilaali",
    "caregiver.findClinic": "Kilinika Dhihoo Barbaadi",
    "caregiver.reminder": "Yaadachiisa: Talaala {{vaccine}} guyyaa {{date}} barbaachisa",
    
    // HEW
    "hew.home": "Daashboordii",
    "hew.children": "Daa'imman",
    "hew.visits": "Daawwannaa Manaa",
    "hew.defaulters": "Haftoota",
    "hew.sync": "Daataa Walsimsiisi",
    "hew.register": "Daa'ima Galmeessi",
    "hew.schedule": "Daawwannaa Karoorfadhu",
    "hew.record": "Talaala Galmeessi",
    "hew.followUp": "Hordoffi",
    
    // Admin
    "admin.dashboard": "Daashboordii",
    "admin.heatmap": "Kaartaa Ho'aa Doozu-Zero",
    "admin.performance": "Raawwii HEW",
    "admin.reports": "Gabaasawwan",
    "admin.settings": "Qindaa'ina",
    "admin.users": "Fayyadamtoota Bulchi",
    "admin.export": "Daataa Baasi",
    "admin.coverage": "Sadarkaa Haguuggii",
    "admin.defaulters": "Sadarkaa Haftoota",
    
    // Common
    "common.loading": "Fe'aa jira...",
    "common.error": "Dogoggora uumameera",
    "common.retry": "Irra deebi'i yaali",
    "common.cancel": "Haqi",
    "common.save": "Olkaa'i",
    "common.delete": "Haqi",
    "common.edit": "Gulaali",
    "common.search": "Barbaadi",
    "common.filter": "Calleessi",
    "common.logout": "Ba'i",
    "common.profile": "Profaayilii",
    "common.settings": "Qindaa'ina",
    "common.language": "Afaan",
    "common.notifications": "Beeksisawwan",
    "common.help": "Gargaarsa",
    "common.about": "Waa'ee",
    "common.version": "Versiinii",
    "common.yes": "Eeyyee",
    "common.no": "Lakki",
    "common.ok": "Tole",
  },
};

export const [LanguageProvider, useLanguage] = createContextHook<LanguageContextType>(() => {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem("language");
        if (savedLanguage && (savedLanguage === "en" || savedLanguage === "am" || savedLanguage === "or")) {
          setLanguageState(savedLanguage);
        }
      } catch (error) {
        console.error("Error loading language:", error);
      }
    };

    loadLanguage();
  }, []);

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem("language", lang);
      setLanguageState(lang);
    } catch (error) {
      console.error("Error saving language:", error);
    }
  };

  const t = (key: string) => {
    const translationObj = translations[language];
    if (!translationObj) return key;

    const translation = translationObj[key as keyof typeof translationObj];
    return translation || key;
  };

  return {
    language,
    setLanguage,
    t,
  };
});