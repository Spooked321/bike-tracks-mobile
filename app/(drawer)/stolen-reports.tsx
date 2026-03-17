import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { searchBikes } from '../../api/bikeindex';
import { BikeCard } from '../../components/BikeCard';
import type { BikeListItem } from '../../types/bike';

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [stolenOnly, setStolenOnly] = useState(false);
  const [results, setResults] = useState<BikeListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  async function handleSearch() {
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    setError(null);
    setResults([]);
    setSearched(true);

    try {
      const bikes = await searchBikes(trimmed, stolenOnly);
      setResults(bikes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        style={styles.container}
        data={results}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <BikeCard bike={item} />}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.heading}>Stolen Reports</Text>
            <Text style={styles.subheading}>
              Search BikeIndex.org by serial number to check if a bike is reported stolen.
            </Text>

            <TextInput
              style={styles.input}
              value={query}
              onChangeText={setQuery}
              placeholder="Serial number (e.g. WTU123456)"
              placeholderTextColor="#555555"
              autoCapitalize="characters"
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />

            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => setStolenOnly((v) => !v)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, stolenOnly && styles.checkboxActive]}>
                {stolenOnly && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.toggleLabel}>Stolen bikes only</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.searchButton, loading && styles.buttonDisabled]}
              onPress={handleSearch}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FF6B00" />
              ) : (
                <Text style={styles.searchButtonText}>Search</Text>
              )}
            </TouchableOpacity>

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {searched && !loading && !error && results.length === 0 && (
              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>
                  No bikes found matching "{query}".
                </Text>
              </View>
            )}

            {results.length > 0 && (
              <Text style={styles.resultsLabel}>
                {results.length} result{results.length !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
  },
  listContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 16,
  },
  heading: {
    fontSize: 26,
    fontFamily: 'BarlowCondensed_700Bold',
    color: '#FAFAFA',
    marginTop: 16,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 15,
    color: '#888888',
    marginBottom: 20,
    lineHeight: 22,
  },
  input: {
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FAFAFA',
    marginBottom: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  checkboxActive: {
    backgroundColor: '#FF6B00',
    borderColor: '#FF6B00',
  },
  checkmark: {
    color: '#FAFAFA',
    fontSize: 13,
    fontWeight: '700',
  },
  toggleLabel: {
    fontSize: 15,
    color: '#888888',
  },
  searchButton: {
    backgroundColor: '#FF6B00',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: '#FAFAFA',
    fontSize: 18,
    fontFamily: 'BarlowCondensed_700Bold',
  },
  errorBox: {
    backgroundColor: '#1A1A1A',
    borderLeftWidth: 3,
    borderLeftColor: '#FF3131',
    borderRadius: 10,
    padding: 14,
    marginTop: 16,
  },
  errorText: {
    color: '#FF3131',
    fontSize: 14,
  },
  emptyBox: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#555555',
    fontSize: 15,
    textAlign: 'center',
  },
  resultsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888888',
    marginTop: 20,
    marginBottom: 4,
  },
});
