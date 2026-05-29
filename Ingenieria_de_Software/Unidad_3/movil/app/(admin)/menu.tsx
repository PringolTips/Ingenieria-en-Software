// app/(admin)/menu.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function AdminMenu() {
  const router = useRouter();

  const options = [
    { title: 'Alta de Personal', icon: 'person-add', route: '/(admin)/create-user' },
    { title: 'Bitácora de Auditoría', icon: 'shield-checkmark', route: '/(admin)/bitacora' },
  ];

  return (
    <View style={styles.container}>
      {options.map((opt, i) => (
        <TouchableOpacity 
          key={i} 
          style={styles.btn} 
          onPress={() => router.push(opt.route as any)}
        >
          <Ionicons name={opt.icon as any} size={24} color="#1976D2" />
          <Text style={styles.btnText}>{opt.title}</Text>
          <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
  btn: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', 
    padding: 20, borderRadius: 15, marginBottom: 15, 
    borderWidth: 1, borderColor: '#E2E8F0', elevation: 1
  },
  btnText: { flex: 1, marginLeft: 15, fontWeight: 'bold', color: '#1E293B' }
});