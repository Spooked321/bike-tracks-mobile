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
            <Text style={styles.heading}>Search Stolen Bikes</Text>
            <Text style={styles.subheading}>
              Search BikeIndex.org by serial number to check if a bike is reported stolen.
            </Text>

            <TextInput
              style={styles.input}
              value={query}
              onChangeText={setQuery}
              placeholder="Serial number (e.g. WTU123456)"
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
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.searchButtonText}>🔍 Search</Text>
              )}
            </TouchableOpacity>

            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>⚠️ {error}</Text>
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
    backgroundColor: '#f3f4f6',
  },
  listContent: {
    paddingBottom: 40,
  },
  header: {
    padding: 16,
  },
  heading: {
    fontSize: 26,
    fontWeight: '800',
    color: '#111827',
    marginTop: 16,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 20,
    lineHeight: 22,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
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
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  checkboxActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  checkmark: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  toggleLabel: {
    fontSize: 15,
    color: '#374151',
  },
  searchButton: {
    backgroundColor: '#2563eb',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
  errorBox: {
    backgroundColor: '#fef2f2',
    borderColor: '#fca5a5',
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginTop: 16,
  },
  errorText: {
    color: '#dc2626',
    fontSize: 14,
  },
  emptyBox: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 15,
    textAlign: 'center',
  },
  resultsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 20,
    marginBottom: 4,
  },
});
