// app/(admin)/bitacora.tsx
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { expedienteService } from '../../services/expedienteService';

export default function BitacoraScreen() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAction, setFilterAction] = useState<'TODOS' | 'Alta' | 'Modificación'>('TODOS');
  const [selectedLog, setSelectedLog] = useState<any>(null);

  const cargarBitacora = async () => {
    setLoading(true);
    try {
      const response = await expedienteService.obtenerBitacora();
      if (response?.ok) {
        setLogs(response.data || []);
        setFilteredLogs(response.data || []);
      }
    } catch (error) {
      console.error("Error al consultar la bitácora:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarBitacora();
  }, []);

  useEffect(() => {
    let resultado = logs;

    if (search) {
      const query = search.toLowerCase();
      resultado = resultado.filter(item => 
        item.nombre_usuario_digiclin?.toLowerCase().includes(query) ||
        item.usuario_postgresql?.toLowerCase().includes(query) ||
        item.id_expediente?.toString().includes(query) ||
        item.motivo?.toLowerCase().includes(query)
      );
    }

    if (filterAction !== 'TODOS') {
      resultado = resultado.filter(item => item.accion_descripcion === filterAction);
    }

    setFilteredLogs(resultado);
  }, [search, filterAction, logs]);

  const formatFecha = (isoString: string) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('es-MX', { hour12: true });
  };

  return (
    <View style={styles.container}>
      {/* Buscador */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={18} color="#64748B" />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por usuario, ID de expediente o síntomas..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#94A3B8"
        />
      </View>

      {/* Filtros rápidos por acción descriptiva */}
      <View style={styles.filterRow}>
        {(['TODOS', 'Alta', 'Modificación'] as const).map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.chip, filterAction === type && styles.chipActive]}
            onPress={() => setFilterAction(type)}
          >
            <Text style={[styles.chipText, filterAction === type && { color: '#FFF' }]}>{type}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Lista Principal de Movimientos */}
      {loading ? (
        <ActivityIndicator size="large" color="#1976D2" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={filteredLogs}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => setSelectedLog(item)}>
              <View style={styles.cardHeader}>
                <View style={[styles.badge, { backgroundColor: item.accion_bitacora === 'A' ? '#10B981' : '#F59E0B' }]}>
                  <Text style={styles.badgeText}>{item.accion_descripcion.toUpperCase()}</Text>
                </View>
                <Text style={styles.dateText}>{formatFecha(item.fecha_bitacora)}</Text>
              </View>

              <Text style={styles.cardTitle}>Expediente Clínico: ID {item.id_expediente}</Text>
              
              <View style={styles.metaRow}>
                <Ionicons name="person-outline" size={14} color="#64748B" />
                <Text style={styles.metaText}>
                  Operador: <Text style={styles.boldText}>{item.nombre_usuario_digiclin || item.usuario_postgresql}</Text> ({item.rol_usuario_digiclin || 'Sistema BD'})
                </Text>
              </View>

              <View style={styles.metaRow}>
                <Ionicons name="medical-outline" size={14} color="#64748B" />
                <Text style={styles.metaText} numberOfLines={1}>Motivo registrado: {item.motivo}</Text>
              </View>

              <Text style={styles.detailsLink}>Ver auditoría completa →</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No se encontraron registros en la bitácora.</Text>
          }
        />
      )}

      {/* Modal Deslizable de Datos de Auditoría */}
      <Modal visible={selectedLog !== null} transparent animationType="slide">
        <View style={styles.modalWrapper}>
          <View style={styles.modalInner}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalMainTitle}>Detalles de la Transacción</Text>
              <TouchableOpacity onPress={() => setSelectedLog(null)}>
                <Ionicons name="close-circle" size={28} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Trazabilidad técnica de BD */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>Trazabilidad de Seguridad</Text>
                <Text style={styles.detailText}>Acción: <Text style={styles.boldText}>{selectedLog?.accion_descripcion}</Text></Text>
                <Text style={styles.detailText}>Fecha de ejecución: {formatFecha(selectedLog?.fecha_bitacora)}</Text>
                <Text style={styles.detailText}>Usuario Aplicación: {selectedLog?.nombre_usuario_digiclin || 'N/A'} (ID: {selectedLog?.id_usuario_digiclin || 'System'})</Text>
                <Text style={styles.detailText}>Rol del Usuario: {selectedLog?.rol_usuario_digiclin || 'Administrador Interno'}</Text>
                <Text style={styles.detailText}>Usuario PostgreSQL: {selectedLog?.usuario_postgresql}</Text>
              </View>

              {/* Snapshot del expediente */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>Captura de Información Médica</Text>
                <Text style={styles.detailText}>ID Expediente: {selectedLog?.id_expediente}</Text>
                <Text style={styles.detailText}>ID Paciente / Médico: {selectedLog?.id_paciente} / {selectedLog?.id_medico}</Text>
                <Text style={styles.detailText}>Fecha de Consulta: {formatFecha(selectedLog?.fecha_consulta)}</Text>
                <Text style={styles.detailText}>Motivo registrado: "{selectedLog?.motivo}"</Text>
                <Text style={styles.detailText}>Presión Arterial: {selectedLog?.presion_arterial} mmHg</Text>
                <Text style={styles.detailText}>Signos Vitales: {selectedLog?.temperatura}°C | {selectedLog?.frecuencia_cardiaca} lpm | {selectedLog?.saturacion_oxigeno}% SpO₂</Text>
                <Text style={styles.detailText}>Somatometría: {selectedLog?.peso} kg | {selectedLog?.altura} m | Cintura: {selectedLog?.talla_cintura} cm</Text>
                <Text style={styles.detailText}>Antecedentes Personales: {selectedLog?.antecedentes_personales}</Text>
                <Text style={styles.detailText}>Antecedentes Familiares: {selectedLog?.antecedentes_familiares}</Text>
                <Text style={styles.detailText}>Observaciones del Médico: "{selectedLog?.observaciones}"</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, borderColor: '#E2E8F0', paddingHorizontal: 12, marginBottom: 12, height: 48, borderWidth: 1 },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 14, color: '#1E293B' },
  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  chip: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#FFF', alignItems: 'center', borderWidth: 1, borderColor: '#1976D2' },
  chipActive: { backgroundColor: '#1976D2' },
  chipText: { color: '#1976D2', fontSize: 12, fontWeight: 'bold' },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  dateText: { fontSize: 12, color: '#64748B' },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  metaText: { fontSize: 13, color: '#475569' },
  boldText: { fontWeight: 'bold', color: '#0F172A' },
  detailsLink: { fontSize: 12, color: '#1976D2', fontWeight: 'bold', marginTop: 12, textAlign: 'right' },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#64748B', fontSize: 14 },
  modalWrapper: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalInner: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 10 },
  modalMainTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  sectionBlock: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 14, marginBottom: 14, borderWidth: 1, borderColor: '#E2E8F0' },
  sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#1976D2', marginBottom: 8, textTransform: 'uppercase' },
  detailText: { fontSize: 13, color: '#334155', marginBottom: 6, lineHeight: 18 }
});