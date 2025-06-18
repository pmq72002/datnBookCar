import * as React from 'react';
import { Text, View, Image } from 'react-native';

export default function NotificationScreen() {
  return (
    <View style={{ flex: 1, paddingTop: 50, alignItems: 'center', backgroundColor: 'white' }}>

      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 40 }}>Thông báo</Text>


      <Text style={{ fontSize: 16, fontWeight: '500', color: '#888' }}>
        Không có thông báo mới
      </Text>
    </View>
  );
}
