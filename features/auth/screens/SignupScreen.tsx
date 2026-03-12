import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link } from 'expo-router';

import CustomToast, { ToastType } from '@/components/CustomToast';
import { ApiError } from '@/services/api';
import { saveAuthToken } from '@/services/authToken';
import { saveUserSession, UserSession } from '@/services/userSession';
import { signup } from '@/features/auth/services/authApi';
import { useTheme } from '@/context/theme';
import { createSignupStyles } from '@/features/auth/styles/signupStyles';

export default function SignupScreen() {
  const { colors } = useTheme();
  const signupStyles = useMemo(() => createSignupStyles(colors), [colors]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: '',
    type: 'success' as ToastType,
  });

  const showToast = (message: string, type: ToastType) => {
    setToast({ visible: true, message, type });
  };

  const handleSignup = async () => {
    if (!name.trim() || !email.trim() || !phone.trim() || !password.trim()) {
      showToast('Please fill in all fields.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const result = await signup({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
      });
      if (result.token) {
        await saveAuthToken(result.token);
      }
      const userPayload = result.user as { data?: UserSession } | UserSession;
      const user = userPayload && 'data' in userPayload ? userPayload.data : userPayload;
      if (user) {
        await saveUserSession(user);
      }
      showToast(result.message ?? 'Account created successfully.', 'success');
    } catch (error) {
      if (error instanceof ApiError) {
        showToast(error.message, 'error');
      } else {
        showToast('Unable to sign up right now. Please try again.', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={signupStyles.screen}>
      <CustomToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast((current) => ({ ...current, visible: false }))}
      />
      <KeyboardAvoidingView
        style={signupStyles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={signupStyles.content} keyboardShouldPersistTaps="handled">
          <View style={signupStyles.header}>
            <Text style={signupStyles.title}>Create your account</Text>
            <Text style={signupStyles.subtitle}>Join BuildOnBudget to stay on top of your spend.</Text>
          </View>

          <View style={signupStyles.card}>
            <View style={signupStyles.fieldGroup}>
              <Text style={signupStyles.label}>Full name</Text>
              <TextInput
                style={signupStyles.input}
                placeholder="Jane Doe"
                placeholderTextColor={colors.textMuted}
                textContentType="name"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={signupStyles.fieldGroup}>
              <Text style={signupStyles.label}>Email address</Text>
              <TextInput
                style={signupStyles.input}
                placeholder="you@email.com"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={signupStyles.fieldGroup}>
              <Text style={signupStyles.label}>Phone</Text>
              <TextInput
                style={signupStyles.input}
                placeholder="07xx xxx xxx"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
                textContentType="telephoneNumber"
                value={phone}
                onChangeText={setPhone}
              />
            </View>

            <View style={signupStyles.fieldGroup}>
              <Text style={signupStyles.label}>Password</Text>
              <View style={signupStyles.inputRow}>
                <TextInput
                  style={[signupStyles.input, signupStyles.inputFlex]}
                  placeholder="Create a password"
                  placeholderTextColor={colors.textMuted}
                  secureTextEntry={!passwordVisible}
                  textContentType="newPassword"
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable
                  style={signupStyles.toggleButton}
                  onPress={() => setPasswordVisible((current) => !current)}
                >
                  <Text style={signupStyles.toggleButtonText}>
                    {passwordVisible ? 'Hide' : 'Show'}
                  </Text>
                </Pressable>
              </View>
            </View>

            <Pressable
              style={[signupStyles.button, submitting && signupStyles.buttonDisabled]}
              onPress={handleSignup}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={signupStyles.buttonText}>Create Account</Text>
              )}
            </Pressable>

            <View style={signupStyles.helperRow}>
              <Text style={signupStyles.helperText}>Already have an account?</Text>
              <Link href="/login" asChild>
                <Pressable>
                  <Text style={signupStyles.helperAction}>Log in</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
