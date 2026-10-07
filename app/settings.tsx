import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { PageHeader } from '@/components/SearchBar';
import { OutlineButton, goBack } from '@/components/Ui';
import { useShop } from '@/store/shop';
import { COLORS, FONTS, RADIUS } from '@/store/theme';

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
}

export default function Settings() {
  const { settings, updateSettings, resetDemo } = useShop();
  const [name, setName] = useState(settings.displayName);
  const [fee, setFee] = useState(String(settings.deliveryFee));
  const [discount, setDiscount] = useState(String(settings.defaultDiscount));

  const saveProfile = () => {
    updateSettings({ displayName: name.trim() || 'Guest' });
    Alert.alert('Saved', 'Display name updated.');
  };

  const saveFee = () => {
    const v = Number(fee);
    if (!Number.isFinite(v) || v < 0) {
      Alert.alert('Invalid fee', 'Delivery fee must be zero or more.');
      return;
    }
    updateSettings({ deliveryFee: Math.round(v) });
    Alert.alert('Saved', 'Delivery fee updated.');
  };

  const saveDiscount = () => {
    const v = Number(discount);
    if (!Number.isFinite(v) || v < 0 || v > 90) {
      Alert.alert('Invalid discount', 'Default discount must be between 0 and 90.');
      return;
    }
    updateSettings({ defaultDiscount: Math.round(v) });
    Alert.alert('Saved', 'Default discount updated.');
  };

  return (
    <Screen>
      <View style={{ paddingTop: 8, paddingBottom: 16, gap: 12, width: '100%', maxWidth: 720, alignSelf: 'center' }}>
        <PageHeader title="Settings" onBack={() => goBack('/(tabs)')} />

        <Row label={`Connection Status (${settings.online ? 'Online' : 'Offline'})`}>
          <Switch
            value={settings.online}
            onValueChange={(v) => updateSettings({ online: v })}
            trackColor={{ true: COLORS.aqua, false: COLORS.light }}
            thumbColor={COLORS.navy}
          />
        </Row>

        <View style={{ gap: 6 }}>
          <Text style={styles.label}>Display Name</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput value={name} onChangeText={setName} placeholder="Guest" placeholderTextColor={COLORS.muted} style={[styles.input, { flex: 1 }]} />
            <Pressable accessibilityRole="button" onPress={saveProfile} style={({ pressed }) => [styles.save, { opacity: pressed ? 0.6 : 1 }]}>
              <Text style={styles.saveText}>Save</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ gap: 6 }}>
          <Text style={styles.label}>Delivery Fee (₱)</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput value={fee} onChangeText={(t) => setFee(t.replace(/[^0-9]/g, ''))} keyboardType="numeric" style={[styles.input, { flex: 1 }]} />
            <Pressable accessibilityRole="button" onPress={saveFee} style={({ pressed }) => [styles.save, { opacity: pressed ? 0.6 : 1 }]}>
              <Text style={styles.saveText}>Save</Text>
            </Pressable>
          </View>
        </View>

        <Row label="Currency">
          <Text style={styles.value}>Philippine Peso (₱)</Text>
        </Row>

        <View style={{ gap: 6 }}>
          <Text style={styles.label}>Default Discount (%)</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput value={discount} onChangeText={(t) => setDiscount(t.replace(/[^0-9]/g, ''))} keyboardType="numeric" style={[styles.input, { flex: 1 }]} />
            <Pressable accessibilityRole="button" onPress={saveDiscount} style={({ pressed }) => [styles.save, { opacity: pressed ? 0.6 : 1 }]}>
              <Text style={styles.saveText}>Save</Text>
            </Pressable>
          </View>
        </View>

        <Row label="Notifications">
          <Switch
            value={settings.notifications}
            onValueChange={(v) => updateSettings({ notifications: v })}
            trackColor={{ true: COLORS.aqua, false: COLORS.light }}
            thumbColor={COLORS.navy}
          />
        </Row>

        <OutlineButton
          label="Reset Demo Data"
          onPress={() =>
            Alert.alert('Reset demo data?', 'Products, cart, orders, and settings will be restored to defaults.', [
              { text: 'Cancel', style: 'cancel' },
              {
                text: 'Reset',
                style: 'destructive',
                onPress: () => {
                  resetDemo();
                  setName('Guest');
                  setFee('150');
                  setDiscount('0');
                },
              },
            ])
          }
        />
        <Text style={styles.note}>Data is stored only on this device. Browser and phone storage do not sync.</Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: COLORS.light,
    borderRadius: RADIUS.lg,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    fontFamily: FONTS.semibold,
    fontSize: 14,
    color: COLORS.navy,
  },
  value: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.navy,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.light,
    borderRadius: RADIUS.md,
    height: 44,
    paddingHorizontal: 12,
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.navy,
    backgroundColor: COLORS.white,
  },
  save: {
    backgroundColor: COLORS.aqua,
    borderRadius: RADIUS.md,
    paddingHorizontal: 16,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  saveText: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: COLORS.navy,
  },
  note: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.muted,
    textAlign: 'center',
  },
});
