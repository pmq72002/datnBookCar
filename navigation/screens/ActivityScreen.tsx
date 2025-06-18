import * as React from 'react'
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import defaultIPV4 from '../../assets/ipv4/ipv4Address';
import { useUser } from '../../context/Client';

interface RideHistoryItem {
  _id: string;
  rideId: string;
  price: number;
  originName: string;
  destinationName: string;
  completedAt: string;
  type: string
}

const ActivityScreen = () => {
  const [history, setHistory] = useState<RideHistoryItem[]>([]);
const { userData } = useUser();

  useEffect(() => {
    fetchRideHistory();
  }, []);

  const fetchRideHistory = async () => {
    try {
      const response = await fetch(`http://${defaultIPV4}:3000/ride-history`);
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

const renderItem = ({ item }: { item: RideHistoryItem }) => (
  <View style={styles.item}>
    <Text style={styles.title}>{item.type}</Text>
    <Text >{item.price}</Text>
    <Text>{item.originName}</Text>
    <Text>{item.destinationName}</Text>
    <Text>Hoàn thành: {new Date(item.completedAt).toLocaleString()}</Text>
  </View>
);


  return (
    <View style={styles.container}>
      <Text style={styles.header}>📜 Lịch sử chuyến đi</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
};

export default ActivityScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', marginTop: 30 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  item: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  title: { fontSize: 18, fontWeight: '600' },
});
