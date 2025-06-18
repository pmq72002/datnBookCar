import React, { useState } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';
import axios from 'axios';
import { GOOGLE_MAP_KEY } from '@env';

const GOOGLE_MAPS_API_KEY = GOOGLE_MAP_KEY;

type PlaceLocation = {
  name: string;
  lat: number;
  lng: number;
};

type PlacePrediction = {
  place_id: string;
  description: string;
};

type CustomPlacesAutocompleteProps = {
  onPlaceSelected: (place: PlaceLocation) => void;
};

const CustomPlacesAutocomplete: React.FC<CustomPlacesAutocompleteProps> = ({
  onPlaceSelected,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlacePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const fetchPredictions = async (input: string) => {
    if (input.length < 2) {
      setResults([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const res = await axios.get(
        'https://maps.googleapis.com/maps/api/place/autocomplete/json',
        {
          params: {
            input,
            key: GOOGLE_MAPS_API_KEY,
            language: 'vi',
            components: 'country:VN',
          },
        }
      );

      if (res.data?.predictions) {
        setResults(res.data.predictions);
        setShowSuggestions(true);
      } else {
        setResults([]);
        setShowSuggestions(false);
      }
    } catch (err) {
      console.error('❌ Lỗi gọi Google Places API:', err);
      setResults([]);
      setShowSuggestions(false);
    }
  };

  const handleSelect = async (place: PlacePrediction) => {
    try {
      const detailRes = await axios.get(
        'https://maps.googleapis.com/maps/api/place/details/json',
        {
          params: {
            place_id: place.place_id,
            key: GOOGLE_MAPS_API_KEY,
          },
        }
      );

      const location = detailRes.data.result.geometry.location;
      const name = detailRes.data.result.name;

      setQuery(name);
      setResults([]);
      setShowSuggestions(false);
      Keyboard.dismiss();

      onPlaceSelected({
        name,
        lat: location.lat,
        lng: location.lng,
      });
    } catch (error) {
      console.error('❌ Lỗi lấy chi tiết địa điểm:', error);
    }
  };

  return (
    <View style={styles.wrapper}>
      <TextInput
        style={styles.input}
        placeholder="Điểm đến"
        value={query}
        onChangeText={(text) => {
          setQuery(text);
          fetchPredictions(text);
        }}
      />

      {showSuggestions && results.length > 0 && (
        <View style={styles.suggestionsContainer}>
          <FlatList
            data={results}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleSelect(item)}
              >
                <Text>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: 10,
    width: '90%',
  },
  input: {
    fontSize: 16,
    padding: 10,
    borderRadius: 6,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 52, // đúng dưới TextInput (chiều cao input + padding)
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    maxHeight: 250,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
    zIndex: 100,
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: '100%',
  },
  item: {
    padding: 12,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
});

export default CustomPlacesAutocomplete;
