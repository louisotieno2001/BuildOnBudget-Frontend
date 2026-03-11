import React, { useState } from 'react';
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
import { Link, useRouter } from 'expo-router';

import CustomToast, { ToastType } from '@/components/CustomToast';
import { ApiError } from '@/services/api';
import { saveAuthToken } from '@/services/authToken';
import { saveUserSession, UserSession } from '@/services/userSession';
import { login } from '@/features/auth/services/authApi';
import { loginStyles } from '@/features/auth/styles/loginStyles';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
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

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      showToast('Please enter your email and password.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const result = await login({ email: email.trim(), password });
      if (result.token) {
        await saveAuthToken(result.token);
      }
      const user = (result as { user?: UserSession }).user;
      if (user) {
        await saveUserSession(user);
      }
      showToast(result.message ?? 'Login successful.', 'success');
      router.replace('/dashboard');
    } catch (error) {
      if (error instanceof ApiError) {
        showToast(error.message, 'error');
      } else {
        showToast('Unable to login right now. Please try again.', 'error');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={loginStyles.screen}>
      <CustomToast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast((current) => ({ ...current, visible: false }))}
      />
      <KeyboardAvoidingView
        style={loginStyles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={loginStyles.content} keyboardShouldPersistTaps="handled">
          <View style={loginStyles.header}>
            <Text style={loginStyles.title}>Welcome back</Text>
            <Text style={loginStyles.subtitle}>Log in to continue managing your budget.</Text>
          </View>

          <View style={loginStyles.card}>
            <View style={loginStyles.fieldGroup}>
              <Text style={loginStyles.label}>Email address</Text>
              <TextInput
                style={loginStyles.input}
                placeholder="you@email.com"
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={loginStyles.fieldGroup}>
              <Text style={loginStyles.label}>Password</Text>
              <View style={loginStyles.inputRow}>
                <TextInput
                  style={[loginStyles.input, loginStyles.inputFlex]}
                  placeholder="••••••••"
                  secureTextEntry={!passwordVisible}
                  textContentType="password"
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable
                  style={loginStyles.toggleButton}
                  onPress={() => setPasswordVisible((current) => !current)}
                >
                  <Text style={loginStyles.toggleButtonText}>
                    {passwordVisible ? 'Hide' : 'Show'}
                  </Text>
                </Pressable>
              </View>
            </View>

            <Pressable
              style={[loginStyles.button, submitting && loginStyles.buttonDisabled]}
              onPress={handleLogin}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={loginStyles.buttonText}>Log In</Text>
              )}
            </Pressable>

            <View style={loginStyles.helperRow}>
              <Text style={loginStyles.helperText}>New here?</Text>
              <Link href="/signup" asChild>
                <Pressable>
                  <Text style={loginStyles.helperAction}>Create an account</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
