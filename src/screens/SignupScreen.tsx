import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useProgress } from '../components/ProgressContext';
import AppText from '../components/AppText';

const SignupScreen = ({ navigation }) => {
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { setNickname } = useProgress();

  const handleSignup = async () => {
    if (!age || !email || !password) {
      setError('Please fill all fields.');
      return;
    }
    await AsyncStorage.setItem('isAuthenticated', 'true');
    navigation.replace('PresetSelection');
  };

  return (
    <View style={styles.container}>
      <AppText style={styles.title}>Create your profile</AppText>
      <TextInput
        style={styles.input}
        placeholder="Age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />
      <AppText style={styles.privacy}>Providing your age ensures you get the right experience. See our Privacy Policy.</AppText>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <AppText style={styles.eye}>{showPassword ? '🙈' : '👁️'}</AppText>
        </TouchableOpacity>
      </View>
      {error ? <AppText style={styles.error}>{error}</AppText> : null}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <AppText style={styles.buttonText}>CREATE ACCOUNT</AppText>
      </TouchableOpacity>
      <AppText style={styles.or}>OR</AppText>
      <TouchableOpacity style={styles.fbButton}>
        <AppText style={styles.fbText}>FACEBOOK</AppText>
      </TouchableOpacity>
      <AppText style={styles.terms}>By signing up, you agree to our Terms and Privacy Policy.</AppText>
      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <AppText style={styles.login}>Have an account? LOG IN</AppText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Nunito-Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  privacy: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  eye: {
    fontSize: 20,
    marginLeft: 8,
  },
  button: {
    backgroundColor: '#1CB0F6',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
  or: {
    textAlign: 'center',
    color: '#888',
    marginVertical: 8,
  },
  fbButton: {
    backgroundColor: '#4267B2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  fbText: {
    color: '#fff',
    fontFamily: 'Nunito-Bold',
    fontSize: 16,
  },
  terms: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginVertical: 8,
  },
  login: {
    color: '#1CB0F6',
    textAlign: 'center',
    marginTop: 12,
    fontFamily: 'Nunito-Bold',
  },
  error: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default SignupScreen; 