import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Alert, Linking } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { addSong, removeSong, loadSavedSongs, SongItem } from '../../store/slices/repertoireSlice';
import * as DocumentPicker from 'expo-document-picker';
import * as IntentLauncher from 'expo-intent-launcher';
import * as FileSystem from 'expo-file-system';

export default function Repertoire() {
  const { theme } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const songs = useSelector((state: RootState) => state.repertoire.songs);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [title, setTitle] = useState('');
  const [composer, setComposer] = useState('');
  const [tutorialUrl, setTutorialUrl] = useState('');
  const [pdfUri, setPdfUri] = useState<string | undefined>(undefined);
  const [pdfName, setPdfName] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    dispatch(loadSavedSongs());
  }, [dispatch]);

  const handlePickPdf = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setPdfUri(file.uri);
        setPdfName(file.name);
      }
    } catch {
      Alert.alert('Error', 'No se pudo seleccionar el archivo PDF.');
    }
  };

  const handleOpenPdf = async (uri?: string) => {
    if (!uri) return;
    try {
      let targetUri = uri;
      if (targetUri.startsWith('file://')) {
        targetUri = await FileSystem.getContentUriAsync(targetUri);
      }
      await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
        data: targetUri,
        flags: 1,
        type: 'application/pdf',
      });
    } catch {
      Alert.alert(
        'Visor no disponible',
        'No se pudo abrir el archivo con la app de lectura de PDFs.'
      );
    }
  };

  const handleOpenLink = async (url?: string) => {
    if (!url || !url.trim()) return;

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      await Linking.openURL(formattedUrl);
    } catch {
      Alert.alert('Error', 'No se pudo abrir el enlace en el navegador.');
    }
  };

  const handleCreateSong = () => {
    if (!title.trim() || !composer.trim()) {
      Alert.alert('Campos requeridos', 'Ingresa al menos el título y el compositor.');
      return;
    }

    const newSong: SongItem = {
      id: Date.now().toString(),
      title: title.trim(),
      composer: composer.trim(),
      tutorialUrl: tutorialUrl.trim() || undefined,
      pdfUri: pdfUri,
      pdfName: pdfName,
      notes: notes.trim() || undefined,
    };

    dispatch(addSong(newSong));

    setTitle('');
    setComposer('');
    setTutorialUrl('');
    setPdfUri(undefined);
    setPdfName(undefined);
    setNotes('');
    setIsModalVisible(false);
  };

  const filteredSongs = songs.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.composer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.title }]}>Tu Repertorio</Text>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: theme.primary }]}
          onPress={() => setIsModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <CustomInput
          values={searchQuery}
          placeholder="Buscar obra o compositor..."
          OnChangeText={setSearchQuery}
          hideicon={true}
        />
      </View>

      <FlatList
        data={filteredSongs}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.subtitle }]}>
            {searchQuery
              ? 'No se encontraron obras con esa búsqueda.'
              : 'Tu repertorio está vacío. Pulsa (+) para registrar tu primera obra.'}
          </Text>
        }
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.cardInfo}>
              <Text style={[styles.songTitle, { color: theme.title }]}>{item.title}</Text>
              <Text style={[styles.composer, { color: theme.subtitle }]}>{item.composer}</Text>

              {item.pdfName ? (
                <Text style={[styles.pdfBadge, { color: theme.primary }]}>
                  📄 {item.pdfName}
                </Text>
              ) : null}

              {item.notes ? (
                <Text style={[styles.notesText, { color: theme.subtitle }]}>
                  "{item.notes}"
                </Text>
              ) : null}
            </View>

            <View style={styles.actionsColumn}>
              {item.pdfUri ? (
                <TouchableOpacity onPress={() => handleOpenPdf(item.pdfUri)} style={styles.actionIcon}>
                  <Ionicons name="document-text" size={22} color={theme.primary} />
                </TouchableOpacity>
              ) : null}

              {item.tutorialUrl ? (
                <TouchableOpacity onPress={() => handleOpenLink(item.tutorialUrl)} style={styles.actionIcon}>
                  <Ionicons name="logo-youtube" size={22} color="#E74C3C" />
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity onPress={() => dispatch(removeSong(item.id))} style={styles.actionIcon}>
                <Ionicons name="trash-outline" size={20} color={theme.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.title }]}>Añadir al Repertorio</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close-circle" size={26} color={theme.error} />
              </TouchableOpacity>
            </View>

            <CustomInput
              values={title}
              placeholder="Título de la obra (ej. Gavotte)"
              OnChangeText={setTitle}
              hideicon={true}
            />

            <CustomInput
              values={composer}
              placeholder="Compositor (ej. F.J. Gossec)"
              OnChangeText={setComposer}
              hideicon={true}
            />

            <CustomInput
              values={tutorialUrl}
              placeholder="Enlace web o YouTube (https://...)"
              OnChangeText={setTutorialUrl}
              hideicon={true}
            />

            <TouchableOpacity
              onPress={handlePickPdf}
              style={[styles.pdfPickerBtn, { borderColor: theme.border, backgroundColor: theme.background }]}
            >
              <Ionicons name="document-attach-outline" size={22} color={theme.primary} />
              <Text style={[styles.pdfPickerText, { color: theme.title }]} numberOfLines={1}>
                {pdfName ? `Adjunto: ${pdfName}` : 'Seleccionar Partitura (PDF)'}
              </Text>
            </TouchableOpacity>

            <CustomInput
              values={notes}
              placeholder="Apuntes o digitación..."
              OnChangeText={setNotes}
              hideicon={true}
              multiline={true}
            />

            <CustomButton title="Guardar Obra" icon="save-outline" onPress={handleCreateSong} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 36,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    marginBottom: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 14,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  cardInfo: {
    flex: 1,
    marginRight: 10,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  composer: {
    fontSize: 13,
    marginBottom: 4,
  },
  pdfBadge: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  actionsColumn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIcon: {
    padding: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    gap: 6,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pdfPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    gap: 8,
    marginBottom: 8,
  },
  pdfPickerText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
});