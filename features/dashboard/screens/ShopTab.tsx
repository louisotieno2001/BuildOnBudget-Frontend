import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import { dashboardStyles } from '@/features/dashboard/styles/dashboardStyles';

const ongoingOrders = [
  { id: 'o1', product: 'Cement Bags', units: 20, amount: 12000, date: '2025-03-02' },
  { id: 'o2', product: 'Steel Rods', units: 12, amount: 18000, date: '2025-03-04' },
];

const deliveredOrders = [
  { id: 'd1', product: 'Paint Buckets', units: 8, amount: 6400, date: '2025-02-20' },
];

export default function ShopTab() {
  return (
    <ScrollView style={dashboardStyles.screen} contentContainerStyle={dashboardStyles.container}>
      <Text style={dashboardStyles.title}>Shop</Text>
      <Text style={dashboardStyles.subtitle}>Track your ongoing and delivered orders.</Text>

      <Text style={dashboardStyles.sectionTitle}>Ongoing Orders</Text>
      {ongoingOrders.length === 0 && <Text style={dashboardStyles.subtitle}>No ongoing orders.</Text>}
      {ongoingOrders.map((order) => (
        <View key={order.id} style={dashboardStyles.card}>
          <Text style={dashboardStyles.cardTitle}>{order.product}</Text>
          <Text style={dashboardStyles.cardSubtitle}>Units: {order.units}</Text>
          <Text style={dashboardStyles.cardSubtitle}>Amount Paid: {order.amount} /=</Text>
          <Text style={dashboardStyles.cardSubtitle}>Updated: {order.date}</Text>
        </View>
      ))}

      <Text style={dashboardStyles.sectionTitle}>Delivered Orders</Text>
      {deliveredOrders.length === 0 && <Text style={dashboardStyles.subtitle}>No delivered orders.</Text>}
      {deliveredOrders.map((order) => (
        <View key={order.id} style={dashboardStyles.card}>
          <Text style={dashboardStyles.cardTitle}>{order.product}</Text>
          <Text style={dashboardStyles.cardSubtitle}>Units: {order.units}</Text>
          <Text style={dashboardStyles.cardSubtitle}>Amount Paid: {order.amount} /=</Text>
          <Text style={dashboardStyles.cardSubtitle}>Delivered: {order.date}</Text>
        </View>
      ))}
    </ScrollView>
  );
}
