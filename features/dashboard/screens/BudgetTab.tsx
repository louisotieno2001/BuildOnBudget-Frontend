import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { dashboardStyles } from '@/features/dashboard/styles/dashboardStyles';

export default function BudgetTab() {
  // Placeholder budget data
  const [budgets] = useState([
    {
      id: '1',
      project: 'Kitchen Renovation',
      total: 250000,
      components: [
        { name: 'Cabinets', cost: 80000 },
        { name: 'Countertops', cost: 45000 },
        { name: 'Flooring', cost: 35000 },
        { name: 'Fixtures', cost: 15000 },
      ],
    },
    {
      id: '2',
      project: 'Office Build',
      total: 1500000,
      components: [
        { name: 'Raw Materials', cost: 600000 },
        { name: 'Labor', cost: 500000 },
        { name: 'Permits', cost: 50000 },
        { name: 'Fixtures', cost: 150000 },
      ],
    },
  ]);

  const [openBudget, setOpenBudget] = useState<string | null>(budgets[0]?.id ?? null);

  return (
    <ScrollView style={dashboardStyles.screen} contentContainerStyle={dashboardStyles.container}>
      <Text style={dashboardStyles.title}>Budget</Text>
      <Text style={dashboardStyles.subtitle}>Allocate budgets per project.</Text>

      {budgets.map((budget) => {
        const allocated = budget.components.reduce((sum, item) => sum + item.cost, 0);
        const difference = allocated - budget.total;
        const open = openBudget === budget.id;

        return (
          <View key={budget.id} style={dashboardStyles.card}>
            <Pressable
              style={dashboardStyles.row}
              onPress={() => setOpenBudget(open ? null : budget.id)}
            >
              <Text style={dashboardStyles.cardTitle}>{budget.project}</Text>
              <Text style={dashboardStyles.actionText}>{open ? 'Hide' : 'Show'}</Text>
            </Pressable>
            <Text style={dashboardStyles.cardSubtitle}>Total budget: {budget.total} /=</Text>
            {open && (
              <View style={{ marginTop: 12 }}>
                {budget.components.map((component) => (
                  <View key={component.name} style={dashboardStyles.listItem}>
                    <Text style={dashboardStyles.listItemTitle}>{component.name}</Text>
                    <Text style={dashboardStyles.listItemMeta}>Cost: {component.cost} /=</Text>
                  </View>
                ))}
                <Text style={dashboardStyles.cardSubtitle}>
                  Allocated: {allocated} /= of {budget.total} /=
                </Text>
                <Text style={dashboardStyles.cardSubtitle}>
                  {difference === 0
                    ? 'Perfectly allocated'
                    : difference > 0
                    ? `Overallocated by ${difference} /=`
                    : `Underallocated by ${Math.abs(difference)} /=`}
                </Text>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

