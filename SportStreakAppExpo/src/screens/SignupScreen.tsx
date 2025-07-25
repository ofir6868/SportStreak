import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignupScreen = ({ navigation }: any) => {
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!age || !email || !password) {
      setError('Please fill all fields.');
      return;
    }
    // Persist user as authenticated
    await AsyncStorage.setItem('isAuthenticated', 'true');
    navigation.replace('PresetSelection');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your profile</Text>
      <TextInput
        style={styles.input}
        placeholder="Age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />
      <Text style={styles.privacy}>Providing your age ensures you get the right experience. See our Privacy Policy.</Text>
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
          <Text style={styles.eye}>{showPassword ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>CREATE ACCOUNT</Text>
      </TouchableOpacity>
      <Text style={styles.or}>OR</Text>
      <TouchableOpacity style={styles.fbButton}>
        <Text style={styles.fbText}>FACEBOOK</Text>
      </TouchableOpacity>
      <Text style={styles.terms}>By signing up, you agree to our Terms and Privacy Policy.</Text>
      <TouchableOpacity onPress={() => navigation.replace('Login')}>
        <Text style={styles.login}>Have an account? LOG IN</Text>
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
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
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default SignupScreen; 