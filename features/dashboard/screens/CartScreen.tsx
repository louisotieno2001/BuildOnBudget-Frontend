import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '@/context/theme';
import { apiFetch } from '@/services/api';
import { getMediaAssetUrl } from '@/services/media';
import { useDashboardStyles } from '@/features/dashboard/styles/dashboardStyles';

type CartItem = {
  id: string | number;
  name: string;
  price?: number | string;
  quantity: number;
  total?: number | string;
  order_id: string | number;
  media?: { id?: string } | string | ({ id?: string } | string)[];
  media_url?: string | null;
};

type PurchaseOrder = {
  id: string | number;
  product_id?: string | number;
  status?: string;
  units?: number | string;
  amount_paid?: number | string;
  update_date?: string;
  delivered_date?: string;
  product?: {
    id?: string | number;
    name?: string;
    price?: number | string;
    media?: { id?: string } | string | ({ id?: string } | string)[];
    media_url?: string | null;
  };
};

type CartResponse = {
  cartItems: CartItem[];
  ongoingOrders: PurchaseOrder[];
  deliveredOrders: PurchaseOrder[];
};

export default function CartScreen() {
  const dashboardStyles = useDashboardStyles();
  const { colors } = useTheme();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [ongoingOrders, setOngoingOrders] = useState<PurchaseOrder[]>([]);
  const [deliveredOrders, setDeliveredOrders] = useState<PurchaseOrder[]>([]);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadCart = async () => {
      try {
        const data = await apiFetch<CartResponse>('/cart?format=json', {
          headers: { Accept: 'application/json' },
        });
        if (!isMounted) return;
        setCartItems(data.cartItems || []);
        setOngoingOrders(data.ongoingOrders || []);
        setDeliveredOrders(data.deliveredOrders || []);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load cart');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCart();

    return () => {
      isMounted = false;
    };
  }, []);

  const totalAmount = cartItems.reduce((sum, item) => sum + Number(item.total || 0), 0);

  const handleUpdateQuantity = async (orderId: string | number, nextQuantity: number) => {
    try {
      await apiFetch('/cart/update', {
        method: 'POST',
        body: JSON.stringify({ order_id: orderId, quantity: nextQuantity }),
      });
      setCartItems((current) => {
        if (nextQuantity <= 0) {
          return current.filter((item) => item.order_id !== orderId);
        }
        return current.map((item) => {
          if (item.order_id !== orderId) return item;
          const priceValue = Number(item.price || 0);
          return {
            ...item,
            quantity: nextQuantity,
            total: priceValue * nextQuantity,
          };
        });
      });
      setNotice(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update cart');
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    try {
      const data = await apiFetch<{ message?: string }>('/cart/checkout', {
        method: 'POST',
        body: JSON.stringify({ phone }),
      });
      setNotice(data.message || 'Checkout initiated. Please check your phone.');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to checkout');
    }
  };

  const renderOrder = (order: PurchaseOrder, label: string) => {
    const product = order.product;
    if (!product) return null;
    const imageUri = getMediaAssetUrl(product.media_url, product.media);
    const priceValue = Number(product.price || 0);
    return (
      <View key={`${label}-${order.id}`} style={dashboardStyles.card}>
        <View style={dashboardStyles.cartItemRow}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={dashboardStyles.cartItemImage} />
          ) : (
            <View style={dashboardStyles.cartItemImageFallback}>
              <Text style={dashboardStyles.productImageFallbackText}>No Image</Text>
            </View>
          )}
          <View style={dashboardStyles.cartItemDetails}>
            <Text style={dashboardStyles.cardTitle}>{product.name || 'Item'}</Text>
            <Text style={dashboardStyles.cardSubtitle}>
              Units: {order.units ?? 1} • {priceValue.toFixed(2)} /=
            </Text>
            <Text style={dashboardStyles.cardSubtitle}>
              Status: {order.status ?? 'processed'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={dashboardStyles.screen} contentContainerStyle={dashboardStyles.container}>
      <View style={dashboardStyles.headerRow}>
        <Pressable style={dashboardStyles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#ffffff" />
        </Pressable>
        <View>
          <Text style={dashboardStyles.title}>Cart</Text>
          <Text style={dashboardStyles.subtitle}>Review items and previous purchases.</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color={colors.accent} />
      ) : cartItems.length === 0 ? (
        <Text style={dashboardStyles.chartEmptyText}>Your cart is empty.</Text>
      ) : (
        <>
          {cartItems.map((item) => {
            const imageUri = getMediaAssetUrl(item.media_url, item.media);
            const priceValue = Number(item.price || 0);
            return (
              <View key={item.order_id} style={dashboardStyles.card}>
                <View style={dashboardStyles.cartItemRow}>
                  {imageUri ? (
                    <Image source={{ uri: imageUri }} style={dashboardStyles.cartItemImage} />
                  ) : (
                    <View style={dashboardStyles.cartItemImageFallback}>
                      <Text style={dashboardStyles.productImageFallbackText}>No Image</Text>
                    </View>
                  )}
                  <View style={dashboardStyles.cartItemDetails}>
                    <Text style={dashboardStyles.cardTitle}>{item.name}</Text>
                    <Text style={dashboardStyles.cardSubtitle}>
                      {priceValue.toFixed(2)} /= each
                    </Text>
                    <Text style={dashboardStyles.cardSubtitle}>
                      Total: {Number(item.total || 0).toFixed(2)} /=
                    </Text>
                  </View>
                </View>
                <View style={dashboardStyles.cartActions}>
                  <View style={dashboardStyles.qtyControls}>
                    <Pressable
                      style={dashboardStyles.qtyButton}
                      onPress={() => handleUpdateQuantity(item.order_id, item.quantity - 1)}
                    >
                      <Text style={dashboardStyles.qtyButtonText}>-</Text>
                    </Pressable>
                    <Text style={dashboardStyles.qtyValue}>{item.quantity}</Text>
                    <Pressable
                      style={dashboardStyles.qtyButton}
                      onPress={() => handleUpdateQuantity(item.order_id, item.quantity + 1)}
                    >
                      <Text style={dashboardStyles.qtyButtonText}>+</Text>
                    </Pressable>
                  </View>
                  <Pressable
                    style={dashboardStyles.removeButton}
                    onPress={() => handleUpdateQuantity(item.order_id, 0)}
                  >
                    <Text style={dashboardStyles.removeButtonText}>Remove</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}

          <View style={dashboardStyles.card}>
            <Text style={dashboardStyles.cardTitle}>Checkout</Text>
            <Text style={dashboardStyles.cardSubtitle}>
              Total: {totalAmount.toFixed(2)} /=
            </Text>
            <TextInput
              style={dashboardStyles.searchInput}
              value={phone}
              onChangeText={setPhone}
              placeholder="+254 7xxxxxxxx"
              keyboardType="phone-pad"
              placeholderTextColor={colors.textMuted}
            />
            <Pressable style={dashboardStyles.primaryButton} onPress={handleCheckout}>
              <Text style={dashboardStyles.primaryButtonText}>Checkout</Text>
            </Pressable>
          </View>
        </>
      )}

      <Text style={dashboardStyles.sectionTitle}>Previous Purchases</Text>
      {loading ? (
        <ActivityIndicator color={colors.accent} />
      ) : ongoingOrders.length === 0 && deliveredOrders.length === 0 ? (
        <Text style={dashboardStyles.chartEmptyText}>No previous purchases yet.</Text>
      ) : (
        <>
          {ongoingOrders.length > 0 && (
            <>
              <Text style={dashboardStyles.sectionTitle}>Ongoing Orders</Text>
              {ongoingOrders.map((order) => renderOrder(order, 'ongoing'))}
            </>
          )}
          {deliveredOrders.length > 0 && (
            <>
              <Text style={dashboardStyles.sectionTitle}>Delivered Orders</Text>
              {deliveredOrders.map((order) => renderOrder(order, 'delivered'))}
            </>
          )}
        </>
      )}

      {!!notice && <Text style={dashboardStyles.noticeText}>{notice}</Text>}
      {!!error && <Text style={dashboardStyles.errorText}>{error}</Text>}
    </ScrollView>
  );
}
