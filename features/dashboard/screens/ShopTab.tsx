import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { dashboardStyles } from '@/features/dashboard/styles/dashboardStyles';
import { apiFetch } from '@/services/api';
import { getMediaAssetUrl } from '@/services/media';

type ShopItem = {
  id: string | number;
  name: string;
  description?: string;
  price?: number | string;
  category?: string;
  sub_category?: string;
  media?: { id?: string } | string | ({ id?: string } | string)[];
  media_url?: string | null;
};

type ShopResponse = {
  items: ShopItem[];
  cartCount?: number;
};

export default function ShopTab() {
  const router = useRouter();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [subcategory, setSubcategory] = useState('All');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const categoryCatalog = [
    'Aggregates',
    'Asphalt',
    'Bricks',
    'Cabinets',
    'Cement',
    'Ceilings',
    'Concrete',
    'Drywall',
    'Electrical',
    'Equipment',
    'Excavation',
    'Fasteners',
    'Fencing',
    'Finishes',
    'Flooring',
    'Foundations',
    'Glass',
    'Hardware',
    'HVAC',
    'Insulation',
    'Interior',
    'Landscaping',
    'Lighting',
    'Lumber',
    'Masonry',
    'Metalwork',
    'Paint',
    'Plumbing',
    'Roofing',
    'Safety',
    'Scaffolding',
    'Steel',
    'Stone',
    'Structures',
    'Surveying',
    'Tiles',
    'Timber',
    'Tools',
    'Waterproofing',
    'Windows',
    'Wire & Cables',
    'Woodwork',
  ];

  useEffect(() => {
    let isMounted = true;

    const loadShop = async () => {
      try {
        const data = await apiFetch<ShopResponse | string>('/shop?format=json', {
          headers: { Accept: 'application/json' },
        });
        if (!isMounted) return;
        if (!data || typeof data !== 'object' || !('items' in data)) {
          throw new Error('Shop data unavailable. Please sign in again.');
        }
        setItems(data.items || []);
        setCartCount(data.cartCount ?? 0);
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load shop items');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadShop();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    const values = items
      .map((item) => item.category)
      .filter((value): value is string => Boolean(value));
    return ['All', ...Array.from(new Set(values))];
  }, [items]);

  const allCategories = useMemo(() => {
    const fromItems = items
      .map((item) => item.category)
      .filter((value): value is string => Boolean(value));
    return ['All', ...Array.from(new Set([...categoryCatalog, ...fromItems]))];
  }, [items]);

  const subcategories = useMemo(() => {
    if (category === 'All') return ['All'];
    const values = items
      .filter((item) => item.category === category)
      .map((item) => item.sub_category)
      .filter((value): value is string => Boolean(value));
    return ['All', ...Array.from(new Set(values))];
  }, [items, category]);

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return items.filter((item) => {
      const matchesSearch =
        !query ||
        item.name.toLowerCase().includes(query) ||
        (item.description || '').toLowerCase().includes(query);
      const matchesCategory = category === 'All' || item.category === category;
      const matchesSubcategory =
        subcategory === 'All' || item.sub_category === subcategory;
      return matchesSearch && matchesCategory && matchesSubcategory;
    });
  }, [items, search, category, subcategory]);

  const handleAddToCart = async (itemId: string | number) => {
    try {
      await apiFetch('/shop/add-to-cart', {
        method: 'POST',
        body: JSON.stringify({ item_id: itemId, quantity: 1 }),
      });
      setCartCount((current) => current + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add to cart');
    }
  };

  return (
    <ScrollView style={dashboardStyles.screen} contentContainerStyle={dashboardStyles.container}>
      <View style={dashboardStyles.shopHeader}>
        <TextInput
          placeholder="Search materials..."
          value={search}
          onChangeText={setSearch}
          style={dashboardStyles.searchInput}
        />
        <View style={dashboardStyles.shopHeaderActions}>
          <Pressable style={dashboardStyles.iconButton} onPress={() => setFiltersOpen(true)}>
            <Ionicons name="filter" size={20} color="#7c3aed" />
          </Pressable>
          <Pressable style={dashboardStyles.iconButton} onPress={() => router.push('/cart')}>
            <Ionicons name="cart" size={20} color="#7c3aed" />
            {cartCount > 0 && (
              <View style={dashboardStyles.cartBadge}>
                <Text style={dashboardStyles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator color="#6d28d9" />
      ) : filteredItems.length === 0 ? (
        <Text style={dashboardStyles.chartEmptyText}>
          {items.length === 0 ? 'No items available yet.' : 'No matches for your filters.'}
        </Text>
      ) : (
        <View style={dashboardStyles.productGrid}>
          {filteredItems.map((item) => {
            const priceValue = Number(item.price || 0);
            const priceLabel = Number.isNaN(priceValue) ? '—' : `${priceValue.toFixed(2)} /=`;
            const imageUri = getMediaAssetUrl(item.media_url, item.media);
            return (
              <View key={item.id} style={dashboardStyles.productCard}>
                {imageUri ? (
                  <Image source={{ uri: imageUri }} style={dashboardStyles.productImage} />
                ) : (
                  <View style={dashboardStyles.productImageFallback}>
                    <Text style={dashboardStyles.productImageFallbackText}>No Image</Text>
                  </View>
                )}
                <Text style={dashboardStyles.cardTitle} numberOfLines={1}>{item.name}</Text>
                <Text style={dashboardStyles.cardSubtitle} numberOfLines={2}>
                  {item.description || 'High-quality construction material'}
                </Text>
                <Text style={dashboardStyles.productPrice}>{priceLabel}</Text>
                <Pressable
                  style={dashboardStyles.productButton}
                  onPress={() => handleAddToCart(item.id)}
                >
                  <Text style={dashboardStyles.productButtonText}>Add to Cart</Text>
                </Pressable>
              </View>
            );
          })}
        </View>
      )}
      {!!error && <Text style={dashboardStyles.errorText}>{error}</Text>}

      <Modal
        visible={filtersOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setFiltersOpen(false)}
      >
        <Pressable style={dashboardStyles.modalBackdrop} onPress={() => setFiltersOpen(false)}>
          <Pressable style={dashboardStyles.modalCard} onPress={() => undefined}>
            <View style={dashboardStyles.modalHeader}>
              <Text style={dashboardStyles.modalTitle}>Filters</Text>
              <Pressable onPress={() => setFiltersOpen(false)}>
                <Ionicons name="close" size={20} color="#0f172a" />
              </Pressable>
            </View>

            <Text style={dashboardStyles.modalSectionTitle}>Category</Text>
            <View style={dashboardStyles.modalChipRow}>
              {allCategories.map((value) => {
                const active = value === category;
                return (
                  <Pressable
                    key={value}
                    style={[dashboardStyles.chip, active && dashboardStyles.chipActive]}
                    onPress={() => {
                      setCategory(value);
                      setSubcategory('All');
                    }}
                  >
                    <Text style={[dashboardStyles.chipText, active && dashboardStyles.chipTextActive]}>
                      {value}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {category !== 'All' && subcategories.length > 1 && (
              <>
                <Text style={dashboardStyles.modalSectionTitle}>Subcategory</Text>
                <View style={dashboardStyles.modalChipRow}>
                  {subcategories.map((value) => {
                    const active = value === subcategory;
                    return (
                      <Pressable
                        key={value}
                        style={[dashboardStyles.chip, active && dashboardStyles.chipActive]}
                        onPress={() => setSubcategory(value)}
                      >
                        <Text style={[dashboardStyles.chipText, active && dashboardStyles.chipTextActive]}>
                          {value}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </>
            )}

            <View style={dashboardStyles.modalActions}>
              <Pressable
                style={dashboardStyles.modalActionButton}
                onPress={() => {
                  setCategory('All');
                  setSubcategory('All');
                }}
              >
                <Text style={dashboardStyles.modalActionText}>Clear</Text>
              </Pressable>
              <Pressable
                style={[dashboardStyles.modalActionButton, dashboardStyles.modalActionPrimary]}
                onPress={() => setFiltersOpen(false)}
              >
                <Text style={dashboardStyles.modalActionPrimaryText}>Apply</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </ScrollView>
  );
}
