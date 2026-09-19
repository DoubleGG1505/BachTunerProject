import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import CustomInput from '../../components/CustomInput';

//temp inteface
interface Song {
  id: string;
  title: string;
  composer: string;
  hasPdf: boolean;
}

const MOCK_DATA: Song[] = [
  { id: '1', title: 'Minuet 1', composer: 'J.S. Bach', hasPdf: true },
  { id: '2', title: 'Gavotte', composer: 'F.J. Gossec', hasPdf: false },
  { id: '3', title: 'Merry Go Round of Life', composer: 'Joe Hisaishi', hasPdf: true },
];

export default function Repertoire({ navigation }: any) {
  const { theme } = useAppTheme();
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.title }]}>Tu Repertorio</Text>

      <View style={styles.searchContainer}>
        <CustomInput
          values={searchQuery}
          placeholder="Buscar partitura o canción..."
          OnChangeText={setSearchQuery}
          hideicon={true}
        />
      </View>

      <FlatList
        data={MOCK_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}
            activeOpacity={0.7}
          >
            <View style={styles.cardInfo}>
              <Text style={[styles.songTitle, { color: theme.title }]}>{item.title}</Text>
              <Text style={[styles.composer, { color: theme.subtitle }]}>{item.composer}</Text>
            </View>
            <View style={styles.iconContainer}>
              {item.hasPdf && <Ionicons name="document-text" size={20} color={theme.primary} />}
              <Ionicons name="chevron-forward" size={20} color={theme.border} />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchContainer: {
    marginBottom: 10,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  cardInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  composer: {
    fontSize: 14,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  }
});