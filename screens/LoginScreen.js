import React, { useState } from 'react';
import { View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import styles from '../styles/styles';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onLoginPress = async () => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // Navigate to Home screen upon successful login
      navigation.replace('Home');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo App Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        onChangeText={(text) => setEmail(text)}
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />
      <Button title="Login" onPress={onLoginPress} />
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
